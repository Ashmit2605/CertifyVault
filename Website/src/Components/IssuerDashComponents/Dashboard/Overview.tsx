import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import {
  AlertTriangle,
  Ban,
  FileText,
  Hourglass,
  ShieldCheck,
} from "lucide-react";
import StatCard from "./StatCard";
import {
  getIssuerAuditLogs,
  getIssuerCertificateStats,
  type CertificateAuditRecord,
  type IssuerCertificateStats,
} from "../../../utils/certificateApi";

const statCards = [
  { key: "total", label: "Total certificates", icon: FileText },
  { key: "issued", label: "Issued", icon: ShieldCheck, color: "text-emerald-600", bg: "bg-emerald-50" },
  { key: "pendingRegistration", label: "Pending registration", icon: Hourglass, color: "text-amber-600", bg: "bg-amber-50" },
  { key: "failedRegistration", label: "Registration failed", icon: AlertTriangle, color: "text-rose-600", bg: "bg-rose-50" },
  { key: "revoked", label: "Revoked", icon: Ban, color: "text-slate-600", bg: "bg-slate-100" },
  { key: "issuedThisMonth", label: "Issued this month", icon: FileText, color: "text-blue-600", bg: "bg-blue-50" },
] as const;

export default function Overview() {
  const { getToken } = useAuth();
  const [stats, setStats] = useState<IssuerCertificateStats | null>(null);
  const [auditLogs, setAuditLogs] = useState<CertificateAuditRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let active = true;
    void (async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("Your secure session is unavailable.");
        const [currentStats, logs] = await Promise.all([
          getIssuerCertificateStats(token),
          getIssuerAuditLogs(token),
        ]);
        if (active) {
          setStats(currentStats);
          setAuditLogs(logs);
        }
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to load issuer dashboard data.",
          );
        }
      } finally {
        if (active) setLoading(false);
      }
    })();
    return () => {
      active = false;
    };
  }, [getToken]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy">Overview</h1>
        <p className="text-sm text-slate-500">
          Certificate activity for your institution
        </p>
      </div>

      {error && (
        <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
          {error}
        </p>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-3 xl:grid-cols-6">
        {statCards.map((card) => (
          <StatCard
            key={card.key}
            icon={card.icon}
            label={card.label}
            value={loading ? "—" : (stats?.[card.key] ?? 0)}
            iconBg={"bg" in card ? card.bg : undefined}
            iconColor={"color" in card ? card.color : undefined}
          />
        ))}
      </div>

      <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm">
        <h2 className="font-semibold text-navy">Recent certificate activity</h2>
        {loading ? (
          <p className="py-8 text-sm text-slate-400">Loading activity…</p>
        ) : auditLogs.length === 0 ? (
          <p className="py-8 text-sm text-slate-400">
            No certificate activity has been recorded.
          </p>
        ) : (
          <ul className="mt-4 divide-y divide-slate-100">
            {auditLogs.map((log) => (
              <li key={log.id} className="flex flex-col gap-1 py-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-navy">
                  <span className="font-medium">{log.action.replaceAll(".", " ")}</span>
                  {log.certificateId && (
                    <span className="ml-2 text-slate-500">{log.certificateId}</span>
                  )}
                </p>
                <time className="text-xs text-slate-400">
                  {new Date(log.createdAt).toLocaleString()}
                </time>
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
