import { Router } from "express";
import { blockchainHealth } from "../controllers/blockchain.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/requireRole.middleware.js";

const router = Router();

router.get("/health", authMiddleware, requireRole("admin"), blockchainHealth);

export default router;
