import { Router } from "express";
import {
  completeClaim,
  discoverCredentials,
  verifyClaim,
} from "../controllers/credential-lifecycle.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/requireRole.middleware.js";

const router = Router();
router.use(authMiddleware, requireRole("holder"));
router.post("/discover", discoverCredentials);

export const credentialClaimRouter = Router();
credentialClaimRouter.use(authMiddleware, requireRole("holder"));
credentialClaimRouter.post("/verify-token", verifyClaim);
credentialClaimRouter.post("/complete", completeClaim);

export default router;
