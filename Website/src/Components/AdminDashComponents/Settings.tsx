import React, { useEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import {
  Settings,
  User,
  Save,
  RotateCcw,
  CheckCircle,
  Upload,
  Trash2,
  ShieldCheck,
  KeyRound,
  LogOut,
  X,
  AlertTriangle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

type TabId = 'general' | 'profile';

interface TabConfig {
  id: TabId;
  label: string;
  icon: LucideIcon;
}

interface GeneralSettings {
  institutionName: string;
  platformDescription: string;
  supportEmail: string;
  certificateValidity: string;
  certificateIdPrefix: string;
  dateTimeFormat: string;
  defaultLanguage: string;
}

interface ProfileSettings {
  fullName: string;
  email: string;
  role: string;
}

type ToastType = 'success' | 'info';

interface ToastMessage {
  type: ToastType;
  text: string;
}

type ModalKind = 'save' | 'reset' | 'password' | 'logout';
type SettingsSection = 'general' | 'profile' | 'password';

interface ModalState {
  kind: ModalKind;
  section: SettingsSection;
}

const GENERAL_DEFAULTS: GeneralSettings = {
  institutionName: 'Credential Vault Platform',
  platformDescription: 'Secure certificate verification and blockchain integration system',
  supportEmail: 'support@vault.io',
  certificateValidity: '365',
  certificateIdPrefix: 'CERT-',
  dateTimeFormat: 'DD/MM/YYYY HH:mm',
  defaultLanguage: 'English',
};

const PROFILE_DEFAULTS: ProfileSettings = {
  fullName: 'Sarah Johnson',
  email: 'sarah.johnson@vault.io',
  role: 'Platform Administrator',
};

const SECTION_LABEL: Record<SettingsSection, string> = {
  general: 'general',
  profile: 'profile',
  password: 'password',
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AdminSettingsPage(): ReactElement {
  const [activeTab, setActiveTab] = useState<TabId>('general');
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [modal, setModal] = useState<ModalState | null>(null);

  const [general, setGeneral] = useState<GeneralSettings>(GENERAL_DEFAULTS);
  const [profile, setProfile] = useState<ProfileSettings>(PROFILE_DEFAULTS);

  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [twoFactorEnabled, setTwoFactorEnabled] = useState<boolean>(true);
  const [pwPanelOpen, setPwPanelOpen] = useState<boolean>(false);
  const [pwCurrent, setPwCurrent] = useState<string>('');
  const [pwNew, setPwNew] = useState<string>('');
  const [pwConfirm, setPwConfirm] = useState<string>('');

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    return () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    };
  }, []);

  const showToast = (text: string, type: ToastType = 'success'): void => {
    setToast({ type, text });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3800);
  };

  const initials = (name: string): string =>
    name
      .trim()
      .split(/\s+/)
      .filter(Boolean)
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() || '?';

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setAvatarSrc(reader.result as string);
    reader.readAsDataURL(file);
  };

  const removeAvatar = (): void => {
    setAvatarSrc(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const openModal = (kind: ModalKind, section: SettingsSection): void =>
    setModal({ kind, section });

  const closeModal = (): void => setModal(null);

  const confirmModal = (): void => {
    if (!modal) return;
    const { kind, section } = modal;

    if (kind === 'save') {
      if (section === 'password') {
        setPwCurrent('');
        setPwNew('');
        setPwConfirm('');
        setPwPanelOpen(false);
        showToast('Password updated.', 'success');
      } else {
        showToast('Your changes have been saved.', 'success');
      }
    } else if (kind === 'reset') {
      if (section === 'general') setGeneral(GENERAL_DEFAULTS);
      if (section === 'profile') setProfile(PROFILE_DEFAULTS);
      showToast(
        `${SECTION_LABEL[section].charAt(0).toUpperCase()}${SECTION_LABEL[section].slice(1)} settings reset.`,
        'info',
      );
    } else if (kind === 'logout') {
      showToast('You’ve been logged out of all other devices.', 'success');
    }

    setModal(null);
  };

  const tabs: TabConfig[] = [
    { id: 'general', label: 'General', icon: Settings },
    { id: 'profile', label: 'Profile', icon: User },
  ];

  return (
    <div className="space-y-6" style={{ fontFamily: "'Figtree', sans-serif" }}>
      <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Settings</p>
            <h2 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">Account settings</h2>
            <p className="mt-2 text-sm text-slate-600">
              Manage your platform details, profile information, and administrator preferences.
            </p>
          </div>
        </div>
      </div>

      {toast && (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700 shadow-sm">
          <div className="flex items-center gap-2">
            <CheckCircle className="h-4 w-4 shrink-0" />
            {toast.text}
          </div>
        </div>
      )}

      {modal && <ConfirmationModal modal={modal} onCancel={closeModal} onConfirm={confirmModal} />}

      <div className="rounded-3xl border border-slate-200 bg-white p-4 shadow-sm shadow-slate-200/50">
        <div className="inline-flex rounded-xl border border-slate-200 bg-slate-50 p-1">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${active ? 'bg-white text-sky-700 shadow-sm ring-1 ring-sky-100' : 'text-slate-600 hover:text-slate-900'
                  }`}
              >
                <Icon className="h-4 w-4" />
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="space-y-6">
        {activeTab === 'general' && (
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
            <div className="mb-5">
              <h3 className="text-lg font-semibold text-slate-900">Platform details</h3>
              <p className="mt-1 text-sm text-slate-500">Shown to users on certificates and verification pages.</p>
            </div>

            <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
              <Field label="Institution / platform name">
                <input
                  type="text"
                  value={general.institutionName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setGeneral({ ...general, institutionName: e.target.value })
                  }
                  className="field-input"
                />
              </Field>

              <Field label="Support email">
                <input
                  type="email"
                  value={general.supportEmail}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setGeneral({ ...general, supportEmail: e.target.value })
                  }
                  className="field-input"
                />
              </Field>
            </div>

            <Field label="Platform description">
              <textarea
                value={general.platformDescription}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                  setGeneral({ ...general, platformDescription: e.target.value })
                }
                rows={3}
                className="field-input min-h-[78px] resize-y"
              />
            </Field>

            <hr className="my-6 border-t border-slate-200" />

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Field label="Default certificate validity (days)">
                <input
                  type="number"
                  value={general.certificateValidity}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setGeneral({ ...general, certificateValidity: e.target.value })
                  }
                  className="field-input"
                />
              </Field>

              <Field label="Certificate ID prefix" hint="Example: CERT-20260815001">
                <input
                  type="text"
                  value={general.certificateIdPrefix}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                    setGeneral({ ...general, certificateIdPrefix: e.target.value })
                  }
                  className="field-input"
                />
              </Field>

              <Field label="Date & time format">
                <select
                  value={general.dateTimeFormat}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setGeneral({ ...general, dateTimeFormat: e.target.value })
                  }
                  className="field-input"
                >
                  <option>DD/MM/YYYY HH:mm</option>
                  <option>MM/DD/YYYY HH:mm</option>
                  <option>YYYY-MM-DD HH:mm</option>
                </select>
              </Field>

              <Field label="Default language">
                <select
                  value={general.defaultLanguage}
                  onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
                    setGeneral({ ...general, defaultLanguage: e.target.value })
                  }
                  className="field-input"
                >
                  <option>English</option>
                  <option>Spanish</option>
                  <option>French</option>
                  <option>German</option>
                  <option>Chinese</option>
                </select>
              </Field>
            </div>

            <div className="mt-6 flex gap-2.5 border-t border-slate-200 pt-5">
              <button onClick={() => openModal('save', 'general')} className="btn-primary">
                <Save className="h-3.75 w-3.75" />
                Save changes
              </button>
              <button onClick={() => openModal('reset', 'general')} className="btn-ghost">
                <RotateCcw className="h-3.75 w-3.75" />
                Reset
              </button>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
              <div className="mb-5">
                <h3 className="text-lg font-semibold text-slate-900">Your profile</h3>
                <p className="mt-1 text-sm text-slate-500">This is how you appear across the admin console.</p>
              </div>

              <div className="mb-6 flex items-center gap-5">
                <div
                  className="flex h-19 w-19 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sky-600 text-2xl font-bold text-white shadow-[0_4px_16px_-4px_rgba(0,80,245,0.45)]"
                  style={{ background: 'linear-gradient(155deg,#0050F5,#0040C4)' }}
                >
                  {avatarSrc ? (
                    <img src={avatarSrc} alt="Profile photo" className="h-full w-full object-cover" />
                  ) : (
                    initials(profile.fullName)
                  )}
                </div>

                <div className="flex flex-col gap-1">
                  <div className="flex gap-2.5">
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-3.5 py-2 text-[13px] font-semibold text-sky-700 transition-colors hover:bg-sky-100"
                    >
                      <Upload className="h-3.5 w-3.5" />
                      Upload photo
                    </button>
                    <button
                      onClick={removeAvatar}
                      className="inline-flex items-center gap-1.5 px-1.5 py-2 text-[13px] font-semibold text-slate-500 transition-colors hover:text-rose-600"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                      Remove
                    </button>
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png, image/jpeg, image/webp"
                    className="hidden"
                    onChange={handleAvatarUpload}
                  />
                  <span className="text-xs text-slate-400">JPG, PNG or WEBP. Max 4MB.</span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                <Field label="Full name">
                  <input
                    type="text"
                    value={profile.fullName}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setProfile({ ...profile, fullName: e.target.value })
                    }
                    className="field-input"
                  />
                </Field>
                <Field label="Email">
                  <input
                    type="email"
                    value={profile.email}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setProfile({ ...profile, email: e.target.value })
                    }
                    className="field-input"
                  />
                </Field>
              </div>

              <div className="mb-1">
                <label className="mb-1.5 block text-[13px] font-semibold">Role</label>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-bold tracking-wide text-sky-700">
                  {profile.role}
                </span>
              </div>

              <div className="mt-6 flex gap-2.5 border-t border-slate-200 pt-5">
                <button onClick={() => openModal('save', 'profile')} className="btn-primary">
                  <Save className="h-3.75 w-3.75" />
                  Save changes
                </button>
                <button onClick={() => openModal('reset', 'profile')} className="btn-ghost">
                  <RotateCcw className="h-3.75 w-3.75" />
                  Reset
                </button>
              </div>
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
              <div className="mb-5">
                <h3 className="text-lg font-semibold text-slate-900">Account security</h3>
                <p className="mt-1 text-sm text-slate-500">Basic protections for your administrator account.</p>
              </div>

              <SecurityRow
                icon={ShieldCheck}
                title="Two-factor authentication"
                subtitle={twoFactorEnabled ? 'Enabled · last updated 3 days ago' : 'Not enabled'}
                right={
                  <button
                    onClick={() => setTwoFactorEnabled((v) => !v)}
                    aria-pressed={twoFactorEnabled}
                    className="relative h-6 w-10 shrink-0 rounded-full transition-colors"
                    style={{ backgroundColor: twoFactorEnabled ? '#0050F5' : '#D5DAE3' }}
                  >
                    <span
                      className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${twoFactorEnabled ? 'translate-x-4' : ''
                        }`}
                    />
                  </button>
                }
              />

              <button className="w-full text-left" onClick={() => setPwPanelOpen((v) => !v)}>
                <SecurityRow
                  icon={KeyRound}
                  title="Password"
                  subtitle="Last changed 45 days ago"
                  right={<span className="text-[13px] font-semibold text-sky-700">Change</span>}
                />
              </button>

              {pwPanelOpen && (
                <div className="pt-4">
                  <Field label="Current password">
                    <input
                      type="password"
                      value={pwCurrent}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPwCurrent(e.target.value)}
                      placeholder="••••••••"
                      className="field-input"
                    />
                  </Field>
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
                    <Field label="New password">
                      <input
                        type="password"
                        value={pwNew}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPwNew(e.target.value)}
                        placeholder="••••••••"
                        className="field-input"
                      />
                    </Field>
                    <Field label="Confirm new password">
                      <input
                        type="password"
                        value={pwConfirm}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPwConfirm(e.target.value)}
                        placeholder="••••••••"
                        className="field-input"
                      />
                    </Field>
                  </div>
                  <button onClick={() => openModal('save', 'password')} className="btn-primary mb-1">
                    Update password
                  </button>
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm shadow-slate-200/50">
              <div className="flex items-center justify-between gap-3.5 rounded-xl border border-rose-200 bg-rose-50 p-4">
                <div className="flex flex-1 items-center gap-3">
                  <div className="flex h-8.5 w-8.5 shrink-0 items-center justify-center rounded-lg border border-rose-200 bg-white">
                    <LogOut className="h-4 w-4 text-rose-600" />
                  </div>
                  <div>
                    <p className="m-0 text-[13.5px] font-semibold text-rose-700">Log out of all devices</p>
                    <span className="text-xs text-rose-600">Ends every active session, including this one</span>
                  </div>
                </div>
                <button
                  onClick={() => openModal('logout', 'profile')}
                  className="rounded-lg border border-rose-200 bg-white px-3.5 py-1.5 text-[12.5px] font-semibold text-rose-600 transition-colors hover:bg-rose-50"
                >
                  Log out all
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .field-input {
          width: 100%;
          padding: 10px 13px;
          font-family: inherit;
          font-size: 14px;
          color: #0F1729;
          border: 1.5px solid #E6E9F0;
          border-radius: 10px;
          background: #fff;
          transition: border-color .15s ease, box-shadow .15s ease;
        }
        .field-input:focus {
          outline: none;
          border-color: #0050F5;
          box-shadow: 0 0 0 4px #EFF4FF;
        }
        .btn-primary {
          font-family: inherit;
          font-size: 14px;
          font-weight: 600;
          border-radius: 10px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 20px;
          background: #0050F5;
          color: #fff;
          border: none;
          transition: opacity .15s ease;
        }
        .btn-primary:hover { opacity: 0.92; }
        .btn-ghost {
          font-family: inherit;
          font-size: 14px;
          font-weight: 600;
          border-radius: 10px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 20px;
          background: #fff;
          border: 1.5px solid #E6E9F0;
          color: #0F1729;
          transition: background .15s ease;
        }
        .btn-ghost:hover { background: #F7F8FB; }
      `}</style>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  Small reusable pieces                                              */
/* ------------------------------------------------------------------ */

interface FieldProps {
  label: string;
  hint?: string;
  children: React.ReactNode;
}

function Field({ label, hint, children }: FieldProps): ReactElement {
  return (
    <div className="mb-[18px]">
      <label className="block text-[13px] font-semibold mb-[7px]">{label}</label>
      {children}
      {hint && <p className="text-xs text-[#94A0B8] mt-1.5">{hint}</p>}
    </div>
  );
}

interface SecurityRowProps {
  icon: LucideIcon;
  title: string;
  subtitle: string;
  right: React.ReactNode;
}

function SecurityRow({ icon: Icon, title, subtitle, right }: SecurityRowProps): ReactElement {
  return (
    <div className="flex items-center justify-between gap-3.5 p-4 bg-[#F7F8FB] border border-[#E6E9F0] rounded-[11px] mb-2.5">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-[34px] h-[34px] rounded-lg bg-white border border-[#E6E9F0] flex items-center justify-center flex-shrink-0">
          <Icon className="w-4 h-4 text-[#5B647A]" />
        </div>
        <div>
          <p className="text-[13.5px] font-semibold m-0">{title}</p>
          <span className="text-xs text-[#5B647A]">{subtitle}</span>
        </div>
      </div>
      {right}
    </div>
  );
}

interface ConfirmationModalProps {
  modal: ModalState;
  onCancel: () => void;
  onConfirm: () => void;
}

function ConfirmationModal({ modal, onCancel, onConfirm }: ConfirmationModalProps): ReactElement {
  const sectionLabel = SECTION_LABEL[modal.section];

  const copy: Record<ModalKind, { title: string; body: string; confirmLabel: string; danger?: boolean }> = {
    save: {
      title: modal.section === 'password' ? 'Update password?' : 'Save changes?',
      body:
        modal.section === 'password'
          ? 'Your password will be updated immediately and you\u2019ll stay signed in on this device.'
          : `You\u2019re about to save changes to your ${sectionLabel} settings.`,
      confirmLabel: modal.section === 'password' ? 'Update password' : 'Save changes',
    },
    reset: {
      title: 'Reset settings?',
      body: `This will restore your ${sectionLabel} settings to their last saved values. This can\u2019t be undone.`,
      confirmLabel: 'Reset',
    },
    password: {
      title: 'Update password?',
      body: 'Your password will be updated immediately.',
      confirmLabel: 'Update password',
    },
    logout: {
      title: 'Log out of all devices?',
      body: 'This immediately ends every active session, including the one you\u2019re using right now.',
      confirmLabel: 'Log out all',
      danger: true,
    },
  };

  const { title, body, confirmLabel, danger } = copy[modal.kind];
  const Icon = modal.kind === 'reset' ? RotateCcw : modal.kind === 'logout' ? AlertTriangle : Save;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-[2px] flex items-center justify-center z-[100] p-4">
      <div className="bg-white rounded-2xl max-w-[420px] w-full p-6 shadow-[0_20px_50px_-12px_rgba(15,23,41,0.35)]">
        <div
          className="w-[42px] h-[42px] rounded-[11px] flex items-center justify-center mb-3.5"
          style={{ background: modal.kind === 'reset' ? '#FFF6E9' : modal.kind === 'logout' ? '#FEF2F2' : '#EFF4FF' }}
        >
          <Icon
            className="w-[21px] h-[21px]"
            style={{ color: modal.kind === 'reset' ? '#C2740B' : modal.kind === 'logout' ? '#DC2626' : '#0050F5' }}
          />
        </div>
        <h3 className="text-[16.5px] font-bold m-0 mb-2">{title}</h3>
        <p className="text-[13.5px] text-[#5B647A] leading-relaxed m-0 mb-5">{body}</p>
        <div className="flex gap-2.5">
          <button onClick={onCancel} className="btn-ghost flex-1 justify-center">
            <X className="w-[15px] h-[15px]" />
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 justify-center inline-flex items-center gap-1.5 text-[14px] font-semibold rounded-[10px] px-4 py-2.5 text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: danger ? '#DC2626' : '#0050F5' }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}