import type { Request, Response, NextFunction } from "express";
import { BlockchainServiceError } from "../services/blockchain.service.js";
import { CertificateServiceError } from "../services/certificate.service.js";
import { verifyCertificate as verifyCertificateService } from "../services/verification.service.js";

async function verify(
  certificateId: string,
  token: unknown,
  res: Response,
  next: NextFunction,
) {
  if (!certificateId || typeof token !== "string" || !token) {
    res.status(400).json({
      success: false,
      message: "A certificate ID and signed QR token are required.",
    });
    return;
  }

  try {
    const result = await verifyCertificateService(certificateId, token);
    res.json({
      success: result.valid,
      data: result,
    });
  } catch (error) {
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
}

export async function verifyCertificate(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const certificateId = String(req.body?.certificateId ?? "");
  const token = req.body?.token;
  await verify(certificateId, token, res, next);
}

export async function verifyCertificateQr(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const certificateId = String(req.params.certificateId ?? "");
  await verify(certificateId, req.query.token, res, next);
}
