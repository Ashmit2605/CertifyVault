import { createContext, useContext, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Search, UserPlus, Upload, X, ArrowLeft, FileCheck2, Mail, GraduationCap,
} from "lucide-react";
import { PageHeader } from "../../../Pages/IssuerDashLayout/IssuerDashLayout";

/* ══════════════════════════════════════════════════════
   1. SHARED STATE (Context)
   Purpose is primarily credential management — keep it lean.
   ══════════════════════════════════════════════════════ */

export type StudentStatus = "Active" | "Inactive";

export interface StudentCertificate {
  id: string;
  type: string;
  issuedDate: string;
  status: "Issued" | "Revoked";
}

export interface Student {
  id: string;
  name: string;
  email: string;
  program: string;
  status: StudentStatus;
  certificates: StudentCertificate[];
}

// 🔧 Replace with a fetch of enrolled students from your API
function initialStudents(): Student[] {
  return [
    {
      id: "STU-2026-041", name: "Aditi Rao", email: "aditi.rao@example.edu", program: "B.Tech CSE", status: "Active",
      certificates: [
        { id: "CERT-2026-00521", type: "Degree Certificate", issuedDate: "12 Aug 2026", status: "Issued" },
      ],
    },
    {
      id: "STU-2026-038", name: "Rohan Mehta", email: "rohan.mehta@example.edu", program: "B.Tech ECE", status: "Active",
      certificates: [
        { id: "CERT-2026-00498", type: "Course Certificate", issuedDate: "09 Aug 2026", status: "Issued" },
        { id: "CERT-2026-00399", type: "Internship Certificate", issuedDate: "22 Jun 2026", status: "Issued" },
      ],
    },
    {
      id: "STU-2026-030", name: "Sneha Kulkarni", email: "sneha.k@example.edu", program: "M.Sc Data Science", status: "Active",
      certificates: [
        { id: "CERT-2026-00470", type: "Bonafide", issuedDate: "02 Aug 2026", status: "Issued" },
      ],
    },
    {
      id: "STU-2026-012", name: "Aman Verma", email: "aman.verma@example.edu", program: "B.Tech Mechanical", status: "Inactive",
      certificates: [
        { id: "CERT-2026-00412", type: "Degree Certificate", issuedDate: "20 Jul 2026", status: "Revoked" },
      ],
    },
    {
      id: "STU-2026-006", name: "Priya Singh", email: "priya.singh@example.edu", program: "B.Tech CSE", status: "Active",
      certificates: [
        { id: "CERT-2026-00390", type: "Achievement Certificate", issuedDate: "15 Jul 2026", status: "Revoked" },
        { id: "CERT-2026-00201", type: "Course Certificate", issuedDate: "10 Mar 2026", status: "Issued" },
      ],
    },
  ];
}

interface StudentsContextValue {
  students: Student[];
  getStudent: (id: string) => Student | undefined;
  addStudent: (input: { name: string; email: string; program: string }) => void;
  importStudents: (count: number) => void;
}

const StudentsContext = createContext<StudentsContextValue | null>(null);

export function StudentsProvider({ children }: { children: ReactNode }) {
  const [students, setStudents] = useState<Student[]>(initialStudents());

  const getStudent = (id: string) => students.find((s) => s.id === id);

  const addStudent = (input: { name: string; email: string; program: string }) => {
    // 🔧 Call POST /api/issuer/students here
    const newStudent: Student = {
      id: `STU-2026-${Math.floor(Math.random() * 900 + 100)}`,
      name: input.name,
      email: input.email,
      program: input.program,
      status: "Active",
      certificates: [],
    };
    setStudents((prev) => [newStudent, ...prev]);
  };

  const importStudents = (_count: number) => {
    // 🔧 Call POST /api/issuer/students/import with the parsed CSV rows here.
    // This stub intentionally doesn't fabricate fake rows — wire it to a real parser
    // (e.g. papaparse) before enabling the button for real use.
  };

  return (
    <StudentsContext.Provider value={{ students, getStudent, addStudent, importStudents }}>
      {children}
    </StudentsContext.Provider>
  );
}

function useStudents() {
  const ctx = useContext(StudentsContext);
  if (!ctx) throw new Error("useStudents must be used within StudentsProvider");
  return ctx;
}

/* ══════════════════════════════════════════════════════
   2. SMALL UI PIECES
   ══════════════════════════════════════════════════════ */

function StatusPill({ status }: { status: StudentStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
        status === "Active" ? "bg-emerald-50 text-emerald-600" : "bg-slate-100 text-slate-500"
      }`}
    >
      {status}
    </span>
  );
}

function Modal({ title, onClose, children }: { title: string; onClose: () => void; children: ReactNode }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40">
      <div className="bg-white rounded-2xl p-6 w-[420px] max-w-[92vw]">
        <div className="flex items-center justify-between mb-5">
          <h3 className="font-bold text-navy text-base">{title}</h3>
          <button onClick={onClose} className="text-slate-400 hover:text-navy">
            <X size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   3. ADD STUDENT MODAL
   ══════════════════════════════════════════════════════ */

function AddStudentModal({ onClose }: { onClose: () => void }) {
  const { addStudent } = useStudents();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [program, setProgram] = useState("");

  const canSubmit = name.trim() && email.trim() && program.trim();

  const handleSubmit = () => {
    if (!canSubmit) return;
    addStudent({ name: name.trim(), email: email.trim(), program: program.trim() });
    onClose();
  };

  return (
    <Modal title="Add Student" onClose={onClose}>
      <div className="space-y-3.5">
        <div>
          <label className="text-xs font-semibold text-navy">Full Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. Aditi Rao"
            className="w-full mt-1.5 px-3 py-2.5 rounded-lg bg-brand-light text-sm text-navy outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-navy">Email</label>
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="student@example.edu"
            className="w-full mt-1.5 px-3 py-2.5 rounded-lg bg-brand-light text-sm text-navy outline-none"
          />
        </div>
        <div>
          <label className="text-xs font-semibold text-navy">Program</label>
          <input
            value={program}
            onChange={(e) => setProgram(e.target.value)}
            placeholder="e.g. B.Tech CSE"
            className="w-full mt-1.5 px-3 py-2.5 rounded-lg bg-brand-light text-sm text-navy outline-none"
          />
        </div>
        <button
          disabled={!canSubmit}
          onClick={handleSubmit}
          className={`w-full mt-2 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
            canSubmit ? "bg-brand text-white hover:bg-brand/90" : "bg-brand-light text-slate-400 cursor-not-allowed"
          }`}
        >
          Add Student
        </button>
      </div>
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════
   4. IMPORT STUDENTS MODAL
   ══════════════════════════════════════════════════════ */

function ImportStudentsModal({ onClose }: { onClose: () => void }) {
  const { importStudents } = useStudents();
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  const handleImport = () => {
    // 🔧 Parse the CSV (e.g. with papaparse) and pass real rows to importStudents
    importStudents(0);
    onClose();
  };

  return (
    <Modal title="Import Students" onClose={onClose}>
      <p className="text-xs text-slate-400 mb-3">
        CSV with columns: <code className="text-navy">name, email, program</code>
      </p>
      <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-xl py-8 cursor-pointer hover:border-brand/40 transition-colors">
        <Upload size={22} className="text-brand" />
        <span className="text-sm text-slate-500">{fileName ?? "Click to choose a .csv file"}</span>
        <input type="file" accept=".csv" className="hidden" onChange={handleFile} />
      </label>
      <button
        disabled={!fileName}
        onClick={handleImport}
        className={`w-full mt-4 py-2.5 rounded-lg text-sm font-semibold transition-colors ${
          fileName ? "bg-brand text-white hover:bg-brand/90" : "bg-brand-light text-slate-400 cursor-not-allowed"
        }`}
      >
        Import
      </button>
    </Modal>
  );
}

/* ══════════════════════════════════════════════════════
   5. STUDENTS PAGE (default export — route: /issuerdashboard/students)
   ══════════════════════════════════════════════════════ */

export default function Students() {
  const { students } = useStudents();
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [showAdd, setShowAdd] = useState(false);
  const [showImport, setShowImport] = useState(false);

  const filtered = useMemo(() => {
    if (!query.trim()) return students;
    const q = query.toLowerCase();
    return students.filter((s) => s.name.toLowerCase().includes(q) || s.email.toLowerCase().includes(q));
  }, [students, query]);

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <PageHeader title="Students" description="Manage certificate holders. Full academic records live in your SIS — this is credential management only." />

      <div className="p-6">
        <div className="flex flex-wrap items-center gap-3 mb-5">
          <div className="relative flex-1 min-w-[220px]">
            <Search size={15} className="absolute left-3 top-2.5 text-slate-400" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or email…"
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-brand-light text-sm text-navy outline-none"
            />
          </div>
          <button
            onClick={() => setShowImport(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand-light text-brand text-sm font-medium hover:bg-brand/10 transition-colors"
          >
            <Upload size={15} /> Import Students
          </button>
          <button
            onClick={() => setShowAdd(true)}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-brand text-white text-sm font-medium hover:bg-brand/90 transition-colors"
          >
            <UserPlus size={15} /> Add Student
          </button>
        </div>

        <div className="rounded-xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-brand-light">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy">Name</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy">Email</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy">Program</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy">Certificates</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy">Status</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy"></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((s) => (
                  <tr key={s.id} className="border-t border-slate-100">
                    <td className="px-5 py-3.5 font-semibold text-navy whitespace-nowrap">{s.name}</td>
                    <td className="px-5 py-3.5 text-slate-500">{s.email}</td>
                    <td className="px-5 py-3.5 text-slate-600">{s.program}</td>
                    <td className="px-5 py-3.5 text-slate-600">{s.certificates.length}</td>
                    <td className="px-5 py-3.5">
                      <StatusPill status={s.status} />
                    </td>
                    <td className="px-5 py-3.5">
                      <button
                        onClick={() => navigate(`/issuerdashboard/students/${s.id}`)}
                        className="inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold bg-brand-light text-brand hover:bg-brand/10 transition-colors"
                      >
                        <FileCheck2 size={13} /> Certificate History
                      </button>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-10 text-sm text-slate-400">
                      No students match your search.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showAdd && <AddStudentModal onClose={() => setShowAdd(false)} />}
      {showImport && <ImportStudentsModal onClose={() => setShowImport(false)} />}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   6. STUDENT CERTIFICATE HISTORY (named export — route: /issuerdashboard/students/:studentId)
   ══════════════════════════════════════════════════════ */

export function StudentCertificateHistory() {
  const { studentId } = useParams();
  const navigate = useNavigate();
  const { getStudent } = useStudents();
  const student = studentId ? getStudent(studentId) : undefined;

  if (!student) {
    return <p className="text-slate-500">Student not found.</p>;
  }

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <PageHeader title={student.name} description={`Certificate history for ${student.id}`} />

      <div className="p-6">
        <button
          onClick={() => navigate("/issuerdashboard/students")}
          className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy mb-4 transition-colors"
        >
          <ArrowLeft size={15} /> Back to Students
        </button>

        <div className="flex flex-wrap items-center gap-6 mb-6 rounded-xl bg-brand-light p-4">
          <div className="flex items-center gap-2 text-sm text-navy">
            <Mail size={14} className="text-brand" /> {student.email}
          </div>
          <div className="flex items-center gap-2 text-sm text-navy">
            <GraduationCap size={14} className="text-brand" /> {student.program}
          </div>
          <StatusPill status={student.status} />
        </div>

        <div className="rounded-xl border border-slate-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm border-collapse">
              <thead>
                <tr className="bg-brand-light">
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy">Certificate ID</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy">Type</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy">Issued Date</th>
                  <th className="text-left px-5 py-3 text-xs font-semibold text-navy">Status</th>
                </tr>
              </thead>
              <tbody>
                {student.certificates.map((c) => (
                  <tr key={c.id} className="border-t border-slate-100">
                    <td className="px-5 py-3.5 font-semibold text-navy">{c.id}</td>
                    <td className="px-5 py-3.5 text-slate-600">{c.type}</td>
                    <td className="px-5 py-3.5 text-slate-500">{c.issuedDate}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold ${
                          c.status === "Issued" ? "bg-emerald-50 text-emerald-600" : "bg-rose-50 text-rose-500"
                        }`}
                      >
                        {c.status}
                      </span>
                    </td>
                  </tr>
                ))}
                {student.certificates.length === 0 && (
                  <tr>
                    <td colSpan={4} className="text-center py-10 text-sm text-slate-400">
                      No certificates issued to this student yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}