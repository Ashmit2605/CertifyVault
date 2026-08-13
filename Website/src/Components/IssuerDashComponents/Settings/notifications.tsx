import { useState } from "react";
import { FileCheck2, Ban, ShieldCheck, ShieldAlert, Bell } from "lucide-react";

/* ══════════════════════════════════════════════════════
   NOTIFICATIONS — keep it simple: one ON/OFF switch each
   route: /issuerdashboard/settings/notifications
   ══════════════════════════════════════════════════════ */

interface NotificationSetting {
  key: string;
  label: string;
  description: string;
  icon: React.ElementType;
  enabled: boolean;
}

// 🔧 Replace with GET /api/issuer/notification-settings
// Defaults match the spec's example exactly (Verification Activity is the one OFF).
const initialSettings: NotificationSetting[] = [
  { key: "certificateIssued", label: "Certificate Issued", description: "When a certificate is successfully issued.", icon: FileCheck2, enabled: true },
  { key: "certificateRevoked", label: "Certificate Revoked", description: "When a certificate is revoked.", icon: Ban, enabled: true },
  { key: "verificationActivity", label: "Verification Activity", description: "Every time an employer or third party verifies a certificate.", icon: ShieldCheck, enabled: false },
  { key: "fraudAlerts", label: "Fraud Alerts", description: "When the AI system flags a certificate as suspicious.", icon: ShieldAlert, enabled: true },
  { key: "systemNotifications", label: "System Notifications", description: "Platform updates, maintenance windows, and policy changes.", icon: Bell, enabled: true },
];

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      onClick={() => onChange(!on)}
      className={`relative w-11 h-6 rounded-full transition-colors shrink-0 ${on ? "bg-brand" : "bg-slate-200"}`}
      aria-pressed={on}
    >
      <span
        className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform ${on ? "translate-x-[22px]" : "translate-x-0.5"}`}
      />
    </button>
  );
}

export default function Notifications() {
  const [settings, setSettings] = useState<NotificationSetting[]>(initialSettings);

  const toggle = (key: string) => {
    // 🔧 Call PATCH /api/issuer/notification-settings here
    setSettings((prev) => prev.map((s) => (s.key === key ? { ...s, enabled: !s.enabled } : s)));
  };

  return (
    <div className="max-w-2xl">
      <p className="text-sm text-slate-500 mb-5">Choose what you get notified about. Changes save automatically.</p>

      <div className="rounded-xl border border-slate-100 divide-y divide-slate-100">
        {settings.map((s) => (
          <div key={s.key} className="flex items-center justify-between gap-4 px-5 py-4">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-brand-light flex items-center justify-center shrink-0">
                <s.icon size={16} className="text-brand" />
              </div>
              <div>
                <p className="text-sm font-semibold text-navy">{s.label}</p>
                <p className="text-xs text-slate-400">{s.description}</p>
              </div>
            </div>
            <Toggle on={s.enabled} onChange={() => toggle(s.key)} />
          </div>
        ))}
      </div>
    </div>
  );
}