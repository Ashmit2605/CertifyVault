import { Link2, Clock, XCircle } from "lucide-react";

interface BlockchainStatusBadgeProps {
  status: "confirmed" | "pending" | "failed";
}

const config = {
  confirmed: { label: "Confirmed", bg: "bg-brand-light", text: "text-brand", icon: Link2 },
  pending: { label: "Pending", bg: "bg-amber-50", text: "text-amber-600", icon: Clock },
  failed: { label: "Failed", bg: "bg-rose-50", text: "text-rose-600", icon: XCircle },
};

export default function BlockchainStatusBadge({ status }: BlockchainStatusBadgeProps) {
  const { label, bg, text, icon: Icon } = config[status];
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text}`}>
      <Icon size={12} />
      {label}
    </span>
  );
}