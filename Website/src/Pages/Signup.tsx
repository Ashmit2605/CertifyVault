import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Eye, EyeOff, ArrowRight, ArrowLeft,
  Building2, GraduationCap, Search, Check,
  Lock, User, Mail, ChevronRight
} from 'lucide-react'
import Logo from '../assets/Logo2.png'

/* ─── Types ─────────────────────────────────────────────── */
type Role = 'issuer' | 'holder' | 'verifier'

const roles = [
  {
    id: 'issuer' as Role,
    icon: Building2,
    label: 'Issuer',
    sub: 'University / Institution',
    desc: 'Issue and manage academic certificates at scale.',
    color: 'var(--blue)',
    bg: 'var(--light-blue)',
  },
  {
    id: 'holder' as Role,
    icon: GraduationCap,
    label: 'Holder',
    sub: 'Student / Graduate',
    desc: 'Store and share your verified credentials securely.',
    color: 'var(--navy)',
    bg: 'var(--bg-3)',
  },
  {
    id: 'verifier' as Role,
    icon: Search,
    label: 'Verifier',
    sub: 'Employer / Organization',
    desc: 'Verify credentials instantly with fraud detection.',
    color: 'var(--blue-2)',
    bg: 'var(--light-blue-2)',
  },
]

/* ─── Right panel — animated trust journey ──────────────── */
const journeySteps = [
  { label: 'Achievement', sub: 'Your credential is created' },
  { label: 'Certificate', sub: 'Issued by institution' },
  { label: 'Protected', sub: 'Encrypted & stored securely' },
  { label: 'Hashed', sub: 'SHA-256 fingerprint generated' },
  { label: 'Anchored', sub: 'Blockchain proof recorded' },
  { label: 'Verified', sub: 'Instantly verifiable by anyone' },
  { label: 'Trusted', sub: 'Your achievement, proven' },
]

function RightPanel({ step }: { step: number }) {
  const activeJourneyStep = Math.min(step * 2, journeySteps.length - 1)

  return (
    <div
      className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden"
      style={{ background: 'var(--navy)', minHeight: '100vh', width: '42%' }}
    >
      {/* Grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '40px 40px',
        }}
      />
      <div
        className="absolute top-0 right-0 w-80 h-80 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,80,245,0.15) 0%, transparent 70%)' }}
      />

      {/* Logo */}
      <Link to="/" className="flex items-center gap-2.5 no-underline relative z-10">

        <img src={Logo} alt="CertifyVault" className="h-7 w-auto" />

        <span className="font-bold text-lg text-white">CertifyVault</span>
      </Link>

      {/* Journey visualization */}
      <div className="relative z-10 flex flex-col gap-0 w-full max-w-[260px] mx-auto">
        <p className="text-xs font-semibold tracking-widest mb-6" style={{ color: 'rgba(255,255,255,0.35)' }}>
          THE TRUST JOURNEY
        </p>
        {journeySteps.map((s, i) => {
          const isActive = i === activeJourneyStep
          const isDone = i < activeJourneyStep
          return (
            <div key={s.label} className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <motion.div
                  className="w-8 h-8 rounded-full flex items-center justify-center shrink-0"
                  animate={{
                    background: isDone
                      ? 'rgba(22,163,74,0.3)'
                      : isActive
                        ? 'rgba(0,80,245,0.4)'
                        : 'rgba(255,255,255,0.06)',
                    borderColor: isDone
                      ? '#4ADE80'
                      : isActive
                        ? 'var(--blue-4)'
                        : 'rgba(255,255,255,0.12)',
                    scale: isActive ? 1.1 : 1,
                  }}
                  style={{ border: '1.5px solid' }}
                  transition={{ duration: 0.4 }}
                >
                  {isDone ? (
                    <Check size={13} color="#4ADE80" strokeWidth={2.5} />
                  ) : (
                    <span
                      className="text-xs font-bold"
                      style={{ color: isActive ? 'var(--blue-4)' : 'rgba(255,255,255,0.25)' }}
                    >
                      {i + 1}
                    </span>
                  )}
                </motion.div>
                {i < journeySteps.length - 1 && (
                  <motion.div
                    className="w-px"
                    style={{ height: '28px' }}
                    animate={{
                      background: isDone
                        ? 'rgba(74,222,128,0.4)'
                        : 'rgba(255,255,255,0.08)',
                    }}
                    transition={{ duration: 0.4 }}
                  />
                )}
              </div>
              <div className="pt-1.5 pb-5">
                <motion.p
                  className="font-bold text-sm"
                  animate={{
                    color: isDone ? '#4ADE80' : isActive ? 'white' : 'rgba(255,255,255,0.3)',
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {s.label}
                </motion.p>
                <motion.p
                  className="text-xs mt-0.5"
                  animate={{ opacity: isActive ? 0.65 : isDone ? 0.45 : 0.2 }}
                  transition={{ duration: 0.3 }}
                  style={{ color: 'rgba(255,255,255,1)' }}
                >
                  {s.sub}
                </motion.p>
              </div>
            </div>
          )
        })}
      </div>

      <p className="text-sm font-semibold relative z-10" style={{ color: 'rgba(255,255,255,0.35)' }}>
        Verify. Protect. Trust.
      </p>
    </div>
  )
}

/* ─── Step 1: Role selection ─────────────────────────────── */
function StepRole({ onNext }: { onNext: (role: Role) => void }) {
  const [selected, setSelected] = useState<Role | null>(null)

  return (
    <motion.div
      key="step-role"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <h2 className="font-extrabold text-2xl mb-1.5" style={{ color: 'var(--navy)' }}>
        I am a...
      </h2>
      <p className="text-sm mb-7" style={{ color: 'var(--navy)', opacity: 0.5 }}>
        Choose your role to get the right experience
      </p>

      <div className="flex flex-col gap-3 mb-8">
        {roles.map(role => (
          <button
            key={role.id}
            onClick={() => setSelected(role.id)}
            className="flex items-center gap-4 p-4 rounded-2xl border-2 text-left transition-all duration-200"
            style={{
              borderColor: selected === role.id ? role.color : 'var(--bg-5)',
              background: selected === role.id ? role.bg : 'white',
              boxShadow: selected === role.id ? `0 0 0 1px ${role.color}20` : 'none',
            }}
          >
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: selected === role.id ? role.color : 'var(--bg-3)' }}
            >
              <role.icon
                size={18}
                strokeWidth={2}
                style={{ color: selected === role.id ? 'white' : 'var(--navy)' }}
              />
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm" style={{ color: 'var(--navy)' }}>{role.label}</p>
              <p className="text-xs mt-0.5" style={{ color: 'var(--navy)', opacity: 0.5 }}>{role.sub}</p>
            </div>
            <motion.div
              animate={{ scale: selected === role.id ? 1 : 0, opacity: selected === role.id ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center"
                style={{ background: role.color }}
              >
                <Check size={11} color="white" strokeWidth={3} />
              </div>
            </motion.div>
          </button>
        ))}
      </div>

      <button
        onClick={() => selected && onNext(selected)}
        disabled={!selected}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-white transition-all duration-200"
        style={{
          background: selected ? 'var(--blue)' : 'var(--bg-5)',
          boxShadow: selected ? '0 4px 16px rgba(0,80,245,0.25)' : 'none',
          color: selected ? 'white' : 'var(--navy)',
          cursor: selected ? 'pointer' : 'not-allowed',
          opacity: selected ? 1 : 0.5,
        }}
      >
        Continue <ArrowRight size={16} />
      </button>
    </motion.div>
  )
}

/* ─── Step 2: Account details ────────────────────────────── */
function StepDetails({ role, onNext, onBack }: { role: Role; onNext: () => void; onBack: () => void }) {
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const roleData = roles.find(r => r.id === role)!

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    // TODO: connect to real registration API
    setTimeout(() => { setLoading(false); onNext() }, 1600)
  }

  return (
    <motion.div
      key="step-details"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.3 }}
    >
      <button
        onClick={onBack}
        className="flex items-center gap-1.5 text-xs font-semibold mb-6 transition-opacity"
        style={{ color: 'var(--navy)', opacity: 0.45 }}
        onMouseEnter={e => { e.currentTarget.style.opacity = '1' }}
        onMouseLeave={e => { e.currentTarget.style.opacity = '0.45' }}
      >
        <ArrowLeft size={13} /> Back
      </button>

      {/* Role badge */}
      <div className="flex items-center gap-2 mb-5">
        <div
          className="w-7 h-7 rounded-lg flex items-center justify-center"
          style={{ background: roleData.bg }}
        >
          <roleData.icon size={14} strokeWidth={2} style={{ color: roleData.color }} />
        </div>
        <span className="text-xs font-semibold" style={{ color: roleData.color }}>
          {roleData.label} — {roleData.sub}
        </span>
      </div>

      <h2 className="font-extrabold text-2xl mb-1.5" style={{ color: 'var(--navy)' }}>
        Create your account
      </h2>
      <p className="text-sm mb-7" style={{ color: 'var(--navy)', opacity: 0.5 }}>
        {roleData.desc}
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--navy)', opacity: 0.6 }}>
              First name
            </label>
            <div className="relative">
              <User size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--navy)', opacity: 0.3 }} />
              <input
                type="text"
                required
                placeholder="First"
                className="w-full pl-9 pr-4 py-3 rounded-2xl border text-sm outline-none transition-all"
                style={{ borderColor: 'var(--bg-5)', color: 'var(--navy)' }}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,80,245,0.08)' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--bg-5)'; e.currentTarget.style.boxShadow = 'none' }}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--navy)', opacity: 0.6 }}>
              Last name
            </label>
            <input
              type="text"
              required
              placeholder="Last"
              className="w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all"
              style={{ borderColor: 'var(--bg-5)', color: 'var(--navy)' }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,80,245,0.08)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--bg-5)'; e.currentTarget.style.boxShadow = 'none' }}
            />
          </div>
        </div>

        {role === 'issuer' && (
          <div>
            <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--navy)', opacity: 0.6 }}>
              Institution name
            </label>
            <div className="relative">
              <Building2 size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--navy)', opacity: 0.3 }} />
              <input
                type="text"
                required
                placeholder="ABC University"
                className="w-full pl-9 pr-4 py-3 rounded-2xl border text-sm outline-none transition-all"
                style={{ borderColor: 'var(--bg-5)', color: 'var(--navy)' }}
                onFocus={e => { e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,80,245,0.08)' }}
                onBlur={e => { e.currentTarget.style.borderColor = 'var(--bg-5)'; e.currentTarget.style.boxShadow = 'none' }}
              />
            </div>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--navy)', opacity: 0.6 }}>
            Email address
          </label>
          <div className="relative">
            <Mail size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--navy)', opacity: 0.3 }} />
            <input
              type="email"
              required
              placeholder={role === 'issuer' ? 'admin@institution.edu' : 'you@email.com'}
              className="w-full pl-9 pr-4 py-3 rounded-2xl border text-sm outline-none transition-all"
              style={{ borderColor: 'var(--bg-5)', color: 'var(--navy)' }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,80,245,0.08)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--bg-5)'; e.currentTarget.style.boxShadow = 'none' }}
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--navy)', opacity: 0.6 }}>
            Password
          </label>
          <div className="relative">
            <Lock size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2" style={{ color: 'var(--navy)', opacity: 0.3 }} />
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={8}
              placeholder="Min. 8 characters"
              className="w-full pl-9 pr-12 py-3 rounded-2xl border text-sm outline-none transition-all"
              style={{ borderColor: 'var(--bg-5)', color: 'var(--navy)' }}
              onFocus={e => { e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,80,245,0.08)' }}
              onBlur={e => { e.currentTarget.style.borderColor = 'var(--bg-5)'; e.currentTarget.style.boxShadow = 'none' }}
            />
            <button
              type="button"
              onClick={() => setShowPassword(v => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2"
              style={{ color: 'var(--navy)', opacity: 0.35 }}
              aria-label="Toggle password visibility"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        <p className="text-xs" style={{ color: 'var(--navy)', opacity: 0.4 }}>
          By creating an account you agree to our{' '}
          <Link to="/terms" className="no-underline font-semibold" style={{ color: 'var(--blue)' }}>Terms</Link>
          {' '}and{' '}
          <Link to="/privacy" className="no-underline font-semibold" style={{ color: 'var(--blue)' }}>Privacy Policy</Link>.
        </p>

        <motion.button
          type="submit"
          disabled={loading}
          className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-white mt-1 transition-all duration-200"
          style={{
            background: loading ? 'var(--blue-4)' : 'var(--blue)',
            boxShadow: loading ? 'none' : '0 4px 16px rgba(0,80,245,0.28)',
            cursor: loading ? 'not-allowed' : 'pointer',
          }}
          whileTap={{ scale: loading ? 1 : 0.98 }}
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.div
                key="loading"
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <motion.div
                  className="w-4 h-4 rounded-full border-2 border-white border-t-transparent"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                />
                Creating account...
              </motion.div>
            ) : (
              <motion.div
                key="idle"
                className="flex items-center gap-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                Create Account <ArrowRight size={15} />
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
      </form>
    </motion.div>
  )
}

/* ─── Step 3: Success ────────────────────────────────────── */
function StepSuccess({ role }: { role: Role }) {
  const roleData = roles.find(r => r.id === role)!
  return (
    <motion.div
      key="step-success"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="flex flex-col items-center text-center"
    >
      <motion.div
        className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
        style={{ background: 'rgba(22,163,74,0.1)' }}
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: 'spring', stiffness: 300, damping: 20, delay: 0.1 }}
      >
        <Check size={28} style={{ color: 'var(--success)' }} strokeWidth={2.5} />
      </motion.div>

      <h2 className="font-extrabold text-2xl mb-2" style={{ color: 'var(--navy)' }}>
        Account created!
      </h2>
      <p className="text-sm mb-8 max-w-xs" style={{ color: 'var(--navy)', opacity: 0.55 }}>
        Welcome to CertifyVault. Your {roleData.label.toLowerCase()} account is ready.
      </p>

      <div
        className="w-full flex items-center gap-3 p-4 rounded-2xl mb-6"
        style={{ background: 'var(--light-blue)', border: '1px solid var(--light-blue-3)' }}
      >
        <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: roleData.bg }}>
          <roleData.icon size={16} strokeWidth={2} style={{ color: roleData.color }} />
        </div>
        <div className="text-left">
          <p className="font-bold text-sm" style={{ color: 'var(--navy)' }}>{roleData.label} Account</p>
          <p className="text-xs" style={{ color: 'var(--navy)', opacity: 0.5 }}>{roleData.sub}</p>
        </div>
        <div className="ml-auto">
          <span className="text-xs font-bold px-2 py-1 rounded-full" style={{ background: 'rgba(22,163,74,0.12)', color: 'var(--success)' }}>
            Active
          </span>
        </div>
      </div>

      <Link
        to={`/app/${role}`}
        className="w-full flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-white no-underline"
        style={{ background: 'var(--blue)', boxShadow: '0 4px 16px rgba(0,80,245,0.25)' }}
      >
        Go to Dashboard <ChevronRight size={16} />
      </Link>
    </motion.div>
  )
}

/* ─── Progress bar ───────────────────────────────────────── */
function ProgressBar({ step, total }: { step: number; total: number }) {
  return (
    <div className="flex gap-1.5 mb-8">
      {Array.from({ length: total }).map((_, i) => (
        <motion.div
          key={i}
          className="h-1 rounded-full flex-1"
          animate={{ background: i < step ? 'var(--blue)' : i === step ? 'var(--blue-4)' : 'var(--bg-5)' }}
          transition={{ duration: 0.3 }}
        />
      ))}
    </div>
  )
}

/* ─── Main component ─────────────────────────────────────── */
export default function SignupPage() {
  const [step, setStep] = useState(0)
  const [role, setRole] = useState<Role>('holder')

  return (
    <div className="flex min-h-screen" style={{ fontFamily: 'Figtree, system-ui, sans-serif' }}>
      <RightPanel step={step} />

      {/* Left: form */}
      <div
        className="flex-1 flex flex-col justify-center px-8 py-12 lg:px-16"
        style={{ background: 'var(--bg)', minHeight: '100vh' }}
      >
        {/* Mobile logo */}
        <Link to="/" className="flex items-center gap-2 no-underline mb-10 lg:hidden">
          <img src={Logo} alt="CertifyVault" className="h-8 w-auto" />
          <span className="font-bold text-base" style={{ color: 'var(--navy)' }}>CertifyVault</span>
        </Link>

        <div className="w-full max-w-md mx-auto">
          {step < 2 && <ProgressBar step={step} total={2} />}

          <AnimatePresence mode="wait">
            {step === 0 && (
              <StepRole
                onNext={r => { setRole(r); setStep(1) }}
              />
            )}
            {step === 1 && (
              <StepDetails
                role={role}
                onNext={() => setStep(2)}
                onBack={() => setStep(0)}
              />
            )}
            {step === 2 && <StepSuccess role={role} />}
          </AnimatePresence>

          {step < 2 && (
            <p className="text-center text-sm mt-6" style={{ color: 'var(--navy)', opacity: 0.5 }}>
              Already have an account?{' '}
              <Link
                to="/app/login"
                className="font-semibold no-underline"
                style={{ color: 'var(--blue)' }}
              >
                Sign in
              </Link>
            </p>
          )}
        </div>
      </div>
    </div>
  )
}