import {
  ArrowUpRight,
  Building2,
  CheckCircle2,
  CircleAlert,
  Clock3,
  FileCheck2,
  ShieldCheck,
  TrendingUp,
  Users,
} from "lucide-react";

const overviewStats = [
  { title: "Total Institutions", value: "126", icon: Building2, accent: "bg-sky-100 text-sky-700" },
  { title: "Verified Certificates", value: "124.6K", icon: FileCheck2, accent: "bg-emerald-100 text-emerald-700" },
  { title: "Active Users", value: "12.45K", icon: Users, accent: "bg-violet-100 text-violet-700" },
  { title: "Pending Reviews", value: "482", icon: Clock3, accent: "bg-amber-100 text-amber-700" },
];

const recentAlerts = [
  { title: "Certificate mismatch flagged", detail: "3 institutions reported irregular signatures", tag: "High priority", tone: "rose" },
  { title: "New institution onboarding", detail: "PCCOE submitted verification documents for approval", tag: "Action required", tone: "amber" },
  { title: "Verification SLA improved", detail: "Median response time reduced to 4.2 hours", tag: "Healthy", tone: "emerald" },
];

const institutionPulse = [
  { name: "PCCOE", value: 82 },
  { name: "COEP", value: 94 },
  { name: "MIT Pune", value: 76 },
  { name: "Symbiosis", value: 88 },
  { name: "VIT Pune", value: 71 },
];

export default function AdminOverview() {
  return (
    <div className="space-y-6" style={{ fontFamily: "'Figtree', sans-serif" }}>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Overview</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Platform performance</h2>
            <p className="mt-2 text-sm text-slate-600">Real-time platform metrics, trends, and alerts at a glance.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
            <TrendingUp className="h-4 w-4" />
            +18.4% vs last month
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {overviewStats.map(({ title, value,icon: Icon, accent }) => (
          <div key={title} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50">
            <div className="flex items-center justify-between">
              <div className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${accent}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-6 text-3xl font-bold tracking-tight text-slate-900">{value}</div>
            <div className="mt-1 text-sm font-medium text-slate-600">{title}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.5fr_1fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Institution engagement</h3>
              <p className="text-sm text-slate-500">Regional participation across network</p>
            </div>
            <div className="rounded-xl bg-slate-100 px-3 py-1.5 text-xs font-medium text-slate-600">Last 30 days</div>
          </div>

          <div className="mt-6 flex h-64 items-end gap-4">
            {institutionPulse.map(({ name, value }) => (
              <div key={name} className="flex flex-1 flex-col items-center gap-3">
                <div className="flex h-44 w-full items-end justify-center rounded-t-2xl bg-slate-100 p-2">
                  <div
                    className="w-full rounded-t-xl bg-linear-to-t from-sky-600 to-sky-400"
                    style={{ height: `${value}%` }}
                  />
                </div>
                <span className="text-xs font-medium text-slate-600">{name}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Operational health</h3>
              <p className="text-sm text-slate-500">Service confidence snapshot</p>
            </div>
            <ShieldCheck className="h-5 w-5 text-emerald-600" />
          </div>

          <div className="mt-6 space-y-4">
            {[
              { label: "Ledger uptime", value: "99.98%", tone: "emerald" },
              { label: "API response", value: "214ms", tone: "sky" },
              { label: "Verification jobs", value: "98.7%", tone: "violet" },
              { label: "Auth success", value: "99.92%", tone: "amber" },
            ].map(({ label, value, tone }) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="mb-2 flex items-center justify-between text-sm">
                  <span className="text-slate-600">{label}</span>
                  <span className="font-semibold text-slate-900">{value}</span>
                </div>
                <div className="h-2 rounded-full bg-slate-200">
                  <div
                    className={`h-2 rounded-full ${tone === "emerald"
                      ? "bg-emerald-500"
                      : tone === "sky"
                        ? "bg-sky-500"
                        : tone === "violet"
                          ? "bg-violet-500"
                          : "bg-amber-500"
                      }`}
                    style={{ width: tone === "emerald" ? "99%" : tone === "sky" ? "84%" : tone === "violet" ? "90%" : "88%" }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.2fr_0.8fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Recent activity</h3>
              <p className="text-sm text-slate-500">Administrative and platform actions</p>
            </div>
            <CheckCircle2 className="h-5 w-5 text-emerald-600" />
          </div>

          <div className="mt-5 space-y-3">
            {[
              ["Institution onboarding approved", "COEP Technological University", "18 minutes ago"],
              ["Certificate batch archived", "Engineering 2026 set", "2 hours ago"],
              ["User role upgraded", "Ananya Kulkarni → Verifier", "Today"],
              ["Fraud review completed", "3 suspicious transcript matches", "Yesterday"],
            ].map(([title, detail, time]) => (
              <div key={title} className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div>
                  <p className="font-medium text-slate-800">{title}</p>
                  <p className="text-sm text-slate-500">{detail}</p>
                </div>
                <span className="whitespace-nowrap text-xs font-medium text-slate-500">{time}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Priority alerts</h3>
              <p className="text-sm text-slate-500">Issues that need attention</p>
            </div>
            <CircleAlert className="h-5 w-5 text-amber-600" />
          </div>

          <div className="mt-5 space-y-3">
            {recentAlerts.map(({ title, detail, tag, tone }) => (
              <div key={title} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                <div className="flex items-center justify-between gap-3">
                  <p className="font-medium text-slate-800">{title}</p>
                  <span className={`rounded-full px-2 py-1 text-[10px] font-semibold ${tone === "rose" ? "bg-rose-100 text-rose-700" : tone === "amber" ? "bg-amber-100 text-amber-700" : "bg-emerald-100 text-emerald-700"}`}>
                    {tag}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-500">{detail}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
