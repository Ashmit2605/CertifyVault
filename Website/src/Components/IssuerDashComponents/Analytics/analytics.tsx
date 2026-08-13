import { useMemo, useState } from "react";
import {
  LineChart, Line, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { FileCheck2, Link as LinkIcon, Clock, CheckCircle2 } from "lucide-react";
import { PageHeader } from "../../../Pages/IssuerDashLayout/IssuerDashLayout";

/* ══════════════════════════════════════════════════════
   1. THEME + MOCK DATA
   Keep this for web, not mobile-heavy.
   ══════════════════════════════════════════════════════ */

const COLORS = {
  brand: "#0050F5",
  navy: "#000F3E",
  emerald: "#10B981",
  amber: "#F59E0B",
  rose: "#F43F5E",
  grid: "#EEF2F9",
  axis: "#94A3B8",
};

const PIE_COLORS = ["#0050F5", "#10B981", "#F59E0B", "#F43F5E", "#8B5CF6", "#06B6D4", "#64748B"];

// 🔧 Replace all mock arrays below with data from your Analytics API endpoints.

const issuedTrend = [
  { month: "Feb", issued: 210 },
  { month: "Mar", issued: 260 },
  { month: "Apr", issued: 240 },
  { month: "May", issued: 310 },
  { month: "Jun", issued: 290 },
  { month: "Jul", issued: 340 },
  { month: "Aug", issued: 312 },
];

const verificationTrend = [
  { month: "Feb", successful: 180, failed: 12, suspicious: 4 },
  { month: "Mar", successful: 210, failed: 15, suspicious: 6 },
  { month: "Apr", successful: 195, failed: 10, suspicious: 3 },
  { month: "May", successful: 250, failed: 18, suspicious: 8 },
  { month: "Jun", successful: 230, failed: 14, suspicious: 5 },
  { month: "Jul", successful: 275, failed: 20, suspicious: 9 },
  { month: "Aug", successful: 260, failed: 16, suspicious: 7 },
];

const certificateTypes = [
  { type: "Degree", count: 420 },
  { type: "Diploma", count: 260 },
  { type: "Bonafide", count: 180 },
  { type: "Course", count: 150 },
  { type: "Internship", count: 110 },
  { type: "Achievement", count: 90 },
  { type: "Custom", count: 38 },
];

const fraudDetection = [
  { month: "Feb", high: 2, medium: 5, low: 9 },
  { month: "Mar", high: 3, medium: 6, low: 11 },
  { month: "Apr", high: 1, medium: 4, low: 8 },
  { month: "May", high: 4, medium: 7, low: 13 },
  { month: "Jun", high: 2, medium: 5, low: 10 },
  { month: "Jul", high: 5, medium: 8, low: 14 },
  { month: "Aug", high: 3, medium: 6, low: 12 },
];

const revocationsByReason = [
  { reason: "Fraud", count: 14 },
  { reason: "Incorrect info", count: 9 },
  { reason: "Duplicate", count: 7 },
  { reason: "Issued in error", count: 5 },
  { reason: "Disciplinary/legal", count: 3 },
];

const blockchainTxTrend = [
  { day: "6 Aug", tx: 42 },
  { day: "7 Aug", tx: 58 },
  { day: "8 Aug", tx: 51 },
  { day: "9 Aug", tx: 66 },
  { day: "10 Aug", tx: 60 },
  { day: "11 Aug", tx: 74 },
  { day: "12 Aug", tx: 69 },
];

const blockchainStats = {
  totalTx: 1284,
  successRate: "99.4%",
  avgConfirmTime: "3.2s",
};

const RANGE_OPTIONS = ["Last 7 days", "Last 30 days", "Last 90 days"] as const;

/* ══════════════════════════════════════════════════════
   2. SHARED CARD SHELL
   ══════════════════════════════════════════════════════ */

function ChartCard({
  title,
  description,
  children,
  className = "",
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-100 shadow-sm p-5 ${className}`}>
      <div className="mb-4">
        <h3 className="text-sm font-semibold text-navy">{title}</h3>
        {description && <p className="text-xs text-slate-400 mt-0.5">{description}</p>}
      </div>
      {children}
    </div>
  );
}

const axisProps = {
  tick: { fontSize: 11, fill: COLORS.axis },
  tickLine: false,
  axisLine: { stroke: COLORS.grid },
};

const tooltipStyle = {
  fontSize: 12,
  borderRadius: 10,
  border: `1px solid ${COLORS.grid}`,
  boxShadow: "0 4px 12px rgba(0,15,62,0.08)",
};

/* ══════════════════════════════════════════════════════
   3. ANALYTICS PAGE (default export — route: /issuerdashboard/analytics)
   ══════════════════════════════════════════════════════ */

export default function Analytics() {
  const [range, setRange] = useState<(typeof RANGE_OPTIONS)[number]>("Last 30 days");

  // 🔧 Swap in a real fetch keyed on `range`; mock data is static here.
  const typesTotal = useMemo(() => certificateTypes.reduce((s, t) => s + t.count, 0), []);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <PageHeader title="Analytics" description="Trends across issuance, verification, fraud, and on-chain activity." />

        <div className="relative">
          <select
            value={range}
            onChange={(e) => setRange(e.target.value as (typeof RANGE_OPTIONS)[number])}
            className="pl-3 pr-8 py-2 rounded-lg bg-brand-light text-sm font-medium text-navy outline-none appearance-none cursor-pointer"
          >
            {RANGE_OPTIONS.map((r) => (
              <option key={r}>{r}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        {/* 1. Certificates Issued */}
        <ChartCard title="Certificates Issued" description="Volume of certificates issued over time">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={issuedTrend}>
              <CartesianGrid stroke={COLORS.grid} vertical={false} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="issued" stroke={COLORS.brand} strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 2. Verification Trends */}
        <ChartCard title="Verification Trends" description="Successful vs. failed vs. suspicious checks">
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={verificationTrend}>
              <CartesianGrid stroke={COLORS.grid} vertical={false} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Line type="monotone" dataKey="successful" name="Successful" stroke={COLORS.emerald} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="failed" name="Failed" stroke={COLORS.rose} strokeWidth={2} dot={false} />
              <Line type="monotone" dataKey="suspicious" name="Suspicious" stroke={COLORS.amber} strokeWidth={2} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 3. Certificate Types */}
        <ChartCard title="Certificate Types" description={`Breakdown across ${typesTotal.toLocaleString()} certificates`}>
          <div className="flex items-center gap-4">
            <ResponsiveContainer width="55%" height={220}>
              <PieChart>
                <Pie data={certificateTypes} dataKey="count" nameKey="type" innerRadius={55} outerRadius={85} paddingAngle={2}>
                  {certificateTypes.map((_, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={tooltipStyle} />
              </PieChart>
            </ResponsiveContainer>
            <div className="flex-1 space-y-1.5">
              {certificateTypes.map((t, i) => (
                <div key={t.type} className="flex items-center justify-between text-xs">
                  <span className="flex items-center gap-2 text-slate-600">
                    <span className="w-2.5 h-2.5 rounded-full" style={{ background: PIE_COLORS[i % PIE_COLORS.length] }} />
                    {t.type}
                  </span>
                  <span className="font-semibold text-navy">{t.count}</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>

        {/* 4. Fraud Detection */}
        <ChartCard title="Fraud Detection" description="Alerts raised by risk level, per month">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={fraudDetection}>
              <CartesianGrid stroke={COLORS.grid} vertical={false} />
              <XAxis dataKey="month" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip contentStyle={tooltipStyle} />
              <Legend wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="high" name="High" stackId="risk" fill={COLORS.rose} radius={[0, 0, 0, 0]} />
              <Bar dataKey="medium" name="Medium" stackId="risk" fill={COLORS.amber} radius={[0, 0, 0, 0]} />
              <Bar dataKey="low" name="Low" stackId="risk" fill={COLORS.emerald} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 5. Revocations */}
        <ChartCard title="Revocations" description="Certificates revoked, grouped by reason">
          <ResponsiveContainer width="100%" height={220}>
            <BarChart data={revocationsByReason} layout="vertical" margin={{ left: 24 }}>
              <CartesianGrid stroke={COLORS.grid} horizontal={false} />
              <XAxis type="number" {...axisProps} />
              <YAxis type="category" dataKey="reason" {...axisProps} width={110} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="count" fill={COLORS.brand} radius={[0, 6, 6, 0]} barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* 6. Blockchain Transactions */}
        <ChartCard title="Blockchain Transactions" description="On-chain writes for issuance, verification, and revocation">
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="rounded-xl bg-brand-light p-3">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium mb-1">
                <LinkIcon size={12} /> Total Tx
              </div>
              <div className="text-lg font-bold text-navy">{blockchainStats.totalTx.toLocaleString()}</div>
            </div>
            <div className="rounded-xl bg-brand-light p-3">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium mb-1">
                <CheckCircle2 size={12} /> Success Rate
              </div>
              <div className="text-lg font-bold text-navy">{blockchainStats.successRate}</div>
            </div>
            <div className="rounded-xl bg-brand-light p-3">
              <div className="flex items-center gap-1.5 text-slate-500 text-[11px] font-medium mb-1">
                <Clock size={12} /> Avg Confirm
              </div>
              <div className="text-lg font-bold text-navy">{blockchainStats.avgConfirmTime}</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={140}>
            <LineChart data={blockchainTxTrend}>
              <CartesianGrid stroke={COLORS.grid} vertical={false} />
              <XAxis dataKey="day" {...axisProps} />
              <YAxis {...axisProps} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="tx" stroke={COLORS.navy} strokeWidth={2.5} dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
    </div>
  );
}