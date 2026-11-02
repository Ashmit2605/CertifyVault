import { createHash, randomBytes } from "node:crypto";
import {
  and,
  count,
  desc,
  eq,
  gte,
  ilike,
  lt,
  or,
} from "drizzle-orm";
import { db } from "../db/index.js";
import {
  certificateAuditLogs,
  certificates,
  users,
} from "../db/schema.js";
import {
  getCertificateProofFromChain,
  getTransactionConfirmation,
  registerCertificateOnChain,
  revokeCertificateOnChain,
} from "./blockchain.service.js";
import {
  readCertificatePdf,
  removeCertificatePdf,
  storeCertificatePdf,
} from "./certificate-storage.service.js";
import { renderCertificatePdf } from "./certificate-template.service.js";
import {
  createCertificateQrToken,
  QrTokenConfigurationError,
  verifyCertificateQrToken,
} from "./qr-token.service.js";

export interface CertificateIssueInput {
  studentName: string;
  certificateNumber: string | null;
  certificateType: string;
  title: string;
  course: string;
  grade: string | null;
  issueDate: string;
  expiryDate: string | null;
}

function getErrorProperty(value: unknown, key: string): unknown {
  return typeof value === "object" && value !== null && key in value
    ? (value as Record<string, unknown>)[key]
    : undefined;
}

function isCertificateNumberConflict(error: unknown) {
  let current = error;
  for (let depth = 0; depth < 3 && current; depth += 1) {
    if (
      getErrorProperty(current, "code") === "23505" &&
      getErrorProperty(current, "constraint") ===
        "certificates_certificate_number_unique"
    ) {
      return true;
    }
    current = getErrorProperty(current, "cause");
  }
  return false;
}

export class CertificateServiceError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
  ) {
    super(message);
    this.name = "CertificateServiceError";
  }
}

const certificateStatuses: Record<
  string,
  typeof certificates.$inferSelect.status
> = {
  pending_registration: "pending_registration",
  issued: "issued",
  registration_failed: "registration_failed",
  revocation_pending: "revocation_pending",
  revoked: "revoked",
  expired: "expired",
};

async function getAuthorizedIssuer(clerkUserId: string) {
  const [issuer] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkUserId))
    .limit(1);

  if (!issuer || issuer.role !== "issuer" || !issuer.isActive) {
    throw new CertificateServiceError(
      "An active issuer account is required.",
      403,
    );
  }
  if (!issuer.institutionName?.trim()) {
    throw new CertificateServiceError(
      "The issuer must have an institution configured.",
      403,
    );
  }
  return issuer;
}

async function getCertificateRow(id: number) {
  const [certificate] = await db
    .select()
    .from(certificates)
    .where(eq(certificates.id, id))
    .limit(1);
  if (!certificate) {
    throw new Error("Certificate record disappeared during processing.");
  }
  return certificate;
}

function createCertificateId() {
  const year = new Date().getUTCFullYear();
  return `CV-${year}-${randomBytes(8).toString("hex").toUpperCase()}`;
}

function getVerificationUrl(certificateId: string, token: string) {
  const configuredBase =
    process.env.PUBLIC_VERIFICATION_URL?.trim() ??
    "http://localhost:5000/api/verification";
  let base: URL;
  try {
    base = new URL(configuredBase);
  } catch {
    throw new CertificateServiceError(
      "PUBLIC_VERIFICATION_URL must be an absolute URL.",
      503,
    );
  }
  if (
    base.protocol !== "https:" &&
    !(base.protocol === "http:" && base.hostname === "localhost")
  ) {
    throw new CertificateServiceError(
      "PUBLIC_VERIFICATION_URL must use HTTPS outside localhost.",
      503,
    );
  }

  base.pathname = `${base.pathname.replace(/\/+$/, "")}/${encodeURIComponent(certificateId)}`;
  base.searchParams.set("token", token);
  return base.toString();
}

async function writeAudit(
  actorId: number,
  certificateRowId: number,
  action: string,
  metadata: Record<string, string | number | null> = {},
) {
  await db.insert(certificateAuditLogs).values({
    actorId,
    certificateRowId,
    action,
    metadata,
  });
}

function certificateResponse(certificate: typeof certificates.$inferSelect) {
  const { storageKey, ...publicFields } = certificate;
  void storageKey;
  return publicFields;
}

async function runRegistration(
  certificate: typeof certificates.$inferSelect,
  issuer: typeof users.$inferSelect,
) {
  try {
    const result = await registerCertificateOnChain(
      certificate.certificateId,
      certificate.certificateHash,
      async (transactionHash) => {
        await db.transaction(async (transaction) => {
          await transaction
            .update(certificates)
            .set({
              blockchainTxHash: transactionHash,
              registrationStatus: "submitted",
              updatedAt: new Date(),
            })
            .where(eq(certificates.id, certificate.id));
          await transaction.insert(certificateAuditLogs).values({
            actorId: issuer.id,
            certificateRowId: certificate.id,
            action: "blockchain.registration_submitted",
            metadata: { transactionHash },
          });
        });
      },
    );

    await db.transaction(async (transaction) => {
      await transaction
        .update(certificates)
        .set({
          status: "issued",
          registrationStatus: "confirmed",
          blockchainNetwork: result.network,
          contractAddress: result.contractAddress,
          blockchainTxHash: result.transactionHash,
          blockchainBlockNumber: result.blockNumber,
          issuedAt: new Date(),
          updatedAt: new Date(),
        })
        .where(eq(certificates.id, certificate.id));
      await transaction.insert(certificateAuditLogs).values({
        actorId: issuer.id,
        certificateRowId: certificate.id,
        action: "certificate.issued",
        metadata: {
          transactionHash: result.transactionHash,
          blockNumber: result.blockNumber,
          network: result.network,
        },
      });
    });

    return getCertificateRow(certificate.id);
  } catch (error) {
    const current = await getCertificateRow(certificate.id);

    if (current?.registrationStatus === "submitted") {
      await writeAudit(issuer.id, certificate.id, "blockchain.registration_pending");
      return current;
    }

    await db.transaction(async (transaction) => {
      await transaction
        .update(certificates)
        .set({
          status: "registration_failed",
          registrationStatus: "failed",
          updatedAt: new Date(),
        })
        .where(eq(certificates.id, certificate.id));
      await transaction.insert(certificateAuditLogs).values({
        actorId: issuer.id,
        certificateRowId: certificate.id,
        action: "blockchain.registration_failed",
      });
    });

    console.error(
      "Certificate blockchain registration failed:",
      error instanceof Error ? error.name : "Unknown error",
    );
    return getCertificateRow(certificate.id);
  }
}

export async function issueCertificate(
  clerkUserId: string,
  input: CertificateIssueInput,
) {
  const issuer = await getAuthorizedIssuer(clerkUserId);
  const institutionName = issuer.institutionName;
  if (!institutionName) {
    throw new CertificateServiceError(
      "The issuer must have an institution configured.",
      403,
    );
  }
  const certificateId = createCertificateId();
  let token: string;
  try {
    token = createCertificateQrToken(certificateId, issuer.id);
    verifyCertificateQrToken(token);
  } catch {
    throw new CertificateServiceError(
      "Certificate QR signing and verification keys are not configured correctly.",
      503,
    );
  }
  const verificationUrl = getVerificationUrl(certificateId, token);
  const issueDate = input.issueDate;
  const pdf = await renderCertificatePdf({
    certificateId,
    certificateNumber: input.certificateNumber,
    certificateType: input.certificateType,
    title: input.title,
    studentName: input.studentName,
    course: input.course,
    grade: input.grade,
    issueDate,
    institutionName,
    issuerName: `${issuer.firstName} ${issuer.lastName}`,
    verificationUrl,
  });
  const certificateHash = createHash("sha256").update(pdf).digest("hex");
  const storageKey = `certificates/${certificateId}.pdf`;

  await storeCertificatePdf(storageKey, pdf);

  let certificate: typeof certificates.$inferSelect;
  try {
    certificate = await db.transaction(async (transaction) => {
      const [created] = await transaction
        .insert(certificates)
        .values({
          certificateId,
          certificateNumber: input.certificateNumber,
          issuerId: issuer.id,
          studentName: input.studentName,
          course: input.course,
          certificateType: input.certificateType,
          title: input.title,
          grade: input.grade,
          issueDate,
          expiryDate: input.expiryDate,
          status: "pending_registration",
          storageKey,
          fileMimeType: "application/pdf",
          fileSize: pdf.byteLength,
          certificateHash,
          qrTokenVersion: 1,
          verificationUrl,
          registrationStatus: "not_submitted",
          revocationStatus: "not_submitted",
          updatedAt: new Date(),
        })
        .returning();
      if (!created) {
        throw new Error("Certificate could not be created.");
      }
      await transaction.insert(certificateAuditLogs).values({
        actorId: issuer.id,
        certificateRowId: created.id,
        action: "certificate.created",
        metadata: {
          certificateId,
          certificateType: input.certificateType,
        },
      });
      return created;
    });
  } catch (error) {
    await removeCertificatePdf(storageKey);
    if (isCertificateNumberConflict(error)) {
      throw new CertificateServiceError(
        "Certificate number has already been used.",
        409,
      );
    }
    throw error;
  }

  certificate = await runRegistration(certificate, issuer);
  return certificateResponse(certificate);
}

function getPageValue(value: unknown, fallback: number, max: number) {
  const number = Number(value);
  return Number.isInteger(number) && number > 0
    ? Math.min(number, max)
    : fallback;
}

export async function listIssuerCertificates(
  clerkUserId: string,
  options: { search?: string; status?: string; page?: unknown; pageSize?: unknown },
) {
  const issuer = await getAuthorizedIssuer(clerkUserId);
  const page = getPageValue(options.page, 1, 1_000_000);
  const pageSize = getPageValue(options.pageSize, 20, 100);
  const filters = [eq(certificates.issuerId, issuer.id)];
  if (options.search?.trim()) {
    const search = `%${options.search.trim().replace(/[%_]/g, "\\$&")}%`;
    filters.push(
      or(
        ilike(certificates.certificateId, search),
        ilike(certificates.certificateNumber, search),
        ilike(certificates.studentName, search),
        ilike(certificates.course, search),
      )!,
    );
  }
  if (options.status) {
    const status = certificateStatuses[options.status];
    if (!status) {
      throw new CertificateServiceError("Certificate status is invalid.", 400);
    }
    filters.push(eq(certificates.status, status));
  }
  const where = and(...filters);

  const [rows, [totalRow]] = await Promise.all([
    db
      .select()
      .from(certificates)
      .where(where)
      .orderBy(desc(certificates.updatedAt))
      .limit(pageSize)
      .offset((page - 1) * pageSize),
    db.select({ value: count() }).from(certificates).where(where),
  ]);
  return {
    certificates: rows.map(certificateResponse),
    pagination: { page, pageSize, total: totalRow?.value ?? 0 },
  };
}

export async function getIssuerCertificate(
  clerkUserId: string,
  certificateId: string,
) {
  const issuer = await getAuthorizedIssuer(clerkUserId);
  const [certificate] = await db
    .select()
    .from(certificates)
    .where(
      and(
        eq(certificates.certificateId, certificateId),
        eq(certificates.issuerId, issuer.id),
      ),
    )
    .limit(1);
  if (!certificate) {
    throw new CertificateServiceError("Certificate not found.", 404);
  }
  return certificateResponse(certificate);
}

export async function downloadIssuerCertificate(
  clerkUserId: string,
  certificateId: string,
) {
  const issuer = await getAuthorizedIssuer(clerkUserId);
  const [certificate] = await db
    .select()
    .from(certificates)
    .where(
      and(
        eq(certificates.certificateId, certificateId),
        eq(certificates.issuerId, issuer.id),
      ),
    )
    .limit(1);
  if (!certificate) {
    throw new CertificateServiceError("Certificate not found.", 404);
  }
  if (
    certificate.status !== "issued" &&
    certificate.status !== "revoked"
  ) {
    throw new CertificateServiceError(
      "Only confirmed certificates can be downloaded.",
      409,
    );
  }
  if (!certificate.storageKey) {
    throw new CertificateServiceError(
      "The certificate file is not available.",
      404,
    );
  }

  const pdf = await readCertificatePdf(
    certificate.storageKey,
    certificate.certificateHash,
  );
  await writeAudit(issuer.id, certificate.id, "certificate.downloaded");
  return { certificate, pdf };
}

export async function getIssuerCertificateStats(clerkUserId: string) {
  const issuer = await getAuthorizedIssuer(clerkUserId);
  const result = await db
    .select({ status: certificates.status, total: count() })
    .from(certificates)
    .where(eq(certificates.issuerId, issuer.id))
    .groupBy(certificates.status);
  const stats = {
    total: 0,
    issued: 0,
    pendingRegistration: 0,
    failedRegistration: 0,
    revoked: 0,
    issuedThisMonth: 0,
  };
  for (const row of result) {
    stats.total += row.total;
    if (row.status === "issued") stats.issued = row.total;
    if (
      row.status === "pending_registration" ||
      row.status === "revocation_pending"
    ) {
      stats.pendingRegistration += row.total;
    }
    if (row.status === "registration_failed") {
      stats.failedRegistration = row.total;
    }
    if (row.status === "revoked") stats.revoked = row.total;
  }

  const monthStart = new Date();
  monthStart.setUTCDate(1);
  monthStart.setUTCHours(0, 0, 0, 0);
  const nextMonthStart = new Date(monthStart);
  nextMonthStart.setUTCMonth(nextMonthStart.getUTCMonth() + 1);
  const [thisMonth] = await db
    .select({ value: count() })
    .from(certificates)
    .where(
      and(
        eq(certificates.issuerId, issuer.id),
        eq(certificates.status, "issued"),
        gte(certificates.issuedAt, monthStart),
        lt(certificates.issuedAt, nextMonthStart),
      ),
    );
  stats.issuedThisMonth = thisMonth?.value ?? 0;

  return stats;
}

export async function listIssuerAuditLogs(
  clerkUserId: string,
  limitValue: unknown,
) {
  const issuer = await getAuthorizedIssuer(clerkUserId);
  const limit = getPageValue(limitValue, 50, 100);
  const logs = await db
    .select({
      id: certificateAuditLogs.id,
      certificateId: certificates.certificateId,
      action: certificateAuditLogs.action,
      metadata: certificateAuditLogs.metadata,
      createdAt: certificateAuditLogs.createdAt,
    })
    .from(certificateAuditLogs)
    .innerJoin(
      certificates,
      eq(certificateAuditLogs.certificateRowId, certificates.id),
    )
    .where(eq(certificates.issuerId, issuer.id))
    .orderBy(desc(certificateAuditLogs.createdAt))
    .limit(limit);
  return logs;
}

export async function verifyCertificateRecord(
  certificateId: string,
  token: string,
) {
  let payload;
  try {
    payload = verifyCertificateQrToken(token);
  } catch (error) {
    if (error instanceof QrTokenConfigurationError) {
      throw new CertificateServiceError(
        "Certificate QR verification is not configured.",
        503,
      );
    }
    throw new CertificateServiceError("Certificate QR token is invalid.", 401);
  }
  if (payload.certificateId !== certificateId) {
    throw new CertificateServiceError(
      "QR token does not match this certificate.",
      401,
    );
  }

  const [certificate] = await db
    .select()
    .from(certificates)
    .where(eq(certificates.certificateId, certificateId))
    .limit(1);
  if (
    !certificate ||
    !certificate.issuerId ||
    certificate.issuerId !== payload.issuerId
  ) {
    throw new CertificateServiceError("Certificate not found.", 404);
  }

  if (certificate.status === "revoked") {
    return { valid: false, status: "revoked", certificateId };
  }
  if (certificate.status !== "issued") {
    return { valid: false, status: certificate.status, certificateId };
  }
  if (
    certificate.expiryDate &&
    certificate.expiryDate < new Date().toISOString().slice(0, 10)
  ) {
    await db.transaction(async (transaction) => {
      await transaction
        .update(certificates)
        .set({ status: "expired", updatedAt: new Date() })
        .where(eq(certificates.id, certificate.id));
      await transaction.insert(certificateAuditLogs).values({
        actorId: certificate.issuerId,
        certificateRowId: certificate.id,
        action: "certificate.expired",
      });
    });
    return { valid: false, status: "expired", certificateId };
  }
  if (
    certificate.registrationStatus !== "confirmed" ||
    !certificate.blockchainNetwork ||
    !certificate.contractAddress
  ) {
    return { valid: false, status: "blockchain_unconfirmed", certificateId };
  }

  const proof = await getCertificateProofFromChain(certificateId);
  const expectedHash = `0x${certificate.certificateHash}`;
  if (
    proof.fileHash.toLowerCase() !== expectedHash.toLowerCase() ||
    proof.revoked
  ) {
    return { valid: false, status: proof.revoked ? "revoked" : "integrity_mismatch", certificateId };
  }

  return {
    valid: true,
    status: "issued",
    certificate: {
      certificateId: certificate.certificateId,
      certificateNumber: certificate.certificateNumber,
      studentName: certificate.studentName,
      title: certificate.title,
      course: certificate.course,
      grade: certificate.grade,
      issueDate: certificate.issueDate,
      institutionName: (
        await db
          .select({ institutionName: users.institutionName })
          .from(users)
          .where(eq(users.id, certificate.issuerId))
          .limit(1)
      )[0]?.institutionName,
      certificateHash: certificate.certificateHash,
      blockchainNetwork: certificate.blockchainNetwork,
      blockchainTxHash: certificate.blockchainTxHash,
    },
  };
}

export async function retryCertificateRegistration(
  clerkUserId: string,
  certificateId: string,
) {
  const issuer = await getAuthorizedIssuer(clerkUserId);
  const [certificate] = await db
    .select()
    .from(certificates)
    .where(
      and(
        eq(certificates.certificateId, certificateId),
        eq(certificates.issuerId, issuer.id),
      ),
    )
    .limit(1);
  if (!certificate) {
    throw new CertificateServiceError("Certificate not found.", 404);
  }
  if (
    certificate.status !== "registration_failed" &&
    certificate.status !== "pending_registration"
  ) {
    throw new CertificateServiceError(
      "Only pending or failed registrations can be retried.",
      409,
    );
  }
  if (
    certificate.registrationStatus === "submitted" &&
    certificate.blockchainTxHash
  ) {
    const confirmation = await getTransactionConfirmation(
      certificate.blockchainTxHash,
    );
    if (confirmation.status === "pending") {
      return certificateResponse(certificate);
    }
    if (confirmation.status === "confirmed") {
      const proof = await getCertificateProofFromChain(certificateId);
      if (
        proof.fileHash.toLowerCase() !==
          `0x${certificate.certificateHash}`.toLowerCase() ||
        proof.revoked
      ) {
        throw new CertificateServiceError(
          "The confirmed blockchain proof does not match this certificate.",
          409,
        );
      }
      await db.transaction(async (transaction) => {
        await transaction
          .update(certificates)
          .set({
            status: "issued",
            registrationStatus: "confirmed",
            blockchainBlockNumber: confirmation.blockNumber,
            issuedAt: new Date(),
            updatedAt: new Date(),
          })
          .where(eq(certificates.id, certificate.id));
        await transaction.insert(certificateAuditLogs).values({
          actorId: issuer.id,
          certificateRowId: certificate.id,
          action: "certificate.issued",
          metadata: {
            transactionHash: certificate.blockchainTxHash,
            blockNumber: confirmation.blockNumber,
          },
        });
      });
      return certificateResponse(await getCertificateRow(certificate.id));
    }

    await db
      .update(certificates)
      .set({
        status: "registration_failed",
        registrationStatus: "failed",
        updatedAt: new Date(),
      })
      .where(eq(certificates.id, certificate.id));
  } else if (certificate.registrationStatus === "submitted") {
    return certificateResponse(certificate);
  }

  await db
    .update(certificates)
    .set({
      status: "pending_registration",
      registrationStatus: "not_submitted",
      updatedAt: new Date(),
    })
    .where(eq(certificates.id, certificate.id));

  const updated = await getCertificateRow(certificate.id);
  const result = await runRegistration(updated, issuer);
  return certificateResponse(result);
}

async function submitRevocation(
  certificate: typeof certificates.$inferSelect,
  issuer: typeof users.$inferSelect,
) {
  try {
    const result = await revokeCertificateOnChain(
      certificate.certificateId,
      async (transactionHash) => {
        await db
          .update(certificates)
          .set({
            blockchainTxHash: transactionHash,
            revocationStatus: "submitted",
            updatedAt: new Date(),
          })
          .where(eq(certificates.id, certificate.id));
      },
    );

    await db.transaction(async (transaction) => {
      await transaction
        .update(certificates)
        .set({
          status: "revoked",
          revocationStatus: "confirmed",
          revokedAt: new Date(),
          blockchainNetwork: result.network,
          contractAddress: result.contractAddress,
          blockchainTxHash: result.transactionHash,
          blockchainBlockNumber: result.blockNumber,
          updatedAt: new Date(),
        })
        .where(eq(certificates.id, certificate.id));
      await transaction.insert(certificateAuditLogs).values({
        actorId: issuer.id,
        certificateRowId: certificate.id,
        action: "certificate.revoked",
        metadata: { transactionHash: result.transactionHash },
      });
    });
  } catch (error) {
    const current = await getCertificateRow(certificate.id);
    await db.insert(certificateAuditLogs).values({
      actorId: issuer.id,
      certificateRowId: certificate.id,
      action:
        current.revocationStatus === "submitted"
          ? "certificate.revocation_pending"
          : "certificate.revocation_failed",
    });
    console.error(
      "Certificate blockchain revocation failed:",
      error instanceof Error ? error.name : "Unknown error",
    );
    if (current.revocationStatus !== "submitted") {
      await db
        .update(certificates)
        .set({
          revocationStatus: "failed",
          updatedAt: new Date(),
        })
        .where(eq(certificates.id, certificate.id));
    }
  }

  return getCertificateRow(certificate.id);
}

export async function revokeIssuerCertificate(
  clerkUserId: string,
  certificateId: string,
  reason: string,
) {
  const issuer = await getAuthorizedIssuer(clerkUserId);
  const [certificate] = await db
    .select()
    .from(certificates)
    .where(
      and(
        eq(certificates.certificateId, certificateId),
        eq(certificates.issuerId, issuer.id),
      ),
    )
    .limit(1);
  if (!certificate) {
    throw new CertificateServiceError("Certificate not found.", 404);
  }
  if (
    certificate.status !== "issued" ||
    certificate.registrationStatus !== "confirmed"
  ) {
    throw new CertificateServiceError(
      "Only successfully issued certificates can be revoked.",
      409,
    );
  }

  await db.transaction(async (transaction) => {
    await transaction
      .update(certificates)
      .set({
        status: "revocation_pending",
        revocationStatus: "not_submitted",
        revocationReason: reason,
        updatedAt: new Date(),
      })
      .where(eq(certificates.id, certificate.id));
    await transaction.insert(certificateAuditLogs).values({
      actorId: issuer.id,
      certificateRowId: certificate.id,
      action: "certificate.revocation_requested",
      metadata: { reason },
    });
  });

  return certificateResponse(
    await submitRevocation(await getCertificateRow(certificate.id), issuer),
  );
}

export async function retryCertificateRevocation(
  clerkUserId: string,
  certificateId: string,
) {
  const issuer = await getAuthorizedIssuer(clerkUserId);
  const [certificate] = await db
    .select()
    .from(certificates)
    .where(
      and(
        eq(certificates.certificateId, certificateId),
        eq(certificates.issuerId, issuer.id),
      ),
    )
    .limit(1);
  if (!certificate) {
    throw new CertificateServiceError("Certificate not found.", 404);
  }
  if (certificate.status !== "revocation_pending") {
    throw new CertificateServiceError(
      "Only pending revocations can be retried.",
      409,
    );
  }

  if (
    certificate.revocationStatus === "submitted" &&
    certificate.blockchainTxHash
  ) {
    const confirmation = await getTransactionConfirmation(
      certificate.blockchainTxHash,
    );
    if (confirmation.status === "pending") {
      return certificateResponse(certificate);
    }
    if (confirmation.status === "confirmed") {
      const proof = await getCertificateProofFromChain(certificateId);
      if (
        proof.fileHash.toLowerCase() !==
          `0x${certificate.certificateHash}`.toLowerCase() ||
        !proof.revoked
      ) {
        throw new CertificateServiceError(
          "The confirmed blockchain revocation does not match this certificate.",
          409,
        );
      }
      await db
        .update(certificates)
        .set({
          status: "revoked",
          revocationStatus: "confirmed",
          revokedAt: new Date(),
          blockchainBlockNumber: confirmation.blockNumber,
          updatedAt: new Date(),
        })
        .where(eq(certificates.id, certificate.id));
      await writeAudit(issuer.id, certificate.id, "certificate.revoked", {
        transactionHash: certificate.blockchainTxHash,
        blockNumber: confirmation.blockNumber,
      });
      return certificateResponse(await getCertificateRow(certificate.id));
    }
    await db
      .update(certificates)
      .set({
        revocationStatus: "failed",
        updatedAt: new Date(),
      })
      .where(eq(certificates.id, certificate.id));
  } else if (certificate.revocationStatus === "submitted") {
    return certificateResponse(certificate);
  }

  const proof = await getCertificateProofFromChain(certificateId);
  if (proof.revoked) {
    if (
      proof.fileHash.toLowerCase() !==
      `0x${certificate.certificateHash}`.toLowerCase()
    ) {
      throw new CertificateServiceError(
        "The existing blockchain proof does not match this certificate.",
        409,
      );
    }
    await db
      .update(certificates)
      .set({
        status: "revoked",
        revocationStatus: "confirmed",
        revokedAt: new Date(),
        updatedAt: new Date(),
      })
      .where(eq(certificates.id, certificate.id));
    await writeAudit(issuer.id, certificate.id, "certificate.revoked");
    return certificateResponse(await getCertificateRow(certificate.id));
  }

  await db
    .update(certificates)
    .set({ revocationStatus: "not_submitted", updatedAt: new Date() })
    .where(eq(certificates.id, certificate.id));
  const ready = await getCertificateRow(certificate.id);
  return certificateResponse(await submitRevocation(ready, issuer));
}
