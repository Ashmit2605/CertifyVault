import assert from "node:assert/strict";
import { generateKeyPairSync } from "node:crypto";
import test from "node:test";
import {
  createCertificateQrToken,
  verifyCertificateQrToken,
} from "./qr-token.service.js";

test("certificate QR tokens bind the certificate and issuer to an Ed25519 signature", () => {
  const { privateKey, publicKey } = generateKeyPairSync("ed25519");
  const privateKeyBase64 = privateKey
    .export({ type: "pkcs8", format: "der" })
    .toString("base64");
  const publicKeyBase64 = publicKey
    .export({ type: "spki", format: "der" })
    .toString("base64");
  process.env.CERTIFICATE_QR_KEY_ID = "test-v1";
  process.env.CERTIFICATE_QR_PRIVATE_KEY_BASE64 = privateKeyBase64;
  process.env.CERTIFICATE_QR_PUBLIC_KEYS = JSON.stringify({
    "test-v1": publicKeyBase64,
  });

  const token = createCertificateQrToken("CV-2026-0123456789ABCDEF", 42);
  const payload = verifyCertificateQrToken(token);
  assert.equal(payload.certificateId, "CV-2026-0123456789ABCDEF");
  assert.equal(payload.issuerId, 42);
  assert.equal(payload.version, 1);

  const [encodedPayload, signature] = token.split(".");
  const changedPayload = Buffer.from(
    JSON.stringify({ ...payload, issuerId: 43 }),
  ).toString("base64url");
  assert.throws(() =>
    verifyCertificateQrToken(`${changedPayload}.${signature}`),
  );
  assert.throws(() =>
    verifyCertificateQrToken(`${encodedPayload}.${"A".repeat(80)}`),
  );
});
