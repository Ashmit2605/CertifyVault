import { Router } from "express";
import {
  issueCertificate,
  getCertificateById,
} from "../controllers/certificate.controller.js";

const router = Router();

router.post("/issue", issueCertificate);
router.get("/:certificateId", getCertificateById);

export default router;
