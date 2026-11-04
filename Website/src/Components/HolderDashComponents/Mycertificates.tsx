import { useCallback, useEffect, useMemo, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Link } from "react-router-dom";
import { Download, Eye, Loader2, Search, Share2, ShieldCheck, ShieldOff } from "lucide-react";
import {
  downloadHolderCredentialPdf,
  getHolderCredential,
  getHolderCredentials,
  type HolderCredential,
  type HolderCredentialDetail,
} from "../../utils/holderApi";

const FILTERS = ["All", "Degree", "Course", "Internship", "Training", "Other"];

function formatDate(value: string | null) {
  if (!value) return "Not provided";
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? value : parsed.toLocaleDateString();
}

function isRevoked(status: string) {
  return status.toLowerCase().includes("revok");
}

export default function MyCertificates() {
  const { getToken } = useAuth();
  const [credentials, setCredentials] = useState<HolderCredential[]>([]);
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<HolderCredentialDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  const loadCredentials = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) throw new Error("Your secure session is unavailable.");
      const items = await getHolderCredentials(token);
      setError("");
      setCredentials(items);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "The wallet could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadCredentials(), 0);
    return () => window.clearTimeout(timer);
  }, [loadCredentials]);

  const filtered = useMemo(() => credentials.filter((credential) => {
    const type = credential.certificateType.toLowerCase();
    const matchesFilter =
      filter === "All" ||
      type === filter.toLowerCase() ||
      (filter === "Other" && !["degree", "course", "internship", "training"].includes(type));
    const needle = query.trim().toLowerCase();
    return matchesFilter &&
      (!needle ||
        credential.title.toLowerCase().includes(needle) ||
        (credential.institutionName ?? "").toLowerCase().includes(needle) ||
        credential.certificateId.toLowerCase().includes(needle));
  }), [credentials, filter, query]);

  const openDetails = async (certificateId: string) => {
    setBusy(true);
    setError("");
    try {
      const token = await getToken();
      if (!token) throw new Error("Your secure session is unavailable.");
      const result = await getHolderCredential(token, certificateId);
      setSelected(result);
    } catch (detailError) {
      setError(detailError instanceof Error ? detailError.message : "Credential details could not be loaded.");
    } finally {
      setBusy(false);
    }
  };

  const downloadPdf = async (certificateId: string) => {
    setBusy(true);
    setError("");
    try {
      const token = await getToken();
      if (!token) throw new Error("Your secure session is unavailable.");
      const blob = await downloadHolderCredentialPdf(token, certificateId);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${certificateId}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (downloadError) {
      setError(downloadError instanceof Error ? downloadError.message : "The PDF could not be downloaded.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <>
      <main className="mx-auto max-w-[1440px] px-6 py-8 lg:px-10">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-[24px] font-semibold tracking-tight text-[#000F3E]">My Certificates</h1>
            <p className="mt-1 text-[14px] text-[#6B7494]">
              Your credential wallet — {credentials.length} {credentials.length === 1 ? "credential" : "credentials"}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl border border-[#E4EAFB] bg-white px-3.5 py-2.5 text-[#8993B4] sm:w-72">
            <Search className="h-4 w-4 shrink-0" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search certificates..."
              aria-label="Search certificates"
              className="w-full bg-transparent text-[13.5px] text-[#000F3E] placeholder:text-[#9AA3C2] focus:outline-none"
            />
          </div>
        </div>

        {error && <p role="alert" className="mb-5 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
        <div className="mb-6 flex flex-wrap gap-2">
          {FILTERS.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setFilter(item)}
              className={`rounded-full px-4 py-2 text-[13px] font-medium transition-colors ${
                filter === item ? "bg-[#0050F5] text-white" : "border border-[#E4EAFB] bg-white text-[#4A5578] hover:bg-[#F5F8FF]"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="flex justify-center rounded-2xl border border-[#EAF1FF] bg-white py-16">
            <Loader2 className="h-6 w-6 animate-spin text-[#0050F5]" aria-label="Loading credentials" />
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-[#DCE6FB] bg-white py-16 text-center">
            <p className="text-[14.5px] text-[#8993B4]">
              {credentials.length ? "No certificates match your search." : "No credentials have been claimed into this wallet yet."}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {filtered.map((credential) => (
              <article key={credential.claimId} className="flex flex-col rounded-2xl border border-[#EAF1FF] bg-white p-6 shadow-[0_1px_2px_rgba(0,15,62,0.04)]">
                <div className="mb-4 flex items-start justify-between">
                  <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#EAF1FF] text-[22px]">🎓</span>
                  {isRevoked(credential.status) ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#FDEDEE] px-2.5 py-1 text-[11.5px] font-medium text-[#E5484D]"><ShieldOff className="h-3.5 w-3.5" />Revoked</span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-[#E8F9EF] px-2.5 py-1 text-[11.5px] font-medium text-[#1AAE5F]"><ShieldCheck className="h-3.5 w-3.5" />{credential.status}</span>
                  )}
                </div>
                <h2 className="text-[15.5px] font-semibold leading-snug text-[#000F3E]">{credential.title}</h2>
                <p className="mt-0.5 text-[13.5px] text-[#6B7494]">{credential.institutionName ?? "Issuing institution"}</p>
                <p className="mt-2 text-[12px] text-[#9AA3C2]">Issued: {formatDate(credential.issueDate)}</p>
                <p className="text-[11.5px] text-[#B3BAD4]">{credential.certificateId}</p>
                <div className="mt-5 flex gap-2.5 border-t border-[#F0F3FC] pt-4">
                  <button type="button" disabled={busy} onClick={() => void openDetails(credential.certificateId)} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl border border-[#DCE6FB] py-2.5 text-[13px] font-medium text-[#000F3E] hover:bg-[#F5F8FF] disabled:opacity-50">
                    <Eye className="h-4 w-4" />View
                  </button>
                  <Link to={`/holderdashboard/share?certificate=${encodeURIComponent(credential.certificateId)}`} className="flex flex-1 items-center justify-center gap-1.5 rounded-xl bg-[#0050F5] py-2.5 text-[13px] font-medium text-white no-underline hover:bg-[#0041CC]">
                    <Share2 className="h-4 w-4" />Share
                  </Link>
                </div>
                <button type="button" disabled={busy || isRevoked(credential.status)} onClick={() => void downloadPdf(credential.certificateId)} className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl py-2 text-[13px] font-medium text-[#4A5578] hover:bg-[#F5F8FF] disabled:opacity-50">
                  <Download className="h-4 w-4" />Download PDF
                </button>
              </article>
            ))}
          </div>
        )}
      </main>
      {selected && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/40 p-4" onClick={() => setSelected(null)}>
          <section role="dialog" aria-modal="true" aria-labelledby="credential-details-title" className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-xl" onClick={(event) => event.stopPropagation()}>
            <div className="mb-5 flex items-start justify-between gap-4">
              <div><h2 id="credential-details-title" className="text-lg font-semibold text-[#000F3E]">Credential details</h2><p className="mt-1 text-sm text-[#6B7494]">{selected.certificate.title}</p></div>
              <button type="button" onClick={() => setSelected(null)} className="rounded-lg px-3 py-1 text-sm text-[#4A5578] hover:bg-[#F5F8FF]">Close</button>
            </div>
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div><dt className="text-[#8993B4]">Credential ID</dt><dd className="break-all font-medium text-[#000F3E]">{selected.certificate.certificateId}</dd></div>
              <div><dt className="text-[#8993B4]">Institution</dt><dd className="font-medium text-[#000F3E]">{selected.institutionName ?? "Not provided"}</dd></div>
              <div><dt className="text-[#8993B4]">Course</dt><dd className="font-medium text-[#000F3E]">{selected.certificate.course}</dd></div>
              <div><dt className="text-[#8993B4]">Issued</dt><dd className="font-medium text-[#000F3E]">{formatDate(selected.certificate.issueDate)}</dd></div>
              <div><dt className="text-[#8993B4]">Status</dt><dd className="font-medium capitalize text-[#000F3E]">{selected.certificate.status} / {selected.certificate.revocationStatus}</dd></div>
              <div><dt className="text-[#8993B4]">Blockchain</dt><dd className="font-medium text-[#000F3E]">{selected.certificate.blockchainTxHash ?? "Not registered"}</dd></div>
            </dl>
            <button type="button" onClick={() => void downloadPdf(selected.certificate.certificateId)} disabled={busy || isRevoked(selected.certificate.status)} className="mt-5 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0050F5] py-3 text-sm font-semibold text-white disabled:opacity-50"><Download className="h-4 w-4" />Download original PDF</button>
          </section>
        </div>
      )}
    </>
  );
}
