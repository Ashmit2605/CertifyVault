import { useMemo, useState } from "react";
import {
  Search, ChevronDown, Download, CheckCircle2, XCircle, Monitor,
} from "lucide-react";
import { PageHeader } from "../../../Pages/IssuerDashLayout/IssuerDashLayout";

/* ══════════════════════════════════════════════════════
   1. TYPES & MOCK DATA
   "For a serious product, this is important."
   ══════════════════════════════════════════════════════ */

type LogResult = "Success" | "Failed";

interface AuditLogEntry {
  id: string;
  who: string;        // WHO
  what: string;        // WHAT
  when: string;        // WHEN
  ip: string;
  device: string;      // IP / DEVICE
  result: LogResult;   // RESULT
}

// 🔧 Replace with GET /api/issuer/audit-logs
const MOCK_LOGS: AuditLogEntry[] = [
  { id: "LOG-9001", who: "Admin A", what: "Issued certificate CV-2026-1023", when: "12 Aug 2026, 10:42 AM", ip: "203.0.113.42", device: "Chrome · Windows", result: "Success" },
  { id: "LOG-9000", who: "Admin B", what: "Revoked certificate CV-2026-0981", when: "12 Aug 2026, 11:13 AM", ip: "198.51.100.7", device: "Safari · macOS", result: "Success" },
  { id: "LOG-8998", who: "Admin A", what: "Updated Degree Certificate template", when: "12 Aug 2026, 09:20 AM", ip: "203.0.113.42", device: "Chrome · Windows", result: "Success" },
  { id: "LOG-8991", who: "Unknown", what: "Login attempt", when: "11 Aug 2026, 11:58 PM", ip: "45.33.12.90", device: "Chrome · Android", result: "Failed" },
  { id: "LOG-8987", who: "Admin C", what: "Added student Rohan Mehta", when: "11 Aug 2026, 04:05 PM", ip: "192.0.2.15", device: "Edge · Windows", result: "Success" },
  { id: "LOG-8980", who: "Admin B", what: "Changed verification retention settings", when: "11 Aug 2026, 02:30 PM", ip: "198.51.100.7", device: "Safari · macOS", result: "Success" },
  { id: "LOG-8975", who: "Admin A", what: "Exported analytics report", when: "10 Aug 2026, 11:47 AM", ip: "203.0.113.42", device: "Chrome · Windows", result: "Success" },
  { id: "LOG-8970", who: "Admin C", what: "Login attempt", when: "10 Aug 2026, 09:02 AM", ip: "192.0.2.15", device: "Edge · Windows", result: "Failed" },
];

const ACTION_FILTERS = ["All actions", "Issued", "Revoked", "Login", "Settings", "Template", "Student", "Export"] as const;
const RESULT_FILTERS = ["All results", "Success", "Failed"] as const;

function actionCategory(what: string) {
  if (/issued/i.test(what)) return "Issued";
  if (/revoked/i.test(what)) return "Revoked";
  if (/login/i.test(what)) return "Login";
  if (/settings/i.test(what)) return "Settings";
  if (/template/i.test(what)) return "Template";
  if (/student/i.test(what)) return "Student";
  if (/export/i.test(what)) return "Export";
  return "Other";
}

/* ══════════════════════════════════════════════════════
   2. SMALL UI PIECES
   ══════════════════════════════════════════════════════ */

function ResultPill({ result }: { result: LogResult }) {
  return result === "Success" ? (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">
      <CheckCircle2 size={13} /> Success
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-500">
      <XCircle size={13} /> Failed
    </span>
  );
}

function Dropdown<T extends string>({
  value, options, onChange,
}: {
  value: T;
  options: readonly T[];
  onChange: (v: T) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as T)}
        className="pl-3 pr-8 py-2 rounded-lg bg-brand-light text-sm font-medium text-navy outline-none appearance-none cursor-pointer"
      >
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
      <ChevronDown size={14} className="absolute right-2.5 top-2.5 text-slate-400 pointer-events-none" />
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   3. AUDIT LOGS PAGE (default export — route: /issuerdashboard/audit-logs)
   ══════════════════════════════════════════════════════ */

export default function AuditLogs() {
  const [query, setQuery] = useState("");
  const [actionFilter, setActionFilter] = useState<(typeof ACTION_FILTERS)[number]>("All actions");
  const [resultFilter, setResultFilter] = useState<(typeof RESULT_FILTERS)[number]>("All results");

  const filtered = useMemo(() => {
    return MOCK_LOGS.filter((log) => {
      const matchesQuery =
        query.trim() === "" ||
        log.who.toLowerCase().includes(query.toLowerCase()) ||
        log.what.toLowerCase().includes(query.toLowerCase());
      const matchesAction = actionFilter === "All actions" || actionCategory(log.what) === actionFilter;
      const matchesResult = resultFilter === "All results" || log.result === resultFilter;
      return matchesQuery && matchesAction && matchesResult;
    });
  }, [query, actionFilter, resultFilter]);

  const handleExport = () => {
    // 🔧 Replace with a real CSV export — either build it client-side from `filtered`
    // or call GET /api/issuer/audit-logs/export for a server-generated file.
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <PageHeader
        title="Audit Logs"
        description="A complete, tamper-evident record of who did what on your account."
        action={{ label: "Export CSV", icon: <Download size={16} />, onClick: handleExport }}
      />

      <div className="p-6">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by admin or action…"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-brand-light text-sm text-navy outline-none"
            />
          </div>
          <Dropdown value={actionFilter} options={ACTION_FILTERS} onChange={setActionFilter} />
          <Dropdown value={resultFilter} options={RESULT_FILTERS} onChange={setResultFilter} />
        </div>

        <div className="rounded-xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-brand-light">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy">Who</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy">What</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy">When</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy">IP / Device</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy">Result</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((log) => (
                  <tr key={log.id} className="border-t border-slate-100">
                    <td className="px-5 py-3.5 font-semibold text-navy whitespace-nowrap">{log.who}</td>
                    <td className="px-5 py-3.5 text-slate-600">{log.what}</td>
                    <td className="px-5 py-3.5 text-slate-500 whitespace-nowrap">{log.when}</td>
                    <td className="px-5 py-3.5 text-slate-500">
                      <div className="flex items-center gap-1.5 whitespace-nowrap">
                        <Monitor size={13} className="text-slate-400" />
                        {log.ip} · {log.device}
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <ResultPill result={log.result} />
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={5} className="text-center py-10 text-sm text-slate-400">
                      No matching log entries.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        <p className="text-xs text-slate-400 mt-4">
          Showing {filtered.length} of {MOCK_LOGS.length} entries. Audit logs are retained per your compliance
          policy and cannot be edited or deleted from this view.
        </p>
      </div>
    </div>
  );
}