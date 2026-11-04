import { createHash } from "node:crypto";
import {
  generateAuthenticationOptions,
  generateRegistrationOptions,
  verifyAuthenticationResponse,
  verifyRegistrationResponse,
  type AuthenticationResponseJSON,
  type RegistrationResponseJSON,
} from "@simplewebauthn/server";
import { and, eq, gt, isNull, lt } from "drizzle-orm";
import { db } from "../db/index.js";
import {
  certificateAuditLogs,
  holderAuthenticatorChallenges,
  holderAuthenticators,
  users,
} from "../db/schema.js";
import { CredentialLifecycleError } from "./credential-lifecycle.service.js";

type PasskeyPurpose = "registration" | "authentication";
type DbTransaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

function hash(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

async function getHolder(clerkUserId: string) {
  const [holder] = await db
    .select()
    .from(users)
    .where(eq(users.clerkId, clerkUserId))
    .limit(1);
  if (!holder || holder.role !== "holder" || !holder.isActive) {
    throw new CredentialLifecycleError("An active holder account is required.", 403);
  }
  return holder;
}

function getRelyingParty() {
  const origins = (process.env.FRONTEND_URL ?? "")
    .split(",")
    .map((origin) => origin.trim())
    .filter(Boolean)
    .map((origin) => {
      try {
        return new URL(origin).origin;
      } catch {
        throw new CredentialLifecycleError(
          "FRONTEND_URL must contain valid absolute origins for passkeys.",
          503,
        );
      }
    });
  if (!origins.length) {
    throw new CredentialLifecycleError(
      "Passkey authentication requires FRONTEND_URL to be configured.",
      503,
    );
  }
  const rpID = process.env.PASSKEY_RP_ID?.trim() || new URL(origins[0]!).hostname;
  return { rpID, origins };
}

async function createChallenge(
  userId: number,
  purpose: PasskeyPurpose,
  challenge: string,
) {
  const now = new Date();
  await db
    .delete(holderAuthenticatorChallenges)
    .where(lt(holderAuthenticatorChallenges.expiresAt, now));
  await db.insert(holderAuthenticatorChallenges).values({
    userId,
    challengeHash: hash(challenge),
    purpose,
    expiresAt: new Date(now.getTime() + 5 * 60_000),
  });
}

function readClientChallenge(
  response: RegistrationResponseJSON | AuthenticationResponseJSON,
) {
  let clientData: unknown;
  try {
    clientData = JSON.parse(
      Buffer.from(response.response.clientDataJSON, "base64url").toString("utf8"),
    );
  } catch {
    throw new CredentialLifecycleError("Passkey response is invalid.", 400);
  }
  if (
    typeof clientData !== "object" ||
    clientData === null ||
    !("challenge" in clientData) ||
    typeof clientData.challenge !== "string"
  ) {
    throw new CredentialLifecycleError("Passkey response is invalid.", 400);
  }
  return clientData.challenge;
}

async function consumeChallenge(
  transaction: DbTransaction,
  userId: number,
  purpose: PasskeyPurpose,
  challenge: string,
) {
  const digest = hash(challenge);
  const [row] = await transaction
    .update(holderAuthenticatorChallenges)
    .set({ consumedAt: new Date() })
    .where(
      and(
        eq(holderAuthenticatorChallenges.userId, userId),
        eq(holderAuthenticatorChallenges.purpose, purpose),
        eq(holderAuthenticatorChallenges.challengeHash, digest),
        gt(holderAuthenticatorChallenges.expiresAt, new Date()),
        isNull(holderAuthenticatorChallenges.consumedAt),
      ),
    )
    .returning({ id: holderAuthenticatorChallenges.id });
  if (!row) {
    throw new CredentialLifecycleError(
      "Passkey challenge is expired or has already been used.",
      409,
    );
  }
}

export async function beginPasskeyRegistration(clerkUserId: string) {
  const holder = await getHolder(clerkUserId);
  const { rpID } = getRelyingParty();
  const authenticators = await db
    .select({
      credentialId: holderAuthenticators.credentialId,
      transports: holderAuthenticators.transports,
    })
    .from(holderAuthenticators)
    .where(
      and(
        eq(holderAuthenticators.userId, holder.id),
        isNull(holderAuthenticators.revokedAt),
      ),
    );
  const options = await generateRegistrationOptions({
    rpName: "CertifyVault",
    rpID,
    userID: Buffer.from(String(holder.id)),
    userName: holder.email,
    userDisplayName: `${holder.firstName} ${holder.lastName}`.trim(),
    attestationType: "none",
    authenticatorSelection: {
      residentKey: "preferred",
      userVerification: "required",
    },
    excludeCredentials: authenticators.map((authenticator) => ({
      id: authenticator.credentialId,
      transports: authenticator.transports,
    })),
  });
  await createChallenge(holder.id, "registration", options.challenge);
  return options;
}

export async function completePasskeyRegistration(
  clerkUserId: string,
  response: RegistrationResponseJSON,
  deviceName: string | null,
) {
  const holder = await getHolder(clerkUserId);
  const { rpID, origins } = getRelyingParty();
  const challenge = readClientChallenge(response);
  const verification = await verifyRegistrationResponse({
    response,
    expectedChallenge: challenge,
    expectedOrigin: origins,
    expectedRPID: rpID,
    requireUserVerification: true,
  });
  if (!verification.verified || !verification.registrationInfo) {
    throw new CredentialLifecycleError("Passkey registration could not be verified.", 400);
  }

  const credential = verification.registrationInfo.credential;
  const transports = credential.transports ?? response.response.transports ?? [];
  const authenticator = await db.transaction(async (transaction) => {
    await consumeChallenge(transaction, holder.id, "registration", challenge);
    const [created] = await transaction
      .insert(holderAuthenticators)
      .values({
        userId: holder.id,
        credentialId: credential.id,
        publicKey: Buffer.from(credential.publicKey).toString("base64url"),
        counter: credential.counter,
        transports,
        deviceName: deviceName?.trim() || null,
      })
      .onConflictDoNothing()
      .returning({
        id: holderAuthenticators.id,
        deviceName: holderAuthenticators.deviceName,
      });
    if (!created) {
      throw new CredentialLifecycleError("This passkey is already registered.", 409);
    }
    await transaction.insert(certificateAuditLogs).values({
      actorId: holder.id,
      action: "holder.passkey_registered",
      metadata: { authenticatorId: created.id },
    });
    return created;
  });
  return authenticator;
}

export async function beginPasskeyAuthentication(clerkUserId: string) {
  const holder = await getHolder(clerkUserId);
  const { rpID } = getRelyingParty();
  const authenticators = await db
    .select({
      credentialId: holderAuthenticators.credentialId,
      transports: holderAuthenticators.transports,
    })
    .from(holderAuthenticators)
    .where(
      and(
        eq(holderAuthenticators.userId, holder.id),
        isNull(holderAuthenticators.revokedAt),
      ),
    );
  if (authenticators.length === 0) {
    throw new CredentialLifecycleError("Register a passkey before testing it.", 409);
  }
  const options = await generateAuthenticationOptions({
    rpID,
    allowCredentials: authenticators.map((authenticator) => ({
      id: authenticator.credentialId,
      transports: authenticator.transports,
    })),
    userVerification: "required",
  });
  await createChallenge(holder.id, "authentication", options.challenge);
  return options;
}

export async function completePasskeyAuthentication(
  clerkUserId: string,
  response: AuthenticationResponseJSON,
) {
  const holder = await getHolder(clerkUserId);
  const { rpID, origins } = getRelyingParty();
  const [authenticator] = await db
    .select()
    .from(holderAuthenticators)
    .where(
      and(
        eq(holderAuthenticators.userId, holder.id),
        eq(holderAuthenticators.credentialId, response.id),
        isNull(holderAuthenticators.revokedAt),
      ),
    )
    .limit(1);
  if (!authenticator) {
    throw new CredentialLifecycleError("Passkey is not registered to this account.", 404);
  }

  const challenge = readClientChallenge(response);
  const verification = await verifyAuthenticationResponse({
    response,
    expectedChallenge: challenge,
    expectedOrigin: origins,
    expectedRPID: rpID,
    requireUserVerification: true,
    credential: {
      id: authenticator.credentialId,
      publicKey: Buffer.from(authenticator.publicKey, "base64url"),
      counter: authenticator.counter,
      transports: authenticator.transports,
    },
  });
  if (!verification.verified || !verification.authenticationInfo.userVerified) {
    throw new CredentialLifecycleError("Passkey authentication could not be verified.", 400);
  }

  await db.transaction(async (transaction) => {
    await consumeChallenge(transaction, holder.id, "authentication", challenge);
    const [updated] = await transaction
      .update(holderAuthenticators)
      .set({
        counter: verification.authenticationInfo.newCounter,
        lastUsedAt: new Date(),
      })
      .where(
        and(
          eq(holderAuthenticators.id, authenticator.id),
          eq(holderAuthenticators.counter, authenticator.counter),
          isNull(holderAuthenticators.revokedAt),
        ),
      )
      .returning({ id: holderAuthenticators.id });
    if (!updated) {
      throw new CredentialLifecycleError("Passkey counter changed; retry authentication.", 409);
    }
    await transaction.insert(certificateAuditLogs).values({
      actorId: holder.id,
      action: "holder.passkey_authenticated",
      metadata: { authenticatorId: authenticator.id },
    });
  });
  return { verified: true };
}

export async function listHolderAuthenticators(clerkUserId: string) {
  const holder = await getHolder(clerkUserId);
  return db
    .select({
      id: holderAuthenticators.id,
      deviceName: holderAuthenticators.deviceName,
      createdAt: holderAuthenticators.createdAt,
      lastUsedAt: holderAuthenticators.lastUsedAt,
      revokedAt: holderAuthenticators.revokedAt,
    })
    .from(holderAuthenticators)
    .where(eq(holderAuthenticators.userId, holder.id))
    .orderBy(holderAuthenticators.createdAt);
}

export async function revokeHolderAuthenticator(
  clerkUserId: string,
  authenticatorId: number,
) {
  const holder = await getHolder(clerkUserId);
  const [revoked] = await db
    .update(holderAuthenticators)
    .set({ revokedAt: new Date() })
    .where(
      and(
        eq(holderAuthenticators.id, authenticatorId),
        eq(holderAuthenticators.userId, holder.id),
        isNull(holderAuthenticators.revokedAt),
      ),
    )
    .returning({ id: holderAuthenticators.id });
  if (!revoked) {
    throw new CredentialLifecycleError("Active passkey not found.", 404);
  }
  await db.insert(certificateAuditLogs).values({
    actorId: holder.id,
    action: "holder.passkey_revoked",
    metadata: { authenticatorId },
  });
}
