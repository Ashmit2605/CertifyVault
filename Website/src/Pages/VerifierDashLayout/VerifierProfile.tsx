import React, { useRef, useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  User, ShieldCheck, KeyRound, LogOut,
  Upload, Trash2, Save, RotateCcw,
  CheckCircle, X, AlertTriangle,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

/* ── Types ── */
type TabId          = 'profile' | 'security'
type ModalKind      = 'save' | 'reset' | 'password' | 'logout'
type SettingsSection = 'profile' | 'password'

interface ProfileSettings { fullName: string; email: string; organization: string; role: string }
interface ModalState      { kind: ModalKind; section: SettingsSection }
interface ToastMsg         { text: string; type: 'success' | 'info' }

const PROFILE_DEFAULTS: ProfileSettings = {
  fullName:     'Alex Verifier',
  email:        'alex.verifier@org.com',
  organization: 'Acme Corp',
  role:         'Verifier',
}

const initials = (name: string) =>
  name.trim().split(/\s+/).filter(Boolean).map(n => n[0]).join('').slice(0, 2).toUpperCase() || '?'

/* ── Field ── */
function Field({ label, hint, children }: { label: string; hint?: string; children: React.ReactNode }) {
  return (
    <div className="mb-[18px]">
      <label className="block text-[13px] font-semibold mb-[7px]" style={{ color: 'var(--navy)' }}>{label}</label>
      {children}
      {hint && <p className="text-xs mt-1.5" style={{ color: 'var(--navy)', opacity: 0.4 }}>{hint}</p>}
    </div>
  )
}

/* ── Security row ── */
function SecurityRow({ icon: Icon, title, subtitle, right }: {
  icon: LucideIcon; title: string; subtitle: string; right: React.ReactNode
}) {
  return (
    <div className="flex items-center justify-between gap-3.5 p-4 rounded-[11px] mb-2.5 border"
      style={{ background: 'var(--bg-2)', borderColor: 'var(--bg-5)' }}>
      <div className="flex items-center gap-3 flex-1">
        <div className="w-[34px] h-[34px] rounded-lg border flex items-center justify-center shrink-0"
          style={{ background: 'white', borderColor: 'var(--bg-5)' }}>
          <Icon className="w-4 h-4" style={{ color: 'var(--navy)', opacity: 0.45 }} />
        </div>
        <div>
          <p className="text-[13.5px] font-semibold m-0" style={{ color: 'var(--navy)' }}>{title}</p>
          <span className="text-xs" style={{ color: 'var(--navy)', opacity: 0.45 }}>{subtitle}</span>
        </div>
      </div>
      {right}
    </div>
  )
}

/* ── Confirmation modal ── */
function ConfirmModal({ modal, onCancel, onConfirm }: {
  modal: ModalState; onCancel: () => void; onConfirm: () => void
}) {
  const copy: Record<ModalKind, { title: string; body: string; confirmLabel: string; danger?: boolean }> = {
    save: {
      title:        modal.section === 'password' ? 'Update password?' : 'Save changes?',
      body:         modal.section === 'password'
                      ? 'Your password will be updated immediately and you\'ll stay signed in on this device.'
                      : 'You\'re about to save changes to your profile settings.',
      confirmLabel: modal.section === 'password' ? 'Update password' : 'Save changes',
    },
    reset: {
      title:        'Reset profile?',
      body:         'This will restore your profile to its last saved values. This can\'t be undone.',
      confirmLabel: 'Reset',
    },
    password: {
      title:        'Update password?',
      body:         'Your password will be updated immediately.',
      confirmLabel: 'Update password',
    },
    logout: {
      title:        'Log out of all devices?',
      body:         'This immediately ends every active session, including the one you\'re using right now.',
      confirmLabel: 'Log out all',
      danger:       true,
    },
  }

  const { title, body, confirmLabel, danger } = copy[modal.kind]
  const Icon = modal.kind === 'logout' ? AlertTriangle : modal.kind === 'reset' ? RotateCcw : Save
  const iconBg    = modal.kind === 'logout' ? '#FEF2F2' : modal.kind === 'reset' ? '#FFF6E9' : 'var(--light-blue)'
  const iconColor = modal.kind === 'logout' ? '#DC2626' : modal.kind === 'reset' ? '#C2740B' : 'var(--blue)'

  return (
    <div className="fixed inset-0 flex items-center justify-center z-[100] p-4"
      style={{ background: 'rgba(0,0,0,0.45)', backdropFilter: 'blur(2px)' }}
      onClick={onCancel}
    >
      <div className="bg-white rounded-2xl max-w-[420px] w-full p-6"
        style={{ boxShadow: '0 20px 50px -12px rgba(0,15,62,0.30)' }}
        onClick={e => e.stopPropagation()}
      >
        <div className="w-[42px] h-[42px] rounded-[11px] flex items-center justify-center mb-3.5"
          style={{ background: iconBg }}>
          <Icon className="w-[21px] h-[21px]" style={{ color: iconColor }} />
        </div>
        <h3 className="text-[16.5px] font-bold m-0 mb-2" style={{ color: 'var(--navy)' }}>{title}</h3>
        <p className="text-[13.5px] leading-relaxed m-0 mb-5" style={{ color: 'var(--navy)', opacity: 0.5 }}>{body}</p>
        <div className="flex gap-2.5">
          <button onClick={onCancel} className="verifier-btn-ghost flex-1 justify-center">
            <X className="w-[15px] h-[15px]" /> Cancel
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 justify-center inline-flex items-center gap-1.5 text-[14px] font-semibold rounded-[10px] px-4 py-2.5 text-white transition-opacity hover:opacity-90"
            style={{ backgroundColor: danger ? '#DC2626' : 'var(--blue)' }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

/* ── Main page ── */
export default function VerifierProfile() {
  const navigate = useNavigate()

  const [activeTab, setActiveTab]       = useState<TabId>('profile')
  const [profile, setProfile]           = useState<ProfileSettings>(PROFILE_DEFAULTS)
  const [avatarSrc, setAvatarSrc]       = useState<string | null>(null)
  const [twoFactor, setTwoFactor]       = useState(true)
  const [pwPanelOpen, setPwPanelOpen]   = useState(false)
  const [pwCurrent, setPwCurrent]       = useState('')
  const [pwNew, setPwNew]               = useState('')
  const [pwConfirm, setPwConfirm]       = useState('')
  const [toast, setToast]               = useState<ToastMsg | null>(null)
  const [modal, setModal]               = useState<ModalState | null>(null)
  const fileInputRef                    = useRef<HTMLInputElement>(null)
  const toastTimer                      = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => () => { if (toastTimer.current) clearTimeout(toastTimer.current) }, [])

  const showToast = (text: string, type: ToastMsg['type'] = 'success') => {
    setToast({ text, type })
    if (toastTimer.current) clearTimeout(toastTimer.current)
    toastTimer.current = setTimeout(() => setToast(null), 3800)
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = () => setAvatarSrc(reader.result as string)
    reader.readAsDataURL(file)
  }

  const removeAvatar = () => {
    setAvatarSrc(null)
    if (fileInputRef.current) fileInputRef.current.value = ''
  }

  const confirmModal = () => {
    if (!modal) return
    const { kind, section } = modal

    if (kind === 'save') {
      if (section === 'password') {
        setPwCurrent(''); setPwNew(''); setPwConfirm(''); setPwPanelOpen(false)
        showToast('Password updated.')
      } else {
        showToast('Your changes have been saved.')
      }
    } else if (kind === 'reset') {
      setProfile(PROFILE_DEFAULTS); setAvatarSrc(null)
      if (fileInputRef.current) fileInputRef.current.value = ''
      showToast('Profile reset.', 'info')
    } else if (kind === 'logout') {
      navigate('/app/login')
    }
    setModal(null)
  }

  const tabs: { id: TabId; label: string; icon: LucideIcon }[] = [
    { id: 'profile',  label: 'Profile',  icon: User       },
    { id: 'security', label: 'Security', icon: ShieldCheck },
  ]

  return (
    <div className="min-h-screen pt-20" style={{ background: 'var(--bg-2)', fontFamily: 'Figtree, system-ui, sans-serif' }}>
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-6">

        {/* Header card */}
        <div className="rounded-3xl border bg-white p-6" style={{ borderColor: 'var(--bg-4)', boxShadow: '0 1px 4px rgba(0,15,62,0.05)' }}>
          <p className="text-xs font-semibold tracking-[0.18em] mb-2" style={{ color: 'var(--blue)' }}>ACCOUNT</p>
          <h2 className="text-3xl font-extrabold tracking-tight mb-1" style={{ color: 'var(--navy)' }}>Profile &amp; Settings</h2>
          <p className="text-sm" style={{ color: 'var(--navy)', opacity: 0.5 }}>
            Manage your profile information and account security.
          </p>
        </div>

        {/* Toast */}
        {toast && (
          <div className="rounded-2xl border px-4 py-3 text-sm font-medium flex items-center gap-2"
            style={{
              background:   toast.type === 'success' ? 'rgba(22,163,74,0.07)' : 'var(--light-blue)',
              borderColor:  toast.type === 'success' ? 'rgba(22,163,74,0.2)'  : 'var(--light-blue-3)',
              color:        toast.type === 'success' ? '#16A34A'               : 'var(--blue)',
            }}>
            <CheckCircle className="h-4 w-4 shrink-0" />
            {toast.text}
          </div>
        )}

        {/* Confirmation modal */}
        {modal && <ConfirmModal modal={modal} onCancel={() => setModal(null)} onConfirm={confirmModal} />}

        {/* Tab switcher */}
        <div className="rounded-3xl border bg-white p-4" style={{ borderColor: 'var(--bg-4)', boxShadow: '0 1px 4px rgba(0,15,62,0.05)' }}>
          <div className="inline-flex rounded-xl p-1 border" style={{ background: 'var(--bg-3)', borderColor: 'var(--bg-4)' }}>
            {tabs.map(tab => {
              const Icon   = tab.icon
              const active = activeTab === tab.id
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-semibold transition-colors"
                  style={{
                    background:  active ? 'white' : 'transparent',
                    color:       active ? 'var(--blue)' : 'var(--navy)',
                    opacity:     active ? 1 : 0.5,
                    boxShadow:   active ? '0 1px 6px rgba(0,15,62,0.08)' : 'none',
                  }}
                >
                  <Icon className="h-4 w-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Profile tab ── */}
        {activeTab === 'profile' && (
          <div className="rounded-3xl border bg-white p-6 space-y-0" style={{ borderColor: 'var(--bg-4)', boxShadow: '0 1px 4px rgba(0,15,62,0.05)' }}>
            <div className="mb-5">
              <h3 className="text-lg font-semibold" style={{ color: 'var(--navy)' }}>Your profile</h3>
              <p className="mt-1 text-sm" style={{ color: 'var(--navy)', opacity: 0.45 }}>This is how you appear across the verifier console.</p>
            </div>

            {/* Avatar */}
            <div className="mb-6 flex items-center gap-5">
              <div
                className="h-[76px] w-[76px] shrink-0 rounded-full overflow-hidden flex items-center justify-center text-2xl font-bold text-white"
                style={{ background: 'linear-gradient(155deg, var(--blue), #0040C4)', boxShadow: '0 4px 16px -4px rgba(0,80,245,0.40)' }}
              >
                {avatarSrc
                  ? <img src={avatarSrc} alt="Profile" className="h-full w-full object-cover" />
                  : initials(profile.fullName)
                }
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex gap-2.5">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-1.5 rounded-lg border px-3.5 py-2 text-[13px] font-semibold transition-colors hover:opacity-80"
                    style={{ borderColor: 'var(--light-blue-3)', background: 'var(--light-blue)', color: 'var(--blue)' }}
                  >
                    <Upload className="h-3.5 w-3.5" /> Upload photo
                  </button>
                  {avatarSrc && (
                    <button
                      onClick={removeAvatar}
                      className="inline-flex items-center gap-1.5 px-2 py-2 text-[13px] font-semibold transition-colors hover:opacity-70"
                      style={{ color: '#DC2626' }}
                    >
                      <Trash2 className="h-3.5 w-3.5" /> Remove
                    </button>
                  )}
                </div>
                <input ref={fileInputRef} type="file" accept="image/png,image/jpeg,image/webp" className="hidden" onChange={handleAvatarUpload} />
                <span className="text-xs" style={{ color: 'var(--navy)', opacity: 0.35 }}>JPG, PNG or WEBP · Max 4 MB</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-0 lg:grid-cols-2 lg:gap-4">
              <Field label="Full name">
                <input type="text" value={profile.fullName}
                  onChange={e => setProfile(p => ({ ...p, fullName: e.target.value }))}
                  className="verifier-field-input" />
              </Field>
              <Field label="Email">
                <input type="email" value={profile.email}
                  onChange={e => setProfile(p => ({ ...p, email: e.target.value }))}
                  className="verifier-field-input" />
              </Field>
            </div>

            <Field label="Organization">
              <input type="text" value={profile.organization}
                onChange={e => setProfile(p => ({ ...p, organization: e.target.value }))}
                className="verifier-field-input" />
            </Field>

            <div className="mb-[18px]">
              <label className="block text-[13px] font-semibold mb-[7px]" style={{ color: 'var(--navy)' }}>Role</label>
              <span className="inline-flex items-center rounded-full px-2.5 py-1 text-xs font-bold tracking-wide"
                style={{ background: 'var(--light-blue)', color: 'var(--blue)' }}>
                {profile.role}
              </span>
            </div>

            <div className="mt-6 flex gap-2.5 border-t pt-5" style={{ borderColor: 'var(--bg-4)' }}>
              <button onClick={() => setModal({ kind: 'save', section: 'profile' })} className="verifier-btn-primary">
                <Save className="h-3.5 w-3.5" /> Save changes
              </button>
              <button onClick={() => setModal({ kind: 'reset', section: 'profile' })} className="verifier-btn-ghost">
                <RotateCcw className="h-3.5 w-3.5" /> Reset
              </button>
            </div>
          </div>
        )}

        {/* ── Security tab ── */}
        {activeTab === 'security' && (
          <div className="space-y-6">

            {/* Security card */}
            <div className="rounded-3xl border bg-white p-6" style={{ borderColor: 'var(--bg-4)', boxShadow: '0 1px 4px rgba(0,15,62,0.05)' }}>
              <div className="mb-5">
                <h3 className="text-lg font-semibold" style={{ color: 'var(--navy)' }}>Account security</h3>
                <p className="mt-1 text-sm" style={{ color: 'var(--navy)', opacity: 0.45 }}>Basic protections for your verifier account.</p>
              </div>

              <SecurityRow
                icon={ShieldCheck}
                title="Two-factor authentication"
                subtitle={twoFactor ? 'Enabled · last updated 3 days ago' : 'Not enabled'}
                right={
                  <button
                    onClick={() => setTwoFactor(v => !v)}
                    aria-pressed={twoFactor}
                    className="relative h-6 w-10 shrink-0 rounded-full transition-colors"
                    style={{ backgroundColor: twoFactor ? 'var(--blue)' : 'var(--bg-5)' }}
                  >
                    <span className={`absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${twoFactor ? 'translate-x-4' : ''}`} />
                  </button>
                }
              />

              <button className="w-full text-left" onClick={() => setPwPanelOpen(v => !v)}>
                <SecurityRow
                  icon={KeyRound}
                  title="Password"
                  subtitle="Last changed 45 days ago"
                  right={<span className="text-[13px] font-semibold" style={{ color: 'var(--blue)' }}>{pwPanelOpen ? 'Cancel' : 'Change'}</span>}
                />
              </button>

              {pwPanelOpen && (
                <div className="pt-2">
                  <Field label="Current password">
                    <input type="password" value={pwCurrent} onChange={e => setPwCurrent(e.target.value)} placeholder="••••••••" className="verifier-field-input" />
                  </Field>
                  <div className="grid grid-cols-1 gap-0 lg:grid-cols-2 lg:gap-4">
                    <Field label="New password">
                      <input type="password" value={pwNew} onChange={e => setPwNew(e.target.value)} placeholder="••••••••" className="verifier-field-input" />
                    </Field>
                    <Field label="Confirm new password">
                      <input type="password" value={pwConfirm} onChange={e => setPwConfirm(e.target.value)} placeholder="••••••••" className="verifier-field-input" />
                    </Field>
                  </div>
                  <button onClick={() => setModal({ kind: 'save', section: 'password' })} className="verifier-btn-primary mb-1">
                    Update password
                  </button>
                </div>
              )}
            </div>

            {/* Danger zone */}
            <div className="rounded-3xl border bg-white p-6" style={{ borderColor: 'var(--bg-4)', boxShadow: '0 1px 4px rgba(0,15,62,0.05)' }}>
              <div className="flex items-center justify-between gap-3.5 rounded-xl border border-rose-200 bg-rose-50 p-4">
                <div className="flex flex-1 items-center gap-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-rose-200 bg-white">
                    <LogOut className="h-4 w-4 text-rose-600" />
                  </div>
                  <div>
                    <p className="m-0 text-[13.5px] font-semibold text-rose-700">Log out of all devices</p>
                    <span className="text-xs text-rose-500">Ends every active session, including this one</span>
                  </div>
                </div>
                <button
                  onClick={() => setModal({ kind: 'logout', section: 'profile' })}
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
        .verifier-field-input {
          width: 100%;
          padding: 10px 13px;
          font-family: inherit;
          font-size: 14px;
          color: var(--navy);
          border: 1.5px solid var(--bg-5);
          border-radius: 10px;
          background: #fff;
          transition: border-color .15s ease, box-shadow .15s ease;
          outline: none;
        }
        .verifier-field-input:focus {
          border-color: var(--blue);
          box-shadow: 0 0 0 4px var(--light-blue);
        }
        .verifier-btn-primary {
          font-family: inherit;
          font-size: 14px;
          font-weight: 600;
          border-radius: 10px;
          cursor: pointer;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 10px 20px;
          background: var(--blue);
          color: #fff;
          border: none;
          transition: opacity .15s ease;
        }
        .verifier-btn-primary:hover { opacity: 0.9; }
        .verifier-btn-ghost {
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
          border: 1.5px solid var(--bg-5);
          color: var(--navy);
          transition: background .15s ease;
        }
        .verifier-btn-ghost:hover { background: var(--bg-2); }
      `}</style>
    </div>
  )
}
