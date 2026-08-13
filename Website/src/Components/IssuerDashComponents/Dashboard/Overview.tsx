import {
  FileText, ShieldCheck, Hourglass, Ban, AlertTriangle,
} from "lucide-react";
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
} from "recharts";
import StatCard from "./StatCard";

const trendData = [
  { date: "1 May", certificates: 40 },
  { date: "8 May", certificates: 62 },
  { date: "15 May", certificates: 55 },
  { date: "22 May", certificates: 78 },
  { date: "29 May", certificates: 70 },
  { date: "5 Jun", certificates: 95 },
];

const recentActivity = [
  { type: "issued", text: "Certificate CERT-2026-00521 issued to Aditi Rao", time: "12 min ago" },
  { type: "verified", text: "Certificate CERT-2026-00498 verified by TCS", time: "40 min ago" },
  { type: "pending", text: "Certificate request from Rohan Mehta", time: "1 hr ago" },
  { type: "flagged", text: "Certificate CERT-2026-00490 flagged as suspicious", time: "3 hrs ago" },
  { type: "revoked", text: "Certificate CERT-2026-00412 revoked", time: "1 day ago" },
];

const dotColor: Record<string, string> = {
  issued: "bg-brand",
  verified: "bg-emerald-500",
  pending: "bg-amber-500",
  flagged: "bg-orange-600",
  revoked: "bg-rose-500",
};

export default function Overview() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-navy">Overview</h1>
        <p className="text-sm text-slate-500">Engineering College · This month</p>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard icon={FileText} label="Total Certificates" value="1,248" change="12.5%" trend="up" />
        <StatCard icon={FileText} label="Issued" value="312" change="9.1%" trend="up" iconBg="bg-blue-50" iconColor="text-blue-600" />
        <StatCard icon={Hourglass} label="Pending" value="18" change="4.2%" trend="down" iconBg="bg-amber-50" iconColor="text-amber-600" />
        <StatCard icon={ShieldCheck} label="Verified" value="982" change="18.2%" trend="up" iconBg="bg-emerald-50" iconColor="text-emerald-600" />
        <StatCard icon={Ban} label="Revoked" value="12" change="2.1%" trend="down" iconBg="bg-rose-50" iconColor="text-rose-600" />
        <StatCard icon={AlertTriangle} label="Suspicious" value="4" change="1.0%" trend="down" iconBg="bg-orange-50" iconColor="text-orange-600" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Trend chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="font-semibold text-navy mb-4">Certificate Issuance Trend</h2>
          <ResponsiveContainer width="100%" height={260}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#0050F5" stopOpacity={0.35} />
                  <stop offset="100%" stopColor="#0050F5" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#EAF1FF" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 12, fill: "#64748B" }} axisLine={false} tickLine={false} />
              <Tooltip contentStyle={{ borderRadius: 8, border: "1px solid #EAF1FF", fontSize: 12 }} />
              <Area type="monotone" dataKey="certificates" stroke="#0050F5" strokeWidth={2} fill="url(#trendFill)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Recent activity */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5">
          <h2 className="font-semibold text-navy mb-4">Recent Activity</h2>
          <ul className="space-y-4">
            {recentActivity.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className={`mt-1.5 w-2 h-2 rounded-full shrink-0 ${dotColor[item.type]}`} />
                <div className="text-sm">
                  <p className="text-navy">{item.text}</p>
                  <p className="text-xs text-slate-400">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}