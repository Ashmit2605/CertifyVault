import { useState, type ReactNode } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import {
  Home,
  FileBadge,
  BadgeCheck,
  ScanSearch,
  Share2,
  Activity,
  UserRound,
  KeyRound,
  Menu,
  X,
  LogOut,
  type LucideIcon,
} from "lucide-react";
import logo from "../../assets/Logo.webp";

interface NavItem {
  title: string;
  path: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { title: "Home", path: "/holderdashboard", icon: Home },
  { title: "My Certificates", path: "/holderdashboard/certificates", icon: FileBadge },
  { title: "Claim credentials", path: "/holderdashboard/claims", icon: BadgeCheck },
  { title: "Verification", path: "/holderdashboard/verification", icon: ScanSearch },
  { title: "Share", path: "/holderdashboard/share", icon: Share2 },
  { title: "Activity", path: "/holderdashboard/activity", icon: Activity },
  { title: "Security", path: "/holderdashboard/security", icon: KeyRound },
  { title: "Profile", path: "/holderdashboard/profile", icon: UserRound },
];

// Shared tokens (same as the issuer dashboard)
const PAGE_BG = "bg-[#F7F8FC]";
const SOFT_BG = "bg-[#F0F2F8]";
const SOFT_HOVER = "hover:bg-[#F0F2F8]";

export function TopNav() {
  const { signOut } = useClerk();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

  const handleLogout = (): void => {
    setIsMobileMenuOpen(false);
    setShowLogoutModal(true);
  };
  const confirmLogout = (): void => {
    setShowLogoutModal(false);
    void signOut().then(() => navigate("/app/login", { replace: true }));
  };
  const cancelLogout = (): void => setShowLogoutModal(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-[#E2E6F0] bg-white font-figtree">
        <div className="flex min-h-[72px] w-full items-center gap-5 px-4 py-3 xl:min-h-[80px] xl:px-6 xl:py-[18px]">
          {/* Logo — left corner */}
          <div className="flex shrink-0 items-center gap-2">
            <img
              src={logo}
              alt="CertifyVault Logo"
              className="h-8 w-auto object-contain"
            />
            <div className="leading-tight">
              <div className="whitespace-nowrap text-[17px] font-extrabold text-navy">
                Certify<span className="text-brand">Vault</span>
              </div>
              <div className="mt-0.5 hidden whitespace-nowrap text-[11px] font-semibold text-[#6B7BA6] xl:block">
                Holder Dashboard
              </div>
            </div>
          </div>

          {/* Desktop nav — centered between logo and logout */}
          <nav
            aria-label="Holder navigation"
            className="hidden min-w-0 flex-1 items-center justify-center gap-1 xl:flex"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/holderdashboard"}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 whitespace-nowrap rounded-[10px] px-2.5 py-2.5 text-[13px] transition-colors ${isActive
                      ? `${SOFT_BG} font-bold text-brand`
                      : `font-semibold text-[#6B7BA6] ${SOFT_HOVER} hover:text-navy`
                    }`
                  }
                >
                  <Icon size={16} strokeWidth={1.9} />
                  {item.title}
                </NavLink>
              );
            })}
          </nav>

          {/* Desktop logout — right corner */}
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Log out"
            className="ml-auto inline-flex shrink-0 items-center gap-2 rounded-[10px] border border-[#E2E6F0] bg-white px-2.5 py-2 text-[13px] font-semibold text-rose-500 transition-colors hover:bg-rose-50 sm:px-3 sm:py-[9px]"
          >
            <LogOut size={16} strokeWidth={1.8} />
            <span className="hidden sm:inline">Log out</span>
          </button>

          {/* Mobile / tablet hamburger */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open navigation"
            className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-[10px] border border-[#E2E6F0] bg-white text-navy transition-colors hover:bg-[#F0F2F8] xl:hidden"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* ── MOBILE OVERLAY ── */}
      {isMobileMenuOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#000F3E]/40 backdrop-blur-sm xl:hidden"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ── MOBILE DRAWER ── */}
      <div
        className={`
          fixed inset-y-0 right-0 z-50 flex w-[85vw] max-w-[340px] flex-col
          border-l border-[#E2E6F0] bg-white font-figtree shadow-xl xl:hidden
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-[#E2E6F0] px-5 py-4">
          <div className="flex items-center gap-2">
            <img
              src={logo}
              alt="CertifyVault Logo"
              className="h-7 w-auto object-contain"
            />
            <span className="font-extrabold text-navy">
              Certify<span className="text-brand">Vault</span>
            </span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="flex h-9 w-9 items-center justify-center rounded-[10px] transition-colors hover:bg-[#F0F2F8]"
            aria-label="Close navigation"
          >
            <X size={20} className="text-navy" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === "/holderdashboard"}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `mb-1 flex items-center gap-3 rounded-xl px-4 py-3 text-[14.5px] transition-colors ${isActive
                    ? `${SOFT_BG} font-bold text-brand`
                    : `font-semibold text-navy ${SOFT_HOVER}`
                  }`
                }
              >
                <Icon size={18} strokeWidth={1.8} />
                {item.title}
              </NavLink>
            );
          })}
        </nav>

        <div className="shrink-0 border-t border-[#E2E6F0] p-3">
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-[14.5px] font-bold text-rose-500 transition-colors hover:bg-rose-50"
          >
            <LogOut size={18} strokeWidth={1.8} />
            <span>Log out</span>
          </button>
        </div>
      </div>

      {/* ── LOGOUT CONFIRM MODAL ── */}
      {showLogoutModal && (
        <div
          onClick={cancelLogout}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-[#000F3E]/45 p-5 font-figtree backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            className="w-full max-w-sm rounded-[18px] bg-white p-6 shadow-xl"
          >
            <h3 className="mb-1.5 text-lg font-extrabold text-navy">
              Log out of CertifyVault?
            </h3>
            <p className="mb-5 text-[13.5px] font-medium leading-relaxed text-[#6B7BA6]">
              You'll need to sign back in to access your certificates again.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={cancelLogout}
                className="flex-1 rounded-xl border border-[#E2E6F0] bg-white px-4 py-[11px] text-sm font-bold text-navy transition-colors hover:bg-[#F0F2F8]"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 rounded-xl bg-rose-500 px-4 py-[11px] text-sm font-bold text-white shadow-lg shadow-rose-500/30 transition-colors hover:bg-rose-600"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

interface PageHeaderAction {
  label: string;
  icon?: ReactNode;
  onClick?: () => void;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: PageHeaderAction;
}

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-t-2xl border-b border-[#E2E6F0] bg-white px-6 py-4">
      <div>
        <h1 className="text-xl font-semibold text-navy">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-slate-500">{description}</p>
        )}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex h-9 shrink-0 cursor-pointer items-center justify-center gap-2 rounded-lg bg-brand px-4 text-sm font-medium text-white transition-colors hover:bg-brand/90 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:pointer-events-none disabled:opacity-50"
        >
          {action.icon}
          {action.label}
        </button>
      )}
    </div>
  );
}

export function HolderDashboardLayout() {
  return (
    <div
      className={`flex min-h-screen flex-col ${PAGE_BG} font-figtree text-navy`}
    >
      <TopNav />
      <Outlet />
    </div>
  );
}

export default HolderDashboardLayout;