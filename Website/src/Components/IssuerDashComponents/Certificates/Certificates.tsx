import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { PlusCircle, Search, Eye, Ban, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { PageHeader } from "../../../Pages/IssuerDashLayout/IssuerDashLayout";
import StatusBadge from "./StatusBadge";
import BlockchainStatusBadge from "./BlockchainStatusBadge";

type CertStatus = "issued" | "pending" | "verified" | "revoked" | "expired" | "suspicious";
type ChainStatus = "confirmed" | "pending" | "failed";

interface Certificate {
  id: string;
  studentName: string;
  studentEmail: string;
  type: string;
  issueDate: string;
  status: CertStatus;
  blockchainStatus: ChainStatus;
  verificationCount: number;
}

// 🔧 Replace with your API call:
// const [certificates, setCertificates] = useState<Certificate[]>([]);
// useEffect(() => { fetch("/api/certificates").then(r => r.json()).then(setCertificates); }, []);
const mockCertificates: Certificate[] = [
  { id: "CERT-2026-00521", studentName: "Aditi Rao", studentEmail: "aditi.rao@college.edu", type: "Degree Certificate", issueDate: "10 Jun 2026", status: "issued", blockchainStatus: "confirmed", verificationCount: 2 },
  { id: "CERT-2026-00498", studentName: "Rohan Mehta", studentEmail: "rohan.mehta@college.edu", type: "Internship Certificate", issueDate: "08 Jun 2026", status: "verified", blockchainStatus: "confirmed", verificationCount: 7 },
  { id: "CERT-2026-00490", studentName: "Sara Khan", studentEmail: "sara.khan@college.edu", type: "Course Certificate", issueDate: "05 Jun 2026", status: "suspicious", blockchainStatus: "confirmed", verificationCount: 1 },
  { id: "CERT-2026-00475", studentName: "Vikram Singh", studentEmail: "vikram.singh@college.edu", type: "Training Certificate", issueDate: "02 Jun 2026", status: "pending", blockchainStatus: "pending", verificationCount: 0 },
  { id: "CERT-2026-00412", studentName: "Neha Joshi", studentEmail: "neha.joshi@college.edu", type: "Degree Certificate", issueDate: "28 May 2026", status: "revoked", blockchainStatus: "confirmed", verificationCount: 4 },
  { id: "CERT-2026-00389", studentName: "Arjun Kapoor", studentEmail: "arjun.kapoor@college.edu", type: "Course Certificate", issueDate: "25 May 2026", status: "verified", blockchainStatus: "confirmed", verificationCount: 12 },
  { id: "CERT-2026-00301", studentName: "Priya Nair", studentEmail: "priya.nair@college.edu", type: "Training Certificate", issueDate: "10 May 2025", status: "expired", blockchainStatus: "confirmed", verificationCount: 3 },
  { id: "CERT-2026-00288", studentName: "Kabir Malhotra", studentEmail: "kabir.malhotra@college.edu", type: "Degree Certificate", issueDate: "02 May 2025", status: "issued", blockchainStatus: "failed", verificationCount: 0 },
];

const statusFilters: { label: string; value: "all" | CertStatus }[] = [
  { label: "All", value: "all" },
  { label: "Issued", value: "issued" },
  { label: "Pending", value: "pending" },
  { label: "Verified", value: "verified" },
  { label: "Revoked", value: "revoked" },
  { label: "Expired", value: "expired" },
  { label: "Suspicious", value: "suspicious" },
];

export default function Certificates() {
  const navigate = useNavigate();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | CertStatus>("all");
  const [page, setPage] = useState(1);
  const pageSize = 6;

  const filtered = useMemo(() => {
    return mockCertificates.filter((cert) => {
      const q = search.toLowerCase();
      const matchesSearch =
        cert.id.toLowerCase().includes(q) || cert.studentName.toLowerCase().includes(q);
      const matchesStatus = statusFilter === "all" || cert.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <PageHeader
        title="Certificates"
        description="Central certificate management"
        action={{
          label: "Issue Certificate",
          icon: <PlusCircle size={16} />,
          onClick: () => navigate("/issuerdashboard/issue"),
        }}
      />

      {/* Filters row */}
      <div className="flex flex-col lg:flex-row gap-3 px-6 py-4 border-b border-slate-100">
        <div className="relative flex-1 lg:max-w-sm">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder="Search by certificate ID or student name..."
            className="w-full pl-9 pr-3 py-2 rounded-lg bg-brand-light text-sm outline-none focus:ring-2 focus:ring-brand/40"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto">
          {statusFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => {
                setStatusFilter(f.value);
                setPage(1);
              }}
              className={`px-3 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-colors ${
                statusFilter === f.value
                  ? "bg-brand text-white"
                  : "bg-brand-light text-slate-600 hover:bg-brand/10"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 text-left text-slate-500">
              <th className="px-6 py-3 font-medium">Certificate ID</th>
              <th className="px-4 py-3 font-medium">Student</th>
              <th className="px-4 py-3 font-medium">Certificate Type</th>
              <th className="px-4 py-3 font-medium">Issue Date</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Blockchain Status</th>
              <th className="px-4 py-3 font-medium text-center">Verifications</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {paginated.map((cert) => (
              <tr key={cert.id} className="border-b border-slate-50 hover:bg-brand-light/40 transition-colors">
                <td className="px-6 py-3.5 font-medium text-navy">{cert.id}</td>
                <td className="px-4 py-3.5">
                  <p className="text-navy">{cert.studentName}</p>
                  <p className="text-xs text-slate-400">{cert.studentEmail}</p>
                </td>
                <td className="px-4 py-3.5 text-slate-600">{cert.type}</td>
                <td className="px-4 py-3.5 text-slate-600">{cert.issueDate}</td>
                <td className="px-4 py-3.5">
                  <StatusBadge status={cert.status} />
                </td>
                <td className="px-4 py-3.5">
                  <BlockchainStatusBadge status={cert.blockchainStatus} />
                </td>
                <td className="px-4 py-3.5 text-center text-navy font-medium">{cert.verificationCount}</td>
                <td className="px-6 py-3.5">
                  <div className="flex items-center justify-end gap-2">
                    <button title="View" className="p-1.5 rounded-lg text-slate-500 hover:bg-brand-light hover:text-brand transition-colors">
                      <Eye size={16} />
                    </button>
                    <button title="Verify" className="p-1.5 rounded-lg text-slate-500 hover:bg-emerald-50 hover:text-emerald-600 transition-colors">
                      <ShieldCheck size={16} />
                    </button>
                    <button title="Revoke" className="p-1.5 rounded-lg text-slate-500 hover:bg-rose-50 hover:text-rose-600 transition-colors">
                      <Ban size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {paginated.length === 0 && (
              <tr>
                <td colSpan={8} className="px-6 py-12 text-center text-slate-400">
                  No certificates match your search.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex items-center justify-between px-6 py-4 border-t border-slate-100">
        <p className="text-xs text-slate-500">
          Showing {paginated.length ? (page - 1) * pageSize + 1 : 0}–{(page - 1) * pageSize + paginated.length} of {filtered.length}
        </p>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-brand-light transition-colors"
          >
            <ChevronLeft size={16} />
          </button>
          <span className="text-sm text-navy font-medium">{page} / {totalPages}</span>
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
            className="p-1.5 rounded-lg border border-slate-200 text-slate-500 disabled:opacity-40 hover:bg-brand-light transition-colors"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}