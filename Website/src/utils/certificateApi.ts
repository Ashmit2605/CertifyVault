export type CertificateStatus =
  | "pending_registration"
  | "issued"
  | "registration_failed"
  | "revocation_pending"
  | "revoked"
  | "expired";

export interface CertificateRecord {
  id: number;
  certificateId: string;
  certificateNumber: string | null;
  studentName: string;
  course: string;
  certificateType: string;
  title: string;
  grade: string | null;
  issueDate: string | null;
  expiryDate: string | null;
  status: CertificateStatus;
  certificateHash: string;
  blockchainTxHash: string | null;
  blockchainNetwork: string | null;
  contractAddress: string | null;
  blockchainBlockNumber: string | null;
  registrationStatus: "not_submitted" | "submitted" | "confirmed" | "failed";
  revocationStatus: "not_submitted" | "submitted" | "confirmed" | "failed";
  revocationReason: string | null;
  verificationUrl: string | null;
  issuedAt: string | null;
}

export interface CertificateIssueInput {
  studentName: string;
  certificateNumber: string | null;
  certificateType: string;
  title: string;
  course: string;
  grade: string | null;
  issueDate: string;
  expiryDate: string | null;
}

export interface CertificateListResult {
  certificates: CertificateRecord[];
  pagination: { page: number; pageSize: number; total: number };
}

export interface IssuerCertificateStats {
  total: number;
  issued: number;
  pendingRegistration: number;
  failedRegistration: number;
  revoked: number;
  issuedThisMonth: number;
}

export interface CertificateAuditRecord {
  id: number;
  certificateId: string;
  action: string;
  metadata: Record<string, string | number | null> | null;
  createdAt: string;
}

export interface CertificateVerificationResult {
  valid: boolean;
  status: string;
  certificate?: {
    certificateId: string;
    certificateNumber: string | null;
    studentName: string;
    title: string;
    course: string;
    grade: string | null;
    issueDate: string | null;
    institutionName: string | null;
    certificateHash: string;
    blockchainNetwork: string | null;
    blockchainTxHash: string | null;
  };
}

const apiBaseUrl = (
  import.meta.env.VITE_API_URL || "http://localhost:5000/api"
).replace(/\/+$/, "");

async function parseResponse(response: Response): Promise<unknown> {
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const message =
      typeof body === "object" &&
      body !== null &&
      "message" in body &&
      typeof body.message === "string"
        ? body.message
        : "The certificate service could not complete this request.";
    throw new Error(message);
  }
  return body;
}

async function certificateRequest(
  path: string,
  token: string,
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
  return parseResponse(response);
}

function getData(response: unknown): Record<string, unknown> {
  if (
    typeof response !== "object" ||
    response === null ||
    !("data" in response) ||
    typeof response.data !== "object" ||
    response.data === null
  ) {
    throw new Error("The certificate service returned an invalid response.");
  }
  return response.data as Record<string, unknown>;
}

function parseCertificate(value: unknown): CertificateRecord {
  if (
    typeof value !== "object" ||
    value === null ||
    !("id" in value) ||
    typeof value.id !== "number" ||
    !("certificateId" in value) ||
    typeof value.certificateId !== "string" ||
    !("studentName" in value) ||
    typeof value.studentName !== "string" ||
    !("course" in value) ||
    typeof value.course !== "string" ||
    !("certificateType" in value) ||
    typeof value.certificateType !== "string" ||
    !("title" in value) ||
    typeof value.title !== "string" ||
    !("status" in value) ||
    ![
      "pending_registration",
      "issued",
      "registration_failed",
      "revocation_pending",
      "revoked",
      "expired",
    ].includes(String(value.status)) ||
    !("certificateHash" in value) ||
    typeof value.certificateHash !== "string" ||
    !("registrationStatus" in value) ||
    !["not_submitted", "submitted", "confirmed", "failed"].includes(
      String(value.registrationStatus),
    )
  ) {
    throw new Error("The certificate service returned an invalid certificate.");
  }

  const record = value as Record<string, unknown>;
  const nullableString = (key: string) => {
    const item = key in record ? record[key] : null;
    if (item !== null && typeof item !== "string") {
      throw new Error("The certificate service returned invalid certificate data.");
    }
    return item;
  };

  const revocationStatus = nullableString("revocationStatus");
  if (
    revocationStatus !== "not_submitted" &&
    revocationStatus !== "submitted" &&
    revocationStatus !== "confirmed" &&
    revocationStatus !== "failed"
  ) {
    throw new Error("The certificate service returned an invalid revocation status.");
  }

  return {
    id: value.id,
    certificateId: value.certificateId,
    certificateNumber: nullableString("certificateNumber"),
    studentName: value.studentName,
    course: value.course,
    certificateType: value.certificateType,
    title: value.title,
    grade: nullableString("grade"),
    issueDate: nullableString("issueDate"),
    expiryDate: nullableString("expiryDate"),
    status: value.status as CertificateStatus,
    certificateHash: value.certificateHash,
    blockchainTxHash: nullableString("blockchainTxHash"),
    blockchainNetwork: nullableString("blockchainNetwork"),
    contractAddress: nullableString("contractAddress"),
    blockchainBlockNumber: nullableString("blockchainBlockNumber"),
    registrationStatus: value.registrationStatus as CertificateRecord["registrationStatus"],
    revocationStatus,
    revocationReason: nullableString("revocationReason"),
    verificationUrl: nullableString("verificationUrl"),
    issuedAt: nullableString("issuedAt"),
  };
}

export async function issueCertificate(
  token: string,
  input: CertificateIssueInput,
): Promise<CertificateRecord> {
  const response = await certificateRequest("/certificates/issue", token, {
    method: "POST",
    body: JSON.stringify(input),
  });
  return parseCertificate(getData(response).certificate);
}

export async function listCertificates(
  token: string,
  options: { search: string; status: string; page: number; pageSize: number },
): Promise<CertificateListResult> {
  const query = new URLSearchParams({
    page: String(options.page),
    pageSize: String(options.pageSize),
  });
  if (options.search) query.set("search", options.search);
  if (options.status !== "all") query.set("status", options.status);
  const data = getData(
    await certificateRequest(`/certificates?${query}`, token),
  );
  if (
    !Array.isArray(data.certificates) ||
    typeof data.pagination !== "object" ||
    data.pagination === null
  ) {
    throw new Error("The certificate service returned an invalid certificate list.");
  }
  const pagination = data.pagination;
  if (
    !("page" in pagination) ||
    typeof pagination.page !== "number" ||
    !("pageSize" in pagination) ||
    typeof pagination.pageSize !== "number" ||
    !("total" in pagination) ||
    typeof pagination.total !== "number"
  ) {
    throw new Error("The certificate service returned invalid pagination.");
  }
  return {
    certificates: data.certificates.map(parseCertificate),
    pagination: {
      page: pagination.page,
      pageSize: pagination.pageSize,
      total: pagination.total,
    },
  };
}

export async function getCertificate(
  token: string,
  certificateId: string,
): Promise<CertificateRecord> {
  const data = getData(
    await certificateRequest(
      `/certificates/${encodeURIComponent(certificateId)}`,
      token,
    ),
  );
  return parseCertificate(data.certificate);
}

export async function downloadCertificate(
  token: string,
  certificateId: string,
): Promise<Blob> {
  const response = await fetch(
    `${apiBaseUrl}/certificates/${encodeURIComponent(certificateId)}/download`,
    { headers: { Authorization: `Bearer ${token}` } },
  );
  if (!response.ok) {
    await parseResponse(response);
    throw new Error("Certificate download failed.");
  }
  return response.blob();
}

export async function retryRegistration(
  token: string,
  certificateId: string,
): Promise<CertificateRecord> {
  const data = getData(
    await certificateRequest(
      `/certificates/${encodeURIComponent(certificateId)}/registration/retry`,
      token,
      { method: "POST" },
    ),
  );
  return parseCertificate(data.certificate);
}

export async function revokeCertificate(
  token: string,
  certificateId: string,
  reason: string,
): Promise<CertificateRecord> {
  const data = getData(
    await certificateRequest(
      `/certificates/${encodeURIComponent(certificateId)}/revoke`,
      token,
      { method: "POST", body: JSON.stringify({ reason }) },
    ),
  );
  return parseCertificate(data.certificate);
}

export async function retryRevocation(
  token: string,
  certificateId: string,
): Promise<CertificateRecord> {
  const data = getData(
    await certificateRequest(
      `/certificates/${encodeURIComponent(certificateId)}/revoke/retry`,
      token,
      { method: "POST" },
    ),
  );
  return parseCertificate(data.certificate);
}

export async function getIssuerCertificateStats(
  token: string,
): Promise<IssuerCertificateStats> {
  const data = getData(
    await certificateRequest("/issuer/dashboard/stats", token),
  );
  if (
    typeof data.stats !== "object" ||
    data.stats === null ||
    !("total" in data.stats) ||
    typeof data.stats.total !== "number" ||
    !("issued" in data.stats) ||
    typeof data.stats.issued !== "number" ||
    !("pendingRegistration" in data.stats) ||
    typeof data.stats.pendingRegistration !== "number" ||
    !("failedRegistration" in data.stats) ||
    typeof data.stats.failedRegistration !== "number" ||
    !("revoked" in data.stats) ||
    typeof data.stats.revoked !== "number" ||
    !("issuedThisMonth" in data.stats) ||
    typeof data.stats.issuedThisMonth !== "number"
  ) {
    throw new Error("The issuer service returned invalid dashboard statistics.");
  }
  return {
    total: data.stats.total,
    issued: data.stats.issued,
    pendingRegistration: data.stats.pendingRegistration,
    failedRegistration: data.stats.failedRegistration,
    revoked: data.stats.revoked,
    issuedThisMonth: data.stats.issuedThisMonth,
  };
}

export async function getIssuerAuditLogs(
  token: string,
): Promise<CertificateAuditRecord[]> {
  const data = getData(
    await certificateRequest("/issuer/audit-logs?limit=8", token),
  );
  if (!Array.isArray(data.logs)) {
    throw new Error("The issuer service returned an invalid audit log list.");
  }
  return data.logs.map((log: unknown) => {
    if (
      typeof log !== "object" ||
      log === null ||
      !("id" in log) ||
      typeof log.id !== "number" ||
      !("certificateId" in log) ||
      typeof log.certificateId !== "string" ||
      !("action" in log) ||
      typeof log.action !== "string" ||
      !("createdAt" in log) ||
      typeof log.createdAt !== "string"
    ) {
      throw new Error("The issuer service returned an invalid audit record.");
    }
    const metadata = "metadata" in log ? log.metadata : null;
    return {
      id: log.id,
      certificateId: log.certificateId,
      action: log.action,
      metadata:
        typeof metadata === "object" && metadata !== null
          ? (metadata as Record<string, string | number | null>)
          : null,
      createdAt: log.createdAt,
    };
  });
}

export async function verifyCertificateByQr(
  certificateId: string,
  token: string,
): Promise<CertificateVerificationResult> {
  const query = new URLSearchParams({ token });
  const response = await fetch(
    `${apiBaseUrl}/verification/${encodeURIComponent(certificateId)}?${query}`,
  );
  const body = await parseResponse(response);
  if (
    typeof body !== "object" ||
    body === null ||
    !("data" in body) ||
    typeof body.data !== "object" ||
    body.data === null ||
    !("valid" in body.data) ||
    typeof body.data.valid !== "boolean" ||
    !("status" in body.data) ||
    typeof body.data.status !== "string"
  ) {
    throw new Error("The verification service returned an invalid response.");
  }
  const result = body.data as Record<string, unknown>;
  const status = result.status;
  if (result.valid !== true) {
    return { valid: false, status: status as string };
  }
  if (
    !("certificate" in result) ||
    typeof result.certificate !== "object" ||
    result.certificate === null
  ) {
    throw new Error("The verification service returned incomplete certificate data.");
  }
  const certificate = result.certificate;
  if (
    !("certificateId" in certificate) ||
    typeof certificate.certificateId !== "string" ||
    !("studentName" in certificate) ||
    typeof certificate.studentName !== "string" ||
    !("title" in certificate) ||
    typeof certificate.title !== "string" ||
    !("course" in certificate) ||
    typeof certificate.course !== "string" ||
    !("certificateHash" in certificate) ||
    typeof certificate.certificateHash !== "string"
  ) {
    throw new Error("The verification service returned invalid certificate data.");
  }
  const nullableValue = (key: string) => {
    const record = certificate as Record<string, unknown>;
    const value = key in record ? record[key] : null;
    if (value !== null && typeof value !== "string") {
      throw new Error("The verification service returned invalid certificate data.");
    }
    return typeof value === "string" ? value : null;
  };

  return {
    valid: true,
    status: status as string,
    certificate: {
      certificateId: certificate.certificateId,
      certificateNumber: nullableValue("certificateNumber"),
      studentName: certificate.studentName,
      title: certificate.title,
      course: certificate.course,
      grade: nullableValue("grade"),
      issueDate: nullableValue("issueDate"),
      institutionName: nullableValue("institutionName"),
      certificateHash: certificate.certificateHash,
      blockchainNetwork: nullableValue("blockchainNetwork"),
      blockchainTxHash: nullableValue("blockchainTxHash"),
    },
  };
}
