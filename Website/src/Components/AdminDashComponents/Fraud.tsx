import { BellRing, Eye, ShieldAlert, ShieldCheck } from "lucide-react";

const alerts = [
  { type: "Suspicious certificate match", level: "High", institution: "MIT Pune", description: "Duplicate transcript signatures detected across 4 records.", time: "12 min ago" },
  { type: "Identity anomaly", level: "Medium", institution: "PCCOE", description: "User account was accessed from an unrecognized device region.", time: "39 min ago" },
  { type: "Document tampering report", level: "High", institution: "COEP", description: "Hash mismatch was found after issuance update.", time: "2 hours ago" },
  { type: "Issuer verification alert", level: "Low", institution: "VIT Pune", description: "A new issuer profile is pending external validation checks.", time: "Today" },
];

const securityScore = [
  { label: "Threat detection", value: "96%", tone: "emerald" },
  { label: "Identity protection", value: "92%", tone: "sky" },
  { label: "Policy compliance", value: "89%", tone: "violet" },
  { label: "False positive rate", value: "2.4%", tone: "amber" },
];

const statusTone: Record<string, string> = {
  High: "bg-rose-100 text-rose-700",
  Medium: "bg-amber-100 text-amber-700",
  Low: "bg-sky-100 text-sky-700",
};

export default function AdminFraud() {
  return (
    <div className="space-y-6" style={{ fontFamily: "'Figtree', sans-serif" }}>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
        <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Fraud & Security</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Security operations</h2>
            <p className="mt-2 text-sm text-slate-600">Track suspicious activity, policy alerts, and fraud investigations in real time.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {securityScore.map(({ label, value, tone }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50">
            <div className="flex items-center justify-between">
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${tone === "emerald" ? "bg-emerald-100 text-emerald-700" : tone === "sky" ? "bg-sky-100 text-sky-700" : tone === "violet" ? "bg-violet-100 text-violet-700" : "bg-amber-100 text-amber-700"}`}>
                <ShieldCheck className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-5 text-3xl font-bold tracking-tight text-slate-900">{value}</div>
            <div className="mt-1 text-sm font-medium text-slate-600">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.25fr_0.75fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Recent alerts</h3>
              <p className="text-sm text-slate-500">Examples of flagged events requiring review</p>
            </div>
            <ShieldAlert className="h-5 w-5 text-rose-600" />
          </div>

          <div className="mt-5 space-y-3">
            {alerts.map((alert) => (
              <div key={alert.type} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="font-semibold text-slate-800">{alert.type}</p>
                    <p className="mt-1 text-sm text-slate-500">{alert.description}</p>
                  </div>
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${statusTone[alert.level]}`}>
                    {alert.level}
                  </span>
                </div>
                <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                  <span>{alert.institution}</span>
                  <span>{alert.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Investigations</h3>
              <p className="text-sm text-slate-500">Current case load</p>
            </div>
            <Eye className="h-5 w-5 text-sky-600" />
          </div>

          <div className="mt-5 space-y-4">
            {[
              { label: "Open cases", value: "23", detail: "Across 6 institutions" },
              { label: "Resolved this week", value: "18", detail: "74% closure rate" },
              { label: "Escalations", value: "6", detail: "2 high-priority" },
            ].map(({ label, value, detail }) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-slate-600">{label}</span>
                  <span className="text-2xl font-bold text-slate-900">{value}</span>
                </div>
                <div className="mt-2 text-xs text-slate-500">{detail}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
