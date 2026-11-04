const apiBaseUrl = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

export interface HolderCredential {
  claimId: number;
  certificateId: string;
  certificateNumber: string | null;
  title: string;
  course: string;
  certificateType: string;
  issueDate: string | null;
  status: string;
  institutionName: string | null;
  visibility: "public" | "unlisted" | "private" | null;
  pdfDownloadPolicy: "private" | "link" | "public" | null;
  showRecipientName: boolean | null;
}

export interface CredentialSharingSettings {
  visibility: "public" | "unlisted" | "private";
  pdfDownloadPolicy: "private" | "link" | "public";
  showRecipientName: boolean;
  allowStructuredExport: boolean;
}

export interface HolderCredentialDetail {
  claimId: number;
  certificate: {
    certificateId: string;
    certificateNumber: string | null;
    studentName: string;
    course: string;
    certificateType: string;
    title: string;
    grade: string | null;
    issueDate: string | null;
    expiryDate: string | null;
    status: string;
    certificateHash: string;
    blockchainTxHash: string | null;
    blockchainNetwork: string | null;
    blockchainBlockNumber: string | null;
    registrationStatus: string;
    revocationStatus: string;
    revocationReason: string | null;
    issuedAt: string | null;
  };
  institutionName: string | null;
  sharing: CredentialSharingSettings | null;
  structuredCredentialAvailable: boolean;
}

export interface HolderInvitation {
  claimId: number;
  certificateId: string;
  title: string;
  institutionName: string | null;
  expiresAt: string;
  usedAt: string | null;
  revokedAt: string | null;
  claimStatus: string;
}

export interface HolderShareLink {
  id: number;
  allowPdfDownload: boolean;
  expiresAt: string;
  revokedAt: string | null;
  createdAt: string;
}

export interface HolderClaimRequest {
  claimId: number;
  certificateId: string;
  title: string;
  institutionName: string | null;
  status: string;
  claimMethod: string;
  createdAt: string;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

async function request(
  path: string,
  token: string,
  options: RequestInit = {},
): Promise<Response> {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
  if (!response.ok) {
    const body: unknown = await response.json().catch(() => null);
    const message =
      isRecord(body) && typeof body.message === "string"
        ? body.message
        : "The credential service could not complete this request.";
    throw new Error(message);
  }
  return response;
}

async function data(path: string, token: string, options?: RequestInit) {
  const body: unknown = await (await request(path, token, options)).json();
  if (!isRecord(body) || !isRecord(body.data)) {
    throw new Error("The credential service returned an invalid response.");
  }
  return body.data;
}

function parseCredential(value: unknown): HolderCredential {
  if (
    !isRecord(value) ||
    typeof value.claimId !== "number" ||
    typeof value.certificateId !== "string" ||
    typeof value.title !== "string" ||
    typeof value.course !== "string" ||
    typeof value.status !== "string"
  ) {
    throw new Error("The wallet returned an invalid credential.");
  }
  return value as unknown as HolderCredential;
}

export async function getHolderCredentials(token: string) {
  const result = await data("/me/credentials", token);
  if (!Array.isArray(result.credentials)) {
    throw new Error("The wallet returned an invalid credential list.");
  }
  return result.credentials.map(parseCredential);
}

export async function getHolderCredential(token: string, certificateId: string) {
  const result = await data(
    `/me/credentials/${encodeURIComponent(certificateId)}`,
    token,
  );
  if (!isRecord(result.credential)) {
    throw new Error("The wallet returned an invalid credential detail.");
  }
  return result.credential as unknown as HolderCredentialDetail;
}

export async function getHolderInvitations(token: string) {
  const result = await data("/me/credential-invitations", token);
  if (!Array.isArray(result.invitations)) {
    throw new Error("The wallet returned an invalid invitation list.");
  }
  return result.invitations as HolderInvitation[];
}

export async function getHolderClaimRequests(token: string) {
  const result = await data("/me/claim-requests", token);
  if (!Array.isArray(result.claims)) {
    throw new Error("The wallet returned an invalid claim-request list.");
  }
  return result.claims as HolderClaimRequest[];
}

export async function updateCredentialSharing(
  token: string,
  certificateId: string,
  settings: CredentialSharingSettings,
) {
  return data(
    `/me/credentials/${encodeURIComponent(certificateId)}/sharing`,
    token,
    { method: "PATCH", body: JSON.stringify(settings) },
  );
}

export async function createCredentialShareLink(
  token: string,
  certificateId: string,
  expiresInDays: number,
  allowPdfDownload: boolean,
) {
  const result = await data(
    `/me/credentials/${encodeURIComponent(certificateId)}/share-links`,
    token,
    {
      method: "POST",
      body: JSON.stringify({ expiresInDays, allowPdfDownload }),
    },
  );
  if (!isRecord(result.link) || typeof result.link.url !== "string") {
    throw new Error("The share service returned an invalid link.");
  }
  return result.link as { id: number; url: string; expiresAt: string; allowPdfDownload: boolean };
}

export async function getCredentialShareLinks(
  token: string,
  certificateId: string,
) {
  const result = await data(
    `/me/credentials/${encodeURIComponent(certificateId)}/share-links`,
    token,
  );
  if (!Array.isArray(result.links)) {
    throw new Error("The share service returned an invalid link list.");
  }
  return result.links as HolderShareLink[];
}

export async function revokeCredentialShareLink(
  token: string,
  certificateId: string,
  linkId: number,
) {
  await request(
    `/me/credentials/${encodeURIComponent(certificateId)}/share-links/${linkId}`,
    token,
    { method: "DELETE" },
  );
}

export async function downloadHolderCredentialPdf(
  token: string,
  certificateId: string,
) {
  return (await request(
    `/me/credentials/${encodeURIComponent(certificateId)}/pdf`,
    token,
  )).blob();
}

export async function exportHolderCredential(
  token: string,
  certificateId: string,
) {
  return (await request(
    `/me/credentials/${encodeURIComponent(certificateId)}/export`,
    token,
  )).json();
}

export async function verifyClaimInvitation(
  token: string,
  claimId: number,
  invitationToken: string,
) {
  const result = await data("/credential-claims/verify-token", token, {
    method: "POST",
    body: JSON.stringify({ claimId, token: invitationToken }),
  });
  return result as {
    claimId: number;
    certificateId: string;
    title: string;
    institutionName: string | null;
  };
}

export async function completeCredentialClaim(
  token: string,
  claimId: number,
  invitationToken: string,
) {
  return data("/credential-claims/complete", token, {
    method: "POST",
    body: JSON.stringify({ claimId, token: invitationToken }),
  });
}

export async function requestCredentialDiscovery(
  token: string,
  institutionName: string,
  institutionReference: string,
) {
  return data("/credentials/discover", token, {
    method: "POST",
    body: JSON.stringify({ institutionName, institutionReference }),
  });
}
