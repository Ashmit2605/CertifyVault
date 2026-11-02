import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  Ban,
  ChevronLeft,
  ChevronRight,
  Download,
  Eye,
  Loader2,
  PlusCircle,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { PageHeader } from "../../../Pages/IssuerDashLayout/IssuerDashLayout";
import {
  downloadCertificate,
  listCertificates,
  retryRevocation,
  retryRegistration,
  revokeCertificate,
  type CertificateRecord,
} from "../../../utils/certificateApi";

const statusFilters = [
  { label: "All", value: "all" },
  { label: "Issued", value: "issued" },
  { label: "Pending", value: "pending_registration" },
  { label: "Registration failed", value: "registration_failed" },
  { label: "Revocation pending", value: "revocation_pending" },
  { label: "Revoked", value: "revoked" },
  { label: "Expired", value: "expired" },
];

const statusStyles: Record<string, string> = {
  issued: "bg-emerald-50 text-emerald-700",
  pending_registration: "bg-amber-50 text-amber-700",
  registration_failed: "bg-rose-50 text-rose-700",
  revocation_pending: "bg-orange-50 text-orange-700",
  revoked: "bg-slate-100 text-slate-600",
  expired: "bg-slate-100 text-slate-600",
};

const explorerBaseUrl = import.meta.env.VITE_BLOCKCHAIN_EXPLORER_URL;

function saveBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = fileName;
  link.click();
  URL.revokeObjectURL(url);
}

export default function Certificates() {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [certificates, setCertificates] = useState<CertificateRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selected, setSelected] = useState<CertificateRecord | null>(null);
  const [revokeTarget, setRevokeTarget] = useState<CertificateRecord | null>(null);
  const [reason, setReason] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);
  const pageSize = 10;

  const loadCertificates = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const token = await getToken();
      if (!token) throw new Error("Your secure session is unavailable.");
      const result = await listCertificates(token, {
        search,
        status: statusFilter,
        page,
        pageSize,
      });
      setCertificates(result.certificates);
      setTotal(result.pagination.total);
    } catch (loadError) {
      setError(
        loadError instanceof Error
          ? loadError.message
          : "Unable to load certificates.",
      );
    } finally {
      setLoading(false);
    }
  }, [getToken, page, pageSize, search, statusFilter]);

  useEffect(() => {
    let active = true;
    void (async () => {
      await Promise.resolve();
      if (active) await loadCertificates();
    })();
    return () => {
      active = false;
    };
  }, [loadCertificates]);

  const handleDownload = async (certificate: CertificateRecord) => {
    setBusyId(certificate.certificateId);
    setError("");
    try {
      const token = await getToken();
      if (!token) throw new Error("Your secure session is unavailable.");
      saveBlob(
        await downloadCertificate(token, certificate.certificateId),
        `${certificate.certificateId}.pdf`,
      );
    } catch (downloadError) {
      setError(
        downloadError instanceof Error
          ? downloadError.message
          : "Certificate download failed.",
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleRetry = async (certificate: CertificateRecord) => {
    setBusyId(certificate.certificateId);
    setError("");
    try {
      const token = await getToken();
      if (!token) throw new Error("Your secure session is unavailable.");
      await retryRegistration(token, certificate.certificateId);
      await loadCertificates();
    } catch (retryError) {
      setError(
        retryError instanceof Error
          ? retryError.message
          : "Registration retry failed.",
      );
    } finally {
      setBusyId(null);
    }
  };

  const handleRetryRevocation = async (certificate: CertificateRecord) => {
    setBusyId(certificate.certificateId);
    setError("");
    try {
      const token = await getToken();
      if (!token) throw new Error("Your secure session is unavailable.");
      await retryRevocation(token, certificate.certificateId);
      await loadCertificates();
    } catch (retryError) {
      setError(
        retryError instanceof Error
          ? retryError.message
          : "Revocation retry failed.",
      );
    } finally {
      setBusyId(null);
    }
  };

  const confirmRevocation = async () => {
    if (!revokeTarget) return;
    setBusyId(revokeTarget.certificateId);
    setError("");
    try {
      const token = await getToken();
      if (!token) throw new Error("Your secure session is unavailable.");
      await revokeCertificate(token, revokeTarget.certificateId, reason);
      setRevokeTarget(null);
      setReason("");
      await loadCertificates();
    } catch (revokeError) {
      setError(
        revokeError instanceof Error
          ? revokeError.message
          : "Certificate revocation failed.",
      );
    } finally {
      setBusyId(null);
    }
  };

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
      <PageHeader
        title="Certificates"
        description="Certificates issued by your institution"
        action={{
          label: "Issue Certificate",
          icon: <PlusCircle size={16} />,
          onClick: () => navigate("/issuerdashboard/issue"),
        }}
      />

      <div className="flex flex-col gap-3 border-b border-slate-100 px-6 py-4 lg:flex-row">
        <div className="relative max-w-sm flex-1">
          <Search
            size={16}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="search"
            value={search}
            onChange={(event) => {
              setSearch(event.target.value);
              setPage(1);
            }}
            placeholder="Search certificate ID, student, or course…"
            className="w-full rounded-lg bg-brand-light py-2 pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-brand/40"
          />
        </div>
        <div className="flex gap-2 overflow-x-auto">
          {statusFilters.map((filter) => (
            <button
              key={filter.value}
              type="button"
              onClick={() => {
                setStatusFilter(filter.value);
                setPage(1);
              }}
              className={`whitespace-nowrap rounded-lg px-3 py-2 text-sm font-medium ${
                statusFilter === filter.value
                  ? "bg-brand text-white"
                  : "bg-brand-light text-slate-600 hover:bg-brand/10"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <p role="alert" className="mx-6 mt-4 rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-slate-500">
              <th className="px-6 py-3 font-medium">Certificate ID</th>
              <th className="px-4 py-3 font-medium">Student</th>
              <th className="px-4 py-3 font-medium">Certificate</th>
              <th className="px-4 py-3 font-medium">Issue date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-6 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {certificates.map((certificate) => (
              <tr
                key={certificate.certificateId}
                className="border-b border-slate-50 hover:bg-brand-light/40"
              >
                <td className="px-6 py-3.5 font-medium text-navy">
                  {certificate.certificateId}
                  {certificate.blockchainTxHash && (
                    <p className="mt-1 max-w-48 truncate text-xs font-normal text-slate-400">
                      {certificate.blockchainTxHash}
                    </p>
                  )}
                </td>
                <td className="px-4 py-3.5 text-navy">{certificate.studentName}</td>
                <td className="px-4 py-3.5 text-slate-600">
                  {certificate.title}
                  <p className="text-xs text-slate-400">{certificate.course}</p>
                </td>
                <td className="px-4 py-3.5 text-slate-600">
                  {certificate.issueDate ?? "—"}
                </td>
                <td className="px-4 py-3.5">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${
                      statusStyles[certificate.status] ?? "bg-slate-100 text-slate-600"
                    }`}
                  >
                    {certificate.status.replaceAll("_", " ")}
                  </span>
                  <p className="mt-1 text-xs text-slate-400">
                    Chain: {certificate.registrationStatus}
                  </p>
                </td>
                <td className="px-6 py-3.5">
                  <div className="flex justify-end gap-1">
                    <button
                      type="button"
                      title="View details"
                      onClick={() => setSelected(certificate)}
                      className="rounded-lg p-2 text-slate-500 hover:bg-brand-light hover:text-brand"
                    >
                      <Eye size={16} />
                    </button>
                    {(certificate.status === "issued" ||
                      certificate.status === "revoked") && (
                      <button
                        type="button"
                        title="Download PDF"
                        disabled={busyId === certificate.certificateId}
                        onClick={() => void handleDownload(certificate)}
                        className="rounded-lg p-2 text-slate-500 hover:bg-brand-light hover:text-brand disabled:opacity-50"
                      >
                        {busyId === certificate.certificateId ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Download size={16} />
                        )}
                      </button>
                    )}
                    {(certificate.status === "registration_failed" ||
                      certificate.status === "pending_registration") && (
                      <button
                        type="button"
                        title="Check or retry blockchain registration"
                        disabled={busyId === certificate.certificateId}
                        onClick={() => void handleRetry(certificate)}
                        className="rounded-lg p-2 text-amber-600 hover:bg-amber-50 disabled:opacity-50"
                      >
                        <ShieldCheck size={16} />
                      </button>
                    )}
                    {certificate.status === "revocation_pending" && (
                      <button
                        type="button"
                        title="Retry blockchain revocation"
                        disabled={busyId === certificate.certificateId}
                        onClick={() => void handleRetryRevocation(certificate)}
                        className="rounded-lg p-2 text-amber-600 hover:bg-amber-50 disabled:opacity-50"
                      >
                        <ShieldCheck size={16} />
                      </button>
                    )}
                    {certificate.status === "issued" && (
                      <button
                        type="button"
                        title="Revoke certificate"
                        onClick={() => setRevokeTarget(certificate)}
                        className="rounded-lg p-2 text-rose-500 hover:bg-rose-50"
                      >
                        <Ban size={16} />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {!loading && certificates.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                  No certificates match this search.
                </td>
              </tr>
            )}
            {loading && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-slate-500">
                  <Loader2 size={18} className="mr-2 inline animate-spin" />
                  Loading certificates…
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between border-t border-slate-100 px-6 py-4">
        <p className="text-xs text-slate-500">
          {total === 0
            ? "No certificates"
            : `Showing ${(page - 1) * pageSize + 1}–${Math.min(
                page * pageSize,
                total,
              )} of ${total}`}
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            disabled={page <= 1 || loading}
            onClick={() => setPage((current) => Math.max(1, current - 1))}
            className="rounded-lg border border-slate-200 p-1.5 text-slate-500 disabled:opacity-40"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm text-navy">
            {page} / {totalPages}
          </span>
          <button
            type="button"
            disabled={page >= totalPages || loading}
            onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
            className="rounded-lg border border-slate-200 p-1.5 text-slate-500 disabled:opacity-40"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>

      {selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="certificate-details-title"
            className="max-h-[90vh] w-full max-w-xl overflow-auto rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <h2 id="certificate-details-title" className="text-lg font-semibold text-navy">
                  Certificate details
                </h2>
                <p className="mt-1 break-all text-sm text-slate-500">
                  {selected.certificateId}
                </p>
              </div>
              <button
                type="button"
                aria-label="Close details"
                onClick={() => setSelected(null)}
                className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"
              >
                <X size={18} />
              </button>
            </div>
            <dl className="mt-5 grid gap-3 text-sm sm:grid-cols-2">
              <div><dt className="text-slate-500">Student</dt><dd className="font-medium text-navy">{selected.studentName}</dd></div>
              <div><dt className="text-slate-500">Title</dt><dd className="font-medium text-navy">{selected.title}</dd></div>
              <div><dt className="text-slate-500">Course</dt><dd className="font-medium text-navy">{selected.course}</dd></div>
              <div><dt className="text-slate-500">Issue date</dt><dd className="font-medium text-navy">{selected.issueDate ?? "—"}</dd></div>
              <div><dt className="text-slate-500">Lifecycle status</dt><dd className="font-medium text-navy">{selected.status.replaceAll("_", " ")}</dd></div>
              <div><dt className="text-slate-500">Blockchain status</dt><dd className="font-medium text-navy">{selected.registrationStatus}</dd></div>
              <div className="sm:col-span-2"><dt className="text-slate-500">SHA-256 of final PDF</dt><dd className="break-all font-mono text-xs text-navy">{selected.certificateHash}</dd></div>
              {selected.blockchainTxHash && (
                <div className="sm:col-span-2">
                  <dt className="text-slate-500">Transaction</dt>
                  <dd className="break-all font-mono text-xs">
                    {explorerBaseUrl ? (
                      <a
                        className="text-brand underline"
                        href={`${explorerBaseUrl.replace(/\/+$/, "")}/tx/${selected.blockchainTxHash}`}
                        target="_blank"
                        rel="noreferrer"
                      >
                        {selected.blockchainTxHash}
                      </a>
                    ) : (
                      <span className="text-navy">{selected.blockchainTxHash}</span>
                    )}
                  </dd>
                </div>
              )}
              {selected.verificationUrl && (
                <div className="sm:col-span-2">
                  <dt className="text-slate-500">Signed QR verification URL</dt>
                  <dd className="break-all text-xs text-navy">{selected.verificationUrl}</dd>
                </div>
              )}
              {selected.revocationReason && (
                <div className="sm:col-span-2">
                  <dt className="text-slate-500">Revocation reason</dt>
                  <dd className="text-navy">{selected.revocationReason}</dd>
                </div>
              )}
            </dl>
          </section>
        </div>
      )}

      {revokeTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 p-4">
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="revoke-title"
            className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl"
          >
            <div className="flex items-start gap-3">
              <AlertTriangle className="mt-0.5 text-rose-500" size={20} />
              <div>
                <h2 id="revoke-title" className="font-semibold text-navy">
                  Revoke certificate?
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {revokeTarget.certificateId} will be marked revoked only after the blockchain confirms.
                </p>
              </div>
            </div>
            <label className="mt-4 block text-sm font-medium text-navy">
              Reason
              <textarea
                value={reason}
                maxLength={1000}
                onChange={(event) => setReason(event.target.value)}
                rows={4}
                className="mt-1.5 w-full resize-none rounded-lg border border-slate-200 p-3 text-sm outline-none focus:ring-2 focus:ring-brand/40"
                placeholder="Provide a reason (at least 10 characters)"
              />
            </label>
            {error && <p role="alert" className="mt-3 text-sm text-rose-600">{error}</p>}
            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                onClick={() => {
                  setRevokeTarget(null);
                  setReason("");
                }}
                className="rounded-lg px-4 py-2 text-sm text-slate-600 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={reason.trim().length < 10 || busyId !== null}
                onClick={() => void confirmRevocation()}
                className="rounded-lg bg-rose-600 px-4 py-2 text-sm font-medium text-white hover:bg-rose-700 disabled:opacity-50"
              >
                {busyId === revokeTarget.certificateId ? "Submitting…" : "Confirm revocation"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
