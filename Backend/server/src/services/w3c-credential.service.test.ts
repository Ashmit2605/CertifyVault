import assert from "node:assert/strict";
import { test } from "node:test";
import * as Ed25519Multikey from "@digitalbazaar/ed25519-multikey";
import {
  createSignedAcademicCredential,
  verifySignedW3cCredential,
} from "./w3c-credential.service.js";

test("W3C academic credentials use a verifiable EdDSA RDFc Data Integrity proof", async () => {
  const originalConfig = process.env.VC_ISSUER_KEYS_JSON;
  const keyPair = await Ed25519Multikey.generate();
  const exported = await keyPair.export({ publicKey: true, secretKey: true });
  assert.ok(exported.publicKeyMultibase);
  assert.ok(exported.secretKeyMultibase);
  process.env.VC_ISSUER_KEYS_JSON = JSON.stringify({
    "42": {
      publicKeyMultibase: exported.publicKeyMultibase,
      secretKeyMultibase: exported.secretKeyMultibase,
    },
  });

  try {
    const result = await createSignedAcademicCredential({
      issuerId: 42,
      issuerName: "Example Institute",
      certificateId: "CV-2026-TEST00001",
      certificateNumber: "DEG-2026-1",
      certificateType: "degree",
      title: "Bachelor of Science",
      studentName: "Example Student",
      course: "Computer Science",
      grade: "A",
      issueDate: "2026-06-01",
      expiryDate: null,
      certificateHash: "a".repeat(64),
    });

    assert.equal(result.credential.type instanceof Array, true);
    assert.equal(result.proofKeyId, `did:key:${exported.publicKeyMultibase}#${exported.publicKeyMultibase}`);
    assert.equal(
      await verifySignedW3cCredential(result.credential, result.credentialDigest),
      true,
    );

    const modified = structuredClone(result.credential);
    const subject = modified.credentialSubject;
    assert.equal(typeof subject, "object");
    assert.notEqual(subject, null);
    (subject as Record<string, unknown>).title = "Modified title";
    assert.equal(await verifySignedW3cCredential(modified), false);
  } finally {
    if (originalConfig === undefined) {
      delete process.env.VC_ISSUER_KEYS_JSON;
    } else {
      process.env.VC_ISSUER_KEYS_JSON = originalConfig;
    }
  }
});
