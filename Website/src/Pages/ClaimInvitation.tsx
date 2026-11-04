import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Link, useLocation, useSearchParams } from "react-router-dom";
import { CheckCircle2, Loader2, ShieldCheck } from "lucide-react";
import {
  completeCredentialClaim,
  verifyClaimInvitation,
} from "../utils/holderApi";

type ClaimDetails = {
  claimId: number;
  certificateId: string;
  title: string;
  institutionName: string | null;
};

export default function ClaimInvitation() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const claimIdValue = Number(searchParams.get("claimId"));
  const invitationToken = searchParams.get("token") ?? "";
  const [details, setDetails] = useState<ClaimDetails | null>(null);
  const [claimed, setClaimed] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    if (!isLoaded || !isSignedIn || !Number.isSafeInteger(claimIdValue) || claimIdValue < 1 || !invitationToken) {
      return () => { active = false; };
    }
    void (async () => {
      setBusy(true);
      setError("");
      try {
        const token = await getToken();
        if (!token) throw new Error("Your secure session is unavailable.");
        const verified = await verifyClaimInvitation(token, claimIdValue, invitationToken);
        if (active) setDetails(verified);
      } catch (verificationError) {
        if (active) setError(verificationError instanceof Error ? verificationError.message : "The invitation could not be verified.");
      } finally {
        if (active) setBusy(false);
      }
    })();
    return () => { active = false; };
  }, [claimIdValue, getToken, invitationToken, isLoaded, isSignedIn]);

  const claimCredential = async () => {
    if (!details) return;
    setBusy(true);
    setError("");
    try {
      const token = await getToken();
      if (!token) throw new Error("Your secure session is unavailable.");
      await completeCredentialClaim(token, details.claimId, invitationToken);
      setClaimed(true);
    } catch (claimError) {
      setError(claimError instanceof Error ? claimError.message : "The credential could not be claimed.");
    } finally {
      setBusy(false);
    }
  };

  const returnTo = `${location.pathname}${location.search}`;

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#F5F8FF] px-4 py-10">
      <section className="w-full max-w-xl rounded-3xl border border-[#E4EAFB] bg-white p-7 shadow-[0_12px_40px_rgba(0,15,62,0.08)] sm:p-10">
        <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#EAF1FF] text-[#0050F5]">
          {claimed ? <CheckCircle2 className="h-6 w-6" /> : <ShieldCheck className="h-6 w-6" />}
        </div>
        <h1 className="text-2xl font-semibold text-[#000F3E]">Claim your credential</h1>
        <p className="mt-2 text-sm leading-6 text-[#6B7494]">
          Sign in with the institution-verified email address that received this invitation.
        </p>

        {!isLoaded || busy ? (
          <div className="mt-7 flex items-center gap-2 text-sm text-[#6B7494]"><Loader2 className="h-4 w-4 animate-spin" />Verifying invitation…</div>
        ) : !isSignedIn ? (
          <Link
            to="/app/login"
            state={{ from: returnTo }}
            className="mt-7 inline-flex rounded-xl bg-[#0050F5] px-5 py-3 text-sm font-semibold text-white no-underline hover:bg-[#0041CC]"
          >
            Sign in to continue
          </Link>
        ) : claimed ? (
          <div className="mt-7">
            <p className="rounded-xl bg-emerald-50 px-4 py-3 text-sm text-emerald-800">Credential claimed and added to your wallet.</p>
            <Link to="/holderdashboard/certificates" className="mt-4 inline-flex rounded-xl bg-[#0050F5] px-5 py-3 text-sm font-semibold text-white no-underline hover:bg-[#0041CC]">Open wallet</Link>
          </div>
        ) : details ? (
          <div className="mt-7 rounded-2xl border border-[#E4EAFB] bg-[#FBFCFF] p-5">
            <p className="text-xs font-semibold uppercase tracking-wide text-[#8993B4]">From {details.institutionName ?? "your institution"}</p>
            <h2 className="mt-2 text-lg font-semibold text-[#000F3E]">{details.title}</h2>
            <p className="mt-1 break-all text-xs text-[#8993B4]">{details.certificateId}</p>
            <button type="button" disabled={busy} onClick={() => void claimCredential()} className="mt-5 w-full rounded-xl bg-[#0050F5] px-5 py-3 text-sm font-semibold text-white hover:bg-[#0041CC] disabled:opacity-50">Claim credential</button>
          </div>
        ) : (
          <p className="mt-7 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">This invitation link is invalid or expired.</p>
        )}
        {error && <p role="alert" className="mt-4 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
      </section>
    </main>
  );
}
