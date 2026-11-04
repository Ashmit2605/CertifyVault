import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { BadgeCheck, Loader2, ShieldAlert } from "lucide-react";
import {
  decideIssuerClaim,
  listIssuerClaims,
  type IssuerClaimRequest,
} from "../../../utils/issuerLifecycleApi";

export default function IssuerClaims() {
  const { getToken } = useAuth();
  const [claims, setClaims] = useState<IssuerClaimRequest[]>([]);
  const [reasons, setReasons] = useState<Record<number, string>>({});
  const [loading, setLoading] = useState(true);
  const [busyClaim, setBusyClaim] = useState<number | null>(null);
  const [error, setError] = useState("");

  const loadClaims = useCallback(async () => {
    try {
      const token = await getToken();
      if (!token) throw new Error("Your secure session is unavailable.");
      const items = await listIssuerClaims(token);
      setError("");
      setClaims(items);
    } catch (loadError) {
      setError(loadError instanceof Error ? loadError.message : "Claim requests could not be loaded.");
    } finally {
      setLoading(false);
    }
  }, [getToken]);

  useEffect(() => {
    const timer = window.setTimeout(() => void loadClaims(), 0);
    return () => window.clearTimeout(timer);
  }, [loadClaims]);

  const decide = async (claim: IssuerClaimRequest, decision: "approve" | "reject") => {
    const reason = reasons[claim.id]?.trim() ?? "";
    if (reason.length < 10) {
      setError("Enter at least 10 characters explaining the review decision.");
      return;
    }
    setBusyClaim(claim.id);
    setError("");
    try {
      const token = await getToken();
      if (!token) throw new Error("Your secure session is unavailable.");
      await decideIssuerClaim(token, claim.id, decision, reason);
      setReasons((current) => ({ ...current, [claim.id]: "" }));
      await loadClaims();
    } catch (decisionError) {
      setError(decisionError instanceof Error ? decisionError.message : "The claim decision could not be saved.");
    } finally {
      setBusyClaim(null);
    }
  };

  const pending = claims.filter((claim) => claim.status === "requested");

  return (
    <main className="mx-auto max-w-6xl space-y-6 p-6">
      <header><h1 className="text-2xl font-semibold text-navy">Credential claims</h1><p className="mt-1 text-sm text-slate-500">Review institution-discovered holder requests before granting wallet access.</p></header>
      {error && <p role="alert" className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
      {loading ? <div className="flex justify-center rounded-2xl bg-white p-12"><Loader2 className="h-5 w-5 animate-spin text-brand" /></div> : claims.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-12 text-center text-sm text-slate-500">No claim requests have been submitted.</p>
      ) : (
        <div className="space-y-4">
          {claims.map((claim) => {
            const reviewable = claim.status === "requested" && claim.claimMethod === "institution_search";
            return (
              <article key={claim.id} className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div><h2 className="font-semibold text-navy">{claim.title}</h2><p className="mt-1 text-sm text-slate-600">{claim.studentName} · {claim.certificateId}</p><p className="mt-1 text-xs text-slate-400">{claim.claimMethod.replaceAll("_", " ")} · {new Date(claim.createdAt).toLocaleString()}</p></div>
                  <span className={`inline-flex w-fit items-center gap-1 rounded-full px-3 py-1 text-xs font-medium ${claim.status === "claimed" ? "bg-emerald-50 text-emerald-700" : claim.status === "rejected" ? "bg-rose-50 text-rose-700" : "bg-amber-50 text-amber-800"}`}>{claim.status === "claimed" ? <BadgeCheck size={14} /> : <ShieldAlert size={14} />}{claim.status}</span>
                </div>
                {claim.evidenceCategory && <p className="mt-3 text-sm text-slate-600">Evidence: {claim.evidenceCategory}</p>}
                {claim.decisionReason && <p className="mt-2 text-sm text-slate-500">Review note: {claim.decisionReason}</p>}
                {reviewable && (
                  <div className="mt-4 border-t border-slate-100 pt-4">
                    <label className="block text-sm font-medium text-navy">Decision rationale<textarea value={reasons[claim.id] ?? ""} onChange={(event) => setReasons((current) => ({ ...current, [claim.id]: event.target.value }))} minLength={10} maxLength={1000} placeholder="Record the evidence and reason for your decision." className="mt-2 w-full rounded-lg bg-slate-50 p-3 text-sm" /></label>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <button type="button" disabled={busyClaim !== null} onClick={() => void decide(claim, "approve")} className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white disabled:opacity-50">Approve claim</button>
                      <button type="button" disabled={busyClaim !== null} onClick={() => void decide(claim, "reject")} className="rounded-lg border border-rose-200 px-4 py-2 text-sm font-medium text-rose-700 disabled:opacity-50">Reject claim</button>
                    </div>
                  </div>
                )}
              </article>
            );
          })}
          {pending.length > 0 && <p className="text-xs text-slate-500">Only institution-reference matches submitted by signed-in holders can be reviewed here.</p>}
        </div>
      )}
    </main>
  );
}
