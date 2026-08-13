import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Check, Loader2, GraduationCap, BookOpen, Briefcase, Award,
  Search, ArrowLeft, ArrowRight, ShieldCheck, Download, Eye,
  UploadCloud, FileSpreadsheet, CheckCircle2, AlertTriangle, X,
} from "lucide-react";
import { PageHeader } from "../../../../Pages/IssuerDashLayout/IssuerDashLayout";

/* ══════════════════════════════════════════════════════
   1. PIPELINE PROGRESS (shared by single + bulk flows)
   ══════════════════════════════════════════════════════ */

interface PipelineProgressProps {
  steps: string[];
  running: boolean;
  stepDuration?: number;
  onComplete?: () => void;
}

function PipelineProgress({ steps, running, stepDuration = 900, onComplete }: PipelineProgressProps) {
  const [activeIndex, setActiveIndex] = useState(-1);

  useEffect(() => {
    if (!running) {
      setActiveIndex(-1);
      return;
    }
    setActiveIndex(0);
    const timers: ReturnType<typeof setTimeout>[] = [];
    steps.forEach((_, i) => {
      const t = setTimeout(() => {
        setActiveIndex(i + 1);
        if (i === steps.length - 1) onComplete?.();
      }, stepDuration * (i + 1));
      timers.push(t);
    });
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running]);

  return (
    <div className="space-y-3">
      {steps.map((step, i) => {
        const isDone = activeIndex > i;
        const isActive = activeIndex === i;
        return (
          <div key={step} className="flex items-center gap-3">
            <div
              className={`w-7 h-7 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                isDone ? "bg-emerald-500 text-white" : isActive ? "bg-brand text-white" : "bg-brand-light text-slate-400"
              }`}
            >
              {isDone ? <Check size={14} /> : isActive ? <Loader2 size={14} className="animate-spin" /> : <span className="text-xs font-semibold">{i + 1}</span>}
            </div>
            <span className={`text-sm ${isDone || isActive ? "text-navy font-medium" : "text-slate-400"}`}>{step}</span>
          </div>
        );
      })}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   2. BULK ISSUANCE (tab)
   ══════════════════════════════════════════════════════ */

const bulkPipelineSteps = [
  "Validating records",
  "Generating certificates",
  "Computing SHA-256 hashes",
  "Registering on blockchain",
  "Generating QR codes",
  "Certificates issued",
];

function BulkIssuance() {
  const [fileName, setFileName] = useState<string | null>(null);
  const [validated, setValidated] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isDone, setIsDone] = useState(false);

  // 🔧 Replace with real file parsing (e.g. papaparse / SheetJS) + API validation
  const mockValidation = { total: 500, valid: 498, errors: 2 };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
      setValidated(false);
      setIsDone(false);
    }
  };

  const handleValidate = () => setValidated(true);
  const handleGenerate = () => setIsProcessing(true);
  const handleComplete = () => {
    setIsProcessing(false);
    setIsDone(true);
  };
  const reset = () => {
    setFileName(null);
    setValidated(false);
    setIsProcessing(false);
    setIsDone(false);
  };

  return (
    <div className="p-6 max-w-2xl mx-auto space-y-6">
      {!fileName && (
        <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-slate-200 rounded-2xl py-12 cursor-pointer hover:border-brand/40 hover:bg-brand-light/40 transition-colors">
          <UploadCloud size={32} className="text-brand" />
          <p className="text-sm font-medium text-navy">Upload Excel or CSV file</p>
          <p className="text-xs text-slate-400">Student names, roll numbers, course, grade columns required</p>
          <input type="file" accept=".csv,.xlsx,.xls" className="hidden" onChange={handleFileChange} />
        </label>
      )}

      {fileName && !isProcessing && !isDone && (
        <div className="rounded-xl border border-slate-200 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <FileSpreadsheet className="text-brand" size={22} />
            <div>
              <p className="text-sm font-medium text-navy">{fileName}</p>
              <p className="text-xs text-slate-400">Ready to validate</p>
            </div>
          </div>
          <button onClick={reset} className="p-1.5 rounded-lg hover:bg-brand-light text-slate-400">
            <X size={16} />
          </button>
        </div>
      )}

      {fileName && !validated && !isProcessing && !isDone && (
        <button onClick={handleValidate} className="w-full py-2.5 rounded-lg bg-brand text-white text-sm font-medium hover:bg-brand/90 transition-colors">
          Validate Records
        </button>
      )}

      {validated && !isProcessing && !isDone && (
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-xl bg-brand-light p-4 text-center">
              <p className="text-2xl font-bold text-navy">{mockValidation.total}</p>
              <p className="text-xs text-slate-500 mt-1">Total Records</p>
            </div>
            <div className="rounded-xl bg-emerald-50 p-4 text-center">
              <p className="text-2xl font-bold text-emerald-600">{mockValidation.valid}</p>
              <p className="text-xs text-slate-500 mt-1">Valid</p>
            </div>
            <div className="rounded-xl bg-rose-50 p-4 text-center">
              <p className="text-2xl font-bold text-rose-500">{mockValidation.errors}</p>
              <p className="text-xs text-slate-500 mt-1">Errors</p>
            </div>
          </div>

          {mockValidation.errors > 0 && (
            <div className="flex items-start gap-2 text-sm text-amber-600 bg-amber-50 rounded-lg p-3">
              <AlertTriangle size={16} className="shrink-0 mt-0.5" />
              <span>2 rows have missing roll numbers. These will be skipped during generation.</span>
            </div>
          )}

          <button
            onClick={handleGenerate}
            className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand text-white text-sm font-medium hover:bg-brand/90 transition-colors"
          >
            <CheckCircle2 size={16} /> Generate {mockValidation.valid} Certificates
          </button>
        </div>
      )}

      {(isProcessing || isDone) && (
        <div className="max-w-md mx-auto py-4">
          {!isDone ? (
            <PipelineProgress steps={bulkPipelineSteps} running={isProcessing} onComplete={handleComplete} />
          ) : (
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="text-emerald-500" size={28} />
              </div>
              <h3 className="font-semibold text-navy text-lg">{mockValidation.valid} Certificates Issued</h3>
              <p className="text-sm text-slate-500 mt-1">All certificates have been generated, hashed, and registered on-chain.</p>
              <button onClick={reset} className="mt-6 px-4 py-2 rounded-lg bg-brand-light text-brand text-sm font-medium hover:bg-brand/10 transition-colors">
                Upload Another Batch
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   3. ISSUE CERTIFICATE (default export — the page)
   ══════════════════════════════════════════════════════ */

// 🔧 Replace with your API call
const mockStudents = [
  { id: "STU-1001", name: "Aditi Rao", email: "aditi.rao@college.edu", rollNo: "CS2021045", branch: "Computer Science" },
  { id: "STU-1002", name: "Rohan Mehta", email: "rohan.mehta@college.edu", rollNo: "ME2021012", branch: "Mechanical Engg." },
  { id: "STU-1003", name: "Sara Khan", email: "sara.khan@college.edu", rollNo: "EC2021078", branch: "Electronics" },
  { id: "STU-1004", name: "Vikram Singh", email: "vikram.singh@college.edu", rollNo: "CS2021099", branch: "Computer Science" },
];

const certTypes = [
  { value: "degree", label: "Degree Certificate", icon: GraduationCap },
  { value: "course", label: "Course Certificate", icon: BookOpen },
  { value: "internship", label: "Internship Certificate", icon: Briefcase },
  { value: "training", label: "Training Certificate", icon: Award },
];

const wizardSteps = ["Select Student", "Certificate Type", "Fill Details", "Preview", "Issue"];

const pipelineSteps = [
  "Generating PDF",
  "Generating QR Code",
  "Computing SHA-256 Hash",
  "Registering on Blockchain",
  "Certificate Issued",
];

function StepIndicator({ currentStep }: { currentStep: number }) {
  return (
    <div className="flex items-center mb-8">
      {wizardSteps.map((label, i) => (
        <div key={label} className="flex items-center flex-1 last:flex-none">
          <div className="flex flex-col items-center gap-1.5">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-semibold shrink-0 ${
                i < currentStep ? "bg-brand text-white" : i === currentStep ? "bg-navy text-white" : "bg-brand-light text-slate-400"
              }`}
            >
              {i < currentStep ? <Check size={14} /> : i + 1}
            </div>
            <span className={`text-xs whitespace-nowrap ${i === currentStep ? "text-navy font-semibold" : "text-slate-400"}`}>{label}</span>
          </div>
          {i < wizardSteps.length - 1 && <div className={`flex-1 h-0.5 mx-2 ${i < currentStep ? "bg-brand" : "bg-brand-light"}`} />}
        </div>
      ))}
    </div>
  );
}

export default function IssueCertificate() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<"single" | "bulk">("single");
  const [step, setStep] = useState(0);
  const [studentSearch, setStudentSearch] = useState("");

  const [selectedStudent, setSelectedStudent] = useState<typeof mockStudents[0] | null>(null);
  const [certType, setCertType] = useState<string | null>(null);
  const [details, setDetails] = useState({
    title: "",
    program: "",
    grade: "",
    issueDate: new Date().toISOString().slice(0, 10),
    expiryDate: "",
    notes: "",
  });

  const [isIssuing, setIsIssuing] = useState(false);
  const [issuedCertId, setIssuedCertId] = useState<string | null>(null);

  const filteredStudents = mockStudents.filter(
    (s) => s.name.toLowerCase().includes(studentSearch.toLowerCase()) || s.rollNo.toLowerCase().includes(studentSearch.toLowerCase())
  );

  const canGoNext =
    (step === 0 && selectedStudent) ||
    (step === 1 && certType) ||
    (step === 2 && details.title && details.program) ||
    step === 3;

  const handleIssue = () => {
    setStep(4);
    setIsIssuing(true);
  };

  const handlePipelineComplete = () => {
    setIssuedCertId(`CERT-2026-${Math.floor(10000 + Math.random() * 89999)}`);
    setIsIssuing(false);
  };

  const resetWizard = () => {
    setStep(0);
    setSelectedStudent(null);
    setCertType(null);
    setDetails({ title: "", program: "", grade: "", issueDate: new Date().toISOString().slice(0, 10), expiryDate: "", notes: "" });
    setIssuedCertId(null);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <PageHeader title="Issue Certificate" description="Create and issue a verified certificate to a student" />

        {/* Tabs */}
        <div className="flex gap-2 px-6 pt-4 border-b border-slate-100">
          {(["single", "bulk"] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2.5 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab ? "border-brand text-brand" : "border-transparent text-slate-500 hover:text-navy"
              }`}
            >
              {tab === "single" ? "Single Issuance" : "Bulk Issuance"}
            </button>
          ))}
        </div>

        {activeTab === "single" ? (
          <div className="p-6">
            <StepIndicator currentStep={step} />

            {/* Step 0 — Select Student */}
            {step === 0 && (
              <div className="space-y-4">
                <div className="relative max-w-sm">
                  <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <input
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                    placeholder="Search by name or roll number..."
                    className="w-full pl-9 pr-3 py-2 rounded-lg bg-brand-light text-sm outline-none focus:ring-2 focus:ring-brand/40"
                  />
                </div>
                <div className="grid sm:grid-cols-2 gap-3">
                  {filteredStudents.map((s) => (
                    <button
                      key={s.id}
                      onClick={() => setSelectedStudent(s)}
                      className={`text-left p-4 rounded-xl border transition-colors ${
                        selectedStudent?.id === s.id ? "border-brand bg-brand-light" : "border-slate-200 hover:border-brand/40 hover:bg-brand-light/40"
                      }`}
                    >
                      <p className="font-semibold text-navy">{s.name}</p>
                      <p className="text-xs text-slate-500">{s.rollNo} · {s.branch}</p>
                      <p className="text-xs text-slate-400">{s.email}</p>
                    </button>
                  ))}
                  {filteredStudents.length === 0 && (
                    <p className="text-sm text-slate-400 col-span-2 py-6 text-center">No students found.</p>
                  )}
                </div>
              </div>
            )}

            {/* Step 1 — Certificate Type */}
            {step === 1 && (
              <div className="grid sm:grid-cols-2 gap-3">
                {certTypes.map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.value}
                      onClick={() => setCertType(type.value)}
                      className={`flex items-center gap-3 p-4 rounded-xl border transition-colors ${
                        certType === type.value ? "border-brand bg-brand-light" : "border-slate-200 hover:border-brand/40 hover:bg-brand-light/40"
                      }`}
                    >
                      <div className="w-10 h-10 rounded-lg bg-brand-light flex items-center justify-center">
                        <Icon size={20} className="text-brand" />
                      </div>
                      <span className="font-medium text-navy">{type.label}</span>
                    </button>
                  );
                })}
              </div>
            )}

            {/* Step 2 — Fill Details */}
            {step === 2 && (
              <div className="grid sm:grid-cols-2 gap-4 max-w-2xl">
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-navy mb-1.5 block">Certificate Title</label>
                  <input
                    value={details.title}
                    onChange={(e) => setDetails({ ...details, title: e.target.value })}
                    placeholder="e.g. Bachelor of Technology"
                    className="w-full px-3 py-2.5 rounded-lg bg-brand-light text-sm outline-none focus:ring-2 focus:ring-brand/40"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-navy mb-1.5 block">Program / Course Name</label>
                  <input
                    value={details.program}
                    onChange={(e) => setDetails({ ...details, program: e.target.value })}
                    placeholder="e.g. Computer Science & Engineering"
                    className="w-full px-3 py-2.5 rounded-lg bg-brand-light text-sm outline-none focus:ring-2 focus:ring-brand/40"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-navy mb-1.5 block">Grade / CGPA</label>
                  <input
                    value={details.grade}
                    onChange={(e) => setDetails({ ...details, grade: e.target.value })}
                    placeholder="e.g. 8.7 CGPA"
                    className="w-full px-3 py-2.5 rounded-lg bg-brand-light text-sm outline-none focus:ring-2 focus:ring-brand/40"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-navy mb-1.5 block">Issue Date</label>
                  <input
                    type="date"
                    value={details.issueDate}
                    onChange={(e) => setDetails({ ...details, issueDate: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-brand-light text-sm outline-none focus:ring-2 focus:ring-brand/40"
                  />
                </div>
                <div>
                  <label className="text-sm font-medium text-navy mb-1.5 block">Expiry Date (optional)</label>
                  <input
                    type="date"
                    value={details.expiryDate}
                    onChange={(e) => setDetails({ ...details, expiryDate: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-lg bg-brand-light text-sm outline-none focus:ring-2 focus:ring-brand/40"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="text-sm font-medium text-navy mb-1.5 block">Additional Notes (optional)</label>
                  <textarea
                    value={details.notes}
                    onChange={(e) => setDetails({ ...details, notes: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2.5 rounded-lg bg-brand-light text-sm outline-none focus:ring-2 focus:ring-brand/40 resize-none"
                  />
                </div>
              </div>
            )}

            {/* Step 3 — Preview */}
            {step === 3 && selectedStudent && (
              <div className="max-w-xl mx-auto">
                <div className="rounded-2xl border-2 border-brand/20 bg-brand-light p-8 text-center relative">
                  <ShieldCheck className="mx-auto text-brand mb-3" size={36} />
                  <p className="text-xs tracking-widest text-slate-500 uppercase">
                    Certificate of {certTypes.find((t) => t.value === certType)?.label.replace(" Certificate", "")}
                  </p>
                  <h2 className="text-2xl font-bold text-navy mt-2">{details.title || "Certificate Title"}</h2>
                  <p className="text-sm text-slate-500 mt-3">This is to certify that</p>
                  <p className="text-xl font-semibold text-brand mt-1">{selectedStudent.name}</p>
                  <p className="text-sm text-slate-500 mt-2">has successfully completed</p>
                  <p className="font-medium text-navy">{details.program || "Program Name"}</p>
                  {details.grade && <p className="text-sm text-slate-500 mt-1">with a grade of {details.grade}</p>}
                  <div className="flex justify-between mt-6 pt-4 border-t border-brand/20 text-xs text-slate-500">
                    <span>Issued: {details.issueDate}</span>
                    <span>{selectedStudent.rollNo}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Step 4 — Issue / Processing / Success */}
            {step === 4 && (
              <div className="max-w-md mx-auto py-4">
                {!issuedCertId ? (
                  <PipelineProgress steps={pipelineSteps} running={isIssuing} onComplete={handlePipelineComplete} />
                ) : (
                  <div className="text-center">
                    <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
                      <Check className="text-emerald-500" size={28} />
                    </div>
                    <h3 className="font-semibold text-navy text-lg">Certificate Issued Successfully</h3>
                    <p className="text-sm text-slate-500 mt-1">{issuedCertId}</p>
                    <div className="flex items-center justify-center gap-3 mt-6">
                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-light text-brand text-sm font-medium hover:bg-brand/10 transition-colors">
                        <Eye size={16} /> View
                      </button>
                      <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-brand-light text-brand text-sm font-medium hover:bg-brand/10 transition-colors">
                        <Download size={16} /> Download PDF
                      </button>
                    </div>
                    <div className="flex items-center justify-center gap-3 mt-4">
                      <button onClick={resetWizard} className="text-sm text-slate-500 hover:text-navy transition-colors">
                        Issue another
                      </button>
                      <span className="text-slate-300">·</span>
                      <button
                        onClick={() => navigate("/issuerdashboard/certificates")}
                        className="text-sm text-slate-500 hover:text-navy transition-colors"
                      >
                        Back to Certificates
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Navigation buttons */}
            {step < 4 && (
              <div className="flex items-center justify-between mt-8 pt-6 border-t border-slate-100">
                <button
                  onClick={() => setStep((s) => Math.max(0, s - 1))}
                  disabled={step === 0}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium text-slate-600 disabled:opacity-40 hover:bg-brand-light transition-colors"
                >
                  <ArrowLeft size={16} /> Back
                </button>

                {step === 3 ? (
                  <button
                    onClick={handleIssue}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-medium bg-brand text-white hover:bg-brand/90 transition-colors"
                  >
                    Issue Certificate <ShieldCheck size={16} />
                  </button>
                ) : (
                  <button
                    onClick={() => setStep((s) => s + 1)}
                    disabled={!canGoNext}
                    className="flex items-center gap-1.5 px-5 py-2.5 rounded-lg text-sm font-medium bg-brand text-white disabled:opacity-40 hover:bg-brand/90 transition-colors"
                  >
                    Next <ArrowRight size={16} />
                  </button>
                )}
              </div>
            )}
          </div>
        ) : (
          <BulkIssuance />
        )}
      </div>
    </div>
  );
}