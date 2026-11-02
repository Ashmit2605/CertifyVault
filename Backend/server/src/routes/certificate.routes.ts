import { Router } from "express";
import {
  downloadCertificate,
  getCertificateById,
  issueCertificate,
  listCertificates,
  retryRevocation,
  retryRegistration,
  revokeCertificate,
} from "../controllers/certificate.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/requireRole.middleware.js";

const router = Router();
const issuerOnly = [authMiddleware, requireRole("issuer")];

router.post("/issue", ...issuerOnly, issueCertificate);
router.get("/", ...issuerOnly, listCertificates);
router.get("/:certificateId/download", ...issuerOnly, downloadCertificate);
router.post(
  "/:certificateId/registration/retry",
  ...issuerOnly,
  retryRegistration,
);
router.post(
  "/:certificateId/revoke/retry",
  ...issuerOnly,
  retryRevocation,
);
router.post("/:certificateId/revoke", ...issuerOnly, revokeCertificate);
router.get("/:certificateId", ...issuerOnly, getCertificateById);

export default router;
