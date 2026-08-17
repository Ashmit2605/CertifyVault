import { Activity, ArrowUpRight, Gauge, ServerCog, ShieldCheck, Zap } from "lucide-react";

const metrics = [
  { label: "Uptime", value: "99.98%", detail: "Last 30 days", tone: "emerald" },
  { label: "API latency", value: "214ms", detail: "Median response", tone: "sky" },
  { label: "CPU load", value: "52%", detail: "Across services", tone: "amber" },
  { label: "Failed jobs", value: "7", detail: "Auto-recovered", tone: "violet" },
];

const services = [
  { name: "Identity Service", status: "Healthy", uptime: "99.99%", latency: "176ms" },
  { name: "Certificate API", status: "Healthy", uptime: "99.97%", latency: "243ms" },
  { name: "Verification Queue", status: "Warning", uptime: "98.8%", latency: "491ms" },
  { name: "Blockchain Sync", status: "Healthy", uptime: "99.95%", latency: "201ms" },
];

const statusClasses: Record<string, string> = {
  Healthy: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Warning: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
};

export default function AdminHealth() {
  return (
    <div className="space-y-6" style={{ fontFamily: "'Figtree', sans-serif" }}>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">System Health</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Platform infrastructure</h2>
            <p className="mt-2 text-sm text-slate-600">Track service uptime, latency, and operational health across the platform.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {metrics.map(({ label, value, detail, tone }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50">
            <div className="flex items-center justify-between">
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${tone === "emerald" ? "bg-emerald-100 text-emerald-700" : tone === "sky" ? "bg-sky-100 text-sky-700" : tone === "amber" ? "bg-amber-100 text-amber-700" : "bg-violet-100 text-violet-700"}`}>
                {tone === "emerald" ? <Activity className="h-5 w-5" /> : tone === "sky" ? <Gauge className="h-5 w-5" /> : tone === "amber" ? <Zap className="h-5 w-5" /> : <ServerCog className="h-5 w-5" />}
              </div>
            </div>
            <div className="mt-5 text-3xl font-bold tracking-tight text-slate-900">{value}</div>
            <div className="mt-1 text-sm font-medium text-slate-600">{label}</div>
            <div className="mt-2 text-xs text-slate-500">{detail}</div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-900">Service status</h3>
            <p className="text-sm text-slate-500">Current health of critical infrastructure</p>
          </div>
          <button className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50">
            Refresh checks
          </button>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              <tr>
                <th className="px-4 py-4">Service</th>
                <th className="px-4 py-4">Status</th>
                <th className="px-4 py-4">Uptime</th>
                <th className="px-4 py-4">Latency</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white text-sm text-slate-700">
              {services.map((service) => (
                <tr key={service.name} className="hover:bg-slate-50/80">
                  <td className="px-4 py-4 font-medium text-slate-800">{service.name}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[service.status]}`}>
                      {service.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-slate-600">{service.uptime}</td>
                  <td className="px-4 py-4 text-slate-600">{service.latency}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
