import type { Request, Response } from "express";
import { verifyCertificate as verifyCertificateService } from "../services/verification.service.js";

export async function verifyCertificate(req: Request, res: Response) {
  const certificateId = String(req.body.certificateId ?? "");

  if (!certificateId) {
    return res
      .status(400)
      .json({ success: false, message: "Missing certificateId" });
  }

  const result = await verifyCertificateService(certificateId);

  res.json({
    success: result.isValid,
    data: result,
  });
}
