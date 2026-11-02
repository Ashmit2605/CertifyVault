import React, { useState, useEffect } from "react";
import {
  LayoutGrid,
  FileStack,
  ShieldCheck,
  BadgeCheck,
  ShieldAlert,
  Boxes,
  Activity,
  ScrollText,
  Settings,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useClerk } from "@clerk/clerk-react";
import logo2 from "../../assets/Logo3.webp";

/**
 * Design tokens — Vault / Platform Admin
 * Navy   #000F3E  — primary text, shield mark
 * Blue   #0050F5  — "Vault" accent, active states
 * White  #FFFFFF  — surfaces
 * Light Blue #F0F2F8 — subtle main-content wash
 * Font: Figtree
 */

const COLORS = {
  navy: "#000F3E",
  blue: "#0050F5",
  blueSoft: "#3E77FF",
  white: "#FFFFFF",
  lightBlue: "#F0F2F8",
  mainBg: "#F7F8FC",
  line: "#E2E6F0",
  textDim: "#6B7BA6",
  green: "#18B37D",
  amber: "#F5A623",
  red: "#F5484B",
  redSoft: "#FDECEC",
};

interface NavItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  path: string;
}

// Each item's `path` drives navigation via react-router, same pattern as Admindash.jsx
const NAV_ITEMS: NavItem[] = [
  {
    key: "overview",
    label: "Overview",
    icon: LayoutGrid,
    path: "/admindashboard"
  },

  {
    key: "issuers",
    label: "Issuers",
    icon: FileStack,
    path: "/admindashboard/issuers"
  },

  {
    key: "verifiers",
    label: "Verifiers",
    icon: BadgeCheck,
    path: "/admindashboard/verifiers"
  },

  {
    key: "verification",
    label: "Verification Activity",
    icon: ShieldCheck,
    path: "/admindashboard/verification"
  },

  {
    key: "fraud",
    label: "Fraud & Security",
    icon: ShieldAlert,
    path: "/admindashboard/fraud"
  },

  {
    key: "blockchain",
    label: "Blockchain",
    icon: Boxes,
    path: "/admindashboard/blockchain"
  },

  {
    key: "health",
    label: "System Health",
    icon: Activity,
    path: "/admindashboard/health"
  },

  {
    key: "audit",
    label: "Audit Logs",
    icon: ScrollText,
    path: "/admindashboard/audit"
  },

  {
    key: "settings",
    label: "Settings",
    icon: Settings,
    path: "/admindashboard/settings"
  },
];

/* ---------------------------------------------------------------- */
/*  Responsive breakpoint hook                                       */
/* ---------------------------------------------------------------- */

function useViewport() {
  const [width, setWidth] = useState(
    typeof window !== "undefined" ? window.innerWidth : 1280
  );

  useEffect(() => {
    const onResize = () => setWidth(window.innerWidth);
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  return {
    width,
    isMobile: width < 720,
    isTablet: width >= 720 && width < 1080,
  };
}

/* ---------------------------------------------------------------- */
/*  Logout confirmation modal                                        */
/* ---------------------------------------------------------------- */

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function LogoutConfirmModal({ isOpen, onCancel, onConfirm }: LogoutConfirmModalProps) {
  if (!isOpen) return null;

  return (
    <div
      onClick={onCancel}
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: "rgba(0, 15, 62, 0.45)",
        zIndex: 2000,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        animation: "fadeIn 0.15s ease-out",
      }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-modal-title"
        style={{
          width: "100%",
          maxWidth: 360,
          background: COLORS.white,
          borderRadius: 18,
          boxShadow: "0 24px 60px rgba(0,15,62,0.28)",
          padding: 24,
          fontFamily: "Figtree, sans-serif",
          animation: "scaleIn 0.18s cubic-bezier(0.4, 0, 0.2, 1)",
        }}
      >
        <h2
          id="logout-modal-title"
          style={{
            fontSize: 18,
            fontWeight: 800,
            color: COLORS.navy,
            margin: 0,
            marginBottom: 6,
          }}
        >
          Log out of CertifyVault?
        </h2>
        <p
          style={{
            fontSize: 13.5,
            color: COLORS.textDim,
            fontWeight: 500,
            margin: 0,
            marginBottom: 22,
            lineHeight: 1.5,
          }}
        >
          You'll need to sign back in to access the admin dashboard again.
        </p>

        <div style={{ display: "flex", gap: 10 }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1,
              padding: "11px 16px",
              borderRadius: 12,
              border: `1px solid ${COLORS.line}`,
              background: COLORS.white,
              color: COLORS.navy,
              fontFamily: "inherit",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.lightBlue)}
            onMouseLeave={(e) => (e.currentTarget.style.background = COLORS.white)}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1,
              padding: "11px 16px",
              borderRadius: 12,
              border: "none",
              background: COLORS.red,
              color: COLORS.white,
              fontFamily: "inherit",
              fontSize: 14,
              fontWeight: 700,
              cursor: "pointer",
              transition: "background 0.15s ease",
              boxShadow: "0 10px 22px rgba(245,72,75,0.28)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "#D93E41")}
            onMouseLeave={(e) => (e.currentTarget.style.background = COLORS.red)}
          >
            Log out
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        @keyframes scaleIn {
          from { opacity: 0; transform: scale(0.94) translateY(6px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  Mobile Drawer — hamburger menu sidebar for mobile               */
/* ---------------------------------------------------------------- */

interface MobileDrawerProps {
  activeKey: string;
  onNavigate: (item: NavItem) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onLogoutClick: () => void;
}

function MobileDrawer({ activeKey, onNavigate, isOpen, setIsOpen, onLogoutClick }: MobileDrawerProps) {
  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0, 15, 62, 0.4)",
            zIndex: 999,
            animation: "fadeIn 0.2s ease-out",
          }}
        />
      )}

      {/* Drawer */}
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "85vw",
          maxWidth: 340,
          height: "100vh",
          background: COLORS.white,
          boxShadow: isOpen ? "8px 0 32px rgba(0,15,62,0.16)" : "none",
          zIndex: 1000,
          transform: isOpen ? "translateX(0)" : "translateX(-100%)",
          transition: "transform 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          display: "flex",
          flexDirection: "column",
          borderRight: `1px solid ${COLORS.line}`,
        }}
      >
        {/* Drawer Header */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "16px 20px",
            borderBottom: `1px solid ${COLORS.line}`,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: "50%",
              background: COLORS.navy,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 8px 18px rgba(0,15,62,0.25)",
            }}
          >
            <svg width={16} height={16} viewBox="0 0 24 24" fill="none">
              <path
                d="M12 2L4 5.5V11c0 5.2 3.4 9.7 8 11 4.6-1.3 8-5.8 8-11V5.5L12 2Z"
                fill={COLORS.white}
              />
              <path
                d="M8.5 12.2l2.4 2.4 4.6-4.9"
                stroke={COLORS.blue}
                strokeWidth={1.8}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 36,
              height: 36,
              borderRadius: 10,
              color: COLORS.navy,
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.lightBlue)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "none")}
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Items */}
        <nav
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "8px 12px",
          }}
        >
          {NAV_ITEMS.map((item) => {
            const ItemIcon = item.icon;
            const isActive = activeKey === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  onNavigate(item);
                  setIsOpen(false);
                }}
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                  gap: 12,
                  padding: "13px 16px",
                  borderRadius: 12,
                  border: "none",
                  background: isActive ? COLORS.lightBlue : "transparent",
                  color: isActive ? COLORS.blue : COLORS.navy,
                  cursor: "pointer",
                  fontFamily: "Figtree, sans-serif",
                  fontSize: 14.5,
                  fontWeight: isActive ? 700 : 600,
                  textAlign: "left",
                  transition: "background 0.15s ease, color 0.15s ease",
                  marginBottom: 4,
                }}
                onMouseEnter={(e) => {
                  if (!isActive) e.currentTarget.style.background = "rgba(240, 242, 248, 0.5)";
                }}
                onMouseLeave={(e) => {
                  if (!isActive) e.currentTarget.style.background = "transparent";
                }}
              >
                <ItemIcon size={18} strokeWidth={1.8} />
                <span style={{ flex: 1 }}>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Logout — pinned to the bottom of the drawer */}
        <div
          style={{
            flexShrink: 0,
            padding: "12px",
            borderTop: `1px solid ${COLORS.line}`,
          }}
        >
          <button
            onClick={() => {
              setIsOpen(false);
              onLogoutClick();
            }}
            style={{
              width: "100%",
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "13px 16px",
              borderRadius: 12,
              border: "none",
              background: "transparent",
              color: COLORS.red,
              cursor: "pointer",
              fontFamily: "Figtree, sans-serif",
              fontSize: 14.5,
              fontWeight: 700,
              textAlign: "left",
              transition: "background 0.15s ease",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = COLORS.redSoft)}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <LogOut size={18} strokeWidth={1.8} />
            <span style={{ flex: 1 }}>Log out</span>
          </button>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  );
}

/* ---------------------------------------------------------------- */
/*  Desktop dashboard navigation                                     */
/* ---------------------------------------------------------------- */

interface RailButtonProps {
  item: NavItem;
  active: boolean;
  onClick: () => void;
}

function RailButton({ item, active, onClick }: RailButtonProps) {
  const Icon = item.icon;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      style={{
        flexShrink: 0,
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "10px 12px",
        border: "none",
        borderRadius: 10,
        cursor: "pointer",
        background: active ? COLORS.lightBlue : "transparent",
        color: active ? COLORS.blue : COLORS.textDim,
        fontFamily: "inherit",
        fontSize: 13,
        fontWeight: active ? 700 : 600,
        whiteSpace: "nowrap",
      }}
    >
      <Icon size={16} strokeWidth={1.9} />
      {item.label}
    </button>
  );
}

interface LogoutRailButtonProps {
  onClick: () => void;
}

function LogoutRailButton({ onClick }: LogoutRailButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label="Log out"
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 8,
        padding: "9px 12px",
        border: `1px solid ${COLORS.line}`,
        borderRadius: 10,
        background: COLORS.white,
        color: COLORS.red,
        fontFamily: "inherit",
        fontSize: 13,
        fontWeight: 600,
        cursor: "pointer",
        flexShrink: 0,
      }}
    >
      <LogOut size={16} strokeWidth={1.8} />
      Log out
    </button>
  );
}

interface SidebarProps {
  activeKey: string;
  onNavigate: (item: NavItem) => void;
  onLogoutClick: () => void;
}

function Sidebar({ activeKey, onNavigate, onLogoutClick }: SidebarProps) {
  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 40,
        width: "100%",
        background: COLORS.white,
        borderBottom: `1px solid ${COLORS.line}`,
      }}
    >
      <div
        style={{
          maxWidth: 1440,
          minHeight: 64,
          margin: "0 auto",
          padding: "10px 24px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
          <img src={logo2} alt="CertifyVault" style={{ width: 38, height: 38, objectFit: "contain" }} />
          <div>
            <div style={{ color: COLORS.navy, fontSize: 17, fontWeight: 800, lineHeight: 1.1 }}>
              Certify<span style={{ color: COLORS.blue }}>Vault</span>
            </div>
            <div style={{ color: COLORS.textDim, fontSize: 11, fontWeight: 600, marginTop: 3 }}>
              Platform Administrator
            </div>
          </div>
        </div>
        <LogoutRailButton onClick={onLogoutClick} />
      </div>
      <nav
        aria-label="Administrator navigation"
        style={{
          maxWidth: 1440,
          margin: "0 auto",
          padding: "0 24px 8px",
          display: "flex",
          alignItems: "center",
          gap: 4,
          overflowX: "auto",
        }}
      >
        {NAV_ITEMS.map((item) => (
          <RailButton
            key={item.key}
            item={item}
            active={activeKey === item.key}
            onClick={() => onNavigate(item)}
          />
        ))}
      </nav>
    </header>
  );
}

/* ---------------------------------------------------------------- */
/*  App                                                               */
/* ---------------------------------------------------------------- */

export default function AdminDashLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { isMobile } = useViewport();
  const navigate = useNavigate();
  const { signOut } = useClerk();
  const location = useLocation();

  // Active nav item is derived from the current route, same idea as
  // Admindash.jsx's handleNavigation/activeTab pairing.
  const activeItem: NavItem =
    NAV_ITEMS.find((item) => location.pathname === item.path) ||
    NAV_ITEMS.find((item) => location.pathname.startsWith(item.path) && item.path !== "/admindashboard") ||
    NAV_ITEMS[0];
  const activeKey = activeItem.key;

  const handleNavigate = (item: NavItem) => {
    navigate(item.path);
  };

  const handleLogoutConfirm = () => {
    setShowLogoutConfirm(false);
    void signOut({ redirectUrl: "/app/login" });
  };

  return (
    <div
      style={{
        fontFamily: "Figtree, sans-serif",
        display: "flex",
        flexDirection: "column",
        minHeight: "100vh",
        background: COLORS.mainBg,
        color: COLORS.navy,
      }}
    >
      {/* Desktop dashboard navigation */}
      {!isMobile && (
        <Sidebar
          activeKey={activeKey}
          onNavigate={handleNavigate}
          onLogoutClick={() => setShowLogoutConfirm(true)}
        />
      )}

      {/* Mobile header and drawer */}
      {isMobile && (
        <>
          <header
            style={{
              position: "sticky",
              top: 0,
              zIndex: 40,
              minHeight: 64,
              padding: "10px 16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              background: COLORS.white,
              borderBottom: `1px solid ${COLORS.line}`,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <img src={logo2} alt="CertifyVault" style={{ width: 36, height: 36, objectFit: "contain" }} />
              <span style={{ color: COLORS.navy, fontSize: 16, fontWeight: 800 }}>
                Certify<span style={{ color: COLORS.blue }}>Vault</span>
              </span>
            </div>
            <button
              type="button"
              onClick={() => setDrawerOpen(true)}
              aria-label="Open administrator navigation"
              style={{
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                width: 40,
                height: 40,
                border: `1px solid ${COLORS.line}`,
                borderRadius: 10,
                background: COLORS.white,
                color: COLORS.navy,
                cursor: "pointer",
              }}
            >
              <Menu size={20} />
            </button>
          </header>
          <MobileDrawer
            activeKey={activeKey}
            onNavigate={handleNavigate}
            isOpen={drawerOpen}
            setIsOpen={setDrawerOpen}
            onLogoutClick={() => setShowLogoutConfirm(true)}
          />
        </>
      )}

      {/* Logout confirmation modal — shared by desktop rail + mobile drawer */}
      <LogoutConfirmModal
        isOpen={showLogoutConfirm}
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogoutConfirm}
      />

      <main
        style={{
          width: "100%",
          maxWidth: 1440,
          margin: "0 auto",
          padding: isMobile ? "20px 16px 32px" : "28px 40px 50px",
          background: COLORS.mainBg,
          flex: 1,
          minWidth: 0,
        }}
      >
        {/* Page content — each sidebar item's own page renders here via its route */}
        <Outlet />
      </main>
    </div>
  );
}