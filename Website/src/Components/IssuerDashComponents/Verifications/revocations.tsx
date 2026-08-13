import { createContext, useContext, useState } from "react";
import type { ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Ban, CheckCircle2, ChevronDown, Search, ArrowLeft, ShieldOff,
} from "lucide-react";
import { PageHeader } from "../../../Pages/IssuerDashLayout/IssuerDashLayout";

/* ══════════════════════════════════════════════════════
   1. SHARED STATE (Context)
   Very important for an academic credential platform.
   ══════════════════════════════════════════════════════ */

export type CertStatus = "active" | "revoked";

export interface RevocationRecord {
  id: string;
  student: string;
  issued: string;
  status: CertStatus;
  reason?: string;
  notes?: string;
  revokedDate?: string;
}

// 🔧 Replace with a fetch of issued certificates from your API
function initialRecords(): RevocationRecord[] {
  return [
    { id: "CERT-2026-00521", student: "Aditi Rao", issued: "12 Aug 2026", status: "active" },
    { id: "CERT-2026-00498", student: "Rohan Mehta", issued: "09 Aug 2026", status: "active" },
    { id: "CERT-2026-00470", student: "Sneha Kulkarni", issued: "02 Aug 2026", status: "active" },
    { id: "CERT-2026-00412", student: "Aman Verma", issued: "20 Jul 2026", status: "revoked", reason: "Fraud", revokedDate: "11 Aug 2026" },
    { id: "CERT-2026-00390", student: "Priya Singh", issued: "15 Jul 2026", status: "revoked", reason: "Duplicate", revokedDate: "05 Aug 2026" },
  ];
}

// Example reasons from your spec
export const REVOKE_REASONS = [
  "Incorrect information",
  "Certificate issued in error",
  "Fraud",
  "Duplicate",
  "Student disciplinary/legal reason",
];

interface RevocationsContextValue {
  records: RevocationRecord[];
  getRecord: (id: string) => RevocationRecord | undefined;
  revokeCertificate: (id: string, reason: string, notes: string) => void;
}

const RevocationsContext = createContext<RevocationsContextValue | null>(null);

export function RevocationsProvider({ children }: { children: ReactNode }) {
  const [records, setRecords] = useState<RevocationRecord[]>(initialRecords());

  const getRecord = (id: string) => records.find((r) => r.id === id);

  const revokeCertificate = (id: string, reason: string, notes: string) => {
    // 🔧 Call your API here (this is irreversible + blockchain-recorded):
    // await api.revokeCertificate({ certId: id, reason, notes });
    setRecords((prev) =>
      prev.map((r) =>
        r.id === id
          ? { ...r, status: "revoked", reason, notes, revokedDate: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }) }
          : r
      )
    );
  };

  return (
    <RevocationsContext.Provider value={{ records, getRecord, revokeCertificate }}>
      {children}
    </RevocationsContext.Provider>
  );
}

function useRevocations() {
  const ctx = useContext(RevocationsContext);
  if (!ctx) throw new Error("useRevocations must be used within RevocationsProvider");
  return ctx;
}

/* ══════════════════════════════════════════════════════
   2. SMALL UI PIECES
   ══════════════════════════════════════════════════════ */

const TABS = ["Active Certificates", "Revoked"] as const;
type Tab = (typeof TABS)[number];

function Tabs({ active, onChange }: { active: Tab; onChange: (t: Tab) => void }) {
  return (
    <div className="flex gap-1 p-1 rounded-xl bg-brand-light w-fit mb-5">
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
   3. REVOCATIONS GALLERY (default export — route: /issuerdashboard/revocations)
   ══════════════════════════════════════════════════════ */

export default function Revocations() {
  const { records } = useRevocations();
  const navigate = useNavigate();
  const [tab, setTab] = useState<Tab>("Active Certificates");

  const rows = records.filter((r) => (tab === "Active Certificates" ? r.status === "active" : r.status === "revoked"));

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <PageHeader title="Revocations" description="Revoke certificates and track the ones already withdrawn." />

      <div className="p-6">
        <Tabs active={tab} onChange={setTab} />

        <div className="rounded-xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-brand-light">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy">Certificate ID</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy">Student</th>
                  {tab === "Active Certificates" ? (
                    <th className="text-left px-5 py-3 text-xs font-semibold text-navy">Issued On</th>
                  ) : (
                    <>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-navy">Reason</th>
                      <th className="text-left px-5 py-3 text-xs font-semibold text-navy">Revoked On</th>
                    </>
                  )}
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy">
                    {tab === "Active Certificates" ? "" : "Status"}
                  </th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-t border-slate-100">
                    <td className="px-5 py-3.5 font-semibold text-navy">{r.id}</td>
                    <td className="px-5 py-3.5 text-slate-600">{r.student}</td>
                    {tab === "Active Certificates" ? (
                      <td className="px-5 py-3.5 text-slate-500">{r.issued}</td>
                    ) : (
                      <>
                        <td className="px-5 py-3.5 text-slate-600">{r.reason}</td>
                        <td className="px-5 py-3.5 text-slate-500">{r.revokedDate}</td>
                      </>
                    )}
                    <td className="px-5 py-3.5">
                      {tab === "Active Certificates" ? (
                        <button
                          onClick={() => navigate(`/issuerdashboard/revocations/${r.id}`)}
                          className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
                        >
                          <Ban size={13} /> Revoke
                        </button>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-500">
                          <Ban size={12} /> REVOKED
                        </span>
                      )}
                    </td>
                  </tr>
                ))}
                {rows.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-sm text-slate-400">
                      Nothing here yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   4. REVOKE CERTIFICATE (named export — route: /issuerdashboard/revocations/:certId)
   ══════════════════════════════════════════════════════ */

export function RevokeCertificate() {
  const { certId } = useParams();
  const navigate = useNavigate();
  const { getRecord, revokeCertificate } = useRevocations();
  const record = certId ? getRecord(certId) : undefined;

  const [reason, setReason] = useState(REVOKE_REASONS[0]);
  const [notes, setNotes] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [confirmed, setConfirmed] = useState(false);

  if (!record) {
    return <p className="text-slate-500">Certificate not found.</p>;
  }

  const alreadyRevoked = record.status === "revoked";

  const handleConfirm = () => {
    revokeCertificate(record.id, reason, notes);
    setConfirmed(true);
    setConfirmOpen(false);
  };

  const steps = [
    { label: "Certificate", done: true },
    { label: "Status = REVOKED", done: confirmed || alreadyRevoked },
    { label: "Blockchain status update", done: confirmed || alreadyRevoked },
    { label: "Verification shows: REVOKED", done: confirmed || alreadyRevoked },
  ];

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <PageHeader title={record.id} description={`Revoke this certificate for ${record.student}`} />

      <div className="p-6">
        <button
          onClick={() => navigate("/issuerdashboard/revocations")}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy mb-4 transition-colors"
        >
          <ArrowLeft size={15} /> Back to Revocations
        </button>

        {alreadyRevoked && !confirmed ? (
          <div className="rounded-xl border border-rose-100 bg-rose-50 p-5 flex items-center gap-3">
            <ShieldOff size={20} className="text-rose-500 shrink-0" />
            <p className="text-sm text-rose-600">
              This certificate was already revoked on {record.revokedDate} ({record.reason}).
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_300px] gap-6">
            {/* Form */}
            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-navy">Certificate ID</label>
                <div className="relative mt-1.5">
                  <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
                  <input
                    value={record.id}
                    disabled
                    className="w-full pl-9 pr-3 py-2.5 rounded-lg bg-brand-light text-sm text-navy outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-navy">Reason for revocation</label>
                <div className="relative mt-1.5">
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    disabled={confirmed}
                    className="w-full pl-3 pr-9 py-2.5 rounded-lg bg-brand-light text-sm text-navy outline-none appearance-none cursor-pointer"
                  >
                    {REVOKE_REASONS.map((r) => (
                      <option key={r}>{r}</option>
                    ))}
                  </select>
                  <ChevronDown size={15} className="absolute right-3 top-2.5 text-slate-400 pointer-events-none" />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-navy">Notes (optional, kept in audit log)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  disabled={confirmed}
                  rows={3}
                  placeholder="Add context for this revocation…"
                  className="w-full mt-1.5 px-3 py-2.5 rounded-lg bg-brand-light text-sm text-navy outline-none resize-y"
                />
              </div>

              <button
                disabled={confirmed}
                onClick={() => setConfirmOpen(true)}
                className={`w-full flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
                  confirmed ? "bg-rose-100 text-rose-300 cursor-not-allowed" : "bg-rose-500 text-white hover:bg-rose-600"
                }`}
              >
                <Ban size={16} /> {confirmed ? "Revoked" : "Revoke Certificate"}
              </button>
            </div>

            {/* Status flow */}
            <div className="rounded-xl bg-brand-light p-5 h-fit">
              <div className="text-xs font-bold text-navy mb-3.5">WHAT HAPPENS NEXT</div>
              {steps.map((step, i) => (
                <div key={step.label} className="flex gap-3 items-start">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-5 h-5 rounded-full flex items-center justify-center border-2 ${
                        step.done ? "bg-brand border-brand" : "bg-white border-slate-200"
                      }`}
                    >
                      {step.done && <CheckCircle2 size={13} className="text-white" />}
                    </div>
                    {i < steps.length - 1 && <div className="w-0.5 h-[30px] bg-slate-200" />}
                  </div>
                  <div className={`pt-px text-sm font-medium ${step.done ? "text-navy" : "text-slate-400"}`}>
                    {step.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Confirm dialog — irreversible + blockchain-recorded */}
      {confirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40">
          <div className="bg-white rounded-2xl p-6 w-[380px]">
            <div className="font-bold text-base text-navy mb-2">Revoke {record.id}?</div>
            <p className="text-sm text-slate-500 mb-5">
              This updates the blockchain record and can't be undone. Reason: <b>{reason}</b>
            </p>
            <div className="flex gap-2 justify-end">
              <button
                onClick={() => setConfirmOpen(false)}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-navy bg-brand-light"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                className="px-4 py-2 rounded-lg text-sm font-semibold text-white bg-rose-500 hover:bg-rose-600"
              >
                Yes, revoke
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}