import React, { useState, useEffect, useRef } from "react";
import {
  LayoutGrid,
  Landmark,
  Users,
  FileStack,
  ShieldCheck,
  ShieldAlert,
  Boxes,
  Activity,
  ScrollText,
  Settings,
  Search,
  Bell,
  Menu,
  X,
  LogOut,
} from "lucide-react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import logo2 from "../../assets/Logo3.png";

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
  { key: "overview", 
    label: "Overview", 
    icon: LayoutGrid, 
    path: "/admindashboard" 
  },

  { key: "institutions", 
    label: "Institutions", 
    icon: Landmark, 
    path: "/admindashboard/institutions" 
  },

  { key: "users", 
    label: "Users", 
    icon: Users, 
    path: "/admindashboard/users" 
  },

  { key: "issuers", 
    label: "Issuers", 
    icon: FileStack, 
    path: "/admindashboard/issuers" 
  },

  { key: "verification", 
    label: "Verification Activity", 
    icon: ShieldCheck, 
    path: "/admindashboard/verification" 
  },

  { key: "fraud", 
    label: "Fraud & Security", 
    icon: ShieldAlert, 
    path: "/admindashboard/fraud" 
  },

  { key: "blockchain", 
    label: "Blockchain", 
    icon: Boxes, 
    path: "/admindashboard/blockchain" 
  },

  { key: "health", 
    label: "System Health", 
    icon: Activity, 
    path: "/admindashboard/health" 
  },

  { key: "audit", 
    label: "Audit Logs", 
    icon: ScrollText, 
    path: "/admindashboard/audit" 
  },
  
  { key: "settings", 
    label: "Settings", 
    icon: Settings, 
    path: "/dashboard/admin/settings" 
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
/*  Fit-to-height sizing for the icon rail — shrinks buttons/gaps    */
/*  so all items always fit with no scrolling, no overlap.           */
/*                                                                    */
/*  NOTE: this hook measures the *nav* container's own clientHeight, */
/*  which is a CSS-pixel measurement. Browser zoom (90% / 100% /     */
/*  110%) scales layout viewport + element sizes together, so the    */
/*  ratio between "space needed" and "space available" is preserved */
/*  and the computed fit stays stable across zoom levels — it only   */
/*  shrinks when there genuinely isn't enough vertical room (e.g. a  */
/*  very short window), never as a side-effect of zooming.           */
/* ---------------------------------------------------------------- */

interface RailFit {
  size: number;
  gap: number;
  icon: number;
}

function useFitRail(count: number) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [fit, setFit] = useState<RailFit>({ size: 52, gap: 10, icon: 19 });

  useEffect(() => {
    const el = containerRef.current;
    if (!el || count <= 0) return;

    const MAX_SIZE = 52;
    const MAX_GAP = 10;
    const MIN_SIZE = 30;
    const MIN_GAP = 3;

    const compute = () => {
      const available = el.clientHeight;
      const neededAtMax = count * MAX_SIZE + (count - 1) * MAX_GAP;

      if (available <= 0) return;

      if (neededAtMax <= available || count <= 1) {
        setFit({ size: MAX_SIZE, gap: MAX_GAP, icon: 19 });
        return;
      }

      const sizeRange = MAX_SIZE - MIN_SIZE;
      const gapRange = MAX_GAP - MIN_GAP;
      const denom = count * sizeRange + (count - 1) * gapRange;
      const neededAtMin = count * MIN_SIZE + (count - 1) * MIN_GAP;
      let t = denom > 0 ? (available - neededAtMin) / denom : 0;
      t = Math.max(0, Math.min(1, t));

      const size = MIN_SIZE + t * sizeRange;
      const gap = MIN_GAP + t * gapRange;
      const icon = Math.max(14, Math.round(size * 0.36));

      setFit({ size, gap, icon });
    };

    compute();
    const ro = new ResizeObserver(compute);
    ro.observe(el);
    window.addEventListener("resize", compute);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", compute);
    };
  }, [count]);

  return { containerRef, ...fit };
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
/*  Desktop Sidebar — light-theme circular icon rail                 */
/* ---------------------------------------------------------------- */

interface RailButtonProps {
  item: NavItem;
  active: boolean;
  onClick: () => void;
  size: number;
  iconSize: number;
}

interface TooltipPos {
  x: number;
  y: number;
}

function RailButton({ item, active, onClick, size, iconSize }: RailButtonProps) {
  const [tooltipPos, setTooltipPos] = useState<TooltipPos | null>(null);
  const Icon = item.icon;

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setTooltipPos({ x: r.right + 12, y: r.top + r.height / 2 });
      }}
      onMouseLeave={() => setTooltipPos(null)}
    >
      <button
        onClick={onClick}
        aria-label={item.label}
        aria-current={active ? "page" : undefined}
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: active ? COLORS.blue : COLORS.white,
          color: active ? COLORS.white : COLORS.navy,
          boxShadow: "0 2px 6px rgba(0,15,62,0.07)",
          transition: "background .15s ease, transform .1s ease, box-shadow .15s ease, width .15s ease, height .15s ease",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <Icon size={iconSize} strokeWidth={1.8} />
      </button>

      {/* tooltip — fixed so it escapes sidebar's overflow:hidden */}
      {tooltipPos && (
        <div
          style={{
            position: "fixed",
            left: tooltipPos.x,
            top: tooltipPos.y,
            transform: "translateY(-50%)",
            background: COLORS.navy,
            color: COLORS.white,
            fontFamily: "Figtree, sans-serif",
            fontSize: 12.5,
            fontWeight: 600,
            padding: "7px 12px",
            borderRadius: 9,
            whiteSpace: "nowrap",
            boxShadow: "0 10px 24px rgba(0,15,62,0.28)",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          {item.label}
        </div>
      )}
    </div>
  );
}

/* Logout rail button — visually distinct (red) but sized to match the
   nav rail's current fit so it never causes the rail above it to
   look mismatched. It sits OUTSIDE the useFitRail-measured container,
   so it has a fixed footprint and is never itself a candidate for
   shrinking — it simply reserves its own space at the bottom of the
   sidebar, which the fit calculation above it already accounts for
   automatically (nav container is flex:1, so it only ever gets the
   height that's left over once brand + divider + logout are laid out). */
interface LogoutRailButtonProps {
  onClick: () => void;
  size: number;
  iconSize: number;
}

function LogoutRailButton({ onClick, size, iconSize }: LogoutRailButtonProps) {
  const [tooltipPos, setTooltipPos] = useState<TooltipPos | null>(null);

  return (
    <div
      style={{
        position: "relative",
        display: "flex",
        justifyContent: "center",
        flexShrink: 0,
      }}
      onMouseEnter={(e) => {
        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
        setTooltipPos({ x: r.right + 12, y: r.top + r.height / 2 });
      }}
      onMouseLeave={() => setTooltipPos(null)}
    >
      <button
        onClick={onClick}
        aria-label="Log out"
        style={{
          width: size,
          height: size,
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: COLORS.white,
          color: COLORS.red,
          boxShadow: "0 2px 6px rgba(0,15,62,0.07)",
          transition: "background .15s ease, color .15s ease",
          flexShrink: 0,
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = COLORS.redSoft;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = COLORS.white;
        }}
      >
        <LogOut size={iconSize} strokeWidth={1.8} />
      </button>

      {tooltipPos && (
        <div
          style={{
            position: "fixed",
            left: tooltipPos.x,
            top: tooltipPos.y,
            transform: "translateY(-50%)",
            background: COLORS.navy,
            color: COLORS.white,
            fontFamily: "Figtree, sans-serif",
            fontSize: 12.5,
            fontWeight: 600,
            padding: "7px 12px",
            borderRadius: 9,
            whiteSpace: "nowrap",
            boxShadow: "0 10px 24px rgba(0,15,62,0.28)",
            zIndex: 9999,
            pointerEvents: "none",
          }}
        >
          Log out
        </div>
      )}
    </div>
  );
}

interface SidebarProps {
  activeKey: string;
  onNavigate: (item: NavItem) => void;
  onLogoutClick: () => void;
}

function Sidebar({ activeKey, onNavigate, onLogoutClick }: SidebarProps) {
  const { containerRef, size, gap, icon } = useFitRail(NAV_ITEMS.length);

  return (
    <aside
      style={{
        width: 96,
        flexShrink: 0,
        height: "100vh",
        overflow: "hidden",
        background: COLORS.white,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "26px 0 20px",
        borderRight: `1px solid ${COLORS.line}`,
        gap: 0,
        boxSizing: "border-box",
      }}
    >
      {/* brand mark */}
      <div
        style={{
          width: 44,
          height: 44,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
          marginBottom: 20,
          overflow: "hidden",
        }}
      >
        <img
          src={logo2}
          alt="Logo"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "contain",
          }}
        />
      </div>

      {/* divider */}
      <div style={{ width: 28, height: 1, background: COLORS.line, marginBottom: 8, flexShrink: 0 }} />

      {/* nav rail — sized to always fit the remaining height, no scrolling.
          This container is flex:1 / minHeight:0, so it only ever receives
          the space left over after the brand mark and the logout button
          below have taken theirs — that's what keeps the whole sidebar
          scroll-free and stable across browser zoom levels. */}
      <nav
        ref={containerRef}
        style={{
          display: "flex",
          flexDirection: "column",
          gap,
          flex: 1,
          minHeight: 0,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {NAV_ITEMS.map((item) => (
          <RailButton
            key={item.key}
            item={item}
            active={activeKey === item.key}
            onClick={() => onNavigate(item)}
            size={size}
            iconSize={icon}
          />
        ))}
      </nav>

      {/* divider above logout */}
      <div style={{ width: 28, height: 1, background: COLORS.line, margin: "8px 0", flexShrink: 0 }} />

      {/* logout — pinned to the bottom-left of the sidebar, fixed footprint */}
      <div style={{ flexShrink: 0 }}>
        <LogoutRailButton onClick={onLogoutClick} size={size} iconSize={icon} />
      </div>
    </aside>
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
  const location = useLocation();

  // Active nav item is derived from the current route, same idea as
  // Admindash.jsx's handleNavigation/activeTab pairing.
  const activeItem: NavItem =
    NAV_ITEMS.find((item) => location.pathname === item.path) ||
    NAV_ITEMS.find((item) => location.pathname.startsWith(item.path) && item.path !== "/admindashboard") ||
    NAV_ITEMS[0];
  const activeKey = activeItem.key;
  const activeLabel = activeItem.label;

  const handleNavigate = (item: NavItem) => {
    navigate(item.path);
  };

  const handleLogoutConfirm = () => {
    // Wire this up to your actual auth/session teardown
    // (e.g. clearing an auth context, invalidating a session token, etc.)
    setShowLogoutConfirm(false);
    navigate("/login");
  };

  return (
    <div
      style={{
        fontFamily: "Figtree, sans-serif",
        display: "flex",
        flexDirection: "row",
        height: "100vh",
        overflow: "hidden",
        background: COLORS.mainBg,
        color: COLORS.navy,
      }}
    >
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Figtree:ital,wght@0,300..900;1,300..900&display=swap');`}</style>

      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sidebar
          activeKey={activeKey}
          onNavigate={handleNavigate}
          onLogoutClick={() => setShowLogoutConfirm(true)}
        />
      )}

      {/* Mobile Drawer */}
      {isMobile && (
        <MobileDrawer
          activeKey={activeKey}
          onNavigate={handleNavigate}
          isOpen={drawerOpen}
          setIsOpen={setDrawerOpen}
          onLogoutClick={() => setShowLogoutConfirm(true)}
        />
      )}

      {/* Logout confirmation modal — shared by desktop rail + mobile drawer */}
      <LogoutConfirmModal
        isOpen={showLogoutConfirm}
        onCancel={() => setShowLogoutConfirm(false)}
        onConfirm={handleLogoutConfirm}
      />

      <main
        style={{
          flex: 1,
          overflowY: "auto",
          padding: isMobile ? "20px 16px 20px" : "30px 40px 50px",
          background: COLORS.mainBg,
          position: "relative",
        }}
      >
        {/* topbar */}
        <div
          style={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            alignItems: isMobile ? "stretch" : "center",
            justifyContent: "space-between",
            marginBottom: isMobile ? 20 : 28,
            gap: isMobile ? 16 : 24,
            position: "relative",
          }}
        >
          <div style={{ flex: 1 }}>
            <h1 style={{ fontSize: isMobile ? 21 : 26, fontWeight: 800, letterSpacing: -0.3, margin: 0 }}>
              {activeLabel}
            </h1>
            <p style={{ fontSize: 13.5, color: COLORS.textDim, fontWeight: 500, marginTop: 4 }}>
              Platform-wide activity across institutions, issuers &amp; the verification ledger
            </p>
          </div>

          {/* Mobile Hamburger Button */}
          {isMobile && (
            <button
              onClick={() => setDrawerOpen(true)}
              style={{
                position: "absolute",
                top: 0,
                right: 0,
                width: 42,
                height: 42,
                borderRadius: 14,
                background: COLORS.white,
                border: `1px solid ${COLORS.line}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                color: COLORS.navy,
                transition: "background 0.15s ease, box-shadow 0.15s ease",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = COLORS.lightBlue;
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,15,62,0.1)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = COLORS.white;
                e.currentTarget.style.boxShadow = "none";
              }}
            >
              <Menu size={20} />
            </button>
          )}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              flexWrap: isMobile ? "wrap" : "nowrap",
              width: isMobile ? "100%" : "auto",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                background: COLORS.white,
                border: `1px solid ${COLORS.line}`,
                borderRadius: 14,
                padding: "10px 16px",
                width: isMobile ? "100%" : 260,
                boxSizing: "border-box",
              }}
            >
              <Search size={16} color={COLORS.textDim} />
              <input
                placeholder="Search institutions, users, logs…"
                style={{
                  border: "none",
                  outline: "none",
                  fontFamily: "inherit",
                  fontSize: 13.5,
                  color: COLORS.navy,
                  background: "transparent",
                  width: "100%",
                }}
              />
            </div>

            <button
              style={{
                width: 42,
                height: 42,
                borderRadius: 14,
                background: COLORS.white,
                border: `1px solid ${COLORS.line}`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                cursor: "pointer",
                position: "relative",
                flexShrink: 0,
              }}
            >
              <Bell size={18} color={COLORS.navy} />
              <span
                style={{
                  position: "absolute",
                  top: 9,
                  right: 9,
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: COLORS.red,
                  border: `2px solid ${COLORS.white}`,
                }}
              />
            </button>
          </div>
        </div>

        {/* Page content — each sidebar item's own page renders here via its route */}
        <Outlet />
      </main>
    </div>
  );
}