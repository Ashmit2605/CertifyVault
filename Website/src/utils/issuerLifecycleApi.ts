const apiBaseUrl = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

export interface IssuerRecipient {
  id: number;
  recipientName: string;
  institutionReference: string | null;
  email: string | null;
  emailVerifiedAt: string | null;
  createdAt: string;
}

export interface IssuerClaimRequest {
  id: number;
  certificateId: string;
  studentName: string;
  title: string;
  status: string;
  claimMethod: string;
  evidenceCategory: string | null;
  decisionReason: string | null;
  createdAt: string;
}

async function request(path: string, token: string, options: RequestInit = {}) {
  const response = await fetch(`${apiBaseUrl}${path}`, {
    ...options,
    headers: {
      Authorization: `Bearer ${token}`,
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...options.headers,
    },
  });
  const result: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      typeof result === "object" && result !== null && "message" in result && typeof result.message === "string"
        ? result.message
        : "The issuer service could not complete this request.";
    throw new Error(message);
  }
  if (
    typeof result !== "object" ||
    result === null ||
    !("data" in result) ||
    typeof result.data !== "object" ||
    result.data === null
  ) {
    throw new Error("The issuer service returned an invalid response.");
  }
  return result.data;
}

export async function listIssuerRecipients(token: string): Promise<IssuerRecipient[]> {
  const result = await request("/issuer/recipients", token);
  if (!("recipients" in result) || !Array.isArray(result.recipients)) {
    throw new Error("The issuer service returned an invalid recipient list.");
  }
  return result.recipients.map((item: unknown) => {
    if (
      typeof item !== "object" ||
      item === null ||
      !("id" in item) ||
      typeof item.id !== "number" ||
      !("recipientName" in item) ||
      typeof item.recipientName !== "string" ||
      !("institutionReference" in item) ||
      !(typeof item.institutionReference === "string" || item.institutionReference === null) ||
      !("email" in item) ||
      !(typeof item.email === "string" || item.email === null) ||
      !("emailVerifiedAt" in item) ||
      !(typeof item.emailVerifiedAt === "string" || item.emailVerifiedAt === null) ||
      !("createdAt" in item) ||
      typeof item.createdAt !== "string"
    ) {
      throw new Error("The issuer service returned an invalid recipient record.");
    }
    return {
      id: item.id,
      recipientName: item.recipientName,
      institutionReference: item.institutionReference,
      email: item.email,
      emailVerifiedAt: item.emailVerifiedAt,
      createdAt: item.createdAt,
    };
  });
}

export async function createIssuerRecipientRecord(
  token: string,
  input: { recipientName: string; email: string | null; institutionReference: string | null },
) {
  await request("/issuer/recipients", token, {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function verifyIssuerRecipientRecord(
  token: string,
  recipientId: number,
  evidence: string,
) {
  await request(`/issuer/recipients/${recipientId}/verify-contact`, token, {
    method: "POST",
    body: JSON.stringify({ confirmation: true, evidence }),
  });
}

export async function listIssuerClaims(token: string): Promise<IssuerClaimRequest[]> {
  const result = await request("/issuer/claim-requests", token);
  if (!("claims" in result) || !Array.isArray(result.claims)) {
    throw new Error("The issuer service returned an invalid claim list.");
  }
  return result.claims.map((claim: unknown) => {
    if (
      typeof claim !== "object" ||
      claim === null ||
      !("id" in claim) ||
      typeof claim.id !== "number" ||
      !("certificateId" in claim) ||
      typeof claim.certificateId !== "string" ||
      !("studentName" in claim) ||
      typeof claim.studentName !== "string" ||
      !("title" in claim) ||
      typeof claim.title !== "string" ||
      !("status" in claim) ||
      typeof claim.status !== "string" ||
      !("claimMethod" in claim) ||
      typeof claim.claimMethod !== "string" ||
      !("evidenceCategory" in claim) ||
      !(typeof claim.evidenceCategory === "string" || claim.evidenceCategory === null) ||
      !("decisionReason" in claim) ||
      !(typeof claim.decisionReason === "string" || claim.decisionReason === null) ||
      !("createdAt" in claim) ||
      typeof claim.createdAt !== "string"
    ) {
      throw new Error("The issuer service returned an invalid claim request.");
    }
    return {
      id: claim.id,
      certificateId: claim.certificateId,
      studentName: claim.studentName,
      title: claim.title,
      status: claim.status,
      claimMethod: claim.claimMethod,
      evidenceCategory: claim.evidenceCategory,
      decisionReason: claim.decisionReason,
      createdAt: claim.createdAt,
    };
  });
}

export async function decideIssuerClaim(
  token: string,
  claimId: number,
  decision: "approve" | "reject",
  reason: string,
) {
  await request(`/issuer/claim-requests/${claimId}/decision`, token, {
    method: "POST",
    body: JSON.stringify({ decision, reason }),
  });
}
