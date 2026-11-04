import type {
  AuthenticationResponseJSON,
  PublicKeyCredentialCreationOptionsJSON,
  PublicKeyCredentialRequestOptionsJSON,
  RegistrationResponseJSON,
} from "@simplewebauthn/browser";

const apiBaseUrl = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

export interface PasskeyRecord {
  id: number;
  deviceName: string | null;
  createdAt: string;
  lastUsedAt: string | null;
  revokedAt: string | null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function request(
  token: string,
  path: string,
  options: RequestInit = {},
) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      isRecord(body) && typeof body.message === "string"
        ? body.message
        : "The passkey service could not complete this request.";
    throw new Error(message);
  }
  if (!isRecord(body) || !isRecord(body.data)) {
    throw new Error("The passkey service returned an invalid response.");
  }
  return body.data;
}

function isRegistrationOptions(
  value: unknown,
): value is PublicKeyCredentialCreationOptionsJSON {
  return (
    isRecord(value) &&
    typeof value.challenge === "string" &&
    isRecord(value.rp) &&
    typeof value.rp.name === "string" &&
    typeof value.rp.id === "string" &&
    isRecord(value.user) &&
    typeof value.user.id === "string" &&
    typeof value.user.name === "string" &&
    typeof value.user.displayName === "string" &&
    Array.isArray(value.pubKeyCredParams) &&
    value.pubKeyCredParams.every(
      (parameter) =>
        isRecord(parameter) &&
        parameter.type === "public-key" &&
        typeof parameter.alg === "number",
    )
  );
}

function parseRegistrationOptions(
  value: unknown,
): PublicKeyCredentialCreationOptionsJSON {
  if (!isRegistrationOptions(value)) {
    throw new Error("The passkey service returned invalid registration options.");
  }
  return value;
}

function isAuthenticationOptions(
  value: unknown,
): value is PublicKeyCredentialRequestOptionsJSON {
  return (
    isRecord(value) &&
    typeof value.challenge === "string" &&
    (value.rpId === undefined || typeof value.rpId === "string") &&
    (value.allowCredentials === undefined ||
      (Array.isArray(value.allowCredentials) &&
        value.allowCredentials.every(
          (credential) =>
            isRecord(credential) &&
            typeof credential.id === "string" &&
            credential.type === "public-key" &&
            (credential.transports === undefined ||
              (Array.isArray(credential.transports) &&
                credential.transports.every(
                  (transport) => typeof transport === "string",
                ))),
        )))
  );
}

function parseAuthenticationOptions(
  value: unknown,
): PublicKeyCredentialRequestOptionsJSON {
  if (!isAuthenticationOptions(value)) {
    throw new Error("The passkey service returned invalid authentication options.");
  }
  return value;
}

export async function listPasskeys(token: string): Promise<PasskeyRecord[]> {
  const data = await request(token, "/me/passkeys");
  if (!Array.isArray(data.authenticators)) {
    throw new Error("The passkey service returned an invalid authenticator list.");
  }
  return data.authenticators.map((item: unknown) => {
    if (
      !isRecord(item) ||
      typeof item.id !== "number" ||
      !(typeof item.deviceName === "string" || item.deviceName === null) ||
      typeof item.createdAt !== "string" ||
      !(typeof item.lastUsedAt === "string" || item.lastUsedAt === null) ||
      !(typeof item.revokedAt === "string" || item.revokedAt === null)
    ) {
      throw new Error("The passkey service returned an invalid authenticator.");
    }
    return {
      id: item.id,
      deviceName: item.deviceName,
      createdAt: item.createdAt,
      lastUsedAt: item.lastUsedAt,
      revokedAt: item.revokedAt,
    };
  });
}

export async function createPasskeyRegistrationOptions(token: string) {
  const data = await request(token, "/me/passkeys/registration/options", {
    method: "POST",
  });
  return parseRegistrationOptions(data.options);
}

export async function verifyPasskeyRegistration(
  token: string,
  response: RegistrationResponseJSON,
  deviceName: string,
) {
  return request(token, "/me/passkeys/registration/verify", {
    method: "POST",
    body: JSON.stringify({ response, deviceName }),
  });
}

export async function createPasskeyAuthenticationOptions(token: string) {
  const data = await request(token, "/me/passkeys/authentication/options", {
    method: "POST",
  });
  return parseAuthenticationOptions(data.options);
}

export async function verifyPasskeyAuthentication(
  token: string,
  response: AuthenticationResponseJSON,
) {
  return request(token, "/me/passkeys/authentication/verify", {
    method: "POST",
    body: JSON.stringify({ response }),
  });
}

export async function revokePasskey(token: string, id: number) {
  await request(token, `/me/passkeys/${id}`, { method: "DELETE" });
}
