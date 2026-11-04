import type { Request, Response, NextFunction } from "express";
import { z } from "zod";
import {
  CertificateServiceError,
  downloadIssuerCertificate,
  getIssuerCertificate,
  issueCertificate as issueCertificateService,
  listIssuerCertificates,
  retryCertificateRevocation,
  retryCertificateRegistration,
  revokeIssuerCertificate,
} from "../services/certificate.service.js";
import { BlockchainServiceError } from "../services/blockchain.service.js";

const dateOnly = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/)
  .refine((value) => {
    const date = new Date(`${value}T00:00:00.000Z`);
    return Number.isFinite(date.getTime()) && date.toISOString().slice(0, 10) === value;
  }, "Enter a valid calendar date.");

const issueSchema = z
  .object({
    studentName: z.string().trim().min(1).max(255),
    certificateNumber: z
      .string()
      .trim()
      .min(1)
      .max(100)
      .transform((value) => value.toUpperCase())
      .nullable()
      .optional(),
    certificateType: z.enum([
      "degree",
      "diploma",
      "bonafide",
      "course",
      "internship",
      "training",
      "achievement",
      "custom",
    ]),
    title: z.string().trim().min(1).max(255),
    course: z.string().trim().min(1).max(255),
    grade: z.string().trim().max(50).nullable().optional(),
    issueDate: dateOnly,
    expiryDate: dateOnly.nullable().optional(),
    recipientId: z.number().int().positive().nullable().optional(),
  })
  .strict()
  .refine(
    (value) =>
      !value.expiryDate ||
      value.expiryDate >= value.issueDate,
    {
      message: "Expiry date cannot be before the issue date.",
      path: ["expiryDate"],
    },
  );

const revokeSchema = z
  .object({
    reason: z.string().trim().min(10).max(1000),
  })
  .strict();

function serviceError(
  error: unknown,
  res: Response,
  next: NextFunction,
) {
  if (error instanceof BlockchainServiceError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }
  if (error instanceof CertificateServiceError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }
  next(error);
}

function getClerkUserId(res: Response) {
  const clerkUserId = res.locals.clerkUserId;
  if (!clerkUserId) {
    throw new CertificateServiceError("Authentication required.", 401);
  }
  return clerkUserId;
}

export async function issueCertificate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const parsed = issueSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "Certificate details are invalid.",
      errors: parsed.error.flatten().fieldErrors,
    });
    return;
  }
  try {
    const certificate = await issueCertificateService(
      getClerkUserId(res),
      {
        ...parsed.data,
        certificateNumber: parsed.data.certificateNumber?.trim() || null,
        grade: parsed.data.grade?.trim() || null,
        expiryDate: parsed.data.expiryDate ?? null,
        recipientId: parsed.data.recipientId ?? null,
      },
    );
    res.status(certificate.status === "issued" ? 201 : 202).json({
      success: certificate.status !== "registration_failed",
      message:
        certificate.status === "issued"
          ? "Certificate issued and registered."
          : certificate.status === "registration_failed"
            ? "Certificate generated, but blockchain registration failed."
            : "Certificate generated; blockchain confirmation is pending.",
      data: { certificate },
    });
  } catch (error) {
    serviceError(error, res, next);
  }
}

export async function listCertificates(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const data = await listIssuerCertificates(getClerkUserId(res), {
      ...(typeof req.query.search === "string"
        ? { search: req.query.search }
        : {}),
      ...(typeof req.query.status === "string"
        ? { status: req.query.status }
        : {}),
      page: req.query.page,
      pageSize: req.query.pageSize,
    });
    res.json({ success: true, data });
  } catch (error) {
    serviceError(error, res, next);
  }
}

export async function getCertificateById(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const certificate = await getIssuerCertificate(
      getClerkUserId(res),
      String(req.params.certificateId ?? ""),
    );
    res.json({ success: true, data: { certificate } });
  } catch (error) {
    serviceError(error, res, next);
  }
}

export async function downloadCertificate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const { certificate, pdf } = await downloadIssuerCertificate(
      getClerkUserId(res),
      String(req.params.certificateId ?? ""),
    );
    res
      .status(200)
      .type("application/pdf")
      .attachment(`${certificate.certificateId}.pdf`)
      .send(pdf);
  } catch (error) {
    serviceError(error, res, next);
  }
}

export async function retryRegistration(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const certificate = await retryCertificateRegistration(
      getClerkUserId(res),
      String(req.params.certificateId ?? ""),
    );
    res.status(certificate.status === "issued" ? 200 : 202).json({
      success: certificate.status !== "registration_failed",
      data: { certificate },
    });
  } catch (error) {
    serviceError(error, res, next);
  }
}

export async function revokeCertificate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const parsed = revokeSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      message: "A revocation reason of 10 to 1000 characters is required.",
    });
    return;
  }
  try {
    const certificate = await revokeIssuerCertificate(
      getClerkUserId(res),
      String(req.params.certificateId ?? ""),
      parsed.data.reason,
    );
    res.status(certificate.status === "revoked" ? 200 : 202).json({
      success: certificate.status === "revoked",
      message:
        certificate.status === "revoked"
          ? "Certificate revocation confirmed."
          : "Revocation is pending blockchain confirmation.",
      data: { certificate },
    });
  } catch (error) {
    serviceError(error, res, next);
  }
}

export async function retryRevocation(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const certificate = await retryCertificateRevocation(
      getClerkUserId(res),
      String(req.params.certificateId ?? ""),
    );
    res.status(certificate.status === "revoked" ? 200 : 202).json({
      success: certificate.status === "revoked",
      data: { certificate },
    });
  } catch (error) {
    serviceError(error, res, next);
  }
}
