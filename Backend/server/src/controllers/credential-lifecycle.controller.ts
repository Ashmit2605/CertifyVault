import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import {
  CredentialLifecycleError,
  createClaimInvitation,
  createHolderShareLink,
  createRecipientRecord,
  decideClaimRequest,
  getClaimStatusForIssuer,
  getHolderCertificatePdf,
  getHolderCredential,
  getHolderStructuredCredential,
  getImportJob,
  listHolderClaimRequests,
  listHolderCredentials,
  listHolderInvitations,
  listHolderShareLinks,
  listIssuerClaimRequests,
  listRecipientRecords,
  completeInvitationClaim,
  requestCredentialDiscovery,
  revokeClaimInvitations,
  revokeHolderShareLink,
  updateHolderSharing,
  verifyInvitationToken,
  verifyRecipientContact,
  enqueueImportJob,
} from "../services/credential-lifecycle.service.js";
import { readCertificatePdf } from "../services/certificate-storage.service.js";

const recipientSchema = z.object({
  recipientName: z.string().trim().min(1).max(255),
  institutionReference: z.string().trim().max(255).nullable().optional(),
  email: z.string().email().max(320).nullable().optional(),
  academicDetails: z.record(z.string(), z.union([z.string(), z.number(), z.null()])).nullable().optional(),
}).strict();

const claimDecisionSchema = z.object({
  decision: z.enum(["approve", "reject"]),
  reason: z.string().trim().min(10).max(1000),
}).strict();

const claimTokenSchema = z.object({
  claimId: z.number().int().positive(),
  token: z.string().min(20).max(256),
}).strict();

const discoverySchema = z.object({
  institutionName: z.string().trim().min(1).max(255),
  institutionReference: z.string().trim().min(1).max(255),
}).strict();

const sharingSchema = z.object({
  visibility: z.enum(["public", "unlisted", "private"]),
  pdfDownloadPolicy: z.enum(["private", "link", "public"]),
  showRecipientName: z.boolean(),
  allowStructuredExport: z.boolean(),
}).strict();

const shareLinkSchema = z.object({
  expiresInDays: z.number().int().min(1).max(30),
  allowPdfDownload: z.boolean(),
}).strict();

const importSchema = z.object({
  idempotencyKey: z.string().trim().min(8).max(128),
  rows: z.array(z.record(z.string(), z.string().nullable())).min(1).max(500),
}).strict();

function clerkUserId(res: Response) {
  const id = res.locals.clerkUserId;
  if (!id) throw new CredentialLifecycleError("Authentication required.", 401);
  return id;
}

function handleError(error: unknown, res: Response, next: NextFunction) {
  if (error instanceof CredentialLifecycleError) {
    res.status(error.statusCode).json({ success: false, message: error.message });
  } else {
    next(error);
  }
}

export async function createRecipient(req: Request, res: Response, next: NextFunction) {
  const parsed = recipientSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: "Recipient details are invalid." });
    return;
  }
  try {
    const recipient = await createRecipientRecord(clerkUserId(res), {
      recipientName: parsed.data.recipientName,
      institutionReference: parsed.data.institutionReference ?? null,
      email: parsed.data.email ?? null,
      academicDetails: parsed.data.academicDetails ?? null,
    });
    res.status(201).json({ success: true, data: { recipient } });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function listRecipients(req: Request, res: Response, next: NextFunction) {
  try {
    const recipients = await listRecipientRecords(
      clerkUserId(res),
      typeof req.query.search === "string" ? req.query.search : undefined,
    );
    res.json({ success: true, data: { recipients } });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function markRecipientContactVerified(req: Request, res: Response, next: NextFunction) {
  const confirmation = z.object({
    confirmation: z.literal(true),
    evidence: z.string().trim().min(10).max(1000),
  }).strict().safeParse(req.body);
  if (!confirmation.success) {
    res.status(400).json({ success: false, message: "Explicit verification evidence is required." });
    return;
  }
  try {
    const result = await verifyRecipientContact(
      clerkUserId(res),
      Number(req.params.recipientId),
      confirmation.data.evidence,
    );
    res.json({ success: true, data: { recipient: result } });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function queueClaimInvitation(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await createClaimInvitation(
      clerkUserId(res),
      String(req.params.certificateId ?? ""),
    );
    res.status(202).json({ success: true, data: result });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function getClaimDeliveryStatus(req: Request, res: Response, next: NextFunction) {
  try {
    const status = await getClaimStatusForIssuer(
      clerkUserId(res),
      String(req.params.certificateId ?? ""),
    );
    res.json({ success: true, data: { status } });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function revokeInvitations(req: Request, res: Response, next: NextFunction) {
  try {
    await revokeClaimInvitations(
      clerkUserId(res),
      String(req.params.certificateId ?? ""),
    );
    res.json({ success: true });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function getIssuerClaimRequests(req: Request, res: Response, next: NextFunction) {
  try {
    const claims = await listIssuerClaimRequests(clerkUserId(res));
    res.json({ success: true, data: { claims } });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function decideIssuerClaim(req: Request, res: Response, next: NextFunction) {
  const parsed = claimDecisionSchema.safeParse(req.body);
  const claimId = Number(req.params.claimId);
  if (!parsed.success || !Number.isSafeInteger(claimId) || claimId < 1) {
    res.status(400).json({ success: false, message: "Claim decision is invalid." });
    return;
  }
  try {
    const result = await decideClaimRequest(
      clerkUserId(res),
      claimId,
      parsed.data.decision,
      parsed.data.reason,
    );
    res.json({ success: true, data: { claim: result } });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function discoverCredentials(req: Request, res: Response, next: NextFunction) {
  const parsed = discoverySchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: "Discovery request is invalid." });
    return;
  }
  try {
    const result = await requestCredentialDiscovery(clerkUserId(res), parsed.data);
    res.status(202).json({ success: true, data: result });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function verifyClaim(req: Request, res: Response, next: NextFunction) {
  const parsed = claimTokenSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: "Claim invitation details are invalid." });
    return;
  }
  try {
    const result = await verifyInvitationToken(
      clerkUserId(res),
      parsed.data.claimId,
      parsed.data.token,
    );
    res.json({ success: true, data: result });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function completeClaim(req: Request, res: Response, next: NextFunction) {
  const parsed = claimTokenSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: "Claim invitation details are invalid." });
    return;
  }
  try {
    const result = await completeInvitationClaim(
      clerkUserId(res),
      parsed.data.claimId,
      parsed.data.token,
    );
    res.json({ success: true, data: { claim: result } });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function holderCredentials(req: Request, res: Response, next: NextFunction) {
  try {
    const credentials = await listHolderCredentials(clerkUserId(res));
    res.json({ success: true, data: { credentials } });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function holderClaimRequests(req: Request, res: Response, next: NextFunction) {
  try {
    const claims = await listHolderClaimRequests(clerkUserId(res));
    res.json({ success: true, data: { claims } });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function holderInvitations(req: Request, res: Response, next: NextFunction) {
  try {
    const invitations = await listHolderInvitations(clerkUserId(res));
    res.json({ success: true, data: { invitations } });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function holderCredentialDetail(req: Request, res: Response, next: NextFunction) {
  try {
    const credential = await getHolderCredential(
      clerkUserId(res),
      String(req.params.certificateId ?? ""),
    );
    res.json({ success: true, data: { credential } });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function updateSharingSettings(req: Request, res: Response, next: NextFunction) {
  const parsed = sharingSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: "Sharing settings are invalid." });
    return;
  }
  try {
    const settings = await updateHolderSharing(
      clerkUserId(res),
      String(req.params.certificateId ?? ""),
      parsed.data,
    );
    res.json({ success: true, data: { settings } });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function createShareLink(req: Request, res: Response, next: NextFunction) {
  const parsed = shareLinkSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: "Share-link settings are invalid." });
    return;
  }
  try {
    const link = await createHolderShareLink(
      clerkUserId(res),
      String(req.params.certificateId ?? ""),
      parsed.data.expiresInDays,
      parsed.data.allowPdfDownload,
    );
    res.status(201).json({ success: true, data: { link } });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function holderShareLinks(req: Request, res: Response, next: NextFunction) {
  try {
    const links = await listHolderShareLinks(
      clerkUserId(res),
      String(req.params.certificateId ?? ""),
    );
    res.json({ success: true, data: { links } });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function revokeShareLink(req: Request, res: Response, next: NextFunction) {
  const linkId = Number(req.params.linkId);
  if (!Number.isSafeInteger(linkId) || linkId < 1) {
    res.status(400).json({ success: false, message: "Share link is invalid." });
    return;
  }
  try {
    await revokeHolderShareLink(
      clerkUserId(res),
      String(req.params.certificateId ?? ""),
      linkId,
    );
    res.json({ success: true });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function downloadHolderPdf(req: Request, res: Response, next: NextFunction) {
  try {
    const certificate = await getHolderCertificatePdf(
      clerkUserId(res),
      String(req.params.certificateId ?? ""),
    );
    const pdf = await readCertificatePdf(certificate.storageKey, certificate.certificateHash);
    res.type("application/pdf").attachment(`${certificate.certificateId}.pdf`).send(pdf);
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function exportHolderCredential(req: Request, res: Response, next: NextFunction) {
  try {
    const credential = await getHolderStructuredCredential(
      clerkUserId(res),
      String(req.params.certificateId ?? ""),
    );
    res.set("Content-Disposition", `attachment; filename="${String(req.params.certificateId)}.json"`);
    res.type("application/ld+json").json(credential);
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function createImportJob(req: Request, res: Response, next: NextFunction) {
  const parsed = importSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ success: false, message: "Import job details are invalid." });
    return;
  }
  try {
    const userId = clerkUserId(res);
    const queued = await enqueueImportJob(
      userId,
      parsed.data.idempotencyKey,
      parsed.data.rows,
    );
    const job = await getImportJob(userId, queued.id);
    res.status(202).json({ success: true, data: { job } });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function readImportJob(req: Request, res: Response, next: NextFunction) {
  const jobId = Number(req.params.jobId);
  if (!Number.isSafeInteger(jobId) || jobId < 1) {
    res.status(400).json({ success: false, message: "Import job ID is invalid." });
    return;
  }
  try {
    const job = await getImportJob(clerkUserId(res), jobId);
    res.json({ success: true, data: { job } });
  } catch (error) {
    handleError(error, res, next);
  }
}
