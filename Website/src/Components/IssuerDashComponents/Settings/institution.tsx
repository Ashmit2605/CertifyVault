import { useRef, useState } from "react";
import { Camera, Save } from "lucide-react";

/* ══════════════════════════════════════════════════════
   INSTITUTION — information about the college/university
   route: /issuerdashboard/settings/institution
   ══════════════════════════════════════════════════════ */

interface InstitutionData {
  logo: string | null;
  name: string;
  institutionId: string;
  type: string;
  officialEmail: string;
  phone: string;
  website: string;
  address: string;
}

const INSTITUTION_TYPES = ["University", "College", "Training Institute", "School", "Other"];

// 🔧 Replace with GET /api/issuer/institution
const initialInstitution: InstitutionData = {
  logo: null,
  name: "Engineering College",
  institutionId: "CV-INST-00214",
  type: "College",
  officialEmail: "registrar@engineeringcollege.edu",
  phone: "+91 20 2345 6789",
  website: "https://engineeringcollege.edu",
  address: "Plot 12, Knowledge Park, Pune, Maharashtra 411045, India",
};

function Field({
  label, value, onChange, type = "text", disabled, helper,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  disabled?: boolean;
  helper?: string;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-navy">{label}</label>
      <input
        type={type}
        value={value}
        disabled={disabled}
        onChange={(e) => onChange?.(e.target.value)}
        className="w-full mt-1.5 px-3 py-2.5 rounded-lg bg-brand-light text-sm text-navy outline-none disabled:text-slate-400"
      />
      {helper && <p className="text-[11px] text-slate-400 mt-1">{helper}</p>}
    </div>
  );
}

export default function Institution() {
  const [data, setData] = useState<InstitutionData>(initialInstitution);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const update = (key: keyof InstitutionData, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update("logo", reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    // 🔧 Call PATCH /api/issuer/institution here
    setSaved(true);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-xl bg-brand-light overflow-hidden flex items-center justify-center">
            {data.logo ? (
              <img src={data.logo} alt="Institution logo" className="w-full h-full object-cover" />
            ) : (
              <span className="text-lg font-bold text-brand">{data.name.slice(0, 2).toUpperCase()}</span>
            )}
          </div>
          <button
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center hover:bg-brand/90 transition-colors"
          >
            <Camera size={12} />
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleLogoUpload} />
        </div>
        <div>
          <p className="text-sm font-semibold text-navy">{data.name}</p>
          <p className="text-xs text-slate-400">{data.institutionId}</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <Field label="Institution Name" value={data.name} onChange={(v) => update("name", v)} />
        <Field
          label="Institution ID"
          value={data.institutionId}
          disabled
          helper="Assigned by CertifyVault — cannot be changed."
        />

        <div>
          <label className="text-xs font-semibold text-navy">Institution Type</label>
          <select
            value={data.type}
            onChange={(e) => update("type", e.target.value)}
            className="w-full mt-1.5 px-3 py-2.5 rounded-lg bg-brand-light text-sm text-navy outline-none appearance-none cursor-pointer"
          >
            {INSTITUTION_TYPES.map((t) => (
              <option key={t}>{t}</option>
            ))}
          </select>
        </div>
        <Field label="Official Email" value={data.officialEmail} onChange={(v) => update("officialEmail", v)} type="email" />

        <Field label="Phone" value={data.phone} onChange={(v) => update("phone", v)} type="tel" />
        <Field label="Website" value={data.website} onChange={(v) => update("website", v)} type="url" />
      </div>

      <div>
        <label className="text-xs font-semibold text-navy">Address</label>
        <textarea
          value={data.address}
          onChange={(e) => update("address", e.target.value)}
          rows={3}
          className="w-full mt-1.5 px-3 py-2.5 rounded-lg bg-brand-light text-sm text-navy outline-none resize-y"
        />
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={handleSave}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90 transition-colors"
        >
          <Save size={15} /> Save Changes
        </button>
        {saved && <span className="text-xs text-emerald-600 font-medium">Saved.</span>}
      </div>
    </div>
  );
}