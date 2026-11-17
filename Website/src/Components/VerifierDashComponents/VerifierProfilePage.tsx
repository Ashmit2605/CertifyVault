import { useEffect, useState } from "react";
import { useUser } from "@clerk/clerk-react";
import { Bell, Check, Mail, ShieldCheck, UserRound } from "lucide-react";

const PREFERENCES_KEY = "certifyvault:verifier:preferences";

interface Preferences {
  emailUpdates: boolean;
  verificationAlerts: boolean;
}

const defaultPreferences: Preferences = {
  emailUpdates: true,
  verificationAlerts: true,
};

function PreferenceToggle({
  title,
  description,
  checked,
  onChange,
}: {
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className="flex w-full items-center justify-between gap-4 rounded-2xl border border-[#E2E6F0] bg-white p-4 text-left transition-colors hover:bg-[#F7F8FC]"
    >
      <span>
        <span className="block text-sm font-bold text-navy">{title}</span>
        <span className="mt-1 block text-xs text-[#6B7BA6]">{description}</span>
      </span>
      <span className={`relative h-6 w-11 shrink-0 rounded-full transition-colors ${checked ? "bg-brand" : "bg-[#CBD2E2]"}`}>
        <span className={`absolute top-1 h-4 w-4 rounded-full bg-white transition-transform ${checked ? "translate-x-6" : "translate-x-1"}`} />
      </span>
    </button>
  );
}

export default function VerifierProfilePage() {
  const { isLoaded, user } = useUser();
  const [preferences, setPreferences] = useState(defaultPreferences);
  const [saved, setSaved] = useState(false);
  const [storageError, setStorageError] = useState("");
  const fullName = user?.fullName?.trim() || "Verifier";
  const email = user?.primaryEmailAddress?.emailAddress || "Email not available";
  const initials = fullName
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  useEffect(() => {
    try {
      const stored = localStorage.getItem(PREFERENCES_KEY);
      if (!stored) return;
      const parsed: unknown = JSON.parse(stored);
      if (
        typeof parsed !== "object" ||
        parsed === null ||
        !("emailUpdates" in parsed) ||
        typeof parsed.emailUpdates !== "boolean" ||
        !("verificationAlerts" in parsed) ||
        typeof parsed.verificationAlerts !== "boolean"
      ) {
        throw new Error("Profile preference data has an invalid format.");
      }
      setPreferences({
        emailUpdates: parsed.emailUpdates,
        verificationAlerts: parsed.verificationAlerts,
      });
    } catch (error) {
      setStorageError(error instanceof Error ? error.message : "Could not load profile preferences.");
    }
  }, []);

  const updatePreference = (key: keyof Preferences) => {
    const next = { ...preferences, [key]: !preferences[key] };
    try {
      localStorage.setItem(PREFERENCES_KEY, JSON.stringify(next));
      setPreferences(next);
      setSaved(true);
      setStorageError("");
      window.setTimeout(() => setSaved(false), 1800);
    } catch (error) {
      setStorageError(error instanceof Error ? error.message : "Could not save profile preferences.");
    }
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <header>
        <div className="mb-2 flex items-center gap-2 text-brand">
          <UserRound size={18} />
          <span className="text-xs font-bold uppercase tracking-[0.16em]">Profile</span>
        </div>
        <h1 className="text-2xl font-extrabold text-navy">Your verifier profile</h1>
        <p className="mt-1 text-sm text-[#6B7BA6]">Manage your account details and dashboard preferences.</p>
      </header>

      {storageError && (
        <p role="alert" className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {storageError}
        </p>
      )}

      <section className="overflow-hidden rounded-3xl border border-[#E2E6F0] bg-white">
        <div className="h-24 bg-gradient-to-r from-[#000F3E] to-[#0050F5]" />
        <div className="px-5 pb-6 sm:px-7">
          <div className="-mt-9 flex flex-wrap items-end justify-between gap-4">
            <div className="flex h-[72px] w-[72px] items-center justify-center rounded-2xl border-4 border-white bg-[#F0F2F8] text-xl font-extrabold text-brand shadow-sm">
              {isLoaded ? initials : "…"}
            </div>
            <span className="mb-1 inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-bold text-emerald-700">
              <ShieldCheck size={14} />
              Verifier account
            </span>
          </div>
          <h2 className="mt-4 text-xl font-extrabold text-navy">{isLoaded ? fullName : "Loading profile…"}</h2>
          <p className="mt-1 flex items-center gap-2 text-sm text-[#6B7BA6]">
            <Mail size={15} />
            {isLoaded ? email : " "}
          </p>
          <div className="mt-6 grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl bg-[#F7F8FC] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7BA6]">Account role</p>
              <p className="mt-1 font-bold capitalize text-navy">Verifier</p>
            </div>
            <div className="rounded-2xl bg-[#F7F8FC] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[#6B7BA6]">Sign-in provider</p>
              <p className="mt-1 font-bold text-navy">Secure account</p>
            </div>
          </div>
        </div>
      </section>

      <section className="rounded-3xl border border-[#E2E6F0] bg-[#F7F8FC] p-4 sm:p-5">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <h2 className="font-bold text-navy">Notifications</h2>
            <p className="mt-1 text-xs text-[#6B7BA6]">Preferences are saved in this browser.</p>
          </div>
          {saved && <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-700"><Check size={14} /> Saved</span>}
        </div>
        <div className="space-y-3">
          <PreferenceToggle
            title="Verification alerts"
            description="Show updates about certificates you verify."
            checked={preferences.verificationAlerts}
            onChange={() => updatePreference("verificationAlerts")}
          />
          <PreferenceToggle
            title="Product updates"
            description="Receive occasional updates about CertifyVault."
            checked={preferences.emailUpdates}
            onChange={() => updatePreference("emailUpdates")}
          />
        </div>
        <div className="mt-4 flex items-start gap-2 rounded-xl bg-blue-50 p-3 text-xs leading-relaxed text-blue-800">
          <Bell size={14} className="mt-0.5 shrink-0" />
          These controls update local dashboard preferences only; they do not change your account or contact the server.
        </div>
      </section>
    </div>
  );
}
