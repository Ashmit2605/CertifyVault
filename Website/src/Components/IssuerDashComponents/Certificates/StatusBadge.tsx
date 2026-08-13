interface StatusBadgeProps {
  status: "issued" | "pending" | "verified" | "revoked" | "expired" | "suspicious";
}

const statusConfig = {
  issued: { label: "Issued", bg: "bg-blue-50", text: "text-blue-600", dot: "bg-blue-500" },
  pending: { label: "Pending", bg: "bg-amber-50", text: "text-amber-600", dot: "bg-amber-500" },
  verified: { label: "Verified", bg: "bg-emerald-50", text: "text-emerald-600", dot: "bg-emerald-500" },
  revoked: { label: "Revoked", bg: "bg-rose-50", text: "text-rose-600", dot: "bg-rose-500" },
  expired: { label: "Expired", bg: "bg-slate-100", text: "text-slate-500", dot: "bg-slate-400" },
  suspicious: { label: "Suspicious", bg: "bg-orange-50", text: "text-orange-600", dot: "bg-orange-500" },
};

export default function StatusBadge({ status }: StatusBadgeProps) {
  const config = statusConfig[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
}