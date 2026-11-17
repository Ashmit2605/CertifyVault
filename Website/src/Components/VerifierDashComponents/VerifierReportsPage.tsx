import { Download, FileText } from "lucide-react";
import ActivityChart from "./ActivityChart";
import StatsBar from "./StatsBar";
import { MOCK_CHART_DATA, MOCK_HISTORY, MOCK_STATS } from "../../data/verifierMockData";

const outcomes = [
  { label: "Verified", value: MOCK_STATS.verified, color: "#16A34A" },
  { label: "Needs review", value: MOCK_STATS.review, color: "#D97706" },
  { label: "Failed", value: MOCK_STATS.failed, color: "#DC2626" },
];

export default function VerifierReportsPage() {
  const exportReport = () => {
    const header = ["Certificate ID", "Type", "Holder", "Institution", "Status", "Trust score", "Verified at", "Method"];
    const rows = MOCK_HISTORY.map((item) => [
      item.certificateId,
      item.certificateType,
      item.holderName,
      item.institution,
      item.status,
      item.trustScore,
      item.verifiedAt,
      item.method,
    ]);
    const csv = [header, ...rows]
      .map((row) => row.map((value) => `"${String(value).replaceAll('"', '""')}"`).join(","))
      .join("\r\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "certifyvault-verification-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="mb-2 flex items-center gap-2 text-brand">
            <FileText size={18} />
            <span className="text-xs font-bold uppercase tracking-[0.16em]">Reports</span>
          </div>
          <h1 className="text-2xl font-extrabold text-navy">Verification reports</h1>
          <p className="mt-1 text-sm text-[#6B7BA6]">A clear view of your verification activity and outcomes.</p>
        </div>
        <button
          type="button"
          onClick={exportReport}
          className="inline-flex items-center gap-2 rounded-xl border border-[#E2E6F0] bg-white px-4 py-2.5 text-sm font-bold text-navy transition-colors hover:bg-[#F0F2F8]"
        >
          <Download size={16} />
          Export CSV
        </button>
      </header>

      <StatsBar stats={MOCK_STATS} />

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        <ActivityChart data={MOCK_CHART_DATA} />
        <section className="rounded-3xl border border-[#E2E6F0] bg-white p-5">
          <h2 className="font-bold text-navy">Outcome breakdown</h2>
          <p className="mt-1 text-xs text-[#6B7BA6]">Based on {MOCK_STATS.total} total verifications</p>
          <div className="mt-6 space-y-5">
            {outcomes.map((outcome) => {
              const percentage = MOCK_STATS.total
                ? Math.round((outcome.value / MOCK_STATS.total) * 100)
                : 0;
              return (
                <div key={outcome.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-semibold text-navy">{outcome.label}</span>
                    <span className="font-bold text-navy">{outcome.value} <span className="font-medium text-[#6B7BA6]">({percentage}%)</span></span>
                  </div>
                  <div className="h-2.5 overflow-hidden rounded-full bg-[#F0F2F8]">
                    <div className="h-full rounded-full" style={{ width: `${percentage}%`, background: outcome.color }} />
                  </div>
                </div>
              );
            })}
          </div>
          <p className="mt-6 border-t border-[#E2E6F0] pt-4 text-xs leading-relaxed text-[#6B7BA6]">
            Report figures are currently based on the verifier dashboard’s sample data.
          </p>
        </section>
      </div>
    </div>
  );
}
