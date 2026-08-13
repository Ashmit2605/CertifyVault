import { useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ShieldCheck, ShieldAlert, CheckCircle2, XCircle, AlertTriangle } from "lucide-react";
import { PageHeader } from "../../../Pages/IssuerDashLayout/IssuerDashLayout";
import StatCard from "../Dashboard/StatCard";

/* ══════════════════════════════════════════════════════
   1. TYPES & MOCK DATA
   Answers: "Who is checking our certificates?"
   ══════════════════════════════════════════════════════ */

type VerificationResult = "Successful" | "Failed" | "Suspicious";

interface VerificationRecord {
  id: string;
  verifiedBy: string;
  date: string;
  result: VerificationResult;
  risk: number;
}

// 🔧 Replace with GET /api/issuer/verifications
const MOCK_VERIFICATIONS: VerificationRecord[] = [
  { id: "CERT-2026-00521", verifiedBy: "TCS", date: "12 Aug 2026, 10:15 AM", result: "Successful", risk: 8 },
  { id: "CERT-2026-00498", verifiedBy: "Infosys", date: "12 Aug 2026, 09:40 AM", result: "Successful", risk: 5 },
  { id: "CERT-2026-00490", verifiedBy: "Wipro", date: "11 Aug 2026, 04:22 PM", result: "Suspicious", risk: 68 },
  { id: "CERT-2026-00475", verifiedBy: "Accenture", date: "11 Aug 2026, 02:10 PM", result: "Failed", risk: 91 },
  { id: "CERT-2026-00460", verifiedBy: "TCS", date: "10 Aug 2026, 11:05 AM", result: "Successful", risk: 3 },
  { id: "CERT-2026-00452", verifiedBy: "Capgemini", date: "10 Aug 2026, 09:12 AM", result: "Failed", risk: 84 },
];

const TABS = ["Recent Verifications", "Successful", "Failed", "Suspicious"] as const;
type Tab = (typeof TABS)[number];

/* ══════════════════════════════════════════════════════
   2. SMALL UI PIECES
   ══════════════════════════════════════════════════════ */

const resultStyles: Record<VerificationResult, string> = {
  Successful: "bg-emerald-50 text-emerald-600",
  Failed: "bg-rose-50 text-rose-500",
  Suspicious: "bg-amber-50 text-amber-600",
};

const resultIcons: Record<VerificationResult, ReactNode> = {
  Successful: <CheckCircle2 size={13} />,
  Failed: <XCircle size={13} />,
  Suspicious: <AlertTriangle size={13} />,
};

function ResultPill({ result }: { result: VerificationResult }) {
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold ${resultStyles[result]}`}>
      {resultIcons[result]} {result}
    </span>
  );
}

function riskColor(risk: number) {
  if (risk >= 70) return "text-rose-500";
  if (risk >= 40) return "text-amber-600";
  return "text-emerald-600";
}

function Tabs({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <div className="flex gap-1 p-1 rounded-xl bg-brand-light w-fit mb-5 flex-wrap">
      {TABS.map((t) => (
        <button
          key={t}
          onClick={() => onChange(t)}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
            active === t ? "bg-brand text-white" : "text-navy hover:bg-white/60"
          }`}
        >
          {t}
        </button>
      ))}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   3. VERIFICATION PAGE (default export — route: /issuerdashboard/verification)
   ══════════════════════════════════════════════════════ */

export default function Verification() {
  const [tab, setTab] = useState<Tab>("Recent Verifications");

  const filtered = useMemo(() => {
    if (tab === "Recent Verifications") return MOCK_VERIFICATIONS;
    return MOCK_VERIFICATIONS.filter((v) => v.result === tab);
  }, [tab]);

  const counts = {
    total: MOCK_VERIFICATIONS.length,
    successful: MOCK_VERIFICATIONS.filter((v) => v.result === "Successful").length,
    failed: MOCK_VERIFICATIONS.filter((v) => v.result === "Failed").length,
    suspicious: MOCK_VERIFICATIONS.filter((v) => v.result === "Suspicious").length,
  };

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={ShieldCheck} label="Total Verifications" value={counts.total} />
        <StatCard icon={CheckCircle2} label="Successful" value={counts.successful} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <StatCard icon={XCircle} label="Failed" value={counts.failed} iconBg="bg-rose-50" iconColor="text-rose-500" />
        <StatCard icon={ShieldAlert} label="Suspicious" value={counts.suspicious} iconBg="bg-amber-50" iconColor="text-amber-600" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <PageHeader
          title="Verification"
          description="See who is checking your certificates, and how those checks turn out."
        />

        <div className="p-6">
          <Tabs active={tab} onChange={setTab} />

          <div className="rounded-xl border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse">
                <thead>
                  <tr className="bg-brand-light">
                    <th className="text-left px-5 py-3 text-xs font-semibold text-navy">Certificate ID</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-navy">Verified By</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-navy">Date</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-navy">Result</th>
                    <th className="text-left px-5 py-3 text-xs font-semibold text-navy">Risk Score</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((v) => (
                    <tr key={v.id} className="border-t border-slate-100">
                      <td className="px-5 py-3.5 font-semibold text-navy">{v.id}</td>
                      <td className="px-5 py-3.5 text-slate-600">{v.verifiedBy}</td>
                      <td className="px-5 py-3.5 text-slate-500">{v.date}</td>
                      <td className="px-5 py-3.5"><ResultPill result={v.result} /></td>
                      <td className={`px-5 py-3.5 font-semibold ${riskColor(v.risk)}`}>{v.risk}/100</td>
                    </tr>
                  ))}
                  {filtered.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center py-10 text-sm text-slate-400">
                        No verifications in this category yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-4">
            Only the fields required for verification integrity are retained here. Verifier contact details
            beyond organization name follow your data retention policy.
          </p>
        </div>
      </div>
    </div>
  );
}