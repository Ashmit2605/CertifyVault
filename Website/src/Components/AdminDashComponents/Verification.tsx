import { CheckCircle2, Clock3, FileCheck2, Search, ShieldCheck, Sparkles, XCircle } from "lucide-react";

const stats = [
  { label: "Total Requests", value: "8,420", icon: FileCheck2, tone: "sky" },
  { label: "Completed", value: "7,310", icon: CheckCircle2, tone: "emerald" },
  { label: "Pending", value: "562", icon: Clock3, tone: "amber" },
  { label: "Rejected", value: "148", icon: XCircle, tone: "rose" },
];

const requests = [
  { id: "VER-1042", applicant: "Rahul Sharma", institution: "PCCOE", document: "Degree certificate", status: "Completed", time: "2 min ago" },
  { id: "VER-1043", applicant: "Ananya Kulkarni", institution: "COEP", document: "Transcript", status: "Pending", time: "12 min ago" },
  { id: "VER-1044", applicant: "Sakshi Patil", institution: "MIT Pune", document: "Internship letter", status: "Under review", time: "41 min ago" },
  { id: "VER-1045", applicant: "Vikas Rane", institution: "Symbiosis", document: "Skill certificate", status: "Rejected", time: "1 hour ago" },
  { id: "VER-1046", applicant: "Neha Joshi", institution: "VIT Pune", document: "Enrollment proof", status: "Completed", time: "Today" },
];

const statusClasses: Record<string, string> = {
  Completed: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
  "Under review": "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  Rejected: "bg-rose-50 text-rose-700 ring-1 ring-rose-200",
};

export default function AdminVerification() {
  return (
    <div className="space-y-6" style={{ fontFamily: "'Figtree', sans-serif" }}>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
        <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Verification</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Verification activity</h2>
            <p className="mt-2 text-sm text-slate-600">Review all verification requests, approvals, and exceptions across the platform.</p>
          </div>
          <div className="inline-flex items-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-medium text-emerald-700">
            <ShieldCheck className="h-4 w-4" />
            98.4% verification success rate
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        {stats.map(({ label, value, icon: Icon, tone }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50">
            <div className="flex items-center justify-between">
              <div className={`inline-flex h-10 w-10 items-center justify-center rounded-xl ${tone === "sky" ? "bg-sky-100 text-sky-700" : tone === "emerald" ? "bg-emerald-100 text-emerald-700" : tone === "amber" ? "bg-amber-100 text-amber-700" : "bg-rose-100 text-rose-700"}`}>
                <Icon className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-5 text-3xl font-bold tracking-tight text-slate-900">{value}</div>
            <div className="mt-1 text-sm font-medium text-slate-600">{label}</div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
            <Search className="h-4 w-4 text-slate-400" />
            <input placeholder="Search requests..." className="w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" />
          </div>
          <button className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
            <Sparkles className="h-4 w-4" />
            Filter queue
          </button>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                <tr>
                  <th className="px-4 py-4">Request ID</th>
                  <th className="px-4 py-4">Applicant</th>
                  <th className="px-4 py-4">Institution</th>
                  <th className="px-4 py-4">Document</th>
                  <th className="px-4 py-4">Status</th>
                  <th className="px-4 py-4">Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-sm text-slate-700">
                {requests.map((request) => (
                  <tr key={request.id} className="hover:bg-slate-50/80">
                    <td className="px-4 py-4 font-semibold text-slate-800">{request.id}</td>
                    <td className="px-4 py-4">{request.applicant}</td>
                    <td className="px-4 py-4 text-slate-600">{request.institution}</td>
                    <td className="px-4 py-4 text-slate-600">{request.document}</td>
                    <td className="px-4 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[request.status]}`}>
                        {request.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-slate-500">{request.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
