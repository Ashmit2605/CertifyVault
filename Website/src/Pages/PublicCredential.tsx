import { useEffect, useState } from "react";
import {
  BadgeCheck,
  Copy,
  Download,
  LoaderCircle,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import { useParams, useSearchParams } from "react-router-dom";
import {
  downloadPublicCredentialPdf,
  getPublicCredential,
  type PublicCredentialPageData,
} from "../utils/certificateApi";

function statusLabel(status: string) {
  switch (status) {
    case "issued":
      return "Valid";
    case "revoked":
      return "Revoked";
    case "expired":
      return "Expired";
    case "blockchain_unconfirmed":
      return "Awaiting blockchain confirmation";
    case "integrity_mismatch":
      return "Integrity check failed";
    case "registration_failed":
      return "Registration failed";
    case "pending_registration":
      return "Registration pending";
    case "revocation_pending":
      return "Revocation pending";
    default:
      return "Unable to verify";
  }
}

export default function PublicCredential() {
  const { certificateId = "" } = useParams();
  const [searchParams] = useSearchParams();
  const shareToken = searchParams.get("share") ?? undefined;
  const requestKey = `${certificateId}:${shareToken ?? ""}`;
  const [pageState, setPageState] = useState<{
    key: string;
    credential?: PublicCredentialPageData;
    error?: string;
  } | null>(null);
  const [copyFailure, setCopyFailure] = useState<{ key: string; message: string } | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let active = true;
    void getPublicCredential(certificateId, shareToken)
      .then((result) => {
        if (active) setPageState({ key: requestKey, credential: result });
      })
      .catch((requestError: unknown) => {
        if (active) {
          setPageState({
            key: requestKey,
            error:
              requestError instanceof Error
                ? requestError.message
                : "The credential could not be verified.",
          });
        }
      });

    return () => {
      active = false;
    };
  }, [certificateId, requestKey, shareToken]);

  async function copyCredentialLink() {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
    } catch {
      setCopyFailure({
        key: requestKey,
        message: "Your browser could not copy the link. Copy it from the address bar instead.",
      });
    }
  }

  async function downloadPdf() {
    try {
      const pdf = await downloadPublicCredentialPdf(certificateId, shareToken);
      const url = URL.createObjectURL(pdf);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${certificateId}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (downloadError) {
      setCopyFailure({
        key: requestKey,
        message: downloadError instanceof Error ? downloadError.message : "PDF download is not available.",
      });
    }
  }

  const currentState = pageState?.key === requestKey ? pageState : null;
  const credential = currentState?.credential ?? null;
  const error =
    currentState?.error ??
    (copyFailure?.key === requestKey ? copyFailure.message : "");
  const isValid = credential?.valid === true;
  const isRevoked = credential?.status === "revoked";

  return (
    <main className="min-h-screen bg-[#F5F8FF] px-4 py-10 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <header className="mb-8 text-center">
          <p className="text-sm font-semibold tracking-[0.18em] text-[#0050F5]">
            CERTIFYVAULT
          </p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-[#000F3E] sm:text-4xl">
            Credential verification
          </h1>
          <p className="mt-3 text-sm text-[#6B7494]">
            Verify the signed issuance proof and current credential status.
          </p>
        </header>

        <section className="overflow-hidden rounded-3xl border border-[#E4EAFB] bg-white shadow-[0_12px_40px_rgba(0,15,62,0.08)]">
          <div className="border-b border-[#EDF1FA] px-6 py-7 sm:px-9">
            {credential ? (
              <div
                className={`inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-sm font-semibold ${
                  isValid
                    ? "bg-[#E8F9EF] text-[#16884C]"
                    : isRevoked
                      ? "bg-[#FDEDEE] text-[#C92D3B]"
                      : "bg-amber-50 text-amber-800"
                }`}
              >
                {isValid ? (
                  <ShieldCheck className="h-4 w-4" />
                ) : (
                  <ShieldAlert className="h-4 w-4" />
                )}
                {statusLabel(credential.status)}
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-full bg-[#F0F3FC] px-3.5 py-2 text-sm font-semibold text-[#4A5578]">
                {error ? (
                  <ShieldAlert className="h-4 w-4" />
                ) : (
                  <LoaderCircle className="h-4 w-4 animate-spin" />
                )}
                {error ? "Verification unavailable" : "Verifying credential"}
              </div>
            )}

            {credential && (
              <>
                <h2 className="mt-5 text-2xl font-semibold text-[#000F3E]">
                  {credential.credential.title}
                </h2>
                <p className="mt-1 text-[#6B7494]">
                  {credential.credential.institutionName ?? "Issuing institution"}
                </p>
                {credential.credential.recipientName && (
                  <p className="mt-1 text-sm text-[#6B7494]">{credential.credential.recipientName}</p>
                )}
              </>
            )}
          </div>

          <div className="grid gap-6 px-6 py-7 sm:grid-cols-2 sm:px-9">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-[#8993B4]">
                Credential ID
              </p>
              <p className="mt-1 break-all font-medium text-[#000F3E]">
                {certificateId}
              </p>
            </div>
            {credential?.credential.issueDate && (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide text-[#8993B4]">
                  Issue date
                </p>
                <p className="mt-1 font-medium text-[#000F3E]">
                  {new Date(`${credential.credential.issueDate}T00:00:00`).toLocaleDateString()}
                </p>
              </div>
            )}
            {credential && (
              <>
                <div className="flex items-start gap-3">
                  <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#16884C]" />
                  <div>
                    <p className="font-medium text-[#000F3E]">Signed issuance proof</p>
                    <p className="mt-1 text-sm text-[#6B7494]">
                      {credential.signedProofValid ? "Signature valid" : "Signature not verified"}
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#0050F5]" />
                  <div>
                    <p className="font-medium text-[#000F3E]">Blockchain proof</p>
                    <p className="mt-1 text-sm text-[#6B7494]">
                      {credential.blockchainProofStatus === "confirmed"
                        ? "Confirmed and matched"
                        : credential.blockchainProofStatus === "pending"
                          ? "Not yet confirmed"
                          : credential.blockchainProofStatus === "mismatch"
                            ? "Proof does not match"
                            : "Not checked for this status"}
                    </p>
                  </div>
                </div>
              </>
            )}
          </div>

          {error && (
            <p role="alert" className="mx-6 mb-6 rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-700 sm:mx-9">
              {error}
            </p>
          )}

          {credential && (
            <footer className="flex flex-col gap-3 border-t border-[#EDF1FA] bg-[#FBFCFF] px-6 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-9">
              <p className="max-w-lg text-xs leading-relaxed text-[#8993B4]">
                This page shows the credential details allowed by the holder&apos;s sharing settings.
              </p>
              <div className="flex flex-wrap gap-2">
                {credential.sharing.canDownloadPdf && (
                  <button type="button" onClick={() => void downloadPdf()} className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl border border-[#DCE6FB] px-4 py-2.5 text-sm font-medium text-[#000F3E] hover:bg-[#F5F8FF]">
                    <Download className="h-4 w-4" />Download PDF
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => void copyCredentialLink()}
                  className="inline-flex shrink-0 items-center justify-center gap-2 rounded-xl bg-[#0050F5] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#0041CC]"
                >
                  <Copy className="h-4 w-4" />
                  {copied ? "Link copied" : "Copy link"}
                </button>
              </div>
            </footer>
          )}
        </section>
      </div>
    </main>
  );
}
