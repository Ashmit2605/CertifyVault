import { createContext, useContext, useState, useRef } from "react";
import type { ReactNode } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  UploadCloud, QrCode, PenTool, Image as ImageIcon, Plus, X, Save, Eye, ArrowLeft,
  CheckCircle2, GraduationCap, Award, FileCheck2, BookOpen, Briefcase, Trophy, Sparkles,
} from "lucide-react";
import { PageHeader } from "../../../../Pages/IssuerDashLayout/IssuerDashLayout";

/* ══════════════════════════════════════════════════════
   1. SHARED STATE (Context)
   ══════════════════════════════════════════════════════ */

export interface TemplateElement {
  id: string;
  type: "qr" | "signature" | "logo";
  label: string;
  x: number; // percentage
  y: number;
  width: number;
  height: number;
}

export interface TemplateField {
  id: string;
  name: string;
  enabled: boolean;
}

export interface TemplateConfig {
  id: string;
  name: string;
  backgroundImage: string | null;
  elements: TemplateElement[];
  fields: TemplateField[];
  configured: boolean;
}

const templateTypes = [
  { id: "degree", name: "Degree Certificate" },
  { id: "diploma", name: "Diploma" },
  { id: "bonafide", name: "Bonafide" },
  { id: "course", name: "Course Certificate" },
  { id: "internship", name: "Internship Certificate" },
  { id: "achievement", name: "Achievement Certificate" },
  { id: "custom", name: "Custom Template" },
];

function defaultElements(): TemplateElement[] {
  return [
    { id: "logo", type: "logo", label: "Institution Logo", x: 42, y: 6, width: 16, height: 12 },
    { id: "qr", type: "qr", label: "QR Code", x: 80, y: 76, width: 14, height: 14 },
    { id: "signature", type: "signature", label: "Signature", x: 6, y: 80, width: 20, height: 10 },
  ];
}

function defaultFields(): TemplateField[] {
  return [
    { id: "studentName", name: "Student Name", enabled: true },
    { id: "program", name: "Program / Course", enabled: true },
    { id: "grade", name: "Grade / CGPA", enabled: true },
    { id: "issueDate", name: "Issue Date", enabled: true },
    { id: "certId", name: "Certificate ID", enabled: true },
  ];
}

function initialTemplates(): TemplateConfig[] {
  return templateTypes.map((t) => ({
    id: t.id,
    name: t.name,
    backgroundImage: null,
    elements: defaultElements(),
    fields: defaultFields(),
    configured: false,
  }));
}

interface TemplatesContextValue {
  templates: TemplateConfig[];
  getTemplate: (id: string) => TemplateConfig | undefined;
  updateTemplate: (id: string, updates: Partial<TemplateConfig>) => void;
}

const TemplatesContext = createContext<TemplatesContextValue | null>(null);

export function TemplatesProvider({ children }: { children: ReactNode }) {
  // 🔧 Replace initialTemplates() with a fetch of saved templates from your API
  const [templates, setTemplates] = useState<TemplateConfig[]>(initialTemplates());

  const getTemplate = (id: string) => templates.find((t) => t.id === id);

  const updateTemplate = (id: string, updates: Partial<TemplateConfig>) => {
    // 🔧 Also PATCH/PUT to your API here once backend exists
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, ...updates } : t)));
  };

  return (
    <TemplatesContext.Provider value={{ templates, getTemplate, updateTemplate }}>
      {children}
    </TemplatesContext.Provider>
  );
}

function useTemplates() {
  const ctx = useContext(TemplatesContext);
  if (!ctx) throw new Error("useTemplates must be used within TemplatesProvider");
  return ctx;
}

/* ══════════════════════════════════════════════════════
   2. DRAGGABLE BOX (used inside the editor canvas)
   ══════════════════════════════════════════════════════ */

interface DraggableBoxProps {
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  icon: React.ReactNode;
  color: string;
  containerRef: React.RefObject<HTMLDivElement | null>;
  onChange: (x: number, y: number) => void;
}

function DraggableBox({ x, y, width, height, label, icon, color, containerRef, onChange }: DraggableBoxProps) {
  const dragging = useRef(false);

  const handlePointerDown = (e: React.PointerEvent) => {
    dragging.current = true;
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragging.current || !containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    let newX = ((e.clientX - rect.left) / rect.width) * 100 - width / 2;
    let newY = ((e.clientY - rect.top) / rect.height) * 100 - height / 2;
    newX = Math.min(Math.max(newX, 0), 100 - width);
    newY = Math.min(Math.max(newY, 0), 100 - height);
    onChange(newX, newY);
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    dragging.current = false;
    (e.target as HTMLElement).releasePointerCapture(e.pointerId);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{ left: `${x}%`, top: `${y}%`, width: `${width}%`, height: `${height}%` }}
      className={`absolute flex flex-col items-center justify-center gap-1 rounded-lg border-2 border-dashed cursor-grab active:cursor-grabbing select-none touch-none ${color}`}
    >
      {icon}
      <span className="text-[10px] font-medium whitespace-nowrap">{label}</span>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   3. TEMPLATE CARD (gallery grid item)
   ══════════════════════════════════════════════════════ */

const iconMap: Record<string, React.ReactNode> = {
  degree: <GraduationCap size={28} />,
  diploma: <Award size={28} />,
  bonafide: <FileCheck2 size={28} />,
  course: <BookOpen size={28} />,
  internship: <Briefcase size={28} />,
  achievement: <Trophy size={28} />,
  custom: <Sparkles size={28} />,
};

function TemplateCard({ template, onEdit }: { template: TemplateConfig; onEdit: () => void }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-white overflow-hidden hover:shadow-md transition-shadow">
      <div
        className="h-32 bg-brand-light bg-cover bg-center flex items-center justify-center"
        style={{ backgroundImage: template.backgroundImage ? `url(${template.backgroundImage})` : undefined }}
      >
        {!template.backgroundImage && <div className="text-brand/40">{iconMap[template.id]}</div>}
      </div>
      <div className="p-4">
        <div className="flex items-center justify-between mb-1">
          <h3 className="font-semibold text-navy text-sm">{template.name}</h3>
          {template.configured && <CheckCircle2 size={16} className="text-emerald-500 shrink-0" />}
        </div>
        <p className="text-xs text-slate-400 mb-3">
          {template.configured ? "Configured" : "Not set up yet"}
        </p>
        <button
          onClick={onEdit}
          className="w-full py-2 rounded-lg bg-brand-light text-brand text-sm font-medium hover:bg-brand/10 transition-colors"
        >
          {template.configured ? "Edit Template" : "Set Up Template"}
        </button>
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   4. TEMPLATES GALLERY (default export — route: /templates)
   ══════════════════════════════════════════════════════ */

export default function Templates() {
  const navigate = useNavigate();
  const { templates } = useTemplates();

  return (
    <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
      <PageHeader title="Templates" description="Design and manage your certificate templates" />
      <div className="p-6 grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {templates.map((t) => (
          <TemplateCard
            key={t.id}
            template={t}
            onEdit={() => navigate(`/issuerdashboard/templates/${t.id}`)}
          />
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════════════════════════════════════
   5. TEMPLATE EDITOR (route: /templates/:templateId)
   ══════════════════════════════════════════════════════ */

const elementIcons: Record<string, React.ReactNode> = {
  logo: <ImageIcon size={16} />,
  qr: <QrCode size={16} />,
  signature: <PenTool size={16} />,
};

const elementColors: Record<string, string> = {
  logo: "bg-blue-50/80 border-blue-400 text-blue-600",
  qr: "bg-emerald-50/80 border-emerald-400 text-emerald-600",
  signature: "bg-amber-50/80 border-amber-400 text-amber-600",
};

export function TemplateEditor() {
  const { templateId } = useParams();
  const navigate = useNavigate();
  const { getTemplate, updateTemplate } = useTemplates();
  const template = templateId ? getTemplate(templateId) : undefined;

  const canvasRef = useRef<HTMLDivElement>(null);
  const [previewMode, setPreviewMode] = useState(false);
  const [newFieldName, setNewFieldName] = useState("");

  if (!template) {
    return <p className="text-slate-500">Template not found.</p>;
  }

  const handleUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      updateTemplate(template.id, { backgroundImage: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleElementMove = (elId: string, x: number, y: number) => {
    const updatedElements = template.elements.map((el) =>
      el.id === elId ? { ...el, x, y } : el
    );
    updateTemplate(template.id, { elements: updatedElements });
  };

  const toggleField = (fieldId: string) => {
    const updatedFields = template.fields.map((f) =>
      f.id === fieldId ? { ...f, enabled: !f.enabled } : f
    );
    updateTemplate(template.id, { fields: updatedFields });
  };

  const addCustomField = () => {
    if (!newFieldName.trim()) return;
    updateTemplate(template.id, {
      fields: [...template.fields, { id: `custom-${Date.now()}`, name: newFieldName.trim(), enabled: true }],
    });
    setNewFieldName("");
  };

  const removeField = (fieldId: string) => {
    updateTemplate(template.id, { fields: template.fields.filter((f) => f.id !== fieldId) });
  };

  const handleSave = () => {
    updateTemplate(template.id, { configured: true });
    navigate("/issuerdashboard/templates");
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        <PageHeader
          title={template.name}
          description="Design your certificate template"
          action={{
            label: previewMode ? "Exit Preview" : "Preview",
            icon: <Eye size={16} />,
            onClick: () => setPreviewMode((p) => !p),
          }}
        />

        <div className="p-6">
          <button
            onClick={() => navigate("/issuerdashboard/templates")}
            className="flex items-center gap-1.5 text-sm text-slate-500 hover:text-navy mb-4 transition-colors"
          >
            <ArrowLeft size={15} /> Back to Templates
          </button>

          <div className="grid lg:grid-cols-[1fr_300px] gap-6">
            {/* Canvas column */}
            <div className="space-y-3">
              {!previewMode && (
                <label className="flex items-center gap-2 w-fit px-4 py-2 rounded-lg bg-brand-light text-brand text-sm font-medium cursor-pointer hover:bg-brand/10 transition-colors">
                  <UploadCloud size={16} />
                  {template.backgroundImage ? "Change Background" : "Upload Background"}
                  <input type="file" accept="image/*" className="hidden" onChange={handleUpload} />
                </label>
              )}

              <div
                ref={canvasRef}
                className="relative w-full aspect-[4/3] rounded-xl border border-slate-200 overflow-hidden bg-brand-light bg-cover bg-center"
                style={{
                  backgroundImage: template.backgroundImage ? `url(${template.backgroundImage})` : undefined,
                }}
              >
                {!template.backgroundImage && (
                  <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm px-6 text-center">
                    Upload a background to preview your certificate
                  </div>
                )}

                {template.elements.map((el) =>
                  previewMode ? (
                    <div
                      key={el.id}
                      style={{ left: `${el.x}%`, top: `${el.y}%`, width: `${el.width}%`, height: `${el.height}%` }}
                      className="absolute flex items-center justify-center rounded-md bg-white/70 backdrop-blur-sm text-[10px] font-medium text-slate-600"
                    >
                      {el.label}
                    </div>
                  ) : (
                    <DraggableBox
                      key={el.id}
                      x={el.x}
                      y={el.y}
                      width={el.width}
                      height={el.height}
                      label={el.label}
                      icon={elementIcons[el.type]}
                      color={elementColors[el.type]}
                      containerRef={canvasRef}
                      onChange={(x, y) => handleElementMove(el.id, x, y)}
                    />
                  )
                )}
              </div>
              {!previewMode && (
                <p className="text-xs text-slate-400">
                  Drag the logo, QR code, and signature boxes to position them on your certificate.
                </p>
              )}
            </div>

            {/* Fields sidebar */}
            {!previewMode && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-semibold text-navy mb-2">Define Fields</h3>
                  <div className="space-y-1.5">
                    {template.fields.map((field) => (
                      <div key={field.id} className="flex items-center justify-between px-3 py-2 rounded-lg bg-brand-light">
                        <label className="flex items-center gap-2 text-sm text-navy cursor-pointer">
                          <input
                            type="checkbox"
                            checked={field.enabled}
                            onChange={() => toggleField(field.id)}
                            className="accent-brand"
                          />
                          {field.name}
                        </label>
                        <button onClick={() => removeField(field.id)} className="text-slate-400 hover:text-rose-500">
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                  </div>
                  <div className="flex gap-2 mt-3">
                    <input
                      value={newFieldName}
                      onChange={(e) => setNewFieldName(e.target.value)}
                      placeholder="Add custom field"
                      className="flex-1 px-3 py-2 rounded-lg bg-brand-light text-sm outline-none focus:ring-2 focus:ring-brand/40"
                    />
                    <button
                      onClick={addCustomField}
                      className="p-2 rounded-lg bg-brand text-white hover:bg-brand/90 transition-colors"
                    >
                      <Plus size={16} />
                    </button>
                  </div>
                </div>

                <button
                  onClick={handleSave}
                  className="w-full flex items-center justify-center gap-2 py-2.5 rounded-lg bg-brand text-white text-sm font-medium hover:bg-brand/90 transition-colors"
                >
                  <Save size={16} /> Save Template
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}