import { useRef, useState } from "react";
import { Camera, Save, FileImage } from "lucide-react";

/* ══════════════════════════════════════════════════════
   BRANDING — specifically for what gets used on certificate PDFs
   route: /issuerdashboard/settings/branding

   Note: "Institution Logo" also appears in Institution settings.
   Kept as separate state here on purpose — this is the asset
   used specifically for certificate generation, which may differ
   from the account/profile logo. If they should always be the
   same file, wire this to read from Institution's state instead.
   ══════════════════════════════════════════════════════ */

interface BrandingData {
  logo: string | null;
  primaryColor: string;
  secondaryColor: string;
  officialSeal: string | null;
  authorizedSignature: string | null;
}

// 🔧 Replace with GET /api/issuer/branding
const initialBranding: BrandingData = {
  logo: null,
  primaryColor: "#0050F5",
  secondaryColor: "#000F3E",
  officialSeal: null,
  authorizedSignature: null,
};

function UploadTile({
  label, value, onUpload, shape = "square",
}: {
  label: string;
  value: string | null;
  onUpload: (dataUrl: string) => void;
  shape?: "square" | "wide";
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => onUpload(reader.result as string);
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <label className="text-xs font-semibold text-navy">{label}</label>
      <button
        onClick={() => inputRef.current?.click()}
        className={`mt-1.5 w-full ${shape === "square" ? "h-28" : "h-20"} rounded-xl border-2 border-dashed border-slate-200 hover:border-brand/40 transition-colors flex items-center justify-center overflow-hidden bg-brand-light`}
      >
        {value ? (
          <img src={value} alt={label} className="max-h-full max-w-full object-contain" />
        ) : (
          <span className="flex flex-col items-center gap-1.5 text-slate-400">
            <FileImage size={20} />
            <span className="text-xs">Click to upload</span>
          </span>
        )}
      </button>
      <input ref={inputRef} type="file" accept="image/*" className="hidden" onChange={handleFile} />
    </div>
  );
}

function ColorField({
  label, value, onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div>
      <label className="text-xs font-semibold text-navy">{label}</label>
      <div className="flex items-center gap-2 mt-1.5">
        <input
          type="color"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-10 h-10 rounded-lg border border-slate-200 cursor-pointer bg-transparent"
        />
        <input
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2.5 rounded-lg bg-brand-light text-sm text-navy outline-none uppercase"
        />
      </div>
    </div>
  );
}

export default function Branding() {
  const [data, setData] = useState<BrandingData>(initialBranding);
  const [saved, setSaved] = useState(false);

  const update = <K extends keyof BrandingData>(key: K, value: BrandingData[K]) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    // 🔧 Call PATCH /api/issuer/branding here — these values feed your
    // certificate PDF generator (logo, colors, seal, signature).
    setSaved(true);
  };

  return (
    <div className="max-w-3xl">
      <p className="text-sm text-slate-500 mb-5">
        These assets and colors are used when generating certificate PDFs.
      </p>

      <div className="grid md:grid-cols-[1fr_260px] gap-6">
        <div className="space-y-5">
          <div className="grid sm:grid-cols-2 gap-4">
            <UploadTile label="Institution Logo" value={data.logo} onUpload={(v) => update("logo", v)} />
            <UploadTile label="Official Seal" value={data.officialSeal} onUpload={(v) => update("officialSeal", v)} />
          </div>

          <UploadTile
            label="Authorized Signature"
            value={data.authorizedSignature}
            onUpload={(v) => update("authorizedSignature", v)}
            shape="wide"
          />

          <div className="grid sm:grid-cols-2 gap-4">
            <ColorField label="Primary Color" value={data.primaryColor} onChange={(v) => update("primaryColor", v)} />
            <ColorField label="Secondary Color" value={data.secondaryColor} onChange={(v) => update("secondaryColor", v)} />
          </div>

          <div className="flex items-center gap-3 pt-1">
            <button
              onClick={handleSave}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90 transition-colors"
            >
              <Save size={15} /> Save Branding
            </button>
            {saved && <span className="text-xs text-emerald-600 font-medium">Saved.</span>}
          </div>
        </div>

        {/* Live preview */}
        <div className="rounded-xl border border-slate-100 p-4 h-fit">
          <p className="text-xs font-semibold text-navy mb-3">Certificate Preview</p>
          <div
            className="rounded-lg p-4 flex flex-col items-center text-center gap-2"
            style={{ background: data.secondaryColor, color: "#FFFFFF" }}
          >
            {data.logo ? (
              <img src={data.logo} alt="Logo" className="w-10 h-10 object-contain bg-white rounded p-1" />
            ) : (
              <div className="w-10 h-10 rounded bg-white/20 flex items-center justify-center">
                <Camera size={14} />
              </div>
            )}
            <div className="text-[10px] font-semibold tracking-wide" style={{ color: data.primaryColor === data.secondaryColor ? "#FFFFFF" : "#FFFFFF" }}>
              CERTIFICATE OF COMPLETION
            </div>
            <div
              className="mt-2 px-3 py-1 rounded text-[9px] font-bold"
              style={{ background: data.primaryColor }}
            >
              Verified on Blockchain
            </div>
            {data.officialSeal && <img src={data.officialSeal} alt="Seal" className="w-8 h-8 object-contain mt-1" />}
            {data.authorizedSignature && (
              <img src={data.authorizedSignature} alt="Signature" className="h-6 object-contain mt-1 bg-white rounded px-1" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}