import type { LucideIcon } from "lucide-react";

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: string | number;
  change?: string;
  trend?: "up" | "down";
  iconBg?: string;
  iconColor?: string;
}

export default function StatCard({
  icon: Icon, label, value, change, trend, iconBg = "bg-brand-light", iconColor = "text-brand",
}: StatCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 flex items-start justify-between">
      <div>
        <p className="text-sm text-slate-500">{label}</p>
        <p className="text-2xl font-bold text-navy mt-1">{value}</p>
        {change && (
          <p className={`text-xs mt-1 font-medium ${trend === "up" ? "text-emerald-600" : "text-rose-500"}`}>
            {trend === "up" ? "↑" : "↓"} {change} vs last month
          </p>
        )}
      </div>
      <div className={`w-11 h-11 rounded-full flex items-center justify-center ${iconBg}`}>
        <Icon size={20} className={iconColor} />
      </div>
    </div>
  );
}