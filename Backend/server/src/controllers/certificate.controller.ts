import type { Request, Response } from "express";
import {
  createCertificate,
  lookupCertificate,
} from "../services/certificate.service.js";

export async function issueCertificate(req: Request, res: Response) {
  const payload = req.body;

  const certificate = await createCertificate(payload);

  res.status(201).json({
    success: true,
    data: certificate,
  });
}

export async function getCertificateById(req: Request, res: Response) {
  const certificateId = String(req.params.certificateId ?? "");

  if (!certificateId) {
    return res
      .status(400)
      .json({ success: false, message: "Missing certificateId" });
  }

  const certificate = await lookupCertificate(certificateId);

  if (!certificate) {
    return res
      .status(404)
      .json({ success: false, message: "Certificate not found" });
  }

  res.json({ success: true, data: certificate });
}
