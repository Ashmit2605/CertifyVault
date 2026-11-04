import { Router } from "express";
import {
  getIssuerAuditLogs,
  getIssuerStats,
} from "../controllers/issuer.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/requireRole.middleware.js";
import {
  createImportJob,
  createRecipient,
  decideIssuerClaim,
  getClaimDeliveryStatus,
  getIssuerClaimRequests,
  listRecipients,
  markRecipientContactVerified,
  queueClaimInvitation,
  readImportJob,
  revokeInvitations,
} from "../controllers/credential-lifecycle.controller.js";

const router = Router();

router.use(authMiddleware, requireRole("issuer"));
router.get("/dashboard/stats", getIssuerStats);
router.get("/audit-logs", getIssuerAuditLogs);
router.get("/recipients", listRecipients);
router.post("/recipients", createRecipient);
router.post("/recipients/:recipientId/verify-contact", markRecipientContactVerified);
router.get("/claim-requests", getIssuerClaimRequests);
router.post("/claim-requests/:claimId/decision", decideIssuerClaim);
router.post("/credentials/:certificateId/invitations", queueClaimInvitation);
router.get("/credentials/:certificateId/invitations", getClaimDeliveryStatus);
router.delete("/credentials/:certificateId/invitations", revokeInvitations);
router.post("/import-jobs", createImportJob);
router.get("/import-jobs/:jobId", readImportJob);

export default router;
