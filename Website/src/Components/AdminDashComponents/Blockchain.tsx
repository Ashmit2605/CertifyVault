import { Activity, Blocks, CheckCircle2, Cpu, Database, ShieldCheck, TrendingUp } from "lucide-react";

const nodeStats = [
  { label: "Network health", value: "99.98%", icon: Activity, tone: "emerald" },
  { label: "Avg block time", value: "2.3s", icon: Blocks, tone: "sky" },
  { label: "Validators", value: "18", icon: Cpu, tone: "violet" },
  { label: "Ledger size", value: "3.8 TB", icon: Database, tone: "amber" },
];

const recentBlocks = [
  { height: "3,284,912", hash: "0x7E2C…50AF", txn: "142", status: "Finalized" },
  { height: "3,284,911", hash: "0x8A4F…1C8D", txn: "124", status: "Finalized" },
  { height: "3,284,910", hash: "0xCC84…E1F5", txn: "156", status: "Pending" },
  { height: "3,284,909", hash: "0x5B27…AA0D", txn: "98", status: "Finalized" },
];

const statusClasses: Record<string, string> = {
  Finalized: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
};

export default function AdminBlockchain() {
  return (
    <div className="space-y-6" style={{ fontFamily: "'Figtree', sans-serif" }}>
      <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm shadow-slate-200/50">
        <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Blockchain</p>
            <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">Distributed ledger</h2>
            <p className="mt-2 text-sm text-slate-600">Monitor network health, validator performance, and the latest chain activity.</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
        {nodeStats.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm shadow-slate-200/50">
            <div className="flex items-center justify-between">
              <div className={`inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl flex-shrink-0 ${tone === "emerald" ? "bg-emerald-100 text-emerald-700" : tone === "sky" ? "bg-sky-100 text-sky-700" : tone === "violet" ? "bg-violet-100 text-violet-700" : "bg-amber-100 text-amber-700"}`}>
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>
            <div className="mt-4 sm:mt-5 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">{value}</div>
            <div className="mt-1 text-xs sm:text-sm font-medium text-slate-600">{label}</div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm shadow-slate-200/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Latest blocks</h3>
              <p className="text-sm text-slate-500">Most recent ledger entries</p>
            </div>
            <ShieldCheck className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          </div>

          <div className="mt-5 overflow-x-auto rounded-2xl border border-slate-200">
            <table className="min-w-[520px] w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                <tr>
                  <th className="whitespace-nowrap px-4 py-4">Height</th>
                  <th className="whitespace-nowrap px-4 py-4">Hash</th>
                  <th className="whitespace-nowrap px-4 py-4">Txns</th>
                  <th className="whitespace-nowrap px-4 py-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-sm text-slate-700">
                {recentBlocks.map((block) => (
                  <tr key={block.height} className="hover:bg-slate-50/80">
                    <td className="whitespace-nowrap px-4 py-4 font-semibold text-slate-800">{block.height}</td>
                    <td className="whitespace-nowrap px-4 py-4 font-mono text-slate-600">{block.hash}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-600">{block.txn}</td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[block.status]}`}>
                        {block.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm shadow-slate-200/50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Consensus</h3>
              <p className="text-sm text-slate-500">Node validation snapshot</p>
            </div>
            <CheckCircle2 className="h-5 w-5 text-emerald-600 flex-shrink-0" />
          </div>

          <div className="mt-5 space-y-4">
            {[
              { label: "Validator quorum", value: "18/18", measure: "Healthy" },
              { label: "Sync status", value: "100%", measure: "Synchronized" },
              { label: "Failed nodes", value: "0", measure: "No issues" },
            ].map(({ label, value, measure }) => (
              <div key={label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-sm text-slate-600">{label}</span>
                  <span className="text-lg font-bold text-slate-900">{value}</span>
                </div>
                <div className="mt-2 text-xs font-medium text-emerald-700">{measure}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}