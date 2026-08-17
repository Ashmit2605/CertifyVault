import { useState } from "react";
import {
  BadgeCheck,
  Building2,
  CalendarRange,
  Download,
  FileText,
  Mail,
  Plus,
  Search,
  ShieldCheck,
  TrendingUp,
  UserCog,
  X,
} from "lucide-react";

const issuerStats = [
  { label: "Total Issuers", value: "184", subtitle: "+14 this quarter", icon: Building2, tone: "sky" },
  { label: "Verified Issuers", value: "167", subtitle: "91% active coverage", icon: BadgeCheck, tone: "emerald" },
  { label: "Pending Approval", value: "17", subtitle: "Requires admin review", icon: CalendarRange, tone: "amber" },
  { label: "Certificates Issued", value: "48.4K", subtitle: "+6.2% vs last month", icon: FileText, tone: "violet" },
];

const issuers = [
  { name: "Dr. A. Sharma", institution: "PCCOE", role: "Issuer Admin", certificateCount: "2,340", status: "Verified", lastActive: "2 hours ago" },
  { name: "Prof. R. Kulkarni", institution: "MIT Pune", role: "Academic Issuer", certificateCount: "1,920", status: "Active", lastActive: "5 hours ago" },
  { name: "Sonal Mehta", institution: "COEP", role: "Department Issuer", certificateCount: "1,440", status: "Pending", lastActive: "1 day ago" },
  { name: "Vikram Joshi", institution: "Symbiosis", role: "Credential Officer", certificateCount: "980", status: "Verified", lastActive: "3 days ago" },
  { name: "Ishita Patil", institution: "VIT Pune", role: "Institution Issuer", certificateCount: "1,110", status: "Active", lastActive: "7 hours ago" },
];

const statusClasses: Record<string, string> = {
  Verified: "bg-emerald-50 text-emerald-700 ring-1 ring-emerald-200",
  Active: "bg-sky-50 text-sky-700 ring-1 ring-sky-200",
  Pending: "bg-amber-50 text-amber-700 ring-1 ring-amber-200",
};

export default function AdminIssuers() {
  const [showAddIssuerModal, setShowAddIssuerModal] = useState(false);
  const [issuerForm, setIssuerForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    institution: "Pimpri Chinchwad College of Engineering",
    role: "Issuer Admin",
    department: "Administration",
    designation: "Credential Authority",
  });

  const handleCreateIssuer = () => {
    setShowAddIssuerModal(false);
    setIssuerForm({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      institution: "Pimpri Chinchwad College of Engineering",
      role: "Issuer Admin",
      department: "Administration",
      designation: "Credential Authority",
    });
  };

  return (
    <div className="space-y-6" style={{ fontFamily: "'Figtree', sans-serif" }}>
      {showAddIssuerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/35 p-4 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-3xl overflow-y-auto rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-2xl">
            <div className="mb-5 sm:mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Add issuer</p>
                <h3 className="mt-2 text-xl sm:text-2xl font-bold tracking-tight text-slate-900">Create issuer credentials</h3>
              </div>
              <button
                type="button"
                onClick={() => setShowAddIssuerModal(false)}
                className="flex-shrink-0 rounded-xl border border-slate-200 p-2 text-slate-500 hover:bg-slate-100"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="grid gap-5 md:grid-cols-2">
              <label className="space-y-2 text-sm font-medium text-slate-700">
                <span>First Name</span>
                <input
                  value={issuerForm.firstName}
                  onChange={(event) => setIssuerForm((prev) => ({ ...prev, firstName: event.target.value }))}
                  placeholder="First name"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-sky-400"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-700">
                <span>Last Name</span>
                <input
                  value={issuerForm.lastName}
                  onChange={(event) => setIssuerForm((prev) => ({ ...prev, lastName: event.target.value }))}
                  placeholder="Last name"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-sky-400"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-700 md:col-span-2">
                <span>Email</span>
                <input
                  type="email"
                  value={issuerForm.email}
                  onChange={(event) => setIssuerForm((prev) => ({ ...prev, email: event.target.value }))}
                  placeholder="issuer@institution.edu"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-sky-400"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-700">
                <span>Phone</span>
                <input
                  value={issuerForm.phone}
                  onChange={(event) => setIssuerForm((prev) => ({ ...prev, phone: event.target.value }))}
                  placeholder="+91 98765 43210"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-sky-400"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-700">
                <span>Institution</span>
                <select
                  value={issuerForm.institution}
                  onChange={(event) => setIssuerForm((prev) => ({ ...prev, institution: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-sky-400"
                >
                  <option>Pimpri Chinchwad College of Engineering</option>
                  <option>MIT Pune</option>
                  <option>COEP Technological University</option>
                  <option>Symbiosis Institute of Technology</option>
                  <option>VIT Pune</option>
                </select>
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-700">
                <span>Role</span>
                <select
                  value={issuerForm.role}
                  onChange={(event) => setIssuerForm((prev) => ({ ...prev, role: event.target.value }))}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-sky-400"
                >
                  <option>Issuer Admin</option>
                  <option>Academic Issuer</option>
                  <option>Department Issuer</option>
                  <option>Credential Officer</option>
                </select>
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-700">
                <span>Department</span>
                <input
                  value={issuerForm.department}
                  onChange={(event) => setIssuerForm((prev) => ({ ...prev, department: event.target.value }))}
                  placeholder="Administration"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-sky-400"
                />
              </label>

              <label className="space-y-2 text-sm font-medium text-slate-700">
                <span>Designation</span>
                <input
                  value={issuerForm.designation}
                  onChange={(event) => setIssuerForm((prev) => ({ ...prev, designation: event.target.value }))}
                  placeholder="Credential Authority"
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-sky-400"
                />
              </label>
            </div>

            <div className="mt-6 rounded-2xl border border-sky-100 bg-sky-50 p-4 text-sm text-sky-800">
              An invitation will be sent to the issuer with setup instructions and platform access credentials.
            </div>

            <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
              <button
                type="button"
                onClick={() => setShowAddIssuerModal(false)}
                className="w-full sm:w-auto rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleCreateIssuer}
                className="w-full sm:w-auto rounded-xl bg-slate-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
              >
                Create Issuer / Send Invitation
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-6 shadow-sm shadow-slate-200/50">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">
              Issuers
            </p>

            <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">
              Issuer management
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              Track institutional credential authorities, certifications issued, and onboarding status.
            </p>
          </div>

          <button
            type="button"
            onClick={() => setShowAddIssuerModal(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl  bg-sky-600 px-4 py-2.5 text-sm font-medium text-white hover:bg-slate-800"
          >
            <Plus className="h-4 w-4" />
            Add Issuer
          </button>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-2 xl:grid-cols-4">
        {issuerStats.map(({ label, value, subtitle, icon: Icon, tone }) => (
          <div key={label} className="rounded-2xl border border-slate-200 bg-white p-3 sm:p-4 shadow-sm shadow-slate-200/50">
            <div className="flex items-center justify-between">
              <div className={`inline-flex h-9 w-9 sm:h-10 sm:w-10 items-center justify-center rounded-xl flex-shrink-0 ${tone === "sky" ? "bg-sky-100 text-sky-700" : tone === "emerald" ? "bg-emerald-100 text-emerald-700" : tone === "amber" ? "bg-amber-100 text-amber-700" : "bg-violet-100 text-violet-700"}`}>
                <Icon className="h-4 w-4 sm:h-5 sm:w-5" />
              </div>
            </div>
            <div className="mt-4 sm:mt-5 text-2xl sm:text-3xl font-bold tracking-tight text-slate-900">{value}</div>
            <div className="mt-1 text-xs sm:text-sm font-medium text-slate-600">{label}</div>
            <div className="mt-2 text-xs text-slate-500">{subtitle}</div>
          </div>
        ))}
      </div>

      <div className="rounded-3xl border border-slate-200 bg-white p-4 sm:p-5 shadow-sm shadow-slate-200/50">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5">
            <Search className="h-4 w-4 flex-shrink-0 text-slate-400" />
            <input placeholder="Search issuers..." className="w-full border-none bg-transparent text-sm text-slate-700 outline-none placeholder:text-slate-400" />
          </div>
          <div className="flex gap-2">
            <button className="flex-1 xl:flex-none rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">Export</button>
            <button className="flex-1 xl:flex-none inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50">
              <Download className="h-4 w-4" />
              CSV
            </button>
          </div>
        </div>

        <div className="mt-5 overflow-hidden rounded-2xl border border-slate-200">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[860px] divide-y divide-slate-200 text-left">
              <thead className="bg-slate-50 text-xs font-semibold uppercase tracking-[0.14em] text-slate-500">
                <tr>
                  <th className="whitespace-nowrap px-4 py-4">Issuer</th>
                  <th className="whitespace-nowrap px-4 py-4">Institution</th>
                  <th className="whitespace-nowrap px-4 py-4">Role</th>
                  <th className="whitespace-nowrap px-4 py-4">Certificates</th>
                  <th className="whitespace-nowrap px-4 py-4">Status</th>
                  <th className="whitespace-nowrap px-4 py-4">Last Active</th>
                  <th className="whitespace-nowrap px-4 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 bg-white text-sm text-slate-700">
                {issuers.map((issuer) => (
                  <tr className="hover:bg-slate-50/80" key={issuer.name}>
                    <td className="whitespace-nowrap px-4 py-4">
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-sky-100 text-xs font-bold text-sky-700">
                          {issuer.name.split(" ").map((piece) => piece[0]).slice(0, 2).join("")}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{issuer.name}</div>
                          <div className="flex items-center gap-1 text-xs text-slate-500">
                            <Mail className="h-3 w-3" />
                            {issuer.name.toLowerCase().replace(/\s+/g, ".")}@{issuer.institution.toLowerCase().replace(/\s+/g, "")}\.edu
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-600">{issuer.institution}</td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-600">{issuer.role}</td>
                    <td className="whitespace-nowrap px-4 py-4 font-medium text-slate-700">{issuer.certificateCount}</td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-medium ${statusClasses[issuer.status]}`}>
                        {issuer.status}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-4 py-4 text-slate-600">{issuer.lastActive}</td>
                    <td className="whitespace-nowrap px-4 py-4">
                      <div className="flex justify-end gap-2">
                        <button className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50">
                          <UserCog className="h-4 w-4" />
                        </button>
                        <button className="rounded-xl border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50">
                          <ShieldCheck className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
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