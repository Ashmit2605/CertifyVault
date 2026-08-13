import React, { useState, useEffect } from "react";
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
  Plus,
  Menu,
  X,
} from "lucide-react";

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
  mainBg: "#F7F8FC", // subtle wash for the content area, distinct from the white sidebar
  line: "#E2E6F0",
  textDim: "#6B7BA6",
  green: "#18B37D",
  amber: "#F5A623",
  red: "#F5484B",
};

interface NavItem {
  key: string;
  label: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  badge?: number;
}

const NAV_ITEMS: NavItem[] = [
  { key: "overview", label: "Overview", icon: LayoutGrid },
  { key: "institutions", label: "Institutions", icon: Landmark, badge: 128 },
  { key: "users", label: "Users", icon: Users },
  { key: "issuers", label: "Issuers", icon: FileStack },
  { key: "verification", label: "Verification Activity", icon: ShieldCheck, badge: 14 },
  { key: "fraud", label: "Fraud & Security", icon: ShieldAlert, badge: 3 },
  { key: "blockchain", label: "Blockchain", icon: Boxes },
  { key: "health", label: "System Health", icon: Activity },
  { key: "audit", label: "Audit Logs", icon: ScrollText },
  { key: "settings", label: "Settings", icon: Settings },
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
/*  Mobile Drawer — hamburger menu sidebar for mobile               */
/* ---------------------------------------------------------------- */

function MobileDrawer({
  active,
  setActive,
  isOpen,
  setIsOpen,
}: {
  active: string;
  setActive: (k: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) {
  
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
            const isActive = active === item.key;
            return (
              <button
                key={item.key}
                onClick={() => {
                  setActive(item.key);
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
                {typeof item.badge === "number" && item.badge > 0 && (
                  <span
                    style={{
                      minWidth: 20,
                      height: 20,
                      padding: "0 6px",
                      borderRadius: 10,
                      background: item.key === "fraud" ? COLORS.red : COLORS.blue,
                      color: COLORS.white,
                      fontSize: 10,
                      fontWeight: 800,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      whiteSpace: "nowrap",
                    }}
                  >
                    {item.badge > 99 ? "99+" : item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Drawer Footer */}
        <div
          style={{
            padding: "16px 20px",
            borderTop: `1px solid ${COLORS.line}`,
            display: "flex",
            alignItems: "center",
            gap: 8,
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: "50%",
              background: COLORS.green,
              boxShadow: `0 0 0 4px rgba(24,179,125,0.16)`,
            }}
          />
          <span style={{ fontSize: 12, fontWeight: 600, color: COLORS.textDim }}>Ledger synced</span>
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

function RailButton({
  item,
  active,
  onClick,
}: {
  item: NavItem;
  active: boolean;
  onClick: () => void;
}) {
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);
  const Icon = item.icon;

  return (
    <div
      style={{ position: "relative", display: "flex", justifyContent: "center" }}
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
          width: 52,
          height: 52,
          borderRadius: "50%",
          border: "none",
          cursor: "pointer",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: active ? COLORS.blue : COLORS.white,
          color: active ? COLORS.white : COLORS.navy,
          boxShadow: active
            ? `0 10px 22px rgba(0,80,245,0.35)`
            : "0 2px 6px rgba(0,15,62,0.07)",
          transition: "background .15s ease, transform .1s ease, box-shadow .15s ease",
          position: "relative",
          flexShrink: 0,
        }}
      >
        <Icon size={19} strokeWidth={1.8} />
        {typeof item.badge === "number" && item.badge > 0 && (
          <span
            style={{
              position: "absolute",
              top: -2,
              right: -2,
              minWidth: 16,
              height: 16,
              padding: "0 4px",
              borderRadius: 999,
              background: item.key === "fraud" ? COLORS.red : COLORS.blue,
              color: COLORS.white,
              fontSize: 9,
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              border: `2px solid ${COLORS.lightBlue}`,
              boxSizing: "border-box",
            }}
          >
            {item.badge > 99 ? "99+" : item.badge}
          </span>
        )}
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
          {typeof item.badge === "number" && item.badge > 0 && (
            <span style={{ opacity: 0.6, marginLeft: 6 }}>· {item.badge}</span>
          )}
        </div>
      )}
    </div>
  );
}

function Sidebar({
  active,
  setActive,
}: {
  active: string;
  setActive: (k: string) => void;
}) {
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
        padding: "26px 0",
        borderRight: `1px solid ${COLORS.line}`,
        gap: 0,
      }}
    >
      {/* brand mark */}
      <div
        style={{
          width: 44,
          height: 44,
          borderRadius: "50%",
          background: COLORS.navy,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 8px 18px rgba(0,15,62,0.25)",
          flexShrink: 0,
          marginBottom: 20,
        }}
      >
        <svg width={20} height={20} viewBox="0 0 24 24" fill="none">
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

      {/* divider */}
      <div style={{ width: 28, height: 1, background: COLORS.line, marginBottom: 8 }} />

      {/* nav rail */}
      <nav
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          flex: 1,
          justifyContent: "center",
          overflow: "hidden",
        }}
      >
        {NAV_ITEMS.map((item) => (
          <RailButton
            key={item.key}
            item={item}
            active={active === item.key}
            onClick={() => setActive(item.key)}
          />
        ))}
      </nav>

      {/* footer: status */}
      <div
        style={{
          width: 10,
          height: 10,
          borderRadius: "50%",
          background: COLORS.green,
          boxShadow: `0 0 0 4px rgba(24,179,125,0.16)`,
          marginTop: 16,
          marginBottom: 12,
        }}
        title="Ledger synced"
      />
    </aside>
  );
}

/* ---------------------------------------------------------------- */
/*  Small building blocks for the main content                       */
/* ---------------------------------------------------------------- */

function StatCard({
  icon: Icon,
  iconBg,
  iconColor,
  trend,
  trendUp,
  value,
  label,
}: {
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  iconBg: string;
  iconColor: string;
  trend: string;
  trendUp: boolean;
  value: string;
  label: string;
}) {
  return (
    <div
      style={{
        background: COLORS.white,
        borderRadius: 18,
        border: `1px solid ${COLORS.line}`,
        padding: 20,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: 11,
            background: iconBg,
            color: iconColor,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Icon size={18} strokeWidth={1.8} />
        </div>
        <span
          style={{
            fontSize: 11.5,
            fontWeight: 700,
            padding: "3px 8px",
            borderRadius: 20,
            color: trendUp ? COLORS.green : COLORS.red,
            background: trendUp ? "rgba(24,179,125,0.12)" : "rgba(245,72,75,0.1)",
          }}
        >
          {trend}
        </span>
      </div>
      <div style={{ fontSize: 25, fontWeight: 800, color: COLORS.navy, letterSpacing: -0.4 }}>{value}</div>
      <div style={{ fontSize: 12.5, color: COLORS.textDim, fontWeight: 600, marginTop: 4 }}>{label}</div>
    </div>
  );
}

/* ---------------------------------------------------------------- */
/*  App                                                               */
/* ---------------------------------------------------------------- */

export default function PlatformAdminDashboard() {
  const [active, setActive] = useState("overview");
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { isMobile, isTablet } = useViewport();
  const activeLabel = NAV_ITEMS.find((n) => n.key === active)?.label ?? "Overview";

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
      {!isMobile && <Sidebar active={active} setActive={setActive} />}

      {/* Mobile Drawer */}
      {isMobile && <MobileDrawer active={active} setActive={setActive} isOpen={drawerOpen} setIsOpen={setDrawerOpen} />}

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

            <button
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 8,
                background: COLORS.blue,
                color: COLORS.white,
                border: "none",
                borderRadius: 14,
                padding: "11px 18px",
                fontFamily: "inherit",
                fontSize: 13.5,
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: "0 10px 20px rgba(0,80,245,0.28)",
                flex: isMobile ? 1 : "none",
                whiteSpace: "nowrap",
              }}
            >
              <Plus size={16} />
              New Institution
            </button>
          </div>
        </div>

        {/* stats */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile
              ? "repeat(2, 1fr)"
              : isTablet
                ? "repeat(3, 1fr)"
                : "repeat(5, 1fr)",
            gap: isMobile ? 10 : 16,
            marginBottom: isMobile ? 18 : 24,
          }}
        >
          <StatCard icon={Landmark} iconBg="rgba(0,80,245,0.1)" iconColor={COLORS.blue} trend="+4.2%" trendUp value="128" label="Institutions" />
          <StatCard icon={Users} iconBg="rgba(0,15,62,0.08)" iconColor={COLORS.navy} trend="+1.8%" trendUp value="42,918" label="Active Users" />
          <StatCard icon={ShieldCheck} iconBg="rgba(24,179,125,0.12)" iconColor={COLORS.green} trend="+0.6%" trendUp value="99.2%" label="Verification Success" />
          <StatCard icon={FileStack} iconBg="rgba(245,166,35,0.14)" iconColor={COLORS.amber} trend="+12" trendUp value="36" label="Issuers Onboarded" />
          <StatCard icon={ShieldAlert} iconBg="rgba(245,72,75,0.12)" iconColor={COLORS.red} trend="-2" trendUp={false} value="3" label="Open Fraud Alerts" />
        </div>

        {/* content panels */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: isMobile || isTablet ? "1fr" : "1.6fr 1fr",
            gap: 20,
          }}
        >
          <div style={{ background: COLORS.white, borderRadius: 28, border: `1px solid ${COLORS.line}`, padding: isMobile ? 18 : 24 }}>
            <h2 style={{ fontSize: 16.5, fontWeight: 800, margin: 0 }}>Verification Volume</h2>
            <p style={{ fontSize: 12, color: COLORS.textDim, fontWeight: 500, marginTop: 2 }}>
              Requests processed across the ledger, last 7 days
            </p>

            <div style={{ height: isMobile ? 160 : 200, display: "flex", alignItems: "flex-end", gap: isMobile ? 6 : 10, marginTop: 18 }}>
              {[
                { d: "Mon", h: 64, ghost: false },
                { d: "Tue", h: 82, ghost: false },
                { d: "Wed", h: 48, ghost: true },
                { d: "Thu", h: 91, ghost: false },
                { d: "Fri", h: 70, ghost: false },
                { d: "Sat", h: 38, ghost: true },
                { d: "Sun", h: 30, ghost: true },
              ].map((b) => (
                <div key={b.d} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 8 }}>
                  <div
                    style={{
                      width: "100%",
                      maxWidth: 34,
                      height: `${b.h}%`,
                      borderRadius: "8px 8px 4px 4px",
                      background: b.ghost ? COLORS.lightBlue : `linear-gradient(180deg, ${COLORS.blueSoft}, ${COLORS.blue})`,
                    }}
                  />
                  <span style={{ fontSize: 10.5, color: COLORS.textDim, fontWeight: 700 }}>{b.d}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={{ background: COLORS.white, borderRadius: 28, border: `1px solid ${COLORS.line}`, padding: isMobile ? 18 : 24 }}>
            <h2 style={{ fontSize: 16.5, fontWeight: 800, margin: 0 }}>Recent Activity</h2>
            <p style={{ fontSize: 12, color: COLORS.textDim, fontWeight: 500, marginTop: 2 }}>System &amp; audit log stream</p>

            <div style={{ display: "flex", flexDirection: "column", marginTop: 12 }}>
              {[
                { title: "Identity verified — Solstice Finance", sub: "Issuer · automated check", time: "2m", color: COLORS.green },
                { title: "Fraud alert raised — Harbor Vault Trust", sub: "Flagged by anomaly model", time: "18m", color: COLORS.red },
                { title: "Block #2,481,930 confirmed", sub: "142 records anchored", time: "31m", color: COLORS.blue },
                { title: "New admin invited", sub: "priya.desai@cedarunion.com", time: "1h", color: COLORS.amber },
              ].map((a) => (
                <div
                  key={a.title}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 12,
                    padding: "12px 4px",
                    borderBottom: `1px solid ${COLORS.lightBlue}`,
                  }}
                >
                  <div style={{ width: 8, height: 8, borderRadius: "50%", background: a.color, flexShrink: 0 }} />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 13, fontWeight: 700, color: COLORS.navy }}>{a.title}</div>
                    <div style={{ fontSize: 11.5, color: COLORS.textDim, fontWeight: 500, marginTop: 1 }}>{a.sub}</div>
                  </div>
                  <div style={{ fontSize: 11, color: COLORS.textDim, fontWeight: 600, whiteSpace: "nowrap" }}>{a.time}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}