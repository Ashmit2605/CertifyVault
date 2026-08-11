import { Router } from "express";
import { verifyCertificate } from "../controllers/verification.controller.js";

const router = Router();

router.post("/", verifyCertificate);

export default router;
