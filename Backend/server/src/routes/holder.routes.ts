import { Router } from "express";
import {
  createShareLink,
  downloadHolderPdf,
  exportHolderCredential,
  holderClaimRequests,
  holderCredentialDetail,
  holderCredentials,
  holderInvitations,
  holderShareLinks,
  revokeShareLink,
  updateSharingSettings,
} from "../controllers/credential-lifecycle.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { requireRole } from "../middleware/requireRole.middleware.js";
import {
  deletePasskey,
  finishPasskeyAuthentication,
  finishPasskeyRegistration,
  listPasskeys,
  startPasskeyAuthentication,
  startPasskeyRegistration,
} from "../controllers/passkey.controller.js";

const router = Router();
router.use(authMiddleware, requireRole("holder"));

router.get("/credentials", holderCredentials);
router.get("/credential-invitations", holderInvitations);
router.get("/claim-requests", holderClaimRequests);
router.get("/credentials/:certificateId", holderCredentialDetail);
router.get("/credentials/:certificateId/sharing", holderCredentialDetail);
router.patch("/credentials/:certificateId/sharing", updateSharingSettings);
router.get("/credentials/:certificateId/pdf", downloadHolderPdf);
router.get("/credentials/:certificateId/export", exportHolderCredential);
router.post("/credentials/:certificateId/share-links", createShareLink);
router.get("/credentials/:certificateId/share-links", holderShareLinks);
router.delete(
  "/credentials/:certificateId/share-links/:linkId",
  revokeShareLink,
);
router.get("/passkeys", listPasskeys);
router.post("/passkeys/registration/options", startPasskeyRegistration);
router.post("/passkeys/registration/verify", finishPasskeyRegistration);
router.post("/passkeys/authentication/options", startPasskeyAuthentication);
router.post("/passkeys/authentication/verify", finishPasskeyAuthentication);
router.delete("/passkeys/:authenticatorId", deletePasskey);

export default router;
