import { Router } from "express";
import {
  downloadPublicCredentialPdf,
  getPublicCredentialPage,
} from "../controllers/public-credential.controller.js";

const router = Router();

router.get("/:publicId", getPublicCredentialPage);
router.get("/:publicId/download", downloadPublicCredentialPdf);

export default router;
