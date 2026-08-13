import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShieldCheck,
  Blocks,
  QrCode,
  BadgeCheck,
  MailCheck,
  ArrowLeft,
} from 'lucide-react'
import Logo from '../assets/Logo2.png'

const trustSignals = [
  { icon: ShieldCheck, label: 'SHA-256 Verified', color: '#16A34A', delay: 0 },
  { icon: Blocks, label: 'Blockchain Anchored', color: 'var(--blue)', delay: 0.6 },
  { icon: QrCode, label: 'QR Authenticated', color: 'var(--blue-2)', delay: 1.2 },
  { icon: BadgeCheck, label: 'Issuer Confirmed', color: '#16A34A', delay: 1.8 },
]

function LeftPanel() {
  return (
    <div
      className="hidden lg:flex flex-col justify-between p-12 relative overflow-hidden"
      style={{ background: 'var(--navy)', minHeight: '100vh', width: '45%' }}
    >
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
        className="absolute bottom-0 left-0 w-96 h-96 pointer-events-none"
        style={{ background: 'radial-gradient(circle, rgba(0,80,245,0.18) 0%, transparent 70%)' }}
      />

      <Link to="/" className="flex items-center gap-2.5 no-underline relative z-10">
        <img src={Logo} alt="CertifyVault" className="h-7 w-auto" />
        <span className="font-bold text-lg text-white">CertifyVault</span>
      </Link>

      <div className="flex flex-col items-center gap-8 relative z-10">
        <motion.div
          className="w-72 rounded-3xl overflow-hidden"
          style={{
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.10)',
            backdropFilter: 'blur(12px)',
          }}
          animate={{ y: [0, -10, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
        >
          <div className="px-5 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
            <span className="text-xs font-bold text-white tracking-widest opacity-70">CERTIFYVAULT</span>
            <motion.span
              className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full"
              style={{ background: 'rgba(22,163,74,0.2)', color: '#4ADE80' }}
              animate={{ opacity: [1, 0.5, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
              VERIFIED
            </motion.span>
          </div>
          <div className="px-5 py-5">
            <p className="text-xs font-semibold tracking-widest mb-3" style={{ color: 'var(--blue-4)' }}>
              PASSWORD RESET
            </p>
            <h3 className="font-bold text-white text-base mb-0.5">Secure Recovery</h3>
            <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.5)' }}>Protected by blockchain verification</p>
            <div className="flex flex-col gap-2">
              {[
                { label: 'EMAIL', val: '✓ MATCHED' },
                { label: 'ACCESS', val: '✓ SECURE' },
              ].map(row => (
                <div key={row.label} className="flex justify-between items-center">
                  <span className="text-xs font-semibold" style={{ color: 'rgba(255,255,255,0.35)' }}>{row.label}</span>
                  <motion.span
                    className="text-xs font-bold"
                    style={{ color: '#4ADE80' }}
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ duration: 2.5, repeat: Infinity, delay: 0.4 }}
                  >
                    {row.val}
                  </motion.span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>

        <div className="flex flex-col gap-3 w-72">
          {trustSignals.map((sig, i) => (
            <motion.div
              key={sig.label}
              className="flex items-center gap-3 px-4 py-3 rounded-2xl"
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: sig.delay + 0.3, duration: 0.5 }}
            >
              <div
                className="w-7 h-7 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: 'rgba(255,255,255,0.08)' }}
              >
                <sig.icon size={14} strokeWidth={2.5} style={{ color: sig.color }} />
              </div>
              <span className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.65)' }}>{sig.label}</span>
              <motion.div
                className="ml-auto w-1.5 h-1.5 rounded-full"
                style={{ background: sig.color }}
                animate={{ scale: [1, 1.4, 1], opacity: [1, 0.5, 1] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
              />
            </motion.div>
          ))}
        </div>
      </div>

      <div className="relative z-10">
        <p className="text-sm font-semibold" style={{ color: 'rgba(255,255,255,0.35)' }}>
          Verify. Protect. Trust.
        </p>
      </div>
    </div>
  )
}

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setTimeout(() => {
      setLoading(false)
      setSubmitted(true)
    }, 1800)
  }

  return (
    <div className="flex min-h-screen" style={{ fontFamily: 'Figtree, system-ui, sans-serif' }}>
      <LeftPanel />

      <div
        className="flex-1 flex flex-col justify-center px-8 py-12 lg:px-16"
        style={{ background: 'var(--bg)', minHeight: '100vh' }}
      >
        <Link to="/app/login" className="flex items-center gap-2 no-underline mb-10 w-fit" style={{ color: 'var(--navy)' }}>
          <ArrowLeft size={16} />
          <span className="text-sm font-semibold">Back to sign in</span>
        </Link>

        <div className="w-full max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="mb-6 flex items-center justify-center lg:hidden">
              <img src={Logo} alt="CertifyVault" className="h-8 w-auto" />
            </div>

            <div className="flex items-center justify-center w-14 h-14 rounded-2xl mb-5 mx-auto" style={{ background: 'rgba(0,80,245,0.08)' }}>
              <MailCheck size={26} style={{ color: 'var(--blue)' }} />
            </div>

            <h1 className="font-extrabold text-3xl mb-2 text-center" style={{ color: 'var(--navy)' }}>
              Forgot your password?
            </h1>
            <p className="text-sm mb-8 text-center" style={{ color: 'var(--navy)', opacity: 0.5 }}>
              Enter your account email and we’ll send a secure reset link.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--navy)', opacity: 0.6 }}>
                  Email address
                </label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@institution.edu"
                  className="w-full px-4 py-3.5 rounded-2xl border text-sm outline-none transition-all"
                  style={{ borderColor: 'var(--bg-5)', color: 'var(--navy)', background: 'white' }}
                  onFocus={e => {
                    e.currentTarget.style.borderColor = 'var(--blue)'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,80,245,0.08)'
                  }}
                  onBlur={e => {
                    e.currentTarget.style.borderColor = 'var(--bg-5)'
                    e.currentTarget.style.boxShadow = 'none'
                  }}
                />
              </div>

              <motion.button
                type="submit"
                disabled={loading}
                className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-white mt-2 transition-all duration-200"
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
                      Sending reset link...
                    </motion.div>
                  ) : (
                    <motion.div
                      key="idle"
                      className="flex items-center gap-2"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      Send reset link
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.button>

              {submitted && (
                <div
                  className="rounded-2xl border px-4 py-3 text-sm"
                  style={{
                    background: 'rgba(22,163,74,0.08)',
                    borderColor: 'rgba(22,163,74,0.2)',
                    color: '#166534',
                  }}
                >
                  A secure reset link has been sent to <strong>{email}</strong>.
                </div>
              )}
            </form>

            <p className="text-center text-sm mt-6" style={{ color: 'var(--navy)', opacity: 0.5 }}>
              Need help?{' '}
              <Link to="/contact" className="font-semibold no-underline" style={{ color: 'var(--blue)' }}>
                Contact support
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  )
}
