import { eq } from "drizzle-orm";
import { db } from "../db/index.js";
import { certificates, users } from "../db/schema.js";
import {
  CertificateServiceError,
  verifyCertificateRecord,
} from "./certificate.service.js";
import {
  CredentialLifecycleError,
  authorizePublicCredential,
} from "./credential-lifecycle.service.js";
import { readCertificatePdf } from "./certificate-storage.service.js";

export async function getPublicCredential(certificateId: string, shareToken?: string) {
  const access = await authorizePublicCredential(certificateId, shareToken);
  const [record] = await db
    .select({
      certificateId: certificates.certificateId,
      title: certificates.title,
      issueDate: certificates.issueDate,
      institutionName: users.institutionName,
      verificationUrl: certificates.verificationUrl,
      studentName: certificates.studentName,
    })
    .from(certificates)
    .leftJoin(users, eq(certificates.issuerId, users.id))
    .where(eq(certificates.certificateId, certificateId))
    .limit(1);

  if (!record) {
    throw new CertificateServiceError("Credential not found.", 404);
  }
  if (
    access.visibility === "private" &&
    !shareToken
  ) {
    throw new CredentialLifecycleError("Credential is private.", 404);
  }
  let token: string | null = null;
  try {
    token = record.verificationUrl
      ? new URL(record.verificationUrl).searchParams.get("token")
      : null;
  } catch {
    throw new CertificateServiceError(
      "Credential verification is unavailable.",
      503,
    );
  }
  if (!token) {
    throw new CertificateServiceError(
      "Credential verification is unavailable.",
      503,
    );
  }
  const verification = await verifyCertificateRecord(certificateId, token);

  const blockchainProofStatus =
    verification.status === "issued"
      ? "confirmed"
      : verification.status === "blockchain_unconfirmed"
        ? "pending"
        : verification.status === "integrity_mismatch"
          ? "mismatch"
          : "not_checked";

  return {
    certificateId: record.certificateId,
    valid: verification.valid,
    status: verification.status,
    signedProofValid: true,
    blockchainProofStatus,
    credential: {
      title: record.title,
      issueDate: record.issueDate,
      institutionName: record.institutionName,
      ...(access.showRecipientName && access.claimId
        ? { recipientName: record.studentName }
        : {}),
    },
    sharing: {
      visibility: access.visibility,
      pdfDownloadPolicy: access.pdfPolicy,
      canDownloadPdf:
        access.pdfPolicy === "public" ||
        (access.pdfPolicy === "link" && access.shareAllowsPdf),
    },
  };
}

export async function getPublicCredentialPdf(
  certificateId: string,
  shareToken?: string,
) {
  const access = await authorizePublicCredential(certificateId, shareToken);
  const allowed =
    access.pdfPolicy === "public" ||
    (access.pdfPolicy === "link" && access.shareAllowsPdf);
  if (!allowed) {
    throw new CredentialLifecycleError("PDF download is not permitted.", 403);
  }
  const [certificate] = await db
    .select()
    .from(certificates)
    .where(eq(certificates.certificateId, certificateId))
    .limit(1);
  if (!certificate || certificate.status !== "issued") {
    throw new CredentialLifecycleError(
      "Credential is not currently valid for public download.",
      404,
    );
  }
  if (!certificate.storageKey) {
    throw new CredentialLifecycleError("Credential file is unavailable.", 404);
  }
  return {
    certificateId: certificate.certificateId,
    pdf: await readCertificatePdf(
      certificate.storageKey,
      certificate.certificateHash,
    ),
  };
}
