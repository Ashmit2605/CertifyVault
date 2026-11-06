import { createHash, randomBytes } from "node:crypto";
import {
  and,
  desc,
  eq,
  gt,
  ilike,
  isNull,
  isNotNull,
  lt,
  or,
  sql,
} from "drizzle-orm";
import { db } from "../db/index.js";
import {
  issueCertificate,
  type CertificateIssueInput,
} from "./certificate.service.js";
import { verifySignedW3cCredential } from "./w3c-credential.service.js";
import {
  bulkImportDocuments,
  bulkImportJobs,
  certificateAuditLogs,
  certificates,
  credentialClaimTokens,
  credentialClaims,
  credentialShareLinks,
  credentialSharingSettings,
  invitationOutbox,
  recipientRecords,
  structuredCredentials,
  users,
} from "../db/schema.js";

export class CredentialLifecycleError extends Error {
  constructor(
    message: string,
    readonly statusCode: number,
  ) {
    super(message);
    this.name = "CredentialLifecycleError";
  }
}

function workerErrorDetails(error: unknown) {
  if (error instanceof Error) {
    const details: {
      errorName: string;
      errorMessage: string;
      errorCode?: string;
      causeName?: string;
    } = {
      errorName: error.name,
      errorMessage: error.message,
    };
    let cause: unknown = error;
    for (let depth = 0; depth < 5; depth += 1) {
      if (
        typeof cause !== "object" ||
        cause === null ||
        !("cause" in cause)
      ) {
        break;
      }
      cause = cause.cause;
      if (cause instanceof Error) {
        details.errorMessage = cause.message;
        details.causeName = cause.name;
      }
      if (
        typeof cause === "object" &&
        cause !== null &&
        "code" in cause &&
        typeof cause.code === "string"
      ) {
        details.errorCode = cause.code;
      }
    }
    return details;
  }
  return {
    errorName: "UnknownError",
    errorMessage: String(error),
  };
}

function hashToken(token: string) {
  return createHash("sha256").update(token).digest("hex");
}

async function getAccount(clerkUserId: string, role: "issuer" | "holder") {
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkUserId))
    .limit(1);
  if (!user || user.role !== role || !user.isActive) {
    throw new CredentialLifecycleError(`An active ${role} account is required.`, 403);
  }
  return user;
}

export async function createRecipientRecord(
  clerkUserId: string,
  input: {
    recipientName: string;
    institutionReference: string | null;
    email: string | null;
    academicDetails: Record<string, string | number | null> | null;
  },
) {
  const issuer = await getAccount(clerkUserId, "issuer");
  const [created] = await db
    .insert(recipientRecords)
    .values({
      issuerId: issuer.id,
      recipientName: input.recipientName,
      institutionReference: input.institutionReference,
      email: input.email?.toLowerCase() ?? null,
      academicDetails: input.academicDetails,
    })
    .returning();
  if (!created) throw new CredentialLifecycleError("Recipient could not be created.", 500);
  await db.insert(certificateAuditLogs).values({
    actorId: issuer.id,
    action: "recipient.created",
    metadata: { recipientId: created.id },
  });
  return created;
}

export async function listRecipientRecords(
  clerkUserId: string,
  search?: string,
) {
  const issuer = await getAccount(clerkUserId, "issuer");
  return db
    .select()
    .from(recipientRecords)
    .where(
      and(
        eq(recipientRecords.issuerId, issuer.id),
        search?.trim()
          ? or(
              ilike(recipientRecords.recipientName, `%${search.trim()}%`),
              ilike(recipientRecords.institutionReference, `%${search.trim()}%`),
            )
          : undefined,
      ),
    )
    .orderBy(desc(recipientRecords.createdAt))
    .limit(100);
}

export async function verifyRecipientContact(
  clerkUserId: string,
  recipientId: number,
  evidence: string,
) {
  const issuer = await getAccount(clerkUserId, "issuer");
  const [existing] = await db
    .select({ email: recipientRecords.email })
    .from(recipientRecords)
    .where(
      and(
        eq(recipientRecords.id, recipientId),
        eq(recipientRecords.issuerId, issuer.id),
      ),
    )
    .limit(1);
  if (!existing?.email) {
    throw new CredentialLifecycleError("Recipient contact not found.", 404);
  }
  const [recipient] = await db
    .update(recipientRecords)
    .set({ emailVerifiedAt: new Date(), updatedAt: new Date() })
    .where(
      and(
        eq(recipientRecords.id, recipientId),
        eq(recipientRecords.issuerId, issuer.id),
      ),
    )
    .returning();
  if (!recipient) throw new CredentialLifecycleError("Recipient contact not found.", 404);
  await db.insert(certificateAuditLogs).values({
    actorId: issuer.id,
    action: "recipient.contact_verified",
    metadata: {
      recipientId,
      evidence: evidence.trim(),
    },
  });
  return recipient;
}

export async function createClaimInvitation(
  clerkUserId: string,
  certificateId: string,
) {
  const issuer = await getAccount(clerkUserId, "issuer");
  const [certificate] = await db
    .select({
      id: certificates.id,
      status: certificates.status,
      recipientId: certificates.recipientId,
    })
    .from(certificates)
    .where(
      and(
        eq(certificates.certificateId, certificateId),
        eq(certificates.issuerId, issuer.id),
      ),
    )
    .limit(1);
  if (!certificate) {
    throw new CredentialLifecycleError("Credential not found.", 404);
  }
  if (certificate.status !== "issued") {
    throw new CredentialLifecycleError(
      "A claim invitation can be sent only after issuance is confirmed.",
      409,
    );
  }
  if (!certificate.recipientId) {
    throw new CredentialLifecycleError(
      "Attach an approved recipient record before sending a claim invitation.",
      409,
    );
  }
  const [recipient] = await db
    .select()
    .from(recipientRecords)
    .where(
      and(
        eq(recipientRecords.id, certificate.recipientId),
        eq(recipientRecords.issuerId, issuer.id),
      ),
    )
    .limit(1);
  if (!recipient?.email || !recipient.emailVerifiedAt) {
    throw new CredentialLifecycleError(
      "The recipient must have an institution-verified email address before invitation.",
      409,
    );
  }
  const invitationEmail = recipient.email;

  const result = await db.transaction(async (transaction) => {
    let [claim] = await transaction
      .select()
      .from(credentialClaims)
      .where(eq(credentialClaims.certificateRowId, certificate.id))
      .for("update");
    if (claim?.status === "claimed") {
      throw new CredentialLifecycleError("Credential has already been claimed.", 409);
    }
    if (!claim) {
      [claim] = await transaction
        .insert(credentialClaims)
        .values({
          certificateRowId: certificate.id,
          recipientId: recipient.id,
          status: "requested",
          claimMethod: "issuer_invitation",
        })
        .onConflictDoNothing()
        .returning();
      if (!claim) {
        [claim] = await transaction
          .select()
          .from(credentialClaims)
          .where(eq(credentialClaims.certificateRowId, certificate.id))
          .for("update");
      }
    }
    if (!claim) {
      throw new CredentialLifecycleError("Claim request could not be created.", 500);
    }
    if (claim.status === "rejected") {
      await transaction
        .update(credentialClaims)
        .set({
          status: "requested",
          holderId: null,
          claimedAt: null,
          reviewedBy: null,
          reviewedAt: null,
          decisionReason: null,
          claimMethod: "issuer_invitation",
          updatedAt: new Date(),
        })
        .where(eq(credentialClaims.id, claim.id));
    }
    const [activeDelivery] = await transaction
      .select({ id: invitationOutbox.id })
      .from(invitationOutbox)
      .where(
        and(
          eq(invitationOutbox.claimId, claim.id),
          or(
            eq(invitationOutbox.status, "queued"),
            eq(invitationOutbox.status, "sending"),
            eq(invitationOutbox.status, "retry"),
          ),
        ),
      )
      .limit(1);
    if (activeDelivery) {
      return { claimId: claim.id, deliveryStatus: "queued" as const };
    }
    await transaction
      .update(credentialClaimTokens)
      .set({ revokedAt: new Date() })
      .where(
        and(
          eq(credentialClaimTokens.claimId, claim.id),
          isNull(credentialClaimTokens.usedAt),
          isNull(credentialClaimTokens.revokedAt),
        ),
      );
    const queuedRows = await transaction
      .insert(invitationOutbox)
      .values([{
        claimId: claim.id,
        recipientEmail: invitationEmail,
        status: "queued",
        nextAttemptAt: new Date(),
      }])
      .returning({ id: invitationOutbox.id });
    const queued = queuedRows[0];
    if (!queued) {
      throw new CredentialLifecycleError("Invitation could not be queued.", 500);
    }
    await transaction.insert(certificateAuditLogs).values({
      actorId: issuer.id,
      certificateRowId: certificate.id,
      action: "claim.invitation_queued",
      metadata: { outboxId: queued.id },
    });
    return { claimId: claim.id, deliveryStatus: "queued" as const };
  });
  return result;
}

export async function listIssuerClaimRequests(clerkUserId: string) {
  const issuer = await getAccount(clerkUserId, "issuer");
  return db
    .select({
      id: credentialClaims.id,
      certificateId: certificates.certificateId,
      studentName: certificates.studentName,
      title: certificates.title,
      status: credentialClaims.status,
      claimMethod: credentialClaims.claimMethod,
      evidenceCategory: credentialClaims.evidenceCategory,
      decisionReason: credentialClaims.decisionReason,
      createdAt: credentialClaims.createdAt,
    })
    .from(credentialClaims)
    .innerJoin(certificates, eq(credentialClaims.certificateRowId, certificates.id))
    .where(
      and(
        eq(certificates.issuerId, issuer.id),
        or(
          eq(credentialClaims.status, "requested"),
          eq(credentialClaims.status, "approved"),
          eq(credentialClaims.status, "rejected"),
        ),
      ),
    )
    .orderBy(desc(credentialClaims.createdAt))
    .limit(100);
}

export async function decideClaimRequest(
  clerkUserId: string,
  claimId: number,
  decision: "approve" | "reject",
  reason: string,
) {
  const issuer = await getAccount(clerkUserId, "issuer");
  return db.transaction(async (transaction) => {
    const [claim] = await transaction
      .select({
        claim: credentialClaims,
        certificateId: certificates.id,
        publicId: certificates.certificateId,
      })
      .from(credentialClaims)
      .innerJoin(certificates, eq(credentialClaims.certificateRowId, certificates.id))
      .where(
        and(
          eq(credentialClaims.id, claimId),
          eq(certificates.issuerId, issuer.id),
        ),
      )
      .for("update");
    if (!claim) {
      throw new CredentialLifecycleError("Claim request not found.", 404);
    }
    if (
      claim.claim.status !== "requested" ||
      !claim.claim.holderId
    ) {
      throw new CredentialLifecycleError(
        "Only institution-based requests awaiting review can be decided.",
        409,
      );
    }
    const status = decision === "approve" ? "claimed" : "rejected";
    await transaction
      .update(credentialClaims)
      .set({
        status,
        decisionReason: reason,
        reviewedBy: issuer.id,
        reviewedAt: new Date(),
        claimedAt: decision === "approve" ? new Date() : null,
        updatedAt: new Date(),
      })
      .where(eq(credentialClaims.id, claimId));
    if (decision === "approve") {
      await transaction
        .insert(credentialSharingSettings)
        .values({ claimId })
        .onConflictDoNothing();
    }
    const auditAction =
      decision === "approve" ? "claim.approved" : "claim.rejected";
    await transaction.insert(certificateAuditLogs).values({
      actorId: issuer.id,
      certificateRowId: claim.certificateId,
      action: auditAction,
      metadata: { claimId, reason },
    });
    return { claimId, status, certificateId: claim.publicId };
  });
}

async function getHolder(clerkUserId: string) {
  const holder = await getAccount(clerkUserId, "holder");
  return holder;
}

export async function verifyInvitationToken(
  clerkUserId: string,
  claimId: number,
  token: string,
) {
  const holder = await getHolder(clerkUserId);
  const [match] = await db
    .select({
      token: credentialClaimTokens,
      claim: credentialClaims,
      certificateId: certificates.certificateId,
      title: certificates.title,
      issuerName: users.institutionName,
    })
    .from(credentialClaimTokens)
    .innerJoin(credentialClaims, eq(credentialClaimTokens.claimId, credentialClaims.id))
    .innerJoin(certificates, eq(credentialClaims.certificateRowId, certificates.id))
    .innerJoin(users, eq(certificates.issuerId, users.id))
    .where(
      and(
        eq(credentialClaimTokens.claimId, claimId),
        eq(credentialClaimTokens.tokenHash, hashToken(token)),
        gt(credentialClaimTokens.expiresAt, new Date()),
        isNull(credentialClaimTokens.usedAt),
        isNull(credentialClaimTokens.revokedAt),
        eq(credentialClaimTokens.recipientEmail, holder.email.toLowerCase()),
        eq(credentialClaims.status, "requested"),
      ),
    )
    .limit(1);
  if (!match) {
    throw new CredentialLifecycleError(
      "Invitation is invalid, expired, already used, or belongs to a different account.",
      400,
    );
  }
  return {
    claimId,
    certificateId: match.certificateId,
    title: match.title,
    institutionName: match.issuerName,
  };
}

export async function completeInvitationClaim(
  clerkUserId: string,
  claimId: number,
  token: string,
) {
  const holder = await getHolder(clerkUserId);
  const digest = hashToken(token);
  return db.transaction(async (transaction) => {
    const [match] = await transaction
      .select({
        token: credentialClaimTokens,
        claim: credentialClaims,
        certificate: certificates,
      })
      .from(credentialClaimTokens)
      .innerJoin(credentialClaims, eq(credentialClaimTokens.claimId, credentialClaims.id))
      .innerJoin(certificates, eq(credentialClaims.certificateRowId, certificates.id))
      .where(
        and(
          eq(credentialClaimTokens.claimId, claimId),
          eq(credentialClaimTokens.tokenHash, digest),
          gt(credentialClaimTokens.expiresAt, new Date()),
          isNull(credentialClaimTokens.usedAt),
          isNull(credentialClaimTokens.revokedAt),
          eq(credentialClaimTokens.recipientEmail, holder.email.toLowerCase()),
          eq(credentialClaims.status, "requested"),
        ),
      )
      .for("update");
    if (!match) {
      throw new CredentialLifecycleError(
        "Invitation is invalid, expired, already used, or belongs to a different account.",
        400,
      );
    }
    const now = new Date();
    const [consumed] = await transaction
      .update(credentialClaimTokens)
      .set({ usedAt: now })
      .where(
        and(
          eq(credentialClaimTokens.id, match.token.id),
          isNull(credentialClaimTokens.usedAt),
          isNull(credentialClaimTokens.revokedAt),
        ),
      )
      .returning({ id: credentialClaimTokens.id });
    if (!consumed) {
      throw new CredentialLifecycleError("Invitation has already been used.", 409);
    }
    await transaction
      .update(credentialClaims)
      .set({
        holderId: holder.id,
        status: "claimed",
        claimMethod: "issuer_invitation",
        claimedAt: now,
        updatedAt: now,
      })
      .where(
        and(
          eq(credentialClaims.id, match.claim.id),
          eq(credentialClaims.status, "requested"),
        ),
      );
    await transaction
      .insert(credentialSharingSettings)
      .values({ claimId: match.claim.id })
      .onConflictDoNothing();
    await transaction.insert(certificateAuditLogs).values({
      actorId: holder.id,
      certificateRowId: match.certificate.id,
      action: "claim.completed",
      metadata: { claimId },
    });
    return { certificateId: match.certificate.certificateId, status: "claimed" };
  });
}

export async function requestCredentialDiscovery(
  clerkUserId: string,
  input: { institutionName: string; institutionReference: string },
) {
  const holder = await getHolder(clerkUserId);
  const [issuer] = await db
    .select({ id: users.id })
    .from(users)
    .where(
      and(
        eq(users.role, "issuer"),
        eq(users.isActive, true),
        ilike(users.institutionName, input.institutionName.trim()),
      ),
    )
    .limit(1);
  if (issuer) {
    const [recipient] = await db
      .select({ id: recipientRecords.id })
      .from(recipientRecords)
      .where(
        and(
          eq(recipientRecords.issuerId, issuer.id),
          eq(recipientRecords.institutionReference, input.institutionReference.trim()),
          eq(recipientRecords.email, holder.email.toLowerCase()),
          isNotNull(recipientRecords.emailVerifiedAt),
        ),
      )
      .limit(1);
    if (recipient) {
      const matches = await db
        .select({ id: certificates.id })
        .from(certificates)
        .where(
          and(
            eq(certificates.recipientId, recipient.id),
            eq(certificates.status, "issued"),
          ),
        )
        .limit(100);
      for (const certificate of matches) {
        const [claim] = await db
          .insert(credentialClaims)
          .values({
            certificateRowId: certificate.id,
            recipientId: recipient.id,
            holderId: holder.id,
            status: "requested",
            claimMethod: "institution_search",
            evidenceCategory: "institution_reference_and_verified_email",
          })
          .onConflictDoNothing()
          .returning({ id: credentialClaims.id });
        if (claim) {
          await db.insert(certificateAuditLogs).values({
            actorId: holder.id,
            certificateRowId: certificate.id,
            action: "claim.discovery_requested",
            metadata: { claimId: claim.id },
          });
        }
      }
    }
  }
  return { requestReceived: true };
}

export async function listHolderCredentials(clerkUserId: string) {
  const holder = await getHolder(clerkUserId);
  return db
    .select({
      claimId: credentialClaims.id,
      certificateId: certificates.certificateId,
      certificateNumber: certificates.certificateNumber,
      title: certificates.title,
      course: certificates.course,
      certificateType: certificates.certificateType,
      issueDate: certificates.issueDate,
      status: certificates.status,
      institutionName: users.institutionName,
      visibility: credentialSharingSettings.visibility,
      pdfDownloadPolicy: credentialSharingSettings.pdfDownloadPolicy,
      showRecipientName: credentialSharingSettings.showRecipientName,
    })
    .from(credentialClaims)
    .innerJoin(certificates, eq(credentialClaims.certificateRowId, certificates.id))
    .leftJoin(credentialSharingSettings, eq(credentialSharingSettings.claimId, credentialClaims.id))
    .leftJoin(users, eq(certificates.issuerId, users.id))
    .where(
      and(
        eq(credentialClaims.holderId, holder.id),
        eq(credentialClaims.status, "claimed"),
      ),
    )
    .orderBy(desc(credentialClaims.claimedAt));
}

export async function getHolderCredential(
  clerkUserId: string,
  certificateId: string,
) {
  const holder = await getHolder(clerkUserId);
  const [credential] = await db
    .select({
      claimId: credentialClaims.id,
      certificate: certificates,
      institutionName: users.institutionName,
      settings: credentialSharingSettings,
      structured: structuredCredentials,
    })
    .from(credentialClaims)
    .innerJoin(certificates, eq(credentialClaims.certificateRowId, certificates.id))
    .leftJoin(credentialSharingSettings, eq(credentialSharingSettings.claimId, credentialClaims.id))
    .leftJoin(users, eq(certificates.issuerId, users.id))
    .leftJoin(structuredCredentials, eq(structuredCredentials.certificateRowId, certificates.id))
    .where(
      and(
        eq(certificates.certificateId, certificateId),
        eq(credentialClaims.holderId, holder.id),
        eq(credentialClaims.status, "claimed"),
      ),
    )
    .limit(1);
  if (!credential) {
    throw new CredentialLifecycleError("Credential not found.", 404);
  }
  const {
    storageKey,
    verificationUrl,
    ...safeCertificate
  } = credential.certificate;
  void storageKey;
  void verificationUrl;
  return {
    claimId: credential.claimId,
    certificate: safeCertificate,
    institutionName: credential.institutionName,
    sharing: credential.settings,
    structuredCredentialAvailable: Boolean(credential.structured),
  };
}

export async function updateHolderSharing(
  clerkUserId: string,
  certificateId: string,
  input: {
    visibility: "public" | "unlisted" | "private";
    pdfDownloadPolicy: "private" | "link" | "public";
    showRecipientName: boolean;
    allowStructuredExport: boolean;
  },
) {
  const holder = await getHolder(clerkUserId);
  return db.transaction(async (transaction) => {
    const [claim] = await transaction
      .select({
        id: credentialClaims.id,
        certificateRowId: certificates.id,
      })
      .from(credentialClaims)
      .innerJoin(certificates, eq(credentialClaims.certificateRowId, certificates.id))
      .where(
        and(
          eq(certificates.certificateId, certificateId),
          eq(credentialClaims.holderId, holder.id),
          eq(credentialClaims.status, "claimed"),
        ),
      )
      .limit(1);
    if (!claim) {
      throw new CredentialLifecycleError("Credential not found.", 404);
    }
    const [settings] = await transaction
      .insert(credentialSharingSettings)
      .values({ claimId: claim.id, ...input, updatedAt: new Date() })
      .onConflictDoUpdate({
        target: credentialSharingSettings.claimId,
        set: { ...input, updatedAt: new Date() },
      })
      .returning();
    await transaction
      .update(credentialShareLinks)
      .set({ revokedAt: new Date() })
      .where(
        and(
          eq(credentialShareLinks.claimId, claim.id),
          isNull(credentialShareLinks.revokedAt),
        ),
      );
    await transaction.insert(certificateAuditLogs).values({
      actorId: holder.id,
      certificateRowId: claim.certificateRowId,
      action: "credential.sharing_updated",
      metadata: {
        visibility: input.visibility,
        pdfDownloadPolicy: input.pdfDownloadPolicy,
        showRecipientName: input.showRecipientName ? 1 : 0,
        allowStructuredExport: input.allowStructuredExport ? 1 : 0,
      },
    });
    return settings;
  });
}

export async function createHolderShareLink(
  clerkUserId: string,
  certificateId: string,
  expiresInDays: number,
  allowPdfDownload: boolean,
) {
  const holder = await getHolder(clerkUserId);
  const [claim] = await db
    .select({ claimId: credentialClaims.id, rowId: certificates.id })
    .from(credentialClaims)
    .innerJoin(certificates, eq(credentialClaims.certificateRowId, certificates.id))
    .where(
      and(
        eq(certificates.certificateId, certificateId),
        eq(credentialClaims.holderId, holder.id),
        eq(credentialClaims.status, "claimed"),
      ),
    )
    .limit(1);
  if (!claim) throw new CredentialLifecycleError("Credential not found.", 404);
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + expiresInDays * 24 * 60 * 60 * 1000);
  const [link] = await db
    .insert(credentialShareLinks)
    .values({
      claimId: claim.claimId,
      tokenHash: hashToken(token),
      allowPdfDownload,
      expiresAt,
    })
    .returning({ id: credentialShareLinks.id });
  if (!link) throw new CredentialLifecycleError("Share link could not be created.", 500);
  await db.insert(certificateAuditLogs).values({
    actorId: holder.id,
    certificateRowId: claim.rowId,
    action: "credential.share_link_created",
    metadata: { linkId: link.id, expiresAt: expiresAt.toISOString() },
  });
  const frontendBase =
    process.env.PUBLIC_CREDENTIAL_URL?.trim() ??
    process.env.FRONTEND_URL?.split(",")[0]?.trim() ??
    "http://localhost:5173";
  return {
    id: link.id,
    url: `${frontendBase.replace(/\/+$/, "")}/credentials/${encodeURIComponent(certificateId)}?share=${encodeURIComponent(token)}`,
    expiresAt,
    allowPdfDownload,
  };
}

export async function revokeHolderShareLink(
  clerkUserId: string,
  certificateId: string,
  linkId: number,
) {
  const holder = await getHolder(clerkUserId);
  const [link] = await db
    .select({ link: credentialShareLinks, rowId: certificates.id })
    .from(credentialShareLinks)
    .innerJoin(credentialClaims, eq(credentialShareLinks.claimId, credentialClaims.id))
    .innerJoin(certificates, eq(credentialClaims.certificateRowId, certificates.id))
    .where(
      and(
        eq(credentialShareLinks.id, linkId),
        eq(certificates.certificateId, certificateId),
        eq(credentialClaims.holderId, holder.id),
        eq(credentialClaims.status, "claimed"),
      ),
    )
    .limit(1);
  if (!link) throw new CredentialLifecycleError("Share link not found.", 404);
  await db
    .update(credentialShareLinks)
    .set({ revokedAt: new Date() })
    .where(eq(credentialShareLinks.id, linkId));
  await db.insert(certificateAuditLogs).values({
    actorId: holder.id,
    certificateRowId: link.rowId,
    action: "credential.share_link_revoked",
    metadata: { linkId },
  });
}

export async function listHolderShareLinks(
  clerkUserId: string,
  certificateId: string,
) {
  const holder = await getHolder(clerkUserId);
  const [claim] = await db
    .select({ id: credentialClaims.id })
    .from(credentialClaims)
    .innerJoin(certificates, eq(credentialClaims.certificateRowId, certificates.id))
    .where(
      and(
        eq(certificates.certificateId, certificateId),
        eq(credentialClaims.holderId, holder.id),
        eq(credentialClaims.status, "claimed"),
      ),
    )
    .limit(1);
  if (!claim) throw new CredentialLifecycleError("Credential not found.", 404);
  return db
    .select({
      id: credentialShareLinks.id,
      allowPdfDownload: credentialShareLinks.allowPdfDownload,
      expiresAt: credentialShareLinks.expiresAt,
      revokedAt: credentialShareLinks.revokedAt,
      createdAt: credentialShareLinks.createdAt,
    })
    .from(credentialShareLinks)
    .where(eq(credentialShareLinks.claimId, claim.id))
    .orderBy(desc(credentialShareLinks.createdAt));
}

export async function authorizeHolderPdf(
  clerkUserId: string,
  certificateId: string,
) {
  const holder = await getHolder(clerkUserId);
  const [certificate] = await db
    .select()
    .from(certificates)
    .innerJoin(credentialClaims, eq(credentialClaims.certificateRowId, certificates.id))
    .where(
      and(
        eq(certificates.certificateId, certificateId),
        eq(credentialClaims.holderId, holder.id),
        eq(credentialClaims.status, "claimed"),
      ),
    )
    .limit(1);
  if (!certificate) throw new CredentialLifecycleError("Credential not found.", 404);
  return certificate.certificates;
}

export async function getHolderCertificatePdf(
  clerkUserId: string,
  certificateId: string,
): Promise<typeof certificates.$inferSelect & { storageKey: string }> {
  const certificate = await authorizeHolderPdf(clerkUserId, certificateId);
  if (
    certificate.status !== "issued" &&
    certificate.status !== "revoked" &&
    certificate.status !== "expired"
  ) {
    throw new CredentialLifecycleError(
      "The original file is not available until issuance is confirmed.",
      409,
    );
  }
  const storageKey = certificate.storageKey;
  if (!storageKey) {
    throw new CredentialLifecycleError("Credential file is unavailable.", 404);
  }
  return { ...certificate, storageKey };
}

export async function authorizePublicCredential(
  certificateId: string,
  shareToken?: string,
) {
  const [record] = await db
    .select({
      id: certificates.id,
      claimId: credentialClaims.id,
      visibility: credentialSharingSettings.visibility,
      pdfPolicy: credentialSharingSettings.pdfDownloadPolicy,
      showRecipientName: credentialSharingSettings.showRecipientName,
    })
    .from(certificates)
    .leftJoin(credentialClaims, eq(credentialClaims.certificateRowId, certificates.id))
    .leftJoin(credentialSharingSettings, eq(credentialSharingSettings.claimId, credentialClaims.id))
    .where(eq(certificates.certificateId, certificateId))
    .limit(1);
  if (!record) throw new CredentialLifecycleError("Credential not found.", 404);

  const link = shareToken
    ? (
        await db
          .select({ allowPdfDownload: credentialShareLinks.allowPdfDownload })
          .from(credentialShareLinks)
          .where(
            and(
              eq(credentialShareLinks.claimId, record.claimId ?? -1),
              eq(credentialShareLinks.tokenHash, hashToken(shareToken)),
              gt(credentialShareLinks.expiresAt, new Date()),
              isNull(credentialShareLinks.revokedAt),
            ),
          )
          .limit(1)
      )[0]
    : undefined;
  if (shareToken && !link) {
    throw new CredentialLifecycleError("Share link is invalid or expired.", 404);
  }
  if (
    record.claimId &&
    record.visibility === "private" &&
    !link
  ) {
    throw new CredentialLifecycleError("Credential is private.", 404);
  }
  return {
    claimId: record.claimId,
    visibility: record.visibility ?? "unlisted",
    pdfPolicy: record.pdfPolicy ?? "private",
    showRecipientName: record.showRecipientName ?? false,
    shareAllowsPdf: link?.allowPdfDownload ?? false,
  };
}

export async function getClaimStatusForIssuer(
  clerkUserId: string,
  certificateId: string,
) {
  const issuer = await getAccount(clerkUserId, "issuer");
  const [row] = await db
    .select({
      status: credentialClaims.status,
      claimMethod: credentialClaims.claimMethod,
      claimedAt: credentialClaims.claimedAt,
      deliveryStatus: invitationOutbox.status,
    })
    .from(certificates)
    .leftJoin(credentialClaims, eq(credentialClaims.certificateRowId, certificates.id))
    .leftJoin(invitationOutbox, eq(invitationOutbox.claimId, credentialClaims.id))
    .where(
      and(
        eq(certificates.certificateId, certificateId),
        eq(certificates.issuerId, issuer.id),
      ),
    )
    .orderBy(desc(invitationOutbox.createdAt))
    .limit(1);
  if (!row) throw new CredentialLifecycleError("Credential not found.", 404);
  return row;
}

export async function listHolderClaimRequests(clerkUserId: string) {
  const holder = await getHolder(clerkUserId);
  return db
    .select({
      claimId: credentialClaims.id,
      certificateId: certificates.certificateId,
      title: certificates.title,
      institutionName: users.institutionName,
      status: credentialClaims.status,
      claimMethod: credentialClaims.claimMethod,
      createdAt: credentialClaims.createdAt,
    })
    .from(credentialClaims)
    .innerJoin(certificates, eq(credentialClaims.certificateRowId, certificates.id))
    .leftJoin(users, eq(certificates.issuerId, users.id))
    .where(
      and(
        eq(credentialClaims.holderId, holder.id),
        or(
          eq(credentialClaims.status, "requested"),
          eq(credentialClaims.status, "rejected"),
        ),
      ),
    )
    .orderBy(desc(credentialClaims.createdAt));
}

export async function listHolderInvitations(clerkUserId: string) {
  const holder = await getHolder(clerkUserId);
  return db
    .select({
      claimId: credentialClaimTokens.claimId,
      certificateId: certificates.certificateId,
      title: certificates.title,
      institutionName: users.institutionName,
      expiresAt: credentialClaimTokens.expiresAt,
      usedAt: credentialClaimTokens.usedAt,
      revokedAt: credentialClaimTokens.revokedAt,
      claimStatus: credentialClaims.status,
    })
    .from(credentialClaimTokens)
    .innerJoin(credentialClaims, eq(credentialClaimTokens.claimId, credentialClaims.id))
    .innerJoin(certificates, eq(credentialClaims.certificateRowId, certificates.id))
    .leftJoin(users, eq(certificates.issuerId, users.id))
    .where(
      and(
        eq(credentialClaimTokens.recipientEmail, holder.email.toLowerCase()),
        or(
          eq(credentialClaims.status, "requested"),
          eq(credentialClaims.status, "claimed"),
        ),
      ),
    )
    .orderBy(desc(credentialClaimTokens.createdAt));
}

export async function revokeClaimInvitations(
  clerkUserId: string,
  certificateId: string,
) {
  const issuer = await getAccount(clerkUserId, "issuer");
  const [certificate] = await db
    .select({ id: certificates.id })
    .from(certificates)
    .where(
      and(
        eq(certificates.certificateId, certificateId),
        eq(certificates.issuerId, issuer.id),
      ),
    )
    .limit(1);
  if (!certificate) throw new CredentialLifecycleError("Credential not found.", 404);
  const [claim] = await db
    .select({ id: credentialClaims.id })
    .from(credentialClaims)
    .where(eq(credentialClaims.certificateRowId, certificate.id))
    .limit(1);
  if (!claim) throw new CredentialLifecycleError("Invitation not found.", 404);
  await db
    .update(credentialClaimTokens)
    .set({ revokedAt: new Date() })
    .where(
      and(
        eq(credentialClaimTokens.claimId, claim.id),
        isNull(credentialClaimTokens.revokedAt),
        isNull(credentialClaimTokens.usedAt),
      ),
    );
  await db.insert(certificateAuditLogs).values({
    actorId: issuer.id,
    certificateRowId: certificate.id,
    action: "claim.invitations_revoked",
  });
}

export async function getHolderStructuredCredential(
  clerkUserId: string,
  certificateId: string,
) {
  const holder = await getHolder(clerkUserId);
  const [result] = await db
    .select({
      credential: structuredCredentials.credentialJson,
      digest: structuredCredentials.credentialDigest,
      allowExport: credentialSharingSettings.allowStructuredExport,
    })
    .from(credentialClaims)
    .innerJoin(certificates, eq(credentialClaims.certificateRowId, certificates.id))
    .leftJoin(credentialSharingSettings, eq(credentialSharingSettings.claimId, credentialClaims.id))
    .innerJoin(structuredCredentials, eq(structuredCredentials.certificateRowId, certificates.id))
    .where(
      and(
        eq(certificates.certificateId, certificateId),
        eq(credentialClaims.holderId, holder.id),
        eq(credentialClaims.status, "claimed"),
      ),
    )
    .limit(1);
  if (!result) {
    throw new CredentialLifecycleError("Structured credential not found.", 404);
  }
  if (!result.allowExport) {
    throw new CredentialLifecycleError(
      "Structured credential export is disabled by the holder.",
      403,
    );
  }
  const valid = await verifySignedW3cCredential(
    result.credential,
    result.digest,
  );
  if (!valid) {
    throw new CredentialLifecycleError(
      "Structured credential integrity verification failed.",
      503,
    );
  }
  return result.credential;
}

export async function enqueueImportJob(
  clerkUserId: string,
  idempotencyKey: string,
  rows: Record<string, string | null>[],
) {
  const issuer = await getAccount(clerkUserId, "issuer");
  if (!rows.length || rows.length > 500) {
    throw new CredentialLifecycleError("Import must contain between 1 and 500 rows.", 400);
  }
  return db.transaction(async (transaction) => {
    const [job] = await transaction
      .insert(bulkImportJobs)
      .values({
        issuerId: issuer.id,
        idempotencyKey,
        status: "queued",
        totalDocuments: rows.length,
      })
      .onConflictDoNothing()
      .returning();
    if (!job) {
      const [existing] = await transaction
        .select()
        .from(bulkImportJobs)
        .where(
          and(
            eq(bulkImportJobs.issuerId, issuer.id),
            eq(bulkImportJobs.idempotencyKey, idempotencyKey),
          ),
        )
        .limit(1);
      if (!existing) throw new CredentialLifecycleError("Import job could not be created.", 500);
      return existing;
    }
    await transaction.insert(bulkImportDocuments).values(
      rows.map((input, index) => ({
        jobId: job.id,
        rowNumber: index + 1,
        input,
        status: "queued" as const,
      })),
    );
    return job;
  });
}

export async function getImportJob(clerkUserId: string, jobId: number) {
  const issuer = await getAccount(clerkUserId, "issuer");
  const [job] = await db
    .select()
    .from(bulkImportJobs)
    .where(and(eq(bulkImportJobs.id, jobId), eq(bulkImportJobs.issuerId, issuer.id)))
    .limit(1);
  if (!job) throw new CredentialLifecycleError("Import job not found.", 404);
  const documents = await db
    .select({
      id: bulkImportDocuments.id,
      rowNumber: bulkImportDocuments.rowNumber,
      status: bulkImportDocuments.status,
      error: bulkImportDocuments.error,
      certificateId: certificates.certificateId,
    })
    .from(bulkImportDocuments)
    .leftJoin(certificates, eq(bulkImportDocuments.certificateRowId, certificates.id))
    .where(eq(bulkImportDocuments.jobId, jobId))
    .orderBy(bulkImportDocuments.rowNumber);
  return { ...job, documents };
}

function importIssueInput(
  input: Record<string, string | null>,
): CertificateIssueInput & { recipientEmail: string | null; institutionReference: string | null } {
  const value = (key: string) => input[key]?.trim() ?? "";
  const studentName = value("studentName");
  const certificateType = value("certificateType").toLowerCase();
  const title = value("title");
  const course = value("course");
  const issueDate = value("issueDate");
  const expiryDate = value("expiryDate");
  const certificateNumber = value("certificateNumber");
  const grade = value("grade");
  const recipientEmail = value("recipientEmail").toLowerCase();
  const institutionReference = value("institutionReference");
  const validTypes = [
    "degree",
    "diploma",
    "bonafide",
    "course",
    "internship",
    "training",
    "achievement",
    "custom",
  ];
  const validDate = (date: string) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false;
    const parsed = new Date(`${date}T00:00:00.000Z`);
    return Number.isFinite(parsed.getTime()) && parsed.toISOString().slice(0, 10) === date;
  };
  if (!studentName || studentName.length > 255) throw new Error("Student name is required and must be at most 255 characters.");
  if (!validTypes.includes(certificateType)) throw new Error("Certificate type is invalid.");
  if (!title || title.length > 255) throw new Error("Title is required and must be at most 255 characters.");
  if (!course || course.length > 255) throw new Error("Course is required and must be at most 255 characters.");
  if (!validDate(issueDate)) throw new Error("Issue date must be a valid YYYY-MM-DD date.");
  if (expiryDate && (!validDate(expiryDate) || expiryDate < issueDate)) {
    throw new Error("Expiry date must be valid and cannot be before the issue date.");
  }
  if (certificateNumber.length > 100) throw new Error("Certificate number must be at most 100 characters.");
  if (grade.length > 50) throw new Error("Grade must be at most 50 characters.");
  if (recipientEmail && (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(recipientEmail) || recipientEmail.length > 320)) {
    throw new Error("Recipient email is invalid.");
  }
  if (institutionReference.length > 255) throw new Error("Institution reference must be at most 255 characters.");
  return {
    studentName,
    certificateNumber: certificateNumber || null,
    certificateType,
    title,
    course,
    grade: grade || null,
    issueDate,
    expiryDate: expiryDate || null,
    recipientEmail: recipientEmail || null,
    institutionReference: institutionReference || null,
  };
}

async function findOrCreateBulkRecipient(
  issuerId: number,
  input: ReturnType<typeof importIssueInput>,
) {
  if (input.institutionReference) {
    const [existing] = await db
      .select()
      .from(recipientRecords)
      .where(
        and(
          eq(recipientRecords.issuerId, issuerId),
          eq(recipientRecords.institutionReference, input.institutionReference),
        ),
      )
      .limit(1);
    if (existing) {
      if (
        existing.recipientName.trim().toLowerCase() !== input.studentName.toLowerCase() ||
        (existing.email?.toLowerCase() ?? null) !== input.recipientEmail
      ) {
        throw new Error("Institution reference already belongs to a different recipient record.");
      }
      return existing.id;
    }
  }
  const [created] = await db
    .insert(recipientRecords)
    .values({
      issuerId,
      recipientName: input.studentName,
      institutionReference: input.institutionReference,
      email: input.recipientEmail,
      academicDetails: null,
    })
    .returning({ id: recipientRecords.id });
  if (!created) throw new Error("Recipient record could not be created.");
  return created.id;
}

async function refreshImportJob(jobId: number) {
  const [counts] = await db
    .select({
      issued: sql<number>`count(*) filter (where ${bulkImportDocuments.status} = 'issued')::int`,
      failed: sql<number>`count(*) filter (where ${bulkImportDocuments.status} = 'failed')::int`,
      remaining: sql<number>`count(*) filter (where ${bulkImportDocuments.status} in ('queued', 'validated', 'issuing'))::int`,
    })
    .from(bulkImportDocuments)
    .where(eq(bulkImportDocuments.jobId, jobId));
  if (!counts) return;
  const completedDocuments = counts.issued + counts.failed;
  const status =
    counts.remaining > 0
      ? "processing"
      : counts.failed > 0
        ? "completed_with_errors"
        : "completed";
  await db
    .update(bulkImportJobs)
    .set({
      status,
      completedDocuments,
      failedDocuments: counts.failed,
      updatedAt: new Date(),
    })
    .where(eq(bulkImportJobs.id, jobId));
}

export async function processBulkImportOnce() {
  const now = new Date();
  const stale = await db
    .select({
      id: bulkImportDocuments.id,
      jobId: bulkImportDocuments.jobId,
    })
    .from(bulkImportDocuments)
    .where(
      and(
        eq(bulkImportDocuments.status, "issuing"),
        lt(bulkImportDocuments.updatedAt, new Date(now.getTime() - 15 * 60_000)),
      ),
    )
    .limit(20);
  for (const document of stale) {
    const [alreadyIssued] = await db
      .select({ id: certificates.id })
      .from(certificates)
      .where(eq(certificates.bulkImportDocumentId, document.id))
      .limit(1);
    if (alreadyIssued) {
      await db
        .update(bulkImportDocuments)
        .set({
          status: "issued",
          certificateRowId: alreadyIssued.id,
          error: null,
          updatedAt: now,
        })
        .where(eq(bulkImportDocuments.id, document.id));
    } else {
      await db
        .update(bulkImportDocuments)
        .set({ status: "queued", updatedAt: now })
        .where(eq(bulkImportDocuments.id, document.id));
    }
    await refreshImportJob(document.jobId);
  }

  const queued = await db.transaction(async (transaction) => {
    const [document] = await transaction
      .select({
        document: bulkImportDocuments,
        job: bulkImportJobs,
        issuerClerkId: users.clerkId,
      })
      .from(bulkImportDocuments)
      .innerJoin(bulkImportJobs, eq(bulkImportDocuments.jobId, bulkImportJobs.id))
      .innerJoin(users, eq(bulkImportJobs.issuerId, users.id))
      .where(
        and(
          eq(bulkImportDocuments.status, "queued"),
          or(
            eq(bulkImportJobs.status, "queued"),
            eq(bulkImportJobs.status, "processing"),
          ),
        ),
      )
      .orderBy(bulkImportDocuments.createdAt)
      .limit(1)
      .for("update", { skipLocked: true });
    if (!document) return null;
    await transaction
      .update(bulkImportDocuments)
      .set({ status: "issuing", error: null, updatedAt: now })
      .where(eq(bulkImportDocuments.id, document.document.id));
    await transaction
      .update(bulkImportJobs)
      .set({ status: "processing", updatedAt: now })
      .where(eq(bulkImportJobs.id, document.job.id));
    return document;
  });
  if (!queued) return false;

  const documentId = queued.document.id;
  const jobId = queued.job.id;
  try {
    const [existing] = await db
      .select({ id: certificates.id })
      .from(certificates)
      .where(eq(certificates.bulkImportDocumentId, documentId))
      .limit(1);
    if (existing) {
      await db
        .update(bulkImportDocuments)
        .set({
          status: "issued",
          certificateRowId: existing.id,
          error: null,
          updatedAt: new Date(),
        })
        .where(eq(bulkImportDocuments.id, documentId));
    } else {
      const input = importIssueInput(queued.document.input);
      const recipientId = await findOrCreateBulkRecipient(queued.job.issuerId, input);
      const certificate = await issueCertificate(queued.issuerClerkId, {
        ...input,
        recipientId,
        bulkImportDocumentId: documentId,
      });
      await db
        .update(bulkImportDocuments)
        .set({
          status: "issued",
          certificateRowId: certificate.id,
          error: null,
          updatedAt: new Date(),
        })
        .where(eq(bulkImportDocuments.id, documentId));
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Certificate issuance failed.";
    await db
      .update(bulkImportDocuments)
      .set({
        status: "failed",
        error: message.slice(0, 1000),
        updatedAt: new Date(),
      })
      .where(eq(bulkImportDocuments.id, documentId));
    console.error("Bulk import document failed:", {
      jobId,
      documentId,
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
  }
  await refreshImportJob(jobId);
  return true;
}

export function startBulkImportWorker() {
  if (!process.env.DATABASE_URL?.trim()) {
    console.warn("Bulk import processing is disabled until DATABASE_URL is configured.");
    return;
  }
  let processing = false;
  const timer = setInterval(() => {
    if (processing) return;
    processing = true;
    void processBulkImportOnce()
      .catch((error: unknown) => {
        console.error("Bulk import worker failed:", {
          ...workerErrorDetails(error),
        });
      })
      .finally(() => {
        processing = false;
      });
  }, 2_000);
  timer.unref();
}

export async function getClaimDeliveryToken(
  claimId: number,
  email: string,
) {
  const token = randomBytes(32).toString("base64url");
  const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000);
  await db.insert(credentialClaimTokens).values({
    claimId,
    tokenHash: hashToken(token),
    recipientEmail: email.toLowerCase(),
    expiresAt,
  });
  return { token, expiresAt };
}

export async function sendInvitationEmail(
  email: string,
  url: string,
  title: string,
  institutionName: string,
) {
  const endpoint = process.env.EMAIL_API_URL?.trim();
  const apiKey = process.env.EMAIL_API_KEY?.trim();
  const from = process.env.EMAIL_FROM?.trim();
  if (!endpoint || !apiKey || !from) {
    throw new Error("Invitation email delivery is not configured.");
  }
  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from,
      to: [email],
      subject: `Claim your credential from ${institutionName}`,
      text: `Your credential "${title}" from ${institutionName} is ready to claim. Sign in to CertifyVault and use this link: ${url}\n\nIf you did not expect this message, you can ignore it.`,
    }),
    signal: AbortSignal.timeout(10_000),
  });
  if (!response.ok) {
    throw new Error(`Email delivery provider returned HTTP ${response.status}.`);
  }
}

export async function processInvitationOutboxOnce() {
  const now = new Date();
  await db
    .update(invitationOutbox)
    .set({ status: "retry", updatedAt: now })
    .where(
      and(
        eq(invitationOutbox.status, "sending"),
        lt(invitationOutbox.updatedAt, new Date(now.getTime() - 5 * 60_000)),
      ),
    );

  const queued = await db.transaction(async (transaction) => {
    const [item] = await transaction
      .select()
      .from(invitationOutbox)
      .where(
        and(
          or(
            eq(invitationOutbox.status, "queued"),
            eq(invitationOutbox.status, "retry"),
          ),
          lt(invitationOutbox.nextAttemptAt, now),
        ),
      )
      .orderBy(invitationOutbox.createdAt)
      .limit(1)
      .for("update", { skipLocked: true });
    if (!item) return null;
    await transaction
      .update(invitationOutbox)
      .set({
        status: "sending",
        attempts: item.attempts + 1,
        updatedAt: now,
      })
      .where(eq(invitationOutbox.id, item.id));
    return { ...item, attempts: item.attempts + 1 };
  });
  if (!queued) return false;

  let tokenId: number | null = null;
  try {
    const [details] = await db
      .select({
        certificateRowId: certificates.id,
        issuerId: certificates.issuerId,
        certificateId: certificates.certificateId,
        title: certificates.title,
        institutionName: users.institutionName,
        claimStatus: credentialClaims.status,
      })
      .from(credentialClaims)
      .innerJoin(certificates, eq(credentialClaims.certificateRowId, certificates.id))
      .innerJoin(users, eq(certificates.issuerId, users.id))
      .where(eq(credentialClaims.id, queued.claimId))
      .limit(1);
    if (!details) throw new Error("Invitation credential is unavailable.");
    if (details.claimStatus !== "requested") {
      await db
        .update(invitationOutbox)
        .set({
          status: "failed",
          lastError: "Claim is no longer available.",
          updatedAt: new Date(),
        })
        .where(eq(invitationOutbox.id, queued.id));
      return true;
    }

    const deliveryToken = randomBytes(32).toString("base64url");
    const expiresAt = new Date(Date.now() + 72 * 60 * 60 * 1000);
    await db
      .update(credentialClaimTokens)
      .set({ revokedAt: new Date() })
      .where(
        and(
          eq(credentialClaimTokens.claimId, queued.claimId),
          isNull(credentialClaimTokens.usedAt),
          isNull(credentialClaimTokens.revokedAt),
        ),
      );
    const [storedToken] = await db
      .insert(credentialClaimTokens)
      .values({
        claimId: queued.claimId,
        tokenHash: hashToken(deliveryToken),
        recipientEmail: queued.recipientEmail,
        expiresAt,
      })
      .returning({ id: credentialClaimTokens.id });
    if (!storedToken) throw new Error("Invitation token could not be stored.");
    tokenId = storedToken.id;

    const base =
      process.env.PUBLIC_CREDENTIAL_URL?.trim() ??
      process.env.FRONTEND_URL?.split(",")[0]?.trim() ??
      "http://localhost:5173";
    const invitationUrl = new URL("/claim-invitation", base);
    invitationUrl.searchParams.set("claimId", String(queued.claimId));
    invitationUrl.searchParams.set("token", deliveryToken);
    await sendInvitationEmail(
      queued.recipientEmail,
      invitationUrl.toString(),
      details.title,
      details.institutionName ?? "your institution",
    );
    await db
      .update(invitationOutbox)
      .set({ status: "sent", lastError: null, updatedAt: new Date() })
      .where(eq(invitationOutbox.id, queued.id));
    await db.insert(certificateAuditLogs).values({
      actorId: details.issuerId,
      certificateRowId: details.certificateRowId,
      action: "claim.invitation_sent",
      metadata: { outboxId: queued.id },
    });
  } catch (error) {
    if (tokenId) {
      await db
        .update(credentialClaimTokens)
        .set({ revokedAt: new Date() })
        .where(eq(credentialClaimTokens.id, tokenId));
    }
    const failedPermanently = queued.attempts >= 5;
    await db
      .update(invitationOutbox)
      .set({
        status: failedPermanently ? "failed" : "retry",
        nextAttemptAt: new Date(Date.now() + Math.min(60, 2 ** queued.attempts) * 60_000),
        lastError: error instanceof Error ? error.message.slice(0, 500) : "Delivery failed.",
        updatedAt: new Date(),
      })
      .where(eq(invitationOutbox.id, queued.id));
    console.error("Claim invitation delivery failed:", {
      outboxId: queued.id,
      errorName: error instanceof Error ? error.name : "UnknownError",
    });
  }
  return true;
}

export function startInvitationOutboxWorker() {
  if (
    !process.env.EMAIL_API_URL?.trim() ||
    !process.env.EMAIL_API_KEY?.trim() ||
    !process.env.EMAIL_FROM?.trim()
  ) {
    console.warn("Claim invitation delivery is disabled until EMAIL_API_URL, EMAIL_API_KEY, and EMAIL_FROM are configured.");
    return;
  }
  const timer = setInterval(() => {
    void processInvitationOutboxOnce().catch((error: unknown) => {
      console.error("Claim invitation worker failed:", {
        ...workerErrorDetails(error),
      });
    });
  }, 15_000);
  timer.unref();
}
