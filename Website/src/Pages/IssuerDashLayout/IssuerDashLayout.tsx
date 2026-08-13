import { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import {
  LayoutGrid,
  FileText,
  PlusCircle,
  Users,
  LayoutTemplate,
  ShieldCheck,
  Ban,
  AlertTriangle,
  BarChart3,
  ScrollText,
  Settings,
  LogOut,
  X,
  Menu,
  Search,
  Bell,
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
  {
    title: "More",
    icon: Settings,
    children: [
      { title: "Audit Logs", path: "/issuerdashboard/audit-logs", icon: ScrollText },
      { title: "Settings", path: "/issuerdashboard/settings", icon: Settings },
    ],
  },
];

export function TopNav() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const navRef = useRef<HTMLElement>(null);
  const navigate = useNavigate();

  const handleLogout = () => setShowLogoutModal(true);
  const confirmLogout = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
  };
  const cancelLogout = () => setShowLogoutModal(false);

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

  return (
    <>
      <header
        ref={navRef}
        className="sticky top-0 z-40 bg-white border-b border-slate-200 font-figtree"
      >
        <div className="h-16 px-4 lg:px-6 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 shrink-0">
            <ShieldCheck className="text-brand" size={26} />
            <span className="text-lg font-bold text-navy">
              Certify<span className="text-brand">Vault</span>
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navGroups.map((group) => {
              const Icon = group.icon;

              if (!group.children) {
                return (
                  <NavLink
                    key={group.title}
                    to={group.path!}
                    end={group.path === "/issuerdashboard"}
                    className={({ isActive }) =>
                      `flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        isActive
                          ? "text-brand"
                          : "text-slate-600 hover:text-navy hover:bg-brand-light"
                      }`
                    }
                  >
                    <Icon size={16} />
                    {group.title}
                  </NavLink>
                );
              }

              const isOpen = openDropdown === group.title;
              return (
                <div key={group.title} className="relative">
                  <button
                    onClick={() => setOpenDropdown(isOpen ? null : group.title)}
                    className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isOpen ? "text-brand" : "text-slate-600 hover:text-navy hover:bg-brand-light"
                    }`}
                  >
                    <Icon size={16} />
                    {group.title}
                    <ChevronDown size={14} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>

                  {isOpen && (
                    <div className="absolute left-0 top-full mt-1 w-56 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50">
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
                                  ? "text-brand bg-brand-light font-medium"
                                  : "text-slate-600 hover:bg-brand-light hover:text-navy"
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

          {/* Right side */}
          <div className="flex items-center gap-4">
            <div className="relative hidden md:block w-64">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                placeholder="Search certificates, students..."
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-brand-light text-sm outline-none focus:ring-2 focus:ring-brand/40"
              />
            </div>

            <button
              onClick={() => navigate("/issuerdashboard/settings/notifications")}
              className="relative shrink-0"
              title="Notifications"
            >
              <Bell size={20} className="text-navy/70" />
              <span className="absolute -top-1 -right-1 bg-brand text-white text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </button>

            <div className="relative hidden lg:block">
              <button
                onClick={() => setOpenDropdown(openDropdown === "profile" ? null : "profile")}
                className="flex items-center gap-2"
              >
                <img
                  src="https://i.pravatar.cc/32"
                  alt="avatar"
                  className="w-8 h-8 rounded-full object-cover"
                />
                <ChevronDown size={16} className="text-slate-400" />
              </button>

              {openDropdown === "profile" && (
                <div className="absolute right-0 top-full mt-1 w-52 bg-white rounded-xl shadow-lg border border-slate-100 py-2 z-50">
                  <div className="px-4 py-2 border-b border-slate-100">
                    <p className="text-sm font-semibold text-navy">Dr. Rakesh Sharma</p>
                    <p className="text-xs text-slate-500">Issuer Admin</p>
                  </div>
                  <button
                    onClick={() => {
                      setOpenDropdown(null);
                      navigate("/issuerdashboard/settings");
                    }}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-slate-600 hover:bg-brand-light hover:text-navy transition-colors"
                  >
                    <Settings size={16} />
                    Settings
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 text-sm text-rose-500 hover:bg-rose-50 transition-colors"
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-brand-light transition-colors"
            >
              <Menu size={22} className="text-navy" />
            </button>
          </div>
        </div>
      </header>

      {/* ── MOBILE OVERLAY ── */}
      {isMobileMenuOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* ── MOBILE DRAWER (nav collapses to vertical list here only) ── */}
      <div
        className={`
          lg:hidden fixed inset-y-0 right-0 z-50
          w-72 bg-white flex flex-col shadow-xl
          transform transition-transform duration-300 ease-in-out
          ${isMobileMenuOpen ? "translate-x-0" : "translate-x-full"}
        `}
      >
        <div className="p-4 border-b border-slate-200 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="text-brand" size={22} />
            <span className="text-navy font-bold">
              Certify<span className="text-brand">Vault</span>
            </span>
          </div>
          <button onClick={() => setIsMobileMenuOpen(false)} className="p-1 rounded hover:bg-brand-light">
            <X size={20} className="text-navy" />
          </button>
        </div>

        <nav className="flex-1 p-3 overflow-y-auto">
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
                    `flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-sm transition-colors ${
                      isActive ? "bg-brand-light text-brand font-semibold" : "text-slate-600 hover:bg-brand-light"
                    }`
                  }
                >
                  <Icon size={18} />
                  {group.title}
                </NavLink>
              );
            }
            return (
              <div key={group.title} className="mb-1">
                <p className="px-4 pt-3 pb-1 text-xs font-semibold text-slate-400 uppercase tracking-wide">
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
                        `flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm transition-colors ${
                          isActive ? "bg-brand-light text-brand font-semibold" : "text-slate-600 hover:bg-brand-light"
                        }`
                      }
                    >
                      <ChildIcon size={17} />
                      {child.title}
                    </NavLink>
                  );
                })}
              </div>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-200">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
          >
            <LogOut size={19} />
            <span className="text-sm font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* ── LOGOUT MODAL ── */}
      {showLogoutModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
          <div className="bg-white rounded-2xl shadow-xl max-w-md w-full">
            <div className="flex items-center justify-between p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-navy">Confirm Logout</h3>
              <button onClick={cancelLogout} className="text-slate-400 hover:text-slate-600 transition-colors">
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-slate-600 text-sm">
                Are you sure you want to logout? You'll need to sign in again to access the Issuer Dashboard.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 p-6 border-t border-slate-200">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 text-sm font-medium text-navy bg-white border border-slate-300 rounded-lg hover:bg-brand-light transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 text-sm font-medium text-white bg-rose-600 rounded-lg hover:bg-rose-700 transition-colors"
              >
                Logout
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
    <div className="flex items-start justify-between border-b border-slate-200 bg-white px-6 py-4 rounded-t-2xl">
      <div>
        <h1 className="text-xl font-semibold text-navy">{title}</h1>
        {description && <p className="mt-1 text-sm text-slate-500">{description}</p>}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex items-center gap-2 justify-center rounded-lg text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand/40 disabled:pointer-events-none disabled:opacity-50 bg-brand text-white hover:bg-brand/90 h-9 px-4"
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
    <div className="min-h-screen bg-brand-light font-figtree">
      <TopNav />
      <main className="p-6">
        <Outlet />
      </main>
    </div>
  );
}

export default IssuerDashLayout;