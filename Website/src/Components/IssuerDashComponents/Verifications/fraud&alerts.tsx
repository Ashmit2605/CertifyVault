import { useMemo, useState } from "react";
import type { ElementType } from "react";
import {
  ShieldAlert, AlertTriangle, ShieldCheck, Link as LinkIcon, Fingerprint,
  ImageOff, FileWarning,
} from "lucide-react";
import { PageHeader } from "../../../Pages/IssuerDashLayout/IssuerDashLayout";
import StatCard from "../Dashboard/StatCard";

/* ══════════════════════════════════════════════════════
   1. TYPES & MOCK DATA
   This is where your AI system becomes visible to the issuer.
   ══════════════════════════════════════════════════════ */

type FlagLevel = "warn" | "critical";
type AlertStatus = "Investigation" | "Resolved";

interface Flag {
  level: FlagLevel;
  text: string;
}

interface FraudAlert {
  id: string;
  risk: number;
  status: AlertStatus;
  flags: Flag[];
}

// 🔧 Replace with GET /api/issuer/fraud-alerts (from your blockchain/AI service)
const MOCK_ALERTS: FraudAlert[] = [
  {
    id: "CV-2026-00982",
    risk: 21,
    status: "Investigation",
    flags: [
      { level: "warn", text: "OCR mismatch" },
      { level: "critical", text: "Certificate ID not found" },
      { level: "critical", text: "Blockchain hash mismatch" },
      { level: "warn", text: "Possible image manipulation" },
    ],
  },
  {
    id: "CV-2026-00975",
    risk: 78,
    status: "Investigation",
    flags: [
      { level: "critical", text: "Blockchain hash mismatch" },
      { level: "critical", text: "Issuer signature invalid" },
    ],
  },
  {
    id: "CV-2026-00963",
    risk: 52,
    status: "Resolved",
    flags: [{ level: "warn", text: "OCR mismatch" }],
  },
  {
    id: "CV-2026-00944",
    risk: 12,
    status: "Resolved",
    flags: [{ level: "warn", text: "Possible image manipulation" }],
  },
];

function riskLevel(risk: number): "High" | "Medium" | "Low" {
  if (risk >= 70) return "High";
  if (risk >= 40) return "Medium";
  return "Low";
}

function riskColors(risk: number) {
  if (risk >= 70) return { text: "text-rose-500", bar: "bg-rose-500" };
  if (risk >= 40) return { text: "text-amber-600", bar: "bg-amber-500" };
  return { text: "text-emerald-600", bar: "bg-emerald-500" };
}

function flagIcon(text: string): ElementType {
  if (/blockchain/i.test(text)) return LinkIcon;
  if (/ocr/i.test(text)) return Fingerprint;
  if (/image/i.test(text)) return ImageOff;
  return FileWarning;
}

const TABS = ["High Risk", "Medium Risk", "Low Risk", "Investigation", "Resolved"] as const;
type Tab = (typeof TABS)[number];

/* ══════════════════════════════════════════════════════
   2. SMALL UI PIECES
   ══════════════════════════════════════════════════════ */

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

function AlertCard({ alert }: { alert: FraudAlert }) {
  const rc = riskColors(alert.risk);
  return (
    <div className="rounded-2xl border border-slate-100 bg-white p-4 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between mb-3">
        <span className="font-bold text-navy text-sm">{alert.id}</span>
        <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-brand-light text-navy">
          {alert.status}
        </span>
      </div>

      <div className="mb-3">
        <div className="flex justify-between text-xs mb-1">
          <span className="text-slate-500 font-medium">Risk Score</span>
          <span className={`font-bold ${rc.text}`}>
            {alert.risk}/100 · {riskLevel(alert.risk)}
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-brand-light overflow-hidden">
          <div className={`h-full rounded-full ${rc.bar}`} style={{ width: `${alert.risk}%` }} />
        </div>
      </div>

      <div className="space-y-1.5">
        {alert.flags.map((f, i) => {
          const Icon = flagIcon(f.text);
          return (
            <div key={i} className="flex items-center gap-2 text-sm text-slate-600">
              <Icon size={14} className={f.level === "critical" ? "text-rose-500" : "text-amber-500"} />
              {f.text}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   3. FRAUD & ALERTS PAGE (default export — route: /issuerdashboard/fraud-alerts)
   ══════════════════════════════════════════════════════ */

export default function FraudAlerts() {
  const [tab, setTab] = useState<Tab>("High Risk");

  const filtered = useMemo(() => {
    if (tab === "Investigation" || tab === "Resolved") {
      return MOCK_ALERTS.filter((a) => a.status === tab);
    }
    const level = tab.split(" ")[0];
    return MOCK_ALERTS.filter((a) => riskLevel(a.risk) === level);
  }, [tab]);

  const counts = {
    high: MOCK_ALERTS.filter((a) => riskLevel(a.risk) === "High").length,
    medium: MOCK_ALERTS.filter((a) => riskLevel(a.risk) === "Medium").length,
    low: MOCK_ALERTS.filter((a) => riskLevel(a.risk) === "Low").length,
  };

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard icon={ShieldAlert} label="High Risk" value={counts.high} iconBg="bg-rose-50" iconColor="text-rose-500" />
        <StatCard icon={AlertTriangle} label="Medium Risk" value={counts.medium} iconBg="bg-amber-50" iconColor="text-amber-600" />
        <StatCard icon={ShieldCheck} label="Low Risk" value={counts.low} iconBg="bg-emerald-50" iconColor="text-emerald-600" />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <PageHeader title="Fraud & Alerts" description="Where CertifyVault's AI flags certificates that look off." />

        <div className="p-6">
          <Tabs active={tab} onChange={setTab} />

          {filtered.length === 0 ? (
            <p className="text-center py-10 text-sm text-slate-400">Nothing here right now.</p>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {filtered.map((a) => (
                <AlertCard key={a.id} alert={a} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}