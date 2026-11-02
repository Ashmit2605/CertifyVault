import {
  createPrivateKey,
  createPublicKey,
  sign,
  verify,
} from "node:crypto";

export interface CertificateQrPayload {
  certificateId: string;
  issuerId: number;
  version: 1;
  issuedAt: number;
  keyId: string;
}

export class QrTokenConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "QrTokenConfigurationError";
  }
}

function getPrivateKey() {
  const encoded = process.env.CERTIFICATE_QR_PRIVATE_KEY_BASE64;
  if (!encoded) {
    throw new QrTokenConfigurationError(
      "Certificate QR signing is not configured.",
    );
  }

  let key;
  try {
    key = createPrivateKey({
      key: Buffer.from(encoded, "base64"),
      format: "der",
      type: "pkcs8",
    });
  } catch {
    throw new QrTokenConfigurationError(
      "Certificate QR signing key is invalid.",
    );
  }
  if (key.asymmetricKeyType !== "ed25519") {
    throw new QrTokenConfigurationError(
      "Certificate QR signing key must be Ed25519.",
    );
  }
  return key;
}

function getPublicKey(keyId: string) {
  const configured = process.env.CERTIFICATE_QR_PUBLIC_KEYS;
  if (!configured) {
    throw new QrTokenConfigurationError(
      "Certificate QR verification is not configured.",
    );
  }

  let keys: Record<string, string>;
  try {
    const parsed: unknown = JSON.parse(configured);
    if (
      typeof parsed !== "object" ||
      parsed === null ||
      Array.isArray(parsed) ||
      !Object.values(parsed).every((value) => typeof value === "string")
    ) {
      throw new Error("Invalid key map.");
    }
    keys = parsed as Record<string, string>;
  } catch {
    throw new QrTokenConfigurationError(
      "Certificate QR public-key configuration is invalid.",
    );
  }

  const encoded = keys[keyId];
  if (!encoded) {
    throw new Error("Certificate QR signing key is not recognized.");
  }

  let key;
  try {
    key = createPublicKey({
      key: Buffer.from(encoded, "base64"),
      format: "der",
      type: "spki",
    });
  } catch {
    throw new QrTokenConfigurationError(
      "Certificate QR verification key is invalid.",
    );
  }
  if (key.asymmetricKeyType !== "ed25519") {
    throw new QrTokenConfigurationError(
      "Certificate QR verification key must be Ed25519.",
    );
  }
  return key;
}

export function createCertificateQrToken(
  certificateId: string,
  issuerId: number,
): string {
  const keyId = process.env.CERTIFICATE_QR_KEY_ID?.trim();
  if (!keyId || keyId.length > 64) {
    throw new QrTokenConfigurationError(
      "Certificate QR key ID is not configured.",
    );
  }

  const payload: CertificateQrPayload = {
    certificateId,
    issuerId,
    version: 1,
    issuedAt: Date.now(),
    keyId,
  };
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url",
  );
  const signature = sign(
    null,
    Buffer.from(encodedPayload),
    getPrivateKey(),
  ).toString("base64url");

  return `${encodedPayload}.${signature}`;
}

export function verifyCertificateQrToken(token: string): CertificateQrPayload {
  if (token.length > 4096) {
    throw new Error("Certificate QR token is invalid.");
  }
  const [encodedPayload, encodedSignature, ...rest] = token.split(".");
  if (!encodedPayload || !encodedSignature || rest.length > 0) {
    throw new Error("Certificate QR token is invalid.");
  }

  let payload: unknown;
  try {
    payload = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    );
  } catch {
    throw new Error("Certificate QR token is invalid.");
  }

  if (
    typeof payload !== "object" ||
    payload === null ||
    !("certificateId" in payload) ||
    typeof payload.certificateId !== "string" ||
    !/^[A-Z0-9-]{8,100}$/.test(payload.certificateId) ||
    !("issuerId" in payload) ||
    typeof payload.issuerId !== "number" ||
    !Number.isSafeInteger(payload.issuerId) ||
    payload.issuerId < 1 ||
    !("version" in payload) ||
    payload.version !== 1 ||
    !("issuedAt" in payload) ||
    typeof payload.issuedAt !== "number" ||
    !Number.isSafeInteger(payload.issuedAt) ||
    !("keyId" in payload) ||
    typeof payload.keyId !== "string" ||
    payload.keyId.length < 1 ||
    payload.keyId.length > 64
  ) {
    throw new Error("Certificate QR token payload is invalid.");
  }

  const validSignature = verify(
    null,
    Buffer.from(encodedPayload),
    getPublicKey(payload.keyId),
    Buffer.from(encodedSignature, "base64url"),
  );
  if (!validSignature) {
    throw new Error("Certificate QR token signature is invalid.");
  }

  return payload as CertificateQrPayload;
}
