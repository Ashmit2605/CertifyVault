import type { NextFunction, Request, Response } from "express";
import {
  CertificateServiceError,
  getIssuerCertificateStats,
  listIssuerAuditLogs,
} from "../services/certificate.service.js";

function getClerkUserId(res: Response) {
  const clerkUserId = res.locals.clerkUserId;
  if (!clerkUserId) {
    throw new CertificateServiceError("Authentication required.", 401);
  }
  return clerkUserId;
}

function handleError(error: unknown, res: Response, next: NextFunction) {
  if (error instanceof CertificateServiceError) {
    res.status(error.statusCode).json({
      success: false,
      message: error.message,
    });
    return;
  }
  next(error);
}

export async function getIssuerStats(
  _req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const stats = await getIssuerCertificateStats(getClerkUserId(res));
    res.json({ success: true, data: { stats } });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function getIssuerAuditLogs(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    const logs = await listIssuerAuditLogs(
      getClerkUserId(res),
      req.query.limit,
    );
    res.json({ success: true, data: { logs } });
  } catch (error) {
    handleError(error, res, next);
  }
}
