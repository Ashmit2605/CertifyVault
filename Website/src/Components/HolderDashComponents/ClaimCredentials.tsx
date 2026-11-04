import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Loader2, Search, ShieldCheck } from "lucide-react";
import {
  getHolderClaimRequests,
  getHolderInvitations,
  requestCredentialDiscovery,
  type HolderClaimRequest,
  type HolderInvitation,
} from "../../utils/holderApi";

export default function ClaimCredentials() {
  const { getToken } = useAuth();
  const [institutionName, setInstitutionName] = useState("");
  const [institutionReference, setInstitutionReference] = useState("");
  const [invitations, setInvitations] = useState<HolderInvitation[]>([]);
  const [claims, setClaims] = useState<HolderClaimRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  const loadClaims = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) throw new Error("Your secure session is unavailable.");
      const [pendingInvitations, requests] = await Promise.all([
        getHolderInvitations(token),
        getHolderClaimRequests(token),
      ]);
      setError("");
      setInvitations(pendingInvitations);
      setClaims(requests);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Claim information could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadClaims(), 0);
    return () => window.clearTimeout(timer);
  }, [loadClaims]);

  const discover = async (event: React.FormEvent) => {
    event.preventDefault();
    setBusy(true);
    setError("");
    setNotice("");
    try {
      const token = await getToken();
      if (!token) throw new Error("Your secure session is unavailable.");
      await requestCredentialDiscovery(token, institutionName.trim(), institutionReference.trim());
      setNotice("Request submitted. The institution will review matching credentials.");
      await loadClaims();
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : "The request could not be submitted.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <main className="mx-auto max-w-5xl space-y-6 px-6 py-8 lg:px-10">
      <header><h1 className="text-2xl font-semibold text-[#000F3E]">Claim credentials</h1><p className="mt-1 text-sm text-[#6B7494]">Accept an institution invitation or request a search using your verified account email and institution reference.</p></header>
      {error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
      {notice && <p role="status" className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">{notice}</p>}

      <form onSubmit={(event) => void discover(event)} className="grid gap-4 rounded-2xl border border-[#EAF1FF] bg-white p-6 sm:grid-cols-2">
        <div className="sm:col-span-2"><h2 className="font-semibold text-[#000F3E]">Find an unclaimed credential</h2><p className="mt-1 text-sm text-[#6B7494]">The institution receives a request only when an exact name and verified-email/reference match is found. The response does not reveal whether a record exists.</p></div>
        <label className="text-sm font-medium text-[#4A5578]">Institution name<input required maxLength={255} value={institutionName} onChange={(event) => setInstitutionName(event.target.value)} className="mt-1.5 w-full rounded-xl border border-[#E4EAFB] px-3.5 py-3" /></label>
        <label className="text-sm font-medium text-[#4A5578]">Student / institution reference<input required maxLength={255} value={institutionReference} onChange={(event) => setInstitutionReference(event.target.value)} className="mt-1.5 w-full rounded-xl border border-[#E4EAFB] px-3.5 py-3" /></label>
        <button type="submit" disabled={busy || !institutionName.trim() || !institutionReference.trim()} className="flex items-center justify-center gap-2 rounded-xl bg-[#0050F5] px-4 py-3 text-sm font-semibold text-white disabled:opacity-50 sm:col-span-2"><Search size={16} />Request credential search</button>
      </form>

      <section className="rounded-2xl border border-[#EAF1FF] bg-white">
        <div className="border-b border-[#EDF1FA] px-5 py-4"><h2 className="font-semibold text-[#000F3E]">Invitation and request status</h2></div>
        {loading ? <div className="flex justify-center p-10"><Loader2 className="h-5 w-5 animate-spin text-[#0050F5]" /></div> : invitations.length === 0 && claims.length === 0 ? <p className="p-8 text-center text-sm text-[#8993B4]">No invitations or claim requests found.</p> : (
          <div className="divide-y divide-[#EDF1FA]">
            {invitations.map((invite, index) => (
              <article key={`${invite.claimId}-${invite.expiresAt}-${index}`} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div><h3 className="font-medium text-[#000F3E]">{invite.title}</h3><p className="mt-1 text-sm text-[#6B7494]">{invite.institutionName ?? "Issuing institution"} · {invite.certificateId}</p></div>
                <span className="w-fit rounded-full bg-blue-50 px-3 py-1 text-xs font-medium text-blue-700">{invite.usedAt ? "Claimed" : invite.revokedAt ? "Revoked" : "Invitation sent"}</span>
              </article>
            ))}
            {claims.map((claim) => (
              <article key={claim.claimId} className="flex flex-col gap-2 p-5 sm:flex-row sm:items-center sm:justify-between">
                <div><h3 className="font-medium text-[#000F3E]">{claim.title}</h3><p className="mt-1 text-sm text-[#6B7494]">{claim.institutionName ?? "Issuing institution"} · {claim.certificateId}</p></div>
                <span className={`w-fit rounded-full px-3 py-1 text-xs font-medium ${claim.status === "rejected" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-800"}`}><ShieldCheck className="mr-1 inline h-3.5 w-3.5" />{claim.status}</span>
              </article>
            ))}
          </div>
        )}
      </section>
      {busy && <p className="sr-only" aria-live="polite">Submitting request</p>}
    </main>
  );
}
