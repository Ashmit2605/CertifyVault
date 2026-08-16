import { CalendarRange, Download, Search, ShieldCheck, UserCog } from "lucide-react";

const logs = [
  { action: "User role updated", user: "Admin User", actor: "Platform-admin", time: "09:42 AM", ip: "10.4.12.21", result: "Success" },
  { action: "Institution approval granted", user: "COEP Technological University", actor: "Review Team", time: "08:18 AM", ip: "10.4.17.56", result: "Success" },
  { action: "Certificate batch revoked", user: "Engineering 2026", actor: "Security admin", time: "Yesterday", ip: "10.4.9.40", result: "Success" },
  { action: "Suspicious activity report reviewed", user: "MIT Pune", actor: "Fraud desk", time: "Yesterday", ip: "10.4.21.11", result: "Escalated" },
  { action: "Password reset requested", user: "Rahul Sharma", actor: "Self-service", time: "Mon", ip: "10.4.7.9", result: "Success" },
];

const resultClasses: Record<string, string> = {
  Success: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Escalated: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
};

export default function AdminAudit() {
  return (
    <div className="space-y-6" style={{ fontFamily: "'Figtree', sans-serif" }}>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Audit Logs</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Admin and platform activity trail</h2>
            <p className="mt-2 text-sm text-slate-600">Review who changed what, when, and from which device or network.</p>
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Download className="h-4 w-4" />
              Export
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800">
              <ShieldCheck className="h-4 w-4" />
              Review log
            </button>
          </div>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
            <Search className="h-4 w-4 text-slate-400" />
            <input placeholder="Search audit events..." className="w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" />
          </div>
          <div className="flex gap-2">
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <CalendarRange className="h-4 w-4" />
              Date range
            </button>
            <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <UserCog className="h-4 w-4" />
              Actor filter
            </button>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
          <table className="min-w-full divide-y divide-slate-200 text-left">
            <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
              <tr>
                <th className="px-4 py-4">Action</th>
                <th className="px-4 py-4">Target</th>
                <th className="px-4 py-4">Actor</th>
                <th className="px-4 py-4">Time</th>
                <th className="px-4 py-4">IP</th>
                <th className="px-4 py-4">Result</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 bg-white text-sm text-slate-700">
              {logs.map((log) => (
                <tr key={`${log.action}-${log.time}`} className="hover:bg-slate-50/80">
                  <td className="px-4 py-4 font-medium text-slate-800">{log.action}</td>
                  <td className="px-4 py-4 text-slate-600">{log.user}</td>
                  <td className="px-4 py-4 text-slate-600">{log.actor}</td>
                  <td className="px-4 py-4 text-slate-600">{log.time}</td>
                  <td className="px-4 py-4 font-mono text-slate-500">{log.ip}</td>
                  <td className="px-4 py-4">
                    <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${resultClasses[log.result]}`}>
                      {log.result}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
