import {
  FileCheck2,
  ShieldCheck,
  ShieldOff,
  Eye,
  Share2,
  CheckCircle2,
  Link2,
} from "lucide-react";

const STATS = [
  {
    label: "Total Certificates",
    value: "7",
    icon: FileCheck2,
    iconBg: "bg-[#EAF1FF]",
    iconColor: "text-[#0050F5]",
  },
  {
    label: "Verified",
    value: "7",
    icon: ShieldCheck,
    iconBg: "bg-[#E8F9EF]",
    iconColor: "text-[#1AAE5F]",
  },
  {
    label: "Revoked",
    value: "0",
    icon: ShieldOff,
    iconBg: "bg-[#FDEDEE]",
    iconColor: "text-[#E5484D]",
  },
];

const RECENT_ACTIVITY = [
  {
    icon: CheckCircle2,
    color: "text-[#1AAE5F]",
    bg: "bg-[#E8F9EF]",
    text: "Certificate verified by ABC Technologies",
    time: "2 hrs ago",
  },
  {
    icon: Link2,
    color: "text-[#0050F5]",
    bg: "bg-[#EAF1FF]",
    text: "Certificate shared with XYZ Corp",
    time: "1 day ago",
  },
  {
    icon: CheckCircle2,
    color: "text-[#1AAE5F]",
    bg: "bg-[#E8F9EF]",
    text: "Certificate verified by PQR Industries",
    time: "3 days ago",
  },
];

export default function Home() {
  return (
    <main className="mx-auto max-w-[1440px] px-6 py-8 lg:px-10">
        {/* Greeting */}
        <div className="mb-7">
          <h1 className="text-[26px] font-semibold tracking-tight text-[#000F3E]">
            Good evening, Atharv 👋
          </h1>
          <p className="mt-1 text-[14.5px] text-[#6B7494]">
            Your credentials are safe and verified.
          </p>
        </div>

        {/* Stat cards */}
        <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
          {STATS.map((s) => (
            <div
              key={s.label}
              className="flex items-center gap-4 rounded-2xl border border-[#EAF1FF] bg-white p-6 shadow-[0_1px_2px_rgba(0,15,62,0.04)]"
            >
              <span
                className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${s.iconBg}`}
              >
                <s.icon className={`h-6 w-6 ${s.iconColor}`} strokeWidth={2} />
              </span>
              <div>
                <p className="text-[13px] font-medium text-[#6B7494]">
                  {s.label}
                </p>
                <p className="text-[26px] font-semibold text-[#000F3E]">
                  {s.value}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          {/* Recent certificate - featured */}
          <div className="lg:col-span-2 rounded-2xl border border-[#EAF1FF] bg-white p-7 shadow-[0_1px_2px_rgba(0,15,62,0.04)]">
            <p className="mb-4 text-[13px] font-semibold uppercase tracking-wide text-[#8993B4]">
              Recent Certificate
            </p>
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-start gap-4">
                <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-[#EAF1FF] text-2xl">
                  🎓
                </span>
                <div>
                  <h3 className="text-[18px] font-semibold text-[#000F3E]">
                    B.E. Computer Engineering
                  </h3>
                  <p className="text-[14px] text-[#6B7494]">PCCOER</p>
                  <p className="mt-1 text-[13px] text-[#9AA3C2]">
                    Issued: 15 June 2026
                  </p>
                  <span className="mt-2 inline-flex items-center gap-1 rounded-full bg-[#E8F9EF] px-2.5 py-1 text-[12px] font-medium text-[#1AAE5F]">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified
                  </span>
                </div>
              </div>
              <div className="flex shrink-0 gap-3">
                <button className="flex items-center gap-2 rounded-xl border border-[#DCE6FB] bg-white px-4 py-2.5 text-[13.5px] font-medium text-[#000F3E] hover:bg-[#F5F8FF]">
                  <Eye className="h-4 w-4" />
                  View
                </button>
                <button className="flex items-center gap-2 rounded-xl bg-[#0050F5] px-4 py-2.5 text-[13.5px] font-medium text-white hover:bg-[#0041CC]">
                  <Share2 className="h-4 w-4" />
                  Share
                </button>
              </div>
            </div>
          </div>

          {/* Recent activity */}
          <div className="rounded-2xl border border-[#EAF1FF] bg-white p-7 shadow-[0_1px_2px_rgba(0,15,62,0.04)]">
            <div className="mb-4 flex items-center justify-between">
              <p className="text-[13px] font-semibold uppercase tracking-wide text-[#8993B4]">
                Recent Activity
              </p>
              <a href="#" className="text-[13px] font-medium text-[#0050F5]">
                View All
              </a>
            </div>
            <ul className="flex flex-col gap-4">
              {RECENT_ACTIVITY.map((a, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span
                    className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${a.bg}`}
                  >
                    <a.icon className={`h-4 w-4 ${a.color}`} />
                  </span>
                  <div>
                    <p className="text-[13.5px] leading-snug text-[#000F3E]">
                      {a.text}
                    </p>
                    <p className="text-[12px] text-[#9AA3C2]">{a.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </main>
  );
}