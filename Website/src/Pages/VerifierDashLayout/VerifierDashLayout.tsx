import { useState, useRef, useEffect } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import {
  ShieldCheck,
  History,
  Bookmark,
  FileText,
  UserCircle,
  LogOut,
  Menu,
  X,
  LayoutGrid,
} from "lucide-react";

interface NavItem {
  title: string;
  path: string;
  icon: React.ElementType;
}

// Update these paths to match the routes you registered for the Verifier pages.
const BASE = "/verifierdashboard";

const navItems: NavItem[] = [
  { title: "Dashboard", path: BASE, icon: LayoutGrid },
  { title: "Verify", path: `/verifierdashboard/verify`, icon: ShieldCheck },
  { title: "History", path: `/verifierdashboard/history`, icon: History },
  { title: "Saved", path: `/verifierdashboard/saved`, icon: Bookmark },
  { title: "Reports", path: `/verifierdashboard/reports`, icon: FileText },
  { title: "Profile", path: `/verifierdashboard/settings`, icon: UserCircle },
];

// Shared tokens (same as the issuer / admin dashboards)
const PAGE_BG = "bg-[#F7F8FC]";
const SOFT_BG = "bg-[#F0F2F8]";
const SOFT_HOVER = "hover:bg-[#F0F2F8]";

export function VerifierTopNav() {
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

  // close mobile menu on route change
  useEffect(() => {
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
                Verifier Dashboard
              </div>
            </div>
          </div>

          {/* Desktop nav — centered between logo and logout */}
          <nav
            aria-label="Verifier navigation"
            className="hidden xl:flex flex-1 min-w-0 items-center justify-center gap-1"
          >
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === BASE}
                  className={({ isActive }) =>
                    `flex items-center gap-1.5 px-2.5 py-2.5 rounded-[10px] text-[13px] whitespace-nowrap transition-colors ${isActive
                      ? `${SOFT_BG} text-brand font-bold`
                      : `text-[#6B7BA6] font-semibold ${SOFT_HOVER} hover:text-navy`
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
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.path === BASE}
                onClick={() => setIsMobileMenuOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl mb-1 text-[14.5px] transition-colors ${isActive
                    ? `${SOFT_BG} text-brand font-bold`
                    : `text-navy font-semibold ${SOFT_HOVER}`
                  }`
                }
              >
                <Icon size={18} strokeWidth={1.8} />
                {item.title}
              </NavLink>
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
              You'll need to sign back in to access the verifier dashboard again.
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

export function VerifierDashLayout() {
  return (
    <div className={`min-h-screen flex flex-col ${PAGE_BG} font-figtree text-navy`}>
      <VerifierTopNav />
      <main
        className={`flex-1 min-w-0 w-full max-w-[1440px] mx-auto ${PAGE_BG} px-4 pt-5 pb-8 xl:px-10 xl:pt-7 xl:pb-[50px]`}
      >
        <Outlet />
      </main>
    </div>
  );
}

export default VerifierDashLayout;