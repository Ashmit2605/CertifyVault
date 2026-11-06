import React, { useEffect, useRef, useState } from 'react';
import type { ReactElement } from 'react';
import { useAuth, useClerk, useUser } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import {
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
import {
  getAdminSettings,
  removeAdminAvatar,
  revokeAdminSessions,
  updateAdminProfile,
  uploadAdminAvatar,
} from '../../utils/settingsApi';

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

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

type ModalKind = 'save' | 'reset' | 'logout';
type SettingsSection = 'profile' | 'password';

interface ModalState {
  kind: ModalKind;
  section: SettingsSection;
}

const SECTION_LABEL: Record<SettingsSection, string> = {
  profile: 'profile',
  password: 'password',
};

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */

export default function AdminSettingsPage(): ReactElement {
  const { getToken } = useAuth();
  const { openUserProfile, signOut } = useClerk();
  const { user } = useUser();
  const navigate = useNavigate();
  const [toast, setToast] = useState<ToastMessage | null>(null);
  const [modal, setModal] = useState<ModalState | null>(null);

  const [profile, setProfile] = useState<ProfileSettings>({ fullName: '', email: '', role: '' });

  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const [storedTwoFactorEnabled, setStoredTwoFactorEnabled] = useState<boolean>(false);
  const twoFactorEnabled = user?.twoFactorEnabled ?? storedTwoFactorEnabled;
  const [loading, setLoading] = useState<boolean>(true);
  const [saving, setSaving] = useState<boolean>(false);
  const [error, setError] = useState<string>('');

  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let active = true;

    void (async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error('Unable to establish a secure session.');
        const settings = await getAdminSettings(token);
        if (!active) return;
        setProfile({
          fullName: settings.fullName,
          email: settings.email,
          role: settings.role,
        });
        setAvatarSrc(settings.avatarData);
        setStoredTwoFactorEnabled(settings.twoFactorEnabled);
      } catch (loadError) {
        if (active) {
          setError(loadError instanceof Error ? loadError.message : 'Unable to load account settings.');
        }
      } finally {
        if (active) setLoading(false);
      }
    })();

    return () => {
      active = false;
    };
  }, [getToken]);

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
    void (async () => {
      if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type)) {
        setError('Upload a JPG, PNG, or WEBP image.');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }
      if (file.size > 4 * 1024 * 1024) {
        setError('Profile photos must be 4MB or smaller.');
        if (fileInputRef.current) fileInputRef.current.value = '';
        return;
      }

      setSaving(true);
      setError('');
      try {
        const token = await getToken();
        if (!token) throw new Error('Unable to establish a secure session.');
        setAvatarSrc(await uploadAdminAvatar(token, file));
        showToast('Profile photo updated.');
      } catch (uploadError) {
        setError(uploadError instanceof Error ? uploadError.message : 'Unable to save your profile photo.');
      } finally {
        setSaving(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    })();
  };

  const removeAvatar = (): void => {
    void (async () => {
      setSaving(true);
      setError('');
      try {
        const token = await getToken();
        if (!token) throw new Error('Unable to establish a secure session.');
        await removeAdminAvatar(token);
        setAvatarSrc(null);
        showToast('Profile photo removed.');
      } catch (removeError) {
        setError(removeError instanceof Error ? removeError.message : 'Unable to remove your profile photo.');
      } finally {
        setSaving(false);
        if (fileInputRef.current) fileInputRef.current.value = '';
      }
    })();
  };

  const openModal = (kind: ModalKind, section: SettingsSection): void =>
    setModal({ kind, section });

  const closeModal = (): void => setModal(null);

  const confirmModal = (): void => {
    if (!modal || saving) return;
    const { kind, section } = modal;

    void (async () => {
      setSaving(true);
      setError('');
      try {
        const token = await getToken();
        if (!token) throw new Error('Unable to establish a secure session.');

        if (kind === 'save') {
          const updated = await updateAdminProfile(token, profile.fullName);
          setProfile({
            fullName: updated.fullName,
            email: updated.email,
            role: updated.role,
          });
          setAvatarSrc(updated.avatarData);
          showToast('Your changes have been saved.');
        } else if (kind === 'reset') {
          const saved = await getAdminSettings(token);
          setProfile({ fullName: saved.fullName, email: saved.email, role: saved.role });
          setAvatarSrc(saved.avatarData);
          setStoredTwoFactorEnabled(saved.twoFactorEnabled);
          showToast(
            `${SECTION_LABEL[section].charAt(0).toUpperCase()}${SECTION_LABEL[section].slice(1)} settings reset.`,
            'info',
          );
        } else {
          await revokeAdminSessions(token);
          await signOut();
          navigate('/app/login', { replace: true });
          return;
        }
        setModal(null);
      } catch (actionError) {
        setError(actionError instanceof Error ? actionError.message : 'Unable to update account settings.');
      } finally {
        setSaving(false);
      }
    })();
  };

  const roleLabel = profile.role === 'admin'
    ? 'Platform Administrator'
    : profile.role.charAt(0).toUpperCase() + profile.role.slice(1);

  /*
   * Single-view layout (desktop, lg+):
   * The page is sized to the visible viewport — 10.5rem accounts for the
   * sticky admin header (~81px) plus the layout's top/bottom padding (~78px).
   * Cards share the remaining height; the security card scrolls internally
   * only if security settings expand on a short screen.
   * On smaller screens the sections simply stack and the page scrolls.
   */
  return (
    <div
      className="flex flex-col gap-4 lg:h-[calc(100vh-10.5rem)] lg:min-h-[500px]"
      style={{ fontFamily: "'Figtree', sans-serif" }}
    >
      {/* Page header (toast appears inline on the right so nothing shifts) */}
      <div className="shrink-0 rounded-3xl border border-slate-200 bg-white px-6 py-4 shadow-sm shadow-slate-200/50">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-600">Settings</p>
            <h2 className="mt-1 text-2xl font-bold tracking-tight text-slate-900">Account settings</h2>
            <p className="mt-1 text-sm text-slate-600">
              Manage your profile information and administrator account security.
            </p>
          </div>

          {toast && (
            <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-2.5 text-sm font-medium text-emerald-700 shadow-sm">
              <div className="flex items-center gap-2">
                <CheckCircle className="h-4 w-4 shrink-0" />
                {toast.text}
              </div>
            </div>
          )}
        </div>
      </div>

      {modal && (
        <ConfirmationModal
          modal={modal}
          saving={saving}
          onCancel={closeModal}
          onConfirm={confirmModal}
        />
      )}

      {error && (
        <div role="alert" className="shrink-0 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error}
        </div>
      )}

      <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 lg:grid-cols-5">
        {/* ---------------- Left: Profile ---------------- */}
        <div className="flex flex-col rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50 lg:col-span-3">
          <div className="mb-4">
            <h3 className="text-base font-semibold text-slate-900">Your profile</h3>
            <p className="mt-0.5 text-sm text-slate-500">This is how you appear across the admin console.</p>
          </div>

          <div className="mb-5 flex items-center gap-4">
            <div
              className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sky-600 text-xl font-bold text-white shadow-[0_4px_16px_-4px_rgba(0,80,245,0.45)]"
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
                  type="button"
                  disabled={saving || loading}
                  onClick={() => fileInputRef.current?.click()}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-sky-200 bg-sky-50 px-3.5 py-2 text-[13px] font-semibold text-sky-700 transition-colors hover:bg-sky-100 disabled:opacity-50"
                >
                  <Upload className="h-3.5 w-3.5" />
                  Upload photo
                </button>
                <button
                  type="button"
                  disabled={saving || loading || !avatarSrc}
                  onClick={removeAvatar}
                  className="inline-flex items-center gap-1.5 px-1.5 py-2 text-[13px] font-semibold text-slate-500 transition-colors hover:text-rose-600 disabled:opacity-50"
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

          <div className="grid grid-cols-1 gap-x-4 sm:grid-cols-2">
            <Field label="Full name">
              <input
                type="text"
                value={profile.fullName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setProfile({ ...profile, fullName: e.target.value })}
                className="field-input"
                disabled={loading || saving}
              />
            </Field>
            <Field label="Email">
              <input
                type="email"
                value={profile.email}
                readOnly
                className="field-input cursor-not-allowed bg-slate-50"
              />
              <p className="mt-1.5 text-xs text-slate-400">
                Email changes require verification.{' '}
                <button type="button" onClick={() => openUserProfile()} className="font-semibold text-sky-700">
                  Manage email
                </button>
              </p>
            </Field>
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-semibold">Role</label>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-sky-50 px-2.5 py-1 text-xs font-bold tracking-wide text-sky-700">
              {roleLabel}
            </span>
          </div>

          <div className="mt-auto flex gap-2.5 border-t border-slate-200 pt-4">
            <button onClick={() => openModal('save', 'profile')} className="btn-primary" disabled={loading || saving}>
              <Save className="h-3.75 w-3.75" />
              Save changes
            </button>
            <button onClick={() => openModal('reset', 'profile')} className="btn-ghost" disabled={loading || saving}>
              <RotateCcw className="h-3.75 w-3.75" />
              Reset
            </button>
          </div>
        </div>

        {/* ---------------- Right: Security + Logout all ---------------- */}
        <div className="flex min-h-0 flex-col gap-4 lg:col-span-2">
          <div className="min-h-0 flex-1 overflow-y-auto rounded-3xl border border-slate-200 bg-white p-5 shadow-sm shadow-slate-200/50">
            <div className="mb-4">
              <h3 className="text-base font-semibold text-slate-900">Account security</h3>
              <p className="mt-0.5 text-sm text-slate-500">Basic protections for your administrator account.</p>
            </div>

            <SecurityRow
              icon={ShieldCheck}
              title="Two-factor authentication"
              subtitle={twoFactorEnabled ? 'Enabled on your account' : 'Not enabled'}
              right={
                <button
                  type="button"
                  onClick={() => openUserProfile()}
                  className="shrink-0 text-[13px] font-semibold text-sky-700"
                >
                  Manage
                </button>
              }
            />

            <button type="button" className="w-full text-left" onClick={() => openUserProfile()}>
              <SecurityRow
                icon={KeyRound}
                title="Password"
                subtitle="Manage your password securely"
                right={<span className="text-[13px] font-semibold text-sky-700">Manage</span>}
              />
            </button>
          </div>

          <div className="shrink-0 rounded-3xl border border-slate-200 bg-white p-3 shadow-sm shadow-slate-200/50">
            <div className="flex items-center justify-between gap-3.5 rounded-xl border border-rose-200 bg-rose-50 p-3.5">
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
                className="shrink-0 cursor-pointer rounded-lg border border-rose-200 bg-white px-3.5 py-1.5 text-[12.5px] font-semibold text-rose-600 transition-colors hover:bg-rose-50"
              >
                Log out all
              </button>
            </div>
          </div>
        </div>
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
        .btn-primary:disabled { opacity: 0.5; cursor: not-allowed; }
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
        .btn-ghost:disabled { opacity: 0.5; cursor: not-allowed; }
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
    <div className="mb-3.5">
      <label className="block text-[13px] font-semibold mb-1.5">{label}</label>
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
    <div className="flex items-center justify-between gap-3.5 p-3.5 bg-[#F7F8FB] border border-[#E6E9F0] rounded-[11px] mb-2">
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
  saving: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}

function ConfirmationModal({ modal, saving, onCancel, onConfirm }: ConfirmationModalProps): ReactElement {
  const sectionLabel = SECTION_LABEL[modal.section];

  const copy: Record<ModalKind, { title: string; body: string; confirmLabel: string; danger?: boolean }> = {
    save: {
      title: 'Save changes?',
      body: `You\u2019re about to save changes to your ${sectionLabel} settings.`,
      confirmLabel: 'Save changes',
    },
    reset: {
      title: 'Reset settings?',
      body: `This will restore your ${sectionLabel} settings to their last saved values. This can\u2019t be undone.`,
      confirmLabel: 'Reset',
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
          <button onClick={onCancel} disabled={saving} className="btn-ghost flex-1 justify-center disabled:opacity-50 disabled:cursor-not-allowed">
            <X className="w-[15px] h-[15px]" />
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={saving}
            className="flex-1 cursor-pointer justify-center inline-flex items-center gap-1.5 text-[14px] font-semibold rounded-[10px] px-4 py-2.5 text-white transition-opacity hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ backgroundColor: danger ? '#DC2626' : '#0050F5' }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}