import { createHash } from "node:crypto";
import * as Ed25519Multikey from "@digitalbazaar/ed25519-multikey";
import multikeyContext from "@digitalbazaar/multikey-context";
import { contexts as credentialContexts } from "@digitalbazaar/credentials-context";
import { DataIntegrityProof } from "@digitalbazaar/data-integrity";
import { cryptosuite as eddsaRdfc2022 } from "@digitalbazaar/eddsa-rdfc-2022-cryptosuite";
import { driver as createDidKeyDriver } from "@digitalbazaar/did-method-key";
import { verifyCredential } from "@digitalbazaar/vc";
import jsigs from "jsonld-signatures";
import securityContext from "@digitalbazaar/security-context";

interface IssuerKeyConfiguration {
  publicKeyMultibase: string;
  secretKeyMultibase: string;
}

interface SignedCredentialResult {
  credential: Record<string, unknown>;
  credentialDigest: string;
  proofKeyId: string;
}

interface AcademicCredentialInput {
  issuerId: number;
  issuerName: string;
  certificateId: string;
  certificateNumber: string | null;
  certificateType: string;
  title: string;
  studentName: string;
  course: string;
  grade: string | null;
  issueDate: string;
  expiryDate: string | null;
  certificateHash: string;
}

const didContextUrl = "https://www.w3.org/ns/did/v1";
const didContext = {
  "@context": {
    "@protected": true,
    id: "@id",
    type: "@type",
    assertionMethod: {
      "@id": "https://www.w3.org/ns/did#assertionMethod",
      "@type": "@id",
      "@container": "@set",
    },
    authentication: {
      "@id": "https://www.w3.org/ns/did#authentication",
      "@type": "@id",
      "@container": "@set",
    },
    controller: {
      "@id": "https://www.w3.org/ns/did#controller",
      "@type": "@id",
    },
    verificationMethod: {
      "@id": "https://www.w3.org/ns/did#verificationMethod",
      "@type": "@id",
      "@container": "@set",
    },
  },
};

const contextDocuments = new Map<string, unknown>([
  ...credentialContexts.entries(),
  ...securityContext.contexts.entries(),
  ...multikeyContext.contexts.entries(),
  [didContextUrl, didContext],
]);

const didKeyDriver = createDidKeyDriver();
didKeyDriver.use({
  multibaseMultikeyHeader: "z6Mk",
  fromMultibase: Ed25519Multikey.from,
});

export class W3cCredentialConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "W3cCredentialConfigurationError";
  }
}

function getIssuerKeyConfiguration(issuerId: number): IssuerKeyConfiguration {
  const configured = process.env.VC_ISSUER_KEYS_JSON?.trim();
  if (!configured) {
    throw new W3cCredentialConfigurationError(
      "W3C credential signing is not configured for this issuer.",
    );
  }
  let parsed: unknown;
  try {
    parsed = JSON.parse(configured);
  } catch {
    throw new W3cCredentialConfigurationError(
      "W3C credential signing-key configuration is invalid JSON.",
    );
  }
  if (
    typeof parsed !== "object" ||
    parsed === null ||
    Array.isArray(parsed) ||
    !(String(issuerId) in parsed)
  ) {
    throw new W3cCredentialConfigurationError(
      "W3C credential signing is not configured for this issuer.",
    );
  }
  const key = (parsed as Record<string, unknown>)[String(issuerId)];
  if (
    typeof key !== "object" ||
    key === null ||
    !("publicKeyMultibase" in key) ||
    typeof key.publicKeyMultibase !== "string" ||
    !key.publicKeyMultibase.startsWith("z6Mk") ||
    !("secretKeyMultibase" in key) ||
    typeof key.secretKeyMultibase !== "string" ||
    !key.secretKeyMultibase.startsWith("z")
  ) {
    throw new W3cCredentialConfigurationError(
      "W3C credential signing-key configuration is invalid.",
    );
  }
  return {
    publicKeyMultibase: key.publicKeyMultibase,
    secretKeyMultibase: key.secretKeyMultibase,
  };
}

async function documentLoader(url: string) {
  const context = contextDocuments.get(url);
  if (context) {
    return { contextUrl: null, documentUrl: url, document: context };
  }
  if (url.startsWith("did:key:")) {
    return {
      contextUrl: null,
      documentUrl: url,
      document: await didKeyDriver.get({ did: url }),
    };
  }
  throw new Error(`Unrecognized JSON-LD document URL: ${url}`);
}

function credentialDigest(credential: Record<string, unknown>) {
  const canonicalize = (value: unknown): string => {
    if (Array.isArray(value)) {
      return `[${value.map(canonicalize).join(",")}]`;
    }
    if (typeof value === "object" && value !== null) {
      return `{${Object.keys(value)
        .sort()
        .map((key) => `${JSON.stringify(key)}:${canonicalize((value as Record<string, unknown>)[key])}`)
        .join(",")}}`;
    }
    const encoded = JSON.stringify(value);
    if (encoded === undefined) throw new Error("Credential cannot be canonically serialized.");
    return encoded;
  };
  return createHash("sha256")
    .update(canonicalize(credential))
    .digest("hex");
}

export async function createSignedAcademicCredential(
  input: AcademicCredentialInput,
): Promise<SignedCredentialResult> {
  const configuredKey = getIssuerKeyConfiguration(input.issuerId);
  const issuerDid = `did:key:${configuredKey.publicKeyMultibase}`;
  const proofKeyId = `${issuerDid}#${configuredKey.publicKeyMultibase}`;
  const keyPair = await Ed25519Multikey.from({
    "@context": multikeyContext.CONTEXT_URL,
    type: "Multikey",
    id: proofKeyId,
    controller: issuerDid,
    publicKeyMultibase: configuredKey.publicKeyMultibase,
    secretKeyMultibase: configuredKey.secretKeyMultibase,
  });
  const publicKey = await keyPair.export({ publicKey: true });
  if (publicKey.publicKeyMultibase !== configuredKey.publicKeyMultibase) {
    throw new W3cCredentialConfigurationError(
      "W3C credential public and private keys do not match.",
    );
  }

  const issuedDate = new Date(`${input.issueDate}T00:00:00.000Z`);
  const credential: Record<string, unknown> = {
    "@context": [
      "https://www.w3.org/ns/credentials/v2",
      {
        cv: "urn:certifyvault:credentials#",
        AcademicCredential: "cv:AcademicCredential",
        certificateId: "cv:certificateId",
        certificateNumber: "cv:certificateNumber",
        certificateType: "cv:certificateType",
        course: "cv:course",
        grade: "cv:grade",
        title: "cv:title",
        certificateHash: "cv:certificateHash",
        name: "https://schema.org/name",
      },
    ],
    id: `urn:uuid:${crypto.randomUUID()}`,
    type: ["VerifiableCredential", "AcademicCredential"],
    issuer: { id: issuerDid, name: input.issuerName },
    validFrom: issuedDate.toISOString(),
    credentialSubject: {
      certificateId: input.certificateId,
      ...(input.certificateNumber ? { certificateNumber: input.certificateNumber } : {}),
      certificateType: input.certificateType,
      title: input.title,
      name: input.studentName,
      course: input.course,
      ...(input.grade ? { grade: input.grade } : {}),
      certificateHash: input.certificateHash,
    },
  };
  if (input.expiryDate) {
    credential.validUntil = new Date(`${input.expiryDate}T23:59:59.000Z`).toISOString();
  }

  const suite = new DataIntegrityProof({
    signer: keyPair.signer(),
    cryptosuite: eddsaRdfc2022,
  });
  const signed = await jsigs.sign(credential, {
    suite,
    purpose: new jsigs.purposes.AssertionProofPurpose(),
    documentLoader,
  });
  const signedCredential = signed as Record<string, unknown>;
  const proof = signedCredential.proof;
  if (
    typeof proof !== "object" ||
    proof === null ||
    !("verificationMethod" in proof) ||
    typeof proof.verificationMethod !== "string"
  ) {
    throw new Error("W3C credential signing returned an invalid proof.");
  }
  return {
    credential: signedCredential,
    credentialDigest: credentialDigest(signedCredential),
    proofKeyId: proof.verificationMethod,
  };
}

export async function verifySignedW3cCredential(
  credential: Record<string, unknown>,
  expectedDigest?: string,
) {
  if (expectedDigest && credentialDigest(credential) !== expectedDigest) {
    return false;
  }
  const suite = new DataIntegrityProof({ cryptosuite: eddsaRdfc2022 });
  const result = await verifyCredential({
    credential,
    suite,
    documentLoader,
  });
  return result.verified === true;
}
