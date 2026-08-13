import { useState } from "react";
import {
  Link2,
  QrCode,
  Copy,
  Ban,
  ChevronRight,
  Check,
} from "lucide-react";

type ShareMode = "anyone" | "specific";

const ACTIVE_SHARES = [
  {
    employer: "ABC Technologies",
    purpose: "Job Application",
    created: "12 Aug 2026",
    expires: "19 Aug 2026",
    status: "Active" as const,
  },
  {
    employer: "XYZ Corporation",
    purpose: "Background Verification",
    created: "1 Aug 2026",
    expires: "8 Aug 2026",
    status: "Expired" as const,
  },
];

const DISCLOSURE_FIELDS = [
  { label: "Degree", defaultOn: true },
  { label: "Institution", defaultOn: true },
  { label: "Issue date", defaultOn: true },
  { label: "Verification status", defaultOn: true },
  { label: "Personal address", defaultOn: false },
  { label: "Phone number", defaultOn: false },
];

export default function Share() {
  const [mode, setMode] = useState<ShareMode>("specific");
  const [expiry, setExpiry] = useState("7");
  const [linkGenerated, setLinkGenerated] = useState(false);
  const [copied, setCopied] = useState(false);

  const generatedLink = "certifyvault.com/share/8fK92xLq71QmP4";

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <main className="mx-auto max-w-[900px] px-6 py-8 lg:px-10">
        <p className="mb-5 flex items-center gap-1.5 text-[13px] text-[#8993B4]">
          B.E. Computer Engineering <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-[#000F3E]">Share Certificate</span>
        </p>

        <h1 className="mb-1 text-[24px] font-semibold tracking-tight text-[#000F3E]">
          Share Certificate
        </h1>
        <p className="mb-7 text-[14px] text-[#6B7494]">
          Generate a secure, verifiable link instead of sending a plain PDF.
        </p>

        {/* Who are you sharing with */}
        <div className="rounded-2xl border border-[#EAF1FF] bg-white p-7 shadow-[0_1px_2px_rgba(0,15,62,0.04)]">
          <p className="mb-4 text-[13px] font-semibold uppercase tracking-wide text-[#8993B4]">
            Who are you sharing with?
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              onClick={() => setMode("anyone")}
              className={`rounded-xl border p-4 text-left transition-colors ${
                mode === "anyone"
                  ? "border-[#0050F5] bg-[#EAF1FF]"
                  : "border-[#E4EAFB] bg-white hover:bg-[#F5F8FF]"
              }`}
            >
              <p className="text-[14px] font-semibold text-[#000F3E]">
                Anyone with the link
              </p>
              <p className="mt-1 text-[12.5px] text-[#6B7494]">
                No specific recipient required
              </p>
            </button>
            <button
              onClick={() => setMode("specific")}
              className={`rounded-xl border p-4 text-left transition-colors ${
                mode === "specific"
                  ? "border-[#0050F5] bg-[#EAF1FF]"
                  : "border-[#E4EAFB] bg-white hover:bg-[#F5F8FF]"
              }`}
            >
              <p className="text-[14px] font-semibold text-[#000F3E]">
                Specific employer
              </p>
              <p className="mt-1 text-[12.5px] text-[#6B7494]">
                Track purpose, expiry &amp; access
              </p>
            </button>
          </div>

          {mode === "specific" && (
            <div className="mt-5 grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div>
                <label className="text-[12.5px] font-medium text-[#4A5578]">
                  Employer
                </label>
                <input
                  defaultValue="ABC Technologies"
                  className="mt-1.5 w-full rounded-xl border border-[#E4EAFB] bg-[#F7F9FF] px-3.5 py-2.5 text-[13.5px] text-[#000F3E] focus:border-[#0050F5] focus:outline-none"
                />
              </div>
              <div>
                <label className="text-[12.5px] font-medium text-[#4A5578]">
                  Purpose
                </label>
                <input
                  defaultValue="Job Application"
                  className="mt-1.5 w-full rounded-xl border border-[#E4EAFB] bg-[#F7F9FF] px-3.5 py-2.5 text-[13.5px] text-[#000F3E] focus:border-[#0050F5] focus:outline-none"
                />
              </div>
            </div>
          )}

          <div className="mt-4">
            <label className="text-[12.5px] font-medium text-[#4A5578]">
              Link expiry
            </label>
            <div className="mt-1.5 flex flex-wrap gap-2">
              {["1", "7", "14", "30"].map((d) => (
                <button
                  key={d}
                  onClick={() => setExpiry(d)}
                  className={`rounded-lg px-3.5 py-2 text-[13px] font-medium ${
                    expiry === d
                      ? "bg-[#0050F5] text-white"
                      : "border border-[#E4EAFB] bg-white text-[#4A5578] hover:bg-[#F5F8FF]"
                  }`}
                >
                  {d} days
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Selective disclosure */}
        <div className="mt-5 rounded-2xl border border-[#EAF1FF] bg-white p-7 shadow-[0_1px_2px_rgba(0,15,62,0.04)]">
          <p className="mb-1 text-[13px] font-semibold uppercase tracking-wide text-[#8993B4]">
            What do you want to share?
          </p>
          <p className="mb-4 text-[12.5px] text-[#9AA3C2]">
            Selective disclosure — choose exactly what the verifier can see.
          </p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {DISCLOSURE_FIELDS.map((f) => (
              <label
                key={f.label}
                className="flex items-center gap-3 rounded-xl border border-[#F0F3FC] px-4 py-3"
              >
                <input
                  type="checkbox"
                  defaultChecked={f.defaultOn}
                  className="h-4 w-4 rounded accent-[#0050F5]"
                />
                <span className="text-[13.5px] text-[#000F3E]">{f.label}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Generate */}
        {!linkGenerated ? (
          <button
            onClick={() => setLinkGenerated(true)}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-[#0050F5] py-3.5 text-[14.5px] font-semibold text-white hover:bg-[#0041CC]"
          >
            <Link2 className="h-4.5 w-4.5" />
            Generate Secure Link
          </button>
        ) : (
          <div className="mt-6 rounded-2xl border border-[#EAF1FF] bg-white p-7 shadow-[0_1px_2px_rgba(0,15,62,0.04)]">
            <p className="mb-4 text-[13px] font-semibold uppercase tracking-wide text-[#8993B4]">
              Secure Verification Link
            </p>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              <div className="flex flex-1 items-center justify-between gap-3 rounded-xl bg-[#F7F9FF] px-4 py-3">
                <span className="truncate text-[13.5px] font-medium text-[#000F3E]">
                  {generatedLink}
                </span>
                <button
                  onClick={handleCopy}
                  className="flex shrink-0 items-center gap-1.5 text-[13px] font-medium text-[#0050F5]"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" /> Copied
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" /> Copy Link
                    </>
                  )}
                </button>
              </div>
              <button className="flex items-center justify-center gap-2 rounded-xl border border-[#DCE6FB] px-4 py-3 text-[13.5px] font-medium text-[#000F3E] hover:bg-[#F5F8FF]">
                <QrCode className="h-4 w-4 text-[#0050F5]" />
                Generate QR
              </button>
            </div>
            <p className="mt-3 text-[12.5px] text-[#9AA3C2]">
              Expires {expiry === "1" ? "in 1 day" : `in ${expiry} days`} · CV-VERIFY-8A72K9
            </p>
          </div>
        )}

        {/* Active shares */}
        <div className="mb-10 mt-8">
          <p className="mb-4 text-[13px] font-semibold uppercase tracking-wide text-[#8993B4]">
            Active Shares
          </p>
          <div className="flex flex-col gap-3">
            {ACTIVE_SHARES.map((s, i) => (
              <div
                key={i}
                className="flex flex-col gap-3 rounded-2xl border border-[#EAF1FF] bg-white p-5 shadow-[0_1px_2px_rgba(0,15,62,0.04)] sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <p className="text-[14px] font-semibold text-[#000F3E]">
                    {s.employer}
                  </p>
                  <p className="text-[12.5px] text-[#6B7494]">
                    {s.purpose} · Created {s.created}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span
                    className={`rounded-full px-3 py-1 text-[12px] font-medium ${
                      s.status === "Active"
                        ? "bg-[#E8F9EF] text-[#1AAE5F]"
                        : "bg-[#F0F3FC] text-[#9AA3C2]"
                    }`}
                  >
                    {s.status === "Active" ? `Expires ${s.expires}` : "Expired"}
                  </span>
                  {s.status === "Active" && (
                    <button className="flex items-center gap-1.5 rounded-lg border border-[#F6D6D7] px-3 py-1.5 text-[12.5px] font-medium text-[#E5484D] hover:bg-[#FDEDEE]">
                      <Ban className="h-3.5 w-3.5" />
                      Revoke Access
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
  );
}