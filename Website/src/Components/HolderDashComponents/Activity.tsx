import { useState } from "react";
import { CheckCircle2, Link2, ShieldOff, Pencil } from "lucide-react";

type Tab = "activity" | "verifications";

const ACTIVITY_LOG = [
  {
    icon: CheckCircle2,
    bg: "bg-[#E8F9EF]",
    color: "text-[#1AAE5F]",
    text: "Certificate verified",
    detail: "ABC Technologies",
    date: "12 Aug 2026",
  },
  {
    icon: Link2,
    bg: "bg-[#EAF1FF]",
    color: "text-[#0050F5]",
    text: "Certificate shared",
    detail: "XYZ Corporation",
    date: "11 Aug 2026",
  },
  {
    icon: CheckCircle2,
    bg: "bg-[#E8F9EF]",
    color: "text-[#1AAE5F]",
    text: "Certificate verified",
    detail: "PQR Industries",
    date: "10 Aug 2026",
  },
  {
    icon: Pencil,
    bg: "bg-[#FFF6E5]",
    color: "text-[#C98A00]",
    text: "Share link expired",
    detail: "XYZ Corporation",
    date: "8 Aug 2026",
  },
  {
    icon: ShieldOff,
    bg: "bg-[#FDEDEE]",
    color: "text-[#E5484D]",
    text: "Certificate revoked by issuer",
    detail: "Web Development Bootcamp",
    date: "3 Aug 2026",
  },
];

const VERIFICATIONS = [
  { cert: "B.E. Degree", verifiedBy: "ABC Technologies", date: "12 Aug 2026", result: "Success" as const },
  { cert: "Internship Certificate", verifiedBy: "XYZ Corporation", date: "11 Aug 2026", result: "Success" as const },
  { cert: "Course Certificate", verifiedBy: "PQR Industries", date: "10 Aug 2026", result: "Success" as const },
  { cert: "Training Certificate", verifiedBy: "Unknown Verifier", date: "3 Aug 2026", result: "Failed" as const },
];

const SUMMARY = [
  { label: "Total Verification Requests", value: "12" },
  { label: "Successful", value: "11" },
  { label: "Failed", value: "1" },
];

export default function Activity() {
  const [tab, setTab] = useState<Tab>("activity");

  return (
    <main className="mx-auto max-w-[900px] px-6 py-8 lg:px-10">
        <h1 className="mb-1 text-[24px] font-semibold tracking-tight text-[#000F3E]">
          Activity
        </h1>
        <p className="mb-6 text-[14px] text-[#6B7494]">
          Track what's happening with your credentials.
        </p>

        {/* Tabs */}
        <div className="mb-6 inline-flex rounded-xl border border-[#EAF1FF] bg-white p-1">
          <button
            onClick={() => setTab("activity")}
            className={`rounded-lg px-4 py-2 text-[13.5px] font-medium transition-colors ${
              tab === "activity"
                ? "bg-[#0050F5] text-white"
                : "text-[#4A5578] hover:bg-[#F5F8FF]"
            }`}
          >
            Activity
          </button>
          <button
            onClick={() => setTab("verifications")}
            className={`rounded-lg px-4 py-2 text-[13.5px] font-medium transition-colors ${
              tab === "verifications"
                ? "bg-[#0050F5] text-white"
                : "text-[#4A5578] hover:bg-[#F5F8FF]"
            }`}
          >
            My Verifications
          </button>
        </div>

        {tab === "activity" ? (
          <div className="rounded-2xl border border-[#EAF1FF] bg-white p-7 shadow-[0_1px_2px_rgba(0,15,62,0.04)]">
            <ul className="flex flex-col divide-y divide-[#F0F3FC]">
              {ACTIVITY_LOG.map((a, i) => (
                <li key={i} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                  <span
                    className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${a.bg}`}
                  >
                    <a.icon className={`h-5 w-5 ${a.color}`} />
                  </span>
                  <div className="flex-1">
                    <p className="text-[14px] font-medium text-[#000F3E]">
                      {a.text}
                    </p>
                    <p className="text-[12.5px] text-[#8993B4]">{a.detail}</p>
                  </div>
                  <span className="shrink-0 text-[12.5px] text-[#9AA3C2]">
                    {a.date}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <>
            {/* Summary */}
            <div className="mb-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
              {SUMMARY.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-[#EAF1FF] bg-white p-6 shadow-[0_1px_2px_rgba(0,15,62,0.04)]"
                >
                  <p className="text-[13px] font-medium text-[#6B7494]">
                    {s.label}
                  </p>
                  <p className="mt-1 text-[26px] font-semibold text-[#000F3E]">
                    {s.value}
                  </p>
                </div>
              ))}
            </div>

            {/* Table */}
            <div className="overflow-hidden rounded-2xl border border-[#EAF1FF] bg-white shadow-[0_1px_2px_rgba(0,15,62,0.04)]">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-[#F0F3FC] bg-[#F7F9FF]">
                    <th className="px-6 py-3.5 text-[12px] font-semibold uppercase tracking-wide text-[#8993B4]">
                      Certificate
                    </th>
                    <th className="px-6 py-3.5 text-[12px] font-semibold uppercase tracking-wide text-[#8993B4]">
                      Verified By
                    </th>
                    <th className="px-6 py-3.5 text-[12px] font-semibold uppercase tracking-wide text-[#8993B4]">
                      Date
                    </th>
                    <th className="px-6 py-3.5 text-[12px] font-semibold uppercase tracking-wide text-[#8993B4]">
                      Result
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {VERIFICATIONS.map((v, i) => (
                    <tr key={i} className="border-b border-[#F0F3FC] last:border-0">
                      <td className="px-6 py-4 text-[13.5px] font-medium text-[#000F3E]">
                        {v.cert}
                      </td>
                      <td className="px-6 py-4 text-[13.5px] text-[#4A5578]">
                        {v.verifiedBy}
                      </td>
                      <td className="px-6 py-4 text-[13.5px] text-[#9AA3C2]">
                        {v.date}
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-[12px] font-medium ${
                            v.result === "Success"
                              ? "bg-[#E8F9EF] text-[#1AAE5F]"
                              : "bg-[#FDEDEE] text-[#E5484D]"
                          }`}
                        >
                          {v.result}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </main>
  );
}