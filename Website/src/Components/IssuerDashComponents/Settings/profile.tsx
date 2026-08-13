import { useRef, useState } from "react";
import { Camera, Save, Lock } from "lucide-react";

/* ══════════════════════════════════════════════════════
   PROFILE — personal information of the logged-in issuer
   route: /issuerdashboard/settings/profile
   ══════════════════════════════════════════════════════ */

interface ProfileData {
  photo: string | null;
  fullName: string;
  email: string;
  phone: string;
  designation: string;
}

// 🔧 Replace with GET /api/issuer/profile
const initialProfile: ProfileData = {
  photo: null,
  fullName: "Priya Sharma",
  email: "priya.sharma@engineeringcollege.edu",
  phone: "+91 98765 43210",
  designation: "Registrar",
};

function Field({
  label, value, onChange, type = "text", disabled,
}: {
  label: string;
  value: string;
  onChange?: (v: string) => void;
  type?: string;
  disabled?: boolean;
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
    </div>
  );
}

export default function Profile() {
  const [data, setData] = useState<ProfileData>(initialProfile);
  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSaved, setPasswordSaved] = useState(false);

  const update = (key: keyof ProfileData, value: string) => {
    setData((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => update("photo", reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    // 🔧 Call PATCH /api/issuer/profile here
    setSaved(true);
  };

  const handlePasswordChange = () => {
    setPasswordError(null);
    if (!currentPassword || !newPassword || !confirmPassword) {
      setPasswordError("Fill in all three fields.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError("New password and confirmation don't match.");
      return;
    }
    if (newPassword.length < 8) {
      setPasswordError("New password must be at least 8 characters.");
      return;
    }
    // 🔧 Call POST /api/issuer/change-password here
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setPasswordSaved(true);
  };

  return (
    <div className="space-y-8 max-w-2xl">
      {/* Profile photo + basic info */}
      <div>
        <div className="flex items-center gap-4 mb-6">
          <div className="relative">
            <div className="w-16 h-16 rounded-full bg-brand-light overflow-hidden flex items-center justify-center">
              {data.photo ? (
                <img src={data.photo} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <span className="text-lg font-bold text-brand">
                  {data.fullName.split(" ").map((n) => n[0]).join("").slice(0, 2)}
                </span>
              )}
            </div>
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-brand text-white flex items-center justify-center hover:bg-brand/90 transition-colors"
            >
              <Camera size={12} />
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
          </div>
          <div>
            <p className="text-sm font-semibold text-navy">{data.fullName}</p>
            <p className="text-xs text-slate-400">{data.designation}</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Full Name" value={data.fullName} onChange={(v) => update("fullName", v)} />
          <Field label="Designation" value={data.designation} onChange={(v) => update("designation", v)} />
          <Field label="Email" value={data.email} onChange={(v) => update("email", v)} type="email" />
          <Field label="Phone" value={data.phone} onChange={(v) => update("phone", v)} type="tel" />
        </div>

        <div className="flex items-center gap-3 mt-5">
          <button
            onClick={handleSave}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand text-white text-sm font-semibold hover:bg-brand/90 transition-colors"
          >
            <Save size={15} /> Save Changes
          </button>
          {saved && <span className="text-xs text-emerald-600 font-medium">Saved.</span>}
        </div>
      </div>

      <hr className="border-slate-100" />

      {/* Change password */}
      <div>
        <h3 className="text-sm font-semibold text-navy mb-1 flex items-center gap-1.5">
          <Lock size={14} className="text-brand" /> Change Password
        </h3>
        <p className="text-xs text-slate-400 mb-4">Use at least 8 characters, mixing letters and numbers.</p>

        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="Current Password" value={currentPassword} onChange={setCurrentPassword} type="password" />
          <div />
          <Field label="New Password" value={newPassword} onChange={setNewPassword} type="password" />
          <Field label="Confirm New Password" value={confirmPassword} onChange={setConfirmPassword} type="password" />
        </div>

        {passwordError && <p className="text-xs text-rose-500 mt-3">{passwordError}</p>}
        {passwordSaved && !passwordError && <p className="text-xs text-emerald-600 mt-3">Password updated.</p>}

        <button
          onClick={handlePasswordChange}
          className="mt-4 inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-brand-light text-brand text-sm font-semibold hover:bg-brand/10 transition-colors"
        >
          Update Password
        </button>
      </div>
    </div>
  );
}