import { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import {
  LayoutGrid,
  FileText,
  PlusCircle,
  Users,
  BadgeCheck,
  LayoutTemplate,
  ShieldCheck,
  Ban,
  AlertTriangle,
  BarChart3,
  ScrollText,
  UserCircle,
  LogOut,
  Menu,
  X,
  ChevronDown,
} from "lucide-react";

interface PageHeaderProps {
  title: string;
  description?: string;
  action?: {
    label: string;
    icon: React.ReactNode;
    onClick: () => void;
  };
}

interface NavGroup {
  title: string;
  path?: string;
  icon: React.ElementType;
  children?: { title: string; path: string; icon: React.ElementType }[];
}

const navGroups: NavGroup[] = [
  { title: "Overview", path: "/issuerdashboard", icon: LayoutGrid },
  {
    title: "Certificates",
    icon: FileText,
    children: [
      { title: "Certificates", path: "/issuerdashboard/certificates", icon: FileText },
      { title: "Issue Certificate", path: "/issuerdashboard/issue", icon: PlusCircle },
      { title: "Templates", path: "/issuerdashboard/templates", icon: LayoutTemplate },
    ],
  },
  { title: "Students", path: "/issuerdashboard/students", icon: Users },
  { title: "Recipients", path: "/issuerdashboard/recipients", icon: Users },
  { title: "Claim requests", path: "/issuerdashboard/claims", icon: BadgeCheck },
  {
    title: "Verification",
    icon: ShieldCheck,
    children: [
      { title: "Verification", path: "/issuerdashboard/verification", icon: ShieldCheck },
      { title: "Revocations", path: "/issuerdashboard/revocations", icon: Ban },
      { title: "Fraud & Alerts", path: "/issuerdashboard/fraud-alerts", icon: AlertTriangle },
    ],
  },
  { title: "Analytics", path: "/issuerdashboard/analytics", icon: BarChart3 },
  // "More" removed: these are now independent top-level items
  { title: "Audit Logs", path: "/issuerdashboard/audit-logs", icon: ScrollText },
  { title: "Profile", path: "/issuerdashboard/settings", icon: UserCircle },
];

// Shared tokens (same as the admin dashboard)
const PAGE_BG = "bg-[#F7F8FC]";
const SOFT_BG = "bg-[#F0F2F8]";
const SOFT_HOVER = "hover:bg-[#F0F2F8]";

export function TopNav() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useClerk();

  const handleLogout = () => {
    setIsMobileMenuOpen(false);
    setShowLogoutModal(true);
  };
  const confirmLogout = () => {
    setShowLogoutModal(false);
    void signOut().then(() => navigate("/app/login", { replace: true }));
  };
  const cancelLogout = () => setShowLogoutModal(false);

  const isGroupActive = (group: NavGroup) =>
    !!group.children?.some(
      (c) => location.pathname === c.path || location.pathname.startsWith(c.path + "/")
    );

  // close dropdown on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  // close menus on route change
  useEffect(() => {
    setOpenDropdown(null);
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <>
      <header
        ref={navRef}
        className="sticky top-0 z-40 w-full bg-white border-b border-[#E2E6F0] font-figtree"
      >
        <div className="min-h-[72px] xl:min-h-[80px] w-full px-4 xl:px-6 py-3 xl:py-[18px] flex items-center gap-5">
          {/* Logo — left corner */}
          <div className="flex items-center gap-2 shrink-0">
            <ShieldCheck className="text-brand" size={26} />
            <div className="leading-tight">
              <div className="text-[17px] font-extrabold text-navy whitespace-nowrap">
                Certify<span className="text-brand">Vault</span>
              </div>
              <div className="hidden xl:block mt-0.5 text-[11px] font-semibold text-[#6B7BA6] whitespace-nowrap">
                Issuer Dashboard
              </div>
            </div>
          </div>

          {/* Desktop nav — centered between logo and logout */}
          <nav
            aria-label="Issuer navigation"
            className="hidden xl:flex flex-1 min-w-0 items-center justify-center gap-1"
          >
            {navGroups.map((group) => {
              const Icon = group.icon;

              if (!group.children) {
                return (
                  <NavLink
                    key={group.title}
                    to={group.path!}
                    end={group.path === "/issuerdashboard"}
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 px-2.5 py-2.5 rounded-[10px] text-[13px] whitespace-nowrap transition-colors ${
                        isActive
                          ? `${SOFT_BG} text-brand font-bold`
                          : `text-[#6B7BA6] font-semibold ${SOFT_HOVER} hover:text-navy`
                      }`
                    }
                  >
                    <Icon size={16} strokeWidth={1.9} />
                    {group.title}
                  </NavLink>
                );
              }

              const isOpen = openDropdown === group.title;
              const active = isGroupActive(group);
              return (
                <div key={group.title} className="relative">
                  <button
                    onClick={() => setOpenDropdown(isOpen ? null : group.title)}
                    className={`flex items-center gap-1.5 px-2.5 py-2.5 rounded-[10px] text-[13px] whitespace-nowrap transition-colors ${
                      isOpen || active
                        ? `${SOFT_BG} text-brand font-bold`
                        : `text-[#6B7BA6] font-semibold ${SOFT_HOVER} hover:text-navy`
                    }`}
                  >
                    <Icon size={16} strokeWidth={1.9} />
                    {group.title}
                    <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isOpen && (
                    <div className="absolute left-0 top-full mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#E2E6F0] py-2 z-50">
                      {group.children.map((child) => {
                        const ChildIcon = child.icon;
                        return (
                          <NavLink
                            key={child.path}
                            to={child.path}
                            onClick={() => setOpenDropdown(null)}
                            className={({ isActive }) =>
                              `flex items-center gap-2.5 px-4 py-2.5 text-sm transition-colors ${
                                isActive
                                  ? `text-brand ${SOFT_BG} font-semibold`
                                  : `text-slate-600 ${SOFT_HOVER} hover:text-navy`
                              }`
                            }
                          >
                            <ChildIcon size={16} />
                            {child.title}
                          </NavLink>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          {/* Desktop logout — right corner */}
          <button
            type="button"
            onClick={handleLogout}
            aria-label="Log out"
            className="hidden xl:inline-flex ml-auto shrink-0 items-center gap-2 px-3 py-[9px] rounded-[10px] border border-[#E2E6F0] bg-white text-rose-500 text-[13px] font-semibold hover:bg-rose-50 transition-colors"
          >
            <LogOut size={16} strokeWidth={1.8} />
            Log out
          </button>

          {/* Mobile / tablet hamburger */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(true)}
            aria-label="Open navigation"
            className="xl:hidden ml-auto inline-flex h-10 w-10 items-center justify-center rounded-[10px] border border-[#E2E6F0] bg-white text-navy hover:bg-[#F0F2F8] transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>
      </header>

      {/* ── MOBILE OVERLAY ── */}
      {isMobileMenuOpen && (
        <div
          className="xl:hidden fixed inset-0 bg-[#000F3E]/40 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ── MOBILE DRAWER ── */}
      <div
        className={`
          xl:hidden fixed inset-y-0 right-0 z-50
          w-[85vw] max-w-[340px] bg-white flex flex-col shadow-xl border-l border-[#E2E6F0]
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="px-5 py-4 border-b border-[#E2E6F0] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-brand" size={22} />
            <span className="text-navy font-extrabold">
              Certify<span className="text-brand">Vault</span>
            </span>
          </div>
          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className="h-9 w-9 flex items-center justify-center rounded-[10px] hover:bg-[#F0F2F8] transition-colors"
            aria-label="Close navigation"
          >
            <X size={20} className="text-navy" />
          </button>
        </div>

        <nav className="flex-1 px-3 py-2 overflow-y-auto">
          {navGroups.map((group) => {
            const Icon = group.icon;
            if (!group.children) {
              return (
                <NavLink
                  key={group.title}
                  to={group.path!}
                  end={group.path === "/issuerdashboard"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-[14.5px] transition-colors ${
                      isActive
                        ? `${SOFT_BG} text-brand font-bold`
                        : `text-navy font-semibold ${SOFT_HOVER}`
                    }`
                  }
                >
                  <Icon size={18} strokeWidth={1.8} />
                  {group.title}
                </NavLink>
              );
            }
            return (
              <div key={group.title} className="mb-1">
                <p className="px-4 pt-3 pb-1 text-xs font-semibold text-[#6B7BA6] uppercase tracking-wide">
                  {group.title}
                </p>
                {group.children.map((child) => {
                  const ChildIcon = child.icon;
                  return (
                    <NavLink
                      key={child.path}
                      to={child.path}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-[14.5px] transition-colors ${
                          isActive
                            ? `${SOFT_BG} text-brand font-bold`
                            : `text-navy font-semibold ${SOFT_HOVER}`
                        }`
                      }
                    >
                      <ChildIcon size={18} strokeWidth={1.8} />
                      {child.title}
                    </NavLink>
                  );
                })}
              </div>
            );
          })}
        </nav>

        <div className="p-3 border-t border-[#E2E6F0] shrink-0">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-rose-500 font-bold text-[14.5px] hover:bg-rose-50 transition-colors"
          >
            <LogOut size={18} strokeWidth={1.8} />
            <span>Log out</span>
          </button>
        </div>
      </div>

      {/* ── LOGOUT MODAL ── */}
      {showLogoutModal && (
        <div
          onClick={cancelLogout}
          className="fixed inset-0 bg-[#000F3E]/45 backdrop-blur-sm flex items-center justify-center z-[70] p-5"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal="true"
            className="bg-white rounded-[18px] shadow-xl max-w-sm w-full p-6"
          >
            <h3 className="text-lg font-extrabold text-navy mb-1.5">Log out of CertifyVault?</h3>
            <p className="text-[13.5px] font-medium text-[#6B7BA6] leading-relaxed mb-5">
              You'll need to sign back in to access the issuer dashboard again.
            </p>
            <div className="flex gap-2.5">
              <button
                onClick={cancelLogout}
                className="flex-1 px-4 py-[11px] text-sm font-bold text-navy bg-white border border-[#E2E6F0] rounded-xl hover:bg-[#F0F2F8] transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-[11px] text-sm font-bold text-white bg-rose-500 rounded-xl hover:bg-rose-600 transition-colors shadow-lg shadow-rose-500/30"
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

export function PageHeader({ title, description, action }: PageHeaderProps) {
  return (
    <div className="flex items-start justify-between gap-4 border-b border-[#E2E6F0] bg-white px-6 py-4 rounded-t-2xl">
      <div>
        <h1 className="text-xl font-semibold text-navy">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex shrink-0 items-center gap-2 justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:pointer-events-none disabled:opacity-50 bg-brand text-white hover:bg-brand/90 h-9 px-4"
        >
          {action.icon}
          {action.label}
        </button>
      )}
    </div>
  );
}

export function IssuerDashLayout() {
  return (
    <div className={`min-h-screen flex flex-col ${PAGE_BG} font-figtree text-navy`}>
      <TopNav />
      <main
        className={`flex-1 min-w-0 w-full max-w-[1440px] mx-auto ${PAGE_BG} px-4 pt-5 pb-8 xl:px-10 xl:pt-7 xl:pb-[50px]`}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default IssuerDashLayout;