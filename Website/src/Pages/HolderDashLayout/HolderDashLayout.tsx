import { useState, type ReactNode } from "react";
import { NavLink, Outlet } from "react-router-dom";
import {
  ShieldCheck,
  Home,
  FileBadge,
  ScanSearch,
  Share2,
  Activity,
  UserRound,
  Bell,
  Search,
  Menu,
  X,
  LogOut,
  ChevronDown,
  type LucideIcon,
} from "lucide-react";
import logo from "/logo1.png";

interface NavItem {
  title: string;
  path: string;
  icon: LucideIcon;
}

const navItems: NavItem[] = [
  { title: "Home", path: "/holderdashboard", icon: Home },
  { title: "My Certificates", path: "/holderdashboard/certificates", icon: FileBadge },
  { title: "Verification", path: "/holderdashboard/verification", icon: ScanSearch },
  { title: "Share", path: "/holderdashboard/share", icon: Share2 },
  { title: "Activity", path: "/holderdashboard/activity", icon: Activity },
  { title: "Profile", path: "/holderdashboard/profile", icon: UserRound },
];

export function TopNav() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);

  const handleLogout = (): void => {
    setShowProfileMenu(false);
    setShowLogoutModal(true);
  };
  const confirmLogout = (): void => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.href = "/";
  };
  const cancelLogout = (): void => setShowLogoutModal(false);

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 lg:px-6">
          {/* ── LOGO ── */}
          <div className="flex shrink-0 items-center gap-2">
            <img
              src={logo}
              alt="CertifyVault Logo"
              className="h-8 w-auto object-contain"
            />
            <span className="hidden text-lg font-bold text-gray-900 sm:inline">
              CertifyVault
            </span>
          </div>

          {/* ── DESKTOP HORIZONTAL NAV ── */}
          <nav className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/holderdashboard"}
                  className={({ isActive }) =>
                    `group relative flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-all duration-150 ${
                      isActive
                        ? "text-blue-600"
                        : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                    }`
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={17}
                        className={`shrink-0 transition-transform duration-150 group-hover:scale-110 ${
                          isActive ? "text-blue-600" : "text-gray-500"
                        }`}
                      />
                      <span className="whitespace-nowrap">{item.title}</span>
                      <span
                        className={`absolute -bottom-[17px] left-1/2 h-0.5 w-full -translate-x-1/2 rounded-full bg-blue-600 transition-all duration-200 ${
                          isActive ? "opacity-100" : "opacity-0 group-hover:opacity-40"
                        }`}
                      />
                    </>
                  )}
                </NavLink>
              );
            })}
          </nav>

          {/* ── RIGHT ACTIONS ── */}
          <div className="flex shrink-0 items-center gap-2 lg:gap-3">
            <button className="hidden cursor-pointer items-center gap-2 rounded-lg border border-gray-200 px-3 py-2 text-sm text-gray-500 transition-colors hover:bg-gray-50 md:flex">
              <Search size={16} />
              <span className="hidden xl:inline">Search certificates...</span>
            </button>

            <button
              className="relative cursor-pointer rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              aria-label="Notifications"
            >
              <Bell size={20} />
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-red-500" />
            </button>

            {/* ── PROFILE DROPDOWN ── */}
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu((p) => !p)}
                className="flex cursor-pointer items-center gap-2 rounded-lg py-1 pl-1 pr-2 transition-colors hover:bg-gray-50"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                  <ShieldCheck size={16} />
                </span>
                <span className="hidden text-left sm:block">
                  <span className="block text-sm font-medium leading-tight text-gray-900">
                    Certificate Holder
                  </span>
                  <span className="block text-xs leading-tight text-gray-500">
                    Student
                  </span>
                </span>
                <ChevronDown
                  size={16}
                  className={`hidden text-gray-400 transition-transform duration-150 sm:block ${
                    showProfileMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showProfileMenu && (
                <>
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfileMenu(false)}
                  />
                  <div className="absolute right-0 z-50 mt-2 w-48 rounded-lg border border-gray-200 bg-white py-1 shadow-lg">
                    <NavLink
                      to="/holderdashboard/profile"
                      onClick={() => setShowProfileMenu(false)}
                      className="flex cursor-pointer items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <UserRound size={16} />
                      My Profile
                    </NavLink>
                    <button
                      onClick={handleLogout}
                      className="flex w-full cursor-pointer items-center gap-2 px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </div>
                </>
              )}
            </div>

            {/* ── MOBILE MENU TOGGLE ── */}
            <button
              onClick={() => setIsMobileMenuOpen((p) => !p)}
              className="cursor-pointer rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
              aria-label="Toggle menu"
            >
              {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {/* ── MOBILE DROPDOWN NAV ── */}
        {isMobileMenuOpen && (
          <nav className="border-t border-gray-200 bg-white px-4 py-2 lg:hidden">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  end={item.path === "/holderdashboard"}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={({ isActive }) =>
                    `flex cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-sm font-medium transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-600"
                        : "text-gray-600 hover:bg-gray-50"
                    }`
                  }
                >
                  <Icon size={18} />
                  {item.title}
                </NavLink>
              );
            })}
            <button
              onClick={handleLogout}
              className="mt-1 flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-3 text-left text-sm font-medium text-red-600 hover:bg-red-50"
            >
              <LogOut size={18} />
              Logout
            </button>
          </nav>
        )}
      </header>

      {/* ── LOGOUT CONFIRM MODAL ── */}
      {showLogoutModal && (
        <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4 backdrop-blur-sm">
          <div className="w-full max-w-md rounded-lg bg-white shadow-xl">
            <div className="flex items-center justify-between border-b border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-900">
                Confirm Logout
              </h3>
              <button
                onClick={cancelLogout}
                className="cursor-pointer text-gray-400 transition-colors hover:text-gray-600"
              >
                <X size={20} />
              </button>
            </div>
            <div className="p-6">
              <p className="text-gray-600">
                Are you sure you want to logout? You'll need to sign in again
                to access your certificates.
              </p>
            </div>
            <div className="flex items-center justify-end gap-3 border-t border-gray-200 p-6">
              <button
                onClick={cancelLogout}
                className="cursor-pointer rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="cursor-pointer rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700"
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
    <div className="flex items-start justify-between border-b border-gray-200 bg-white px-6 py-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
        {description && (
          <p className="mt-1 text-sm text-gray-600">{description}</p>
        )}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="inline-flex h-9 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-blue-600 px-3 text-sm font-medium text-white transition-colors hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50"
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
      className="min-h-screen bg-gray-50"
      style={{ fontFamily: "'Urbanist', sans-serif" }}
    >
      <link
        href="https://fonts.googleapis.com/css2?family=Urbanist:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />
      <style>{`* { font-family: 'Urbanist', sans-serif; }`}</style>
      <TopNav />
      <main className="min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

export default HolderDashboardLayout;