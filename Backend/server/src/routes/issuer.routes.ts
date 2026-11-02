import { Router } from "express";
import {
  getIssuerAuditLogs,
  getIssuerStats,
} from "../controllers/issuer.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/requireRole.middleware.js";

const router = Router();

router.use(authMiddleware, requireRole("issuer"));
router.get("/dashboard/stats", getIssuerStats);
router.get("/audit-logs", getIssuerAuditLogs);

export default router;
