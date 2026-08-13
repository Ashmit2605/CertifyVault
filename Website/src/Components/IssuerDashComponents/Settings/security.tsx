import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Lock, ShieldCheck, Monitor, Smartphone, LogOut, CheckCircle2, XCircle,
} from "lucide-react";

/* ══════════════════════════════════════════════════════
   SECURITY
   route: /issuerdashboard/settings/security

   Note: "Change Password" also lives in Profile (per spec).
   Rather than duplicate that form, this shows a summary card
   that links there — avoids two independent password flows
   drifting out of sync.
   ══════════════════════════════════════════════════════ */

interface Session {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
}

interface LoginEvent {
  id: string;
  when: string;
  ip: string;
  device: string;
  result: "Success" | "Failed";
}

// 🔧 Replace with GET /api/issuer/security/sessions
const initialSessions: Session[] = [
  { id: "SESS-01", device: "Chrome · Windows", location: "Pune, IN", lastActive: "Active now", current: true },
  { id: "SESS-02", device: "Safari · macOS", location: "Mumbai, IN", lastActive: "2 hours ago", current: false },
  { id: "SESS-03", device: "Chrome · Android", location: "Pune, IN", lastActive: "1 day ago", current: false },
];

// 🔧 Replace with GET /api/issuer/security/login-activity
const loginActivity: LoginEvent[] = [
  { id: "LGN-01", when: "13 Aug 2026, 09:12 AM", ip: "203.0.113.42", device: "Chrome · Windows", result: "Success" },
  { id: "LGN-02", when: "12 Aug 2026, 11:58 PM", ip: "45.33.12.90", device: "Chrome · Android", result: "Failed" },
  { id: "LGN-03", when: "12 Aug 2026, 08:47 AM", ip: "203.0.113.42", device: "Chrome · Windows", result: "Success" },
];

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${on ? "bg-brand" : "bg-slate-200"}`}
    >
      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-[22px]" : "translate-x-0.5"}`} />
    </button>
  );
}

function SectionCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-slate-100 p-5">
      <h3 className="text-sm font-semibold text-navy mb-4">{title}</h3>
      {children}
    </div>
  );
}

export default function Security() {
  const navigate = useNavigate();
  const [twoFA, setTwoFA] = useState(false);
  const [sessions, setSessions] = useState<Session[]>(initialSessions);

  const revokeSession = (id: string) => {
    // 🔧 Call DELETE /api/issuer/security/sessions/:id here
    setSessions((prev) => prev.filter((s) => s.id !== id));
  };

  return (
    <div className="max-w-2xl space-y-5">
      {/* Password — links to Profile, doesn't duplicate the form */}
      <SectionCard title="Password">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-light flex items-center justify-center">
              <Lock size={16} className="text-brand" />
            </div>
            <div>
              <p className="text-sm text-navy font-medium">Last changed 42 days ago</p>
              <p className="text-xs text-slate-400">Managed from your Profile settings.</p>
            </div>
          </div>
          <button
            onClick={() => navigate("/issuerdashboard/settings/profile")}
            className="px-4 py-2 rounded-lg bg-brand-light text-brand text-sm font-semibold hover:bg-brand/10 transition-colors whitespace-nowrap"
          >
            Change Password
          </button>
        </div>
      </SectionCard>

      {/* Two-Factor Authentication */}
      <SectionCard title="Two-Factor Authentication">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-light flex items-center justify-center">
              <ShieldCheck size={16} className="text-brand" />
            </div>
            <div>
              <p className="text-sm text-navy font-medium">Authenticator app</p>
              <p className="text-xs text-slate-400">Require a code from your phone at login.</p>
            </div>
          </div>
          <Toggle on={twoFA} onChange={setTwoFA} />
        </div>
        {twoFA && (
          <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-3">
            <button className="px-4 py-2 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90 transition-colors">
              Set Up Authenticator
            </button>
            <button className="px-4 py-2 rounded-lg bg-brand-light text-brand text-sm font-semibold hover:bg-brand/10 transition-colors">
              View Backup Codes
            </button>
          </div>
        )}
      </SectionCard>

      {/* Active Sessions */}
      <SectionCard title="Active Sessions">
        <div className="space-y-3">
          {sessions.map((s) => (
            <div key={s.id} className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-full bg-brand-light flex items-center justify-center">
                  {s.device.includes("Android") || s.device.includes("iOS") ? (
                    <Smartphone size={16} className="text-brand" />
                  ) : (
                    <Monitor size={16} className="text-brand" />
                  )}
                </div>
                <div>
                  <p className="text-sm text-navy font-medium flex items-center gap-2">
                    {s.device}
                    {s.current && (
                      <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600">
                        This device
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-slate-400">{s.location} · {s.lastActive}</p>
                </div>
              </div>
              {!s.current && (
                <button
                  onClick={() => revokeSession(s.id)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold bg-rose-50 text-rose-500 hover:bg-rose-100 transition-colors"
                >
                  <LogOut size={13} /> Revoke
                </button>
              )}
            </div>
          ))}
        </div>
      </SectionCard>

      {/* Login Activity */}
      <SectionCard title="Login Activity">
        <div className="rounded-lg border border-slate-100 overflow-hidden -mx-1">
          <table className="w-full text-sm border-collapse">
            <thead>
              <tr className="bg-brand-light">
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-navy">When</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-navy">IP / Device</th>
                <th className="text-left px-4 py-2.5 text-xs font-semibold text-navy">Result</th>
              </tr>
            </thead>
            <tbody>
              {loginActivity.map((l) => (
                <tr key={l.id} className="border-t border-slate-100">
                  <td className="px-4 py-2.5 text-slate-500 whitespace-nowrap">{l.when}</td>
                  <td className="px-4 py-2.5 text-slate-500">{l.ip} · {l.device}</td>
                  <td className="px-4 py-2.5">
                    {l.result === "Success" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-600">
                        <CheckCircle2 size={12} /> Success
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-500">
                        <XCircle size={12} /> Failed
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SectionCard>
    </div>
  );
}