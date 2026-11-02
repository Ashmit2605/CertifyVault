import { Router } from "express";
import {
  verifyCertificate,
  verifyCertificateQr,
} from "../controllers/verification.controller.js";

const router = Router();

router.post("/", verifyCertificate);
router.get("/:certificateId", verifyCertificateQr);

export default router;
