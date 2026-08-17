import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ShieldCheck } from 'lucide-react'
import VerificationInput from '../../Components/VerifierDashComponents/VerificationInput'
import VerificationTimeline from '../../Components/VerifierDashComponents/VerificationTimeline'
import VerificationResult from '../../Components/VerifierDashComponents/VerificationResult'
import RecentVerifications from '../../Components/VerifierDashComponents/RecentVerifications'
import StatsBar from '../../Components/VerifierDashComponents/StatsBar'
import ActivityChart from '../../Components/VerifierDashComponents/ActivityChart'
import {
  MOCK_VERIFIED_RESULT,
  MOCK_SUSPICIOUS_RESULT,
  MOCK_HISTORY,
  MOCK_STATS,
  MOCK_CHART_DATA,
  VERIFICATION_STEPS,
} from '../../data/verifierMockData'
import type { VerificationResult as VResult } from '../../types/verifier'

type Stage = 'idle' | 'processing' | 'result'

export default function VerifierDashboard() {
  const [stage, setStage] = useState<Stage>('idle')
  const [currentStep, setCurrentStep] = useState(0)
  const [result, setResult] = useState<VResult | null>(null)
  const [demoMode, setDemoMode] = useState<'verified' | 'suspicious'>('verified')

  const runVerification = () => {
    setStage('processing')
    setCurrentStep(0)

    VERIFICATION_STEPS.forEach((_, i) => {
      setTimeout(() => {
        setCurrentStep(i)
        if (i === VERIFICATION_STEPS.length - 1) {
          setTimeout(() => {
            setResult(demoMode === 'verified' ? MOCK_VERIFIED_RESULT : MOCK_SUSPICIOUS_RESULT)
            setStage('result')
          }, 500)
        }
      }, i * 600)
    })
  }

  const reset = () => {
    setStage('idle')
    setCurrentStep(0)
    setResult(null)
  }

  return (
    <div className="min-h-screen pt-20" style={{ background: 'var(--bg-2)', fontFamily: 'Figtree, system-ui, sans-serif' }}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10">

        {/* ── Hero greeting ── */}
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-semibold tracking-widest" style={{ color: 'var(--blue)' }}>
            CERTIFICATE VERIFICATION
          </span>
          <h1
            className="font-extrabold leading-tight tracking-tight mt-2 mb-3"
            style={{ fontSize: 'clamp(28px, 4vw, 44px)', color: 'var(--navy)' }}
          >
            Verify with confidence.
          </h1>
          <p className="text-base max-w-lg" style={{ color: 'var(--navy)', opacity: 0.55 }}>
            Upload a certificate, scan its QR code, or enter a certificate ID to verify its authenticity in seconds.
          </p>
        </motion.div>

        {/* ── Demo mode toggle ── */}
        <motion.div
          className="flex items-center gap-2 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <span className="text-xs font-medium" style={{ color: 'var(--navy)', opacity: 0.45 }}>Demo mode:</span>
          {(['verified', 'suspicious'] as const).map(mode => (
            <button
              key={mode}
              onClick={() => setDemoMode(mode)}
              className="px-3 py-1 rounded-full text-xs font-semibold transition-all"
              style={{
                background: demoMode === mode ? (mode === 'verified' ? 'rgba(22,163,74,0.12)' : 'rgba(220,38,38,0.10)') : 'var(--bg-4)',
                color: demoMode === mode ? (mode === 'verified' ? '#16A34A' : '#DC2626') : 'var(--navy)',
                opacity: demoMode === mode ? 1 : 0.5,
              }}
            >
              {mode === 'verified' ? '✓ Verified result' : '⚠ Suspicious result'}
            </button>
          ))}
        </motion.div>

        {/* ── Main verification card ── */}
        <motion.div
          className="rounded-3xl border overflow-hidden mb-8"
          style={{ background: 'white', borderColor: 'var(--bg-4)', boxShadow: '0 4px 24px rgba(0,15,62,0.06)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.5 }}
        >
          {/* Card header */}
          <div className="px-6 py-5 border-b flex items-center gap-3" style={{ borderColor: 'var(--bg-4)' }}>
            <div className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--light-blue)' }}>
              <ShieldCheck size={18} strokeWidth={2} style={{ color: 'var(--blue)' }} />
            </div>
            <div>
              <p className="font-bold text-sm" style={{ color: 'var(--navy)' }}>Verify a Certificate</p>
              <p className="text-xs" style={{ color: 'var(--navy)', opacity: 0.45 }}>Scan, upload, or enter a certificate ID</p>
            </div>
          </div>

          <div className="p-6">
            <AnimatePresence mode="wait">
              {stage === 'idle' && (
                <motion.div key="idle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <VerificationInput onVerify={runVerification} loading={false} />
                </motion.div>
              )}

              {stage === 'processing' && (
                <motion.div
                  key="processing"
                  className="py-6"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <p className="text-center font-semibold text-sm mb-8" style={{ color: 'var(--navy)', opacity: 0.6 }}>
                    Analyzing certificate...
                  </p>
                  <VerificationTimeline steps={VERIFICATION_STEPS} currentStep={currentStep} />
                </motion.div>
              )}

              {stage === 'result' && result && (
                <motion.div key="result" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                  <VerificationResult result={result} onReset={reset} />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>

        {/* ── Stats ── */}
        <motion.div
          className="mb-8"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatsBar stats={MOCK_STATS} />
        </motion.div>

        {/* ── Recent + Chart ── */}
        <div className="grid lg:grid-cols-5 gap-6 mb-8">
          {/* Recent verifications */}
          <motion.div
            className="lg:col-span-3"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
          >
            <div className="flex items-center justify-between mb-4">
              <p className="font-bold text-sm" style={{ color: 'var(--navy)' }}>Recent Verifications</p>
              <Link
                to="/app/verifier/history"
                className="text-xs font-semibold no-underline flex items-center gap-1 transition-opacity"
                style={{ color: 'var(--blue)' }}
                onMouseEnter={e => { e.currentTarget.style.opacity = '0.7' }}
                onMouseLeave={e => { e.currentTarget.style.opacity = '1' }}
              >
                View all <ArrowRight size={12} />
              </Link>
            </div>
            <RecentVerifications items={MOCK_HISTORY} limit={5} />
          </motion.div>

          {/* Chart */}
          <motion.div
            className="lg:col-span-2 flex flex-col gap-4"
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <ActivityChart data={MOCK_CHART_DATA} />

            {/* Security strip */}
            <div
              className="p-4 rounded-2xl border flex items-start gap-3"
              style={{ background: 'var(--navy)', borderColor: 'transparent' }}
            >
              <ShieldCheck size={18} color="white" strokeWidth={2} style={{ opacity: 0.7, flexShrink: 0, marginTop: 2 }} />
              <div>
                <p className="text-xs font-bold text-white mb-2">Your verification is protected.</p>
                {['SHA-256 integrity', 'Encrypted processing', 'Blockchain-backed proof', 'Secure records'].map(item => (
                  <p key={item} className="text-xs" style={{ color: 'rgba(255,255,255,0.45)' }}>· {item}</p>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

      </div>
    </div>
  )
}
