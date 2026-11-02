import { useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useNavigate } from "react-router-dom";
import {
  AlertTriangle,
  ArrowLeft,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Loader2,
  ShieldCheck,
  UploadCloud,
  X,
} from "lucide-react";
import { PageHeader } from "../../../../Pages/IssuerDashLayout/IssuerDashLayout";
import {
  downloadCertificate,
  issueCertificate,
  retryRegistration,
  type CertificateIssueInput,
  type CertificateRecord,
} from "../../../../utils/certificateApi";

const certificateTypes = [
  { value: "degree", label: "Degree Certificate" },
  { value: "diploma", label: "Diploma" },
  { value: "bonafide", label: "Bonafide" },
  { value: "course", label: "Course Certificate" },
  { value: "internship", label: "Internship Certificate" },
  { value: "training", label: "Training Certificate" },
  { value: "achievement", label: "Achievement Certificate" },
  { value: "custom", label: "Custom Certificate" },
];

const initialForm = (): CertificateIssueInput => ({
  studentName: "",
  certificateNumber: null,
  certificateType: "degree",
  title: "",
  course: "",
  grade: null,
  issueDate: new Date().toISOString().slice(0, 10),
  expiryDate: null,
});

interface BulkRow {
  line: number;
  input: CertificateIssueInput | null;
  error: string | null;
  certificateNumber?: string;
  result?: CertificateRecord;
  resultError?: string;
}

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < text.length; index += 1) {
    const character = text[index];
    if (quoted) {
      if (character === '"' && text[index + 1] === '"') {
        field += '"';
        index += 1;
      } else if (character === '"') {
        quoted = false;
      } else {
        field += character;
      }
    } else if (character === '"' && field.length === 0) {
      quoted = true;
    } else if (character === ",") {
      row.push(field.trim());
      field = "";
    } else if (character === "\n" || character === "\r") {
      if (character === "\r" && text[index + 1] === "\n") index += 1;
      row.push(field.trim());
      if (row.some(Boolean)) rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }
  if (quoted) throw new Error("CSV contains an unclosed quoted field.");
  row.push(field.trim());
  if (row.some(Boolean)) rows.push(row);
  return rows;
}

function parseBulkCsv(text: string): BulkRow[] {
  const rows = parseCsv(text);
  if (rows.length < 2) {
    throw new Error("The CSV must include a header and at least one certificate.");
  }
  if (rows.length > 51) {
    throw new Error("Upload at most 50 records per batch.");
  }

  const headers = rows[0].map((header) => header.trim().toLowerCase());
  const required = [
    "studentname",
    "certificatetype",
    "title",
    "course",
    "issuedate",
  ];
  const missing = required.filter((header) => !headers.includes(header));
  if (missing.length) {
    throw new Error(`Missing CSV columns: ${missing.join(", ")}.`);
  }

  const index = (name: string) => headers.indexOf(name);
  const parsedRows = rows.slice(1).map((cells, rowIndex) => {
    const value = (name: string) => cells[index(name)]?.trim() ?? "";
    const input: CertificateIssueInput = {
      studentName: value("studentname"),
      certificateNumber: value("certificatenumber") || null,
      certificateType: value("certificatetype").toLowerCase(),
      title: value("title"),
      course: value("course"),
      grade: value("grade") || null,
      issueDate: value("issuedate"),
      expiryDate: value("expirydate") || null,
    };
    const errors: string[] = [];
    if (!input.studentName) errors.push("Student name is required.");
    if (!certificateTypes.some((type) => type.value === input.certificateType)) {
      errors.push("Certificate type is invalid.");
    }
    if (!input.title) errors.push("Title is required.");
    if (!input.course) errors.push("Course is required.");
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.issueDate)) {
      errors.push("Issue date must use YYYY-MM-DD.");
    }
    if (input.expiryDate && !/^\d{4}-\d{2}-\d{2}$/.test(input.expiryDate)) {
      errors.push("Expiry date must use YYYY-MM-DD.");
    }
    return {
      line: rowIndex + 2,
      input: errors.length ? null : input,
      error: errors.length ? errors.join(" ") : null,
      certificateNumber: input.certificateNumber ?? undefined,
    };
  });
  const certificateNumberCounts = new Map<string, number>();
  for (const row of parsedRows) {
    if (row.certificateNumber) {
      const key = row.certificateNumber.toLocaleLowerCase();
      certificateNumberCounts.set(key, (certificateNumberCounts.get(key) ?? 0) + 1);
    }
  }
  return parsedRows.map((row) => {
    if (
      row.certificateNumber &&
      (certificateNumberCounts.get(row.certificateNumber.toLocaleLowerCase()) ??
        0) > 1
    ) {
      return {
        ...row,
        input: null,
        error: [row.error, "Certificate number is duplicated in this file."]
          .filter(Boolean)
          .join(" "),
      };
    }
    return row;
  });
}

function StatusMessage({ certificate }: { certificate: CertificateRecord }) {
  if (certificate.status === "issued") {
    return (
      <p className="mt-1 text-sm text-emerald-700">
        Blockchain registration confirmed.
      </p>
    );
  }
  if (certificate.status === "registration_failed") {
    return (
      <p className="mt-1 text-sm text-rose-600">
        Registration failed. The private PDF is not available until confirmation.
      </p>
    );
  }
  return (
    <p className="mt-1 text-sm text-amber-700">
      Registration submitted. The certificate is not issued until confirmation.
    </p>
  );
}

export default function IssueCertificate() {
  const { getToken } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");
  const [form, setForm] = useState<CertificateIssueInput>(initialForm);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [issued, setIssued] = useState<CertificateRecord | null>(null);
  const [bulkRows, setBulkRows] = useState<BulkRow[]>([]);
  const [bulkBusy, setBulkBusy] = useState(false);
  const [bulkProgress, setBulkProgress] = useState(0);
  const [bulkError, setBulkError] = useState("");

  const updateForm = <K extends keyof CertificateIssueInput>(
    key: K,
    value: CertificateIssueInput[K],
  ) => setForm((current) => ({ ...current, [key]: value }));

  const handleIssue = async () => {
    setBusy(true);
    setError("");
    try {
      const token = await getToken();
      if (!token) throw new Error("Your secure session is unavailable.");
      const certificate = await issueCertificate(token, form);
      setIssued(certificate);
    } catch (issueError) {
      setError(
        issueError instanceof Error
          ? issueError.message
          : "Certificate issuance failed.",
      );
    } finally {
      setBusy(false);
    }
  };

  const handleRetry = async () => {
    if (!issued) return;
    setBusy(true);
    setError("");
    try {
      const token = await getToken();
      if (!token) throw new Error("Your secure session is unavailable.");
      setIssued(await retryRegistration(token, issued.certificateId));
    } catch (retryError) {
      setError(
        retryError instanceof Error
          ? retryError.message
          : "Registration retry failed.",
      );
    } finally {
      setBusy(false);
    }
  };

  const handleDownload = async (certificate: CertificateRecord) => {
    setError("");
    try {
      const token = await getToken();
      if (!token) throw new Error("Your secure session is unavailable.");
      const blob = await downloadCertificate(token, certificate.certificateId);
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${certificate.certificateId}.pdf`;
      link.click();
      URL.revokeObjectURL(url);
    } catch (downloadError) {
      setError(
        downloadError instanceof Error
          ? downloadError.message
          : "Certificate download failed.",
      );
    }
  };

  const handleCsv = async (file: File | undefined) => {
    setBulkError("");
    setBulkRows([]);
    if (!file) return;
    if (file.size > 1_000_000) {
      setBulkError("CSV files must be smaller than 1 MB.");
      return;
    }
    try {
      setBulkRows(parseBulkCsv(await file.text()));
    } catch (parseError) {
      setBulkError(
        parseError instanceof Error ? parseError.message : "CSV could not be read.",
      );
    }
  };

  const handleBulkIssue = async () => {
    const validRows = bulkRows.filter(
      (row): row is BulkRow & { input: CertificateIssueInput } =>
        row.input !== null,
    );
    if (!validRows.length) return;
    setBulkBusy(true);
    setBulkProgress(0);
    setBulkError("");
    try {
      const token = await getToken();
      if (!token) throw new Error("Your secure session is unavailable.");
      for (let index = 0; index < validRows.length; index += 1) {
        const row = validRows[index];
        try {
          row.result = await issueCertificate(token, row.input);
        } catch (rowError) {
          row.resultError =
            rowError instanceof Error ? rowError.message : "Issuance failed.";
        }
        setBulkRows((current) =>
          current.map((item) => (item.line === row.line ? { ...row } : item)),
        );
        setBulkProgress(index + 1);
      }
    } catch (batchError) {
      setBulkError(
        batchError instanceof Error
          ? batchError.message
          : "Bulk issuance could not start.",
      );
    } finally {
      setBulkBusy(false);
    }
  };

  const resetSingle = () => {
    setIssued(null);
    setError("");
    setForm(initialForm());
  };

  return (
    <div className="space-y-6">
      <div className="overflow-hidden rounded-2xl border border-slate-100 bg-white shadow-sm">
        <PageHeader
          title="Issue Certificate"
          description="Generate a signed, verifiable certificate for a student"
        />
        <div className="flex gap-2 border-b border-slate-100 px-6 pt-4">
          {(["single", "bulk"] as const).map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`border-b-2 px-4 py-2.5 text-sm font-medium ${
                activeTab === tab
                  ? "border-brand text-brand"
                  : "border-transparent text-slate-500 hover:text-navy"
              }`}
            >
              {tab === "single" ? "Single issuance" : "Bulk CSV"}
            </button>
          ))}
        </div>

        {activeTab === "single" && (
          <div className="grid gap-8 p-6 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.8fr)]">
            <div className="space-y-4">
              <div>
                <label className="mb-1.5 block text-sm font-medium text-navy">
                  Certificate template
                </label>
                <select
                  value={form.certificateType}
                  onChange={(event) =>
                    updateForm("certificateType", event.target.value)
                  }
                  className="w-full rounded-lg bg-brand-light px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/40"
                >
                  {certificateTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
                    </option>
                  ))}
                </select>
                <p className="mt-1 text-xs text-slate-500">
                  Uses the built-in print-ready certificate layout.
                </p>
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-navy">
                  Student name
                </label>
                <input
                  value={form.studentName}
                  maxLength={255}
                  onChange={(event) => updateForm("studentName", event.target.value)}
                  className="w-full rounded-lg bg-brand-light px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/40"
                  required
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-navy">
                  Certificate number (optional)
                </label>
                <input
                  value={form.certificateNumber ?? ""}
                  maxLength={100}
                  onChange={(event) =>
                    updateForm("certificateNumber", event.target.value || null)
                  }
                  className="w-full rounded-lg bg-brand-light px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/40"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-sm font-medium text-navy">
                  Certificate title
                </label>
                <input
                  value={form.title}
                  maxLength={255}
                  onChange={(event) => updateForm("title", event.target.value)}
                  placeholder="Bachelor of Technology"
                  className="w-full rounded-lg bg-brand-light px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/40"
                  required
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-navy">
                    Degree / course
                  </label>
                  <input
                    value={form.course}
                    maxLength={255}
                    onChange={(event) => updateForm("course", event.target.value)}
                    className="w-full rounded-lg bg-brand-light px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/40"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-navy">
                    Grade / CGPA
                  </label>
                  <input
                    value={form.grade ?? ""}
                    maxLength={50}
                    onChange={(event) =>
                      updateForm("grade", event.target.value || null)
                    }
                    className="w-full rounded-lg bg-brand-light px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/40"
                  />
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-navy">
                    Issue date
                  </label>
                  <input
                    type="date"
                    value={form.issueDate}
                    onChange={(event) => updateForm("issueDate", event.target.value)}
                    className="w-full rounded-lg bg-brand-light px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/40"
                    required
                  />
                </div>
                <div>
                  <label className="mb-1.5 block text-sm font-medium text-navy">
                    Expiry date (optional)
                  </label>
                  <input
                    type="date"
                    value={form.expiryDate ?? ""}
                    min={form.issueDate}
                    onChange={(event) =>
                      updateForm("expiryDate", event.target.value || null)
                    }
                    className="w-full rounded-lg bg-brand-light px-3 py-2.5 text-sm outline-none focus:ring-2 focus:ring-brand/40"
                  />
                </div>
              </div>

              {error && (
                <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
                  {error}
                </p>
              )}

              {!issued ? (
                <button
                  type="button"
                  onClick={() => void handleIssue()}
                  disabled={
                    busy ||
                    !form.studentName.trim() ||
                    !form.title.trim() ||
                    !form.course.trim() ||
                    !form.issueDate
                  }
                  className="flex w-full items-center justify-center gap-2 rounded-lg bg-brand px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-brand/90 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {busy ? <Loader2 size={16} className="animate-spin" /> : <ShieldCheck size={16} />}
                  {busy ? "Generating and registering…" : "Review & issue"}
                </button>
              ) : (
                <div className="rounded-xl border border-slate-200 p-4">
                  <div className="flex items-start gap-3">
                    {issued.status === "issued" ? (
                      <CheckCircle2 className="mt-0.5 text-emerald-500" size={20} />
                    ) : (
                      <AlertTriangle className="mt-0.5 text-amber-500" size={20} />
                    )}
                    <div className="min-w-0">
                      <p className="break-all font-semibold text-navy">
                        {issued.certificateId}
                      </p>
                      <StatusMessage certificate={issued} />
                      {issued.blockchainTxHash && (
                        <p className="mt-2 break-all text-xs text-slate-500">
                          Transaction: {issued.blockchainTxHash}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="mt-4 flex flex-wrap gap-2">
                    {issued.status === "issued" && (
                      <button
                        type="button"
                        onClick={() => void handleDownload(issued)}
                        className="flex items-center gap-2 rounded-lg bg-brand-light px-3 py-2 text-sm font-medium text-brand"
                      >
                        <Download size={15} /> Download PDF
                      </button>
                    )}
                    {(issued.status === "registration_failed" ||
                      issued.status === "pending_registration") && (
                      <button
                        type="button"
                        disabled={busy}
                        onClick={() => void handleRetry()}
                        className="rounded-lg bg-amber-50 px-3 py-2 text-sm font-medium text-amber-800 disabled:opacity-50"
                      >
                        {busy ? "Checking…" : "Check / retry registration"}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={resetSingle}
                      className="rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                    >
                      Issue another
                    </button>
                    <button
                      type="button"
                      onClick={() => navigate("/issuerdashboard/certificates")}
                      className="flex items-center gap-1 rounded-lg px-3 py-2 text-sm text-slate-600 hover:bg-slate-50"
                    >
                      <ArrowLeft size={14} /> Certificates
                    </button>
                  </div>
                </div>
              )}
            </div>

            <div className="self-start rounded-2xl border-2 border-brand/20 bg-brand-light p-8 text-center">
              <ShieldCheck className="mx-auto mb-3 text-brand" size={34} />
              <p className="text-xs uppercase tracking-widest text-slate-500">
                {certificateTypes.find((type) => type.value === form.certificateType)?.label}
              </p>
              <h2 className="mt-2 break-words text-2xl font-bold text-navy">
                {form.title || "Certificate title"}
              </h2>
              <p className="mt-4 text-sm text-slate-500">This is to certify that</p>
              <p className="mt-1 break-words text-xl font-semibold text-brand">
                {form.studentName || "Student name"}
              </p>
              <p className="mt-3 text-sm text-slate-500">has completed</p>
              <p className="break-words font-medium text-navy">
                {form.course || "Degree / course"}
              </p>
              {form.grade && (
                <p className="mt-1 text-sm text-slate-500">
                  Grade / CGPA: {form.grade}
                </p>
              )}
              <p className="mt-6 border-t border-brand/20 pt-4 text-xs text-slate-500">
                Issue date: {form.issueDate || "—"}
              </p>
            </div>
          </div>
        )}

        {activeTab === "bulk" && (
          <div className="mx-auto max-w-3xl space-y-5 p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-semibold text-navy">CSV certificate batch</h2>
                <p className="mt-1 text-sm text-slate-500">
                  Upload up to 50 records. Each certificate is independently validated and issued.
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  const csv = [
                    "studentName,certificateNumber,certificateType,title,course,grade,issueDate,expiryDate",
                    "Example Student,INST-2026-001,degree,Bachelor of Science,Computer Science,8.5,2026-06-01,",
                  ].join("\r\n");
                  const link = document.createElement("a");
                  link.href = URL.createObjectURL(
                    new Blob([csv], { type: "text/csv" }),
                  );
                  link.download = "certifyvault-certificates.csv";
                  link.click();
                  URL.revokeObjectURL(link.href);
                }}
                className="text-sm font-medium text-brand hover:underline"
              >
                Download CSV template
              </button>
            </div>

            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 py-10 hover:border-brand/40 hover:bg-brand-light/30">
              <UploadCloud size={30} className="text-brand" />
              <span className="text-sm font-medium text-navy">
                Choose a CSV file
              </span>
              <span className="text-xs text-slate-400">
              Required columns: studentName, certificateType, title, course, issueDate; certificateNumber is optional
              </span>
              <input
                type="file"
                accept=".csv,text/csv"
                className="hidden"
                disabled={bulkBusy}
                onChange={(event) => void handleCsv(event.target.files?.[0])}
              />
            </label>

            {bulkError && (
              <p role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">
                {bulkError}
              </p>
            )}

            {bulkRows.length > 0 && (
              <>
                <div className="flex items-center gap-3 rounded-xl bg-brand-light p-4">
                  <FileSpreadsheet className="text-brand" size={20} />
                  <p className="text-sm text-navy">
                    {bulkRows.length} rows · {bulkRows.filter((row) => row.input).length} valid ·{" "}
                    {bulkRows.filter((row) => !row.input).length} invalid
                  </p>
                </div>
                <div className="max-h-80 overflow-auto rounded-xl border border-slate-200">
                  <table className="w-full text-left text-sm">
                    <thead className="sticky top-0 bg-slate-50 text-slate-500">
                      <tr>
                        <th className="px-3 py-2">CSV row</th>
                        <th className="px-3 py-2">Student</th>
                        <th className="px-3 py-2">Result</th>
                      </tr>
                    </thead>
                    <tbody>
                      {bulkRows.map((row) => (
                        <tr key={row.line} className="border-t border-slate-100">
                          <td className="px-3 py-2">{row.line}</td>
                          <td className="px-3 py-2">
                            {row.input?.studentName ?? "—"}
                          </td>
                          <td className="px-3 py-2">
                            {row.error ??
                              row.resultError ??
                              row.result?.status ??
                              (bulkBusy ? "Waiting" : "Ready")}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <div className="flex flex-wrap items-center justify-between gap-3">
                  {bulkBusy && (
                    <p className="text-sm text-slate-500">
                      Processed {bulkProgress} of{" "}
                      {bulkRows.filter((row) => row.input).length} records.
                    </p>
                  )}
                  <button
                    type="button"
                    disabled={
                      bulkBusy ||
                      !bulkRows.some((row) => row.input) ||
                      bulkProgress > 0
                    }
                    onClick={() => void handleBulkIssue()}
                    className="ml-auto flex items-center gap-2 rounded-lg bg-brand px-5 py-2.5 text-sm font-medium text-white hover:bg-brand/90 disabled:opacity-50"
                  >
                    {bulkBusy && <Loader2 size={16} className="animate-spin" />}
                    {bulkBusy ? "Issuing records…" : "Confirm valid rows"}
                  </button>
                </div>
              </>
            )}

            <button
              type="button"
              onClick={() => {
                setBulkRows([]);
                setBulkProgress(0);
                setBulkError("");
              }}
              disabled={bulkBusy}
              className="flex items-center gap-1 text-sm text-slate-500 hover:text-navy disabled:opacity-50"
            >
              <X size={14} /> Clear batch
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
