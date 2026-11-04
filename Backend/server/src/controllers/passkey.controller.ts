import type { NextFunction, Request, Response } from "express";
import { z } from "zod";
import type {
  AuthenticationResponseJSON,
  RegistrationResponseJSON,
} from "@simplewebauthn/server";
import { CredentialLifecycleError } from "../services/credential-lifecycle.service.js";
import {
  beginPasskeyAuthentication,
  beginPasskeyRegistration,
  completePasskeyAuthentication,
  completePasskeyRegistration,
  listHolderAuthenticators,
  revokeHolderAuthenticator,
} from "../services/passkey.service.js";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function isRegistrationResponse(value: unknown): value is RegistrationResponseJSON {
  if (!isRecord(value) || !isRecord(value.response)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.rawId === "string" &&
    value.type === "public-key" &&
    isRecord(value.clientExtensionResults) &&
    typeof value.response.clientDataJSON === "string" &&
    typeof value.response.attestationObject === "string"
  );
}

function isAuthenticationResponse(value: unknown): value is AuthenticationResponseJSON {
  if (!isRecord(value) || !isRecord(value.response)) return false;
  return (
    typeof value.id === "string" &&
    typeof value.rawId === "string" &&
    value.type === "public-key" &&
    isRecord(value.clientExtensionResults) &&
    typeof value.response.clientDataJSON === "string" &&
    typeof value.response.authenticatorData === "string" &&
    typeof value.response.signature === "string" &&
    (value.response.userHandle === undefined || value.response.userHandle === null || typeof value.response.userHandle === "string")
  );
}

function clerkUserId(res: Response) {
  const userId = res.locals.clerkUserId;
  if (!userId) throw new CredentialLifecycleError("Authentication required.", 401);
  return userId;
}

function handleError(error: unknown, res: Response, next: NextFunction) {
  if (error instanceof CredentialLifecycleError) {
    res.status(error.statusCode).json({ success: false, message: error.message });
  } else {
    next(error);
  }
}

export async function listPasskeys(_req: Request, res: Response, next: NextFunction) {
  try {
    const authenticators = await listHolderAuthenticators(clerkUserId(res));
    res.json({ success: true, data: { authenticators } });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function startPasskeyRegistration(_req: Request, res: Response, next: NextFunction) {
  try {
    const options = await beginPasskeyRegistration(clerkUserId(res));
    res.set("Cache-Control", "no-store").json({ success: true, data: { options } });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function finishPasskeyRegistration(req: Request, res: Response, next: NextFunction) {
  const bodySchema = z.object({
    response: z.unknown(),
    deviceName: z.string().trim().min(1).max(100).nullable().optional(),
  }).strict().safeParse(req.body);
  if (!bodySchema.success || !isRegistrationResponse(bodySchema.data.response)) {
    res.status(400).json({ success: false, message: "Passkey registration response is invalid." });
    return;
  }
  try {
    const authenticator = await completePasskeyRegistration(
      clerkUserId(res),
      bodySchema.data.response,
      bodySchema.data.deviceName ?? null,
    );
    res.status(201).json({ success: true, data: { authenticator } });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function startPasskeyAuthentication(_req: Request, res: Response, next: NextFunction) {
  try {
    const options = await beginPasskeyAuthentication(clerkUserId(res));
    res.set("Cache-Control", "no-store").json({ success: true, data: { options } });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function finishPasskeyAuthentication(req: Request, res: Response, next: NextFunction) {
  const parsed = z.object({ response: z.unknown() }).strict().safeParse(req.body);
  if (!parsed.success || !isAuthenticationResponse(parsed.data.response)) {
    res.status(400).json({ success: false, message: "Passkey authentication response is invalid." });
    return;
  }
  try {
    const result = await completePasskeyAuthentication(
      clerkUserId(res),
      parsed.data.response,
    );
    res.json({ success: true, data: result });
  } catch (error) {
    handleError(error, res, next);
  }
}

export async function deletePasskey(req: Request, res: Response, next: NextFunction) {
  const id = Number(req.params.authenticatorId);
  if (!Number.isSafeInteger(id) || id < 1) {
    res.status(400).json({ success: false, message: "Passkey ID is invalid." });
    return;
  }
  try {
    await revokeHolderAuthenticator(clerkUserId(res), id);
    res.json({ success: true });
  } catch (error) {
    handleError(error, res, next);
  }
}
