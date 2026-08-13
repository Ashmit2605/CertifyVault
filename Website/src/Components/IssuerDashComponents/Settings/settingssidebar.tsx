import { NavLink, Outlet } from "react-router-dom";
import { User, Building2, Users, Bell, Shield, Palette, Construction } from "lucide-react";
import { PageHeader } from "../../../Pages/IssuerDashLayout/IssuerDashLayout";

/* ══════════════════════════════════════════════════════
   SETTINGS SHELL — horizontal tabs + <Outlet/>
   route: /issuerdashboard/settings/*
   (filename kept as settingssidebar.tsx per your file structure,
   nav itself renders horizontally per your request)
   ══════════════════════════════════════════════════════ */

const TABS = [
  { to: "profile", label: "Profile", icon: User },
  { to: "institution", label: "Institution", icon: Building2 },
  { to: "users-permissions", label: "Users & Permissions", icon: Users },
  { to: "notifications", label: "Notifications", icon: Bell },
  { to: "security", label: "Security", icon: Shield },
  { to: "branding", label: "Branding", icon: Palette },
] as const;

export default function SettingsSidebar() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <PageHeader title="Settings" description="Manage your profile, institution details, and account preferences." />

      <div className="px-6 pt-3">
        <div className="flex items-center gap-1 border-b border-slate-100 overflow-x-auto">
          {TABS.map((t) => (
            <NavLink
              key={t.to}
              to={t.to}
              className={({ isActive }) =>
                `flex items-center gap-2 px-4 py-3 text-sm font-semibold whitespace-nowrap border-b-2 transition-colors ${
                  isActive ? "border-brand text-brand" : "border-transparent text-slate-500 hover:text-navy"
                }`
              }
            >
              <t.icon size={15} />
              {t.label}
            </NavLink>
          ))}
        </div>
      </div>

      <div className="p-6">
        <Outlet />
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   PLACEHOLDER — used for the 4 sections not built yet
   (Users & Permissions, Notifications, Security, Branding)
   Swap each out for a real component as you build it.
   ══════════════════════════════════════════════════════ */

export function SettingsComingSoon({ section }: { section: string }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-16">
      <div className="w-12 h-12 rounded-full bg-brand-light flex items-center justify-center mb-4">
        <Construction size={20} className="text-brand" />
      </div>
      <h3 className="text-sm font-semibold text-navy mb-1">{section}</h3>
      <p className="text-xs text-slate-400 max-w-xs">
        This section isn't built yet. It'll live here once it's ready.
      </p>
    </div>
  );
}