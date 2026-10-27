import { Router } from "express";
import {
  issueCertificate,
  getCertificateById,
} from "../controllers/certificate.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/requireRole.middleware.js";

const router = Router();

router.post("/issue", authMiddleware, requireRole("issuer", "admin"), issueCertificate);
router.get("/:certificateId", getCertificateById);

export default router;
