import type { NextFunction, Request, Response } from "express";
import { BlockchainServiceError } from "../services/blockchain.service.js";
import { CertificateServiceError } from "../services/certificate.service.js";
import { CredentialLifecycleError } from "../services/credential-lifecycle.service.js";
import {
  getPublicCredential,
  getPublicCredentialPdf,
} from "../services/public-credential.service.js";

export async function getPublicCredentialPage(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const certificateId = String(req.params.publicId ?? "");
  if (!/^[A-Z0-9-]{8,100}$/.test(certificateId)) {
    res.status(400).json({
      success: false,
      message: "A valid credential ID is required.",
    });
    return;
  }

  try {
    const shareToken =
      typeof req.query.share === "string" && req.query.share.length <= 256
        ? req.query.share
        : undefined;
    const data = await getPublicCredential(certificateId, shareToken);
    res
      .set("Cache-Control", "no-store")
      .set("Referrer-Policy", "no-referrer")
      .json({ success: true, data });
  } catch (error) {
    if (
      error instanceof BlockchainServiceError ||
      error instanceof CertificateServiceError ||
      error instanceof CredentialLifecycleError
    ) {
      res.status(error.statusCode).json({
        success: false,
        message: error.message,
      });
      return;
    }
    next(error);
  }
}

export async function downloadPublicCredentialPdf(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const certificateId = String(req.params.publicId ?? "");
  const shareToken =
    typeof req.query.share === "string" && req.query.share.length <= 256
      ? req.query.share
      : undefined;
  if (!/^[A-Z0-9-]{8,100}$/.test(certificateId)) {
    res.status(400).json({
      success: false,
      message: "A valid credential ID is required.",
    });
    return;
  }
  try {
    const { pdf } = await getPublicCredentialPdf(certificateId, shareToken);
    res
      .set("Cache-Control", "no-store")
      .set("Referrer-Policy", "no-referrer")
      .type("application/pdf")
      .attachment(`${certificateId}.pdf`)
      .send(pdf);
  } catch (error) {
    if (
      error instanceof BlockchainServiceError ||
      error instanceof CertificateServiceError ||
      error instanceof CredentialLifecycleError
    ) {
      res.status(error.statusCode).json({ success: false, message: error.message });
      return;
    }
    next(error);
  }
}
