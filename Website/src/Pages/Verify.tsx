import { useState } from 'react'
import { motion} from 'framer-motion'
import { Upload, QrCode, CheckCircle, Loader2, Blocks, ShieldCheck, BarChart3 } from 'lucide-react'

// Demo mock data — replace with real API calls when backend is ready
const MOCK_RESULT = {
  id: 'CV-2026-001245',
  issuer: 'ABC University',
  holder: 'Student Name',
  degree: 'Bachelor of Technology — Computer Engineering',
  issued: 'June 2026',
  blockchain: 'Verified',
  integrity: 'Verified',
  riskScore: 96,
}

const verificationSteps = [
  'Uploading certificate...',
  'Reading certificate data...',
  'Extracting information via OCR...',
  'Checking issuer records...',
  'Verifying blockchain proof...',
  'Running fraud analysis...',
  'Generating verification report...',
]

export default function VerifyPage() {
  const [mode, setMode] = useState<'idle' | 'running' | 'done'>('idle')
  const [stepIndex, setStepIndex] = useState(0)

  const runVerification = () => {
    if (mode === 'running') return
    setMode('running')
    setStepIndex(0)
    verificationSteps.forEach((_, i) => {
      setTimeout(() => {
        setStepIndex(i)
        if (i === verificationSteps.length - 1) {
          setTimeout(() => setMode('done'), 600)
        }
      }, i * 700)
    })
  }

  const reset = () => { setMode('idle'); setStepIndex(0) }

  return (
    <div className="min-h-screen pt-28 pb-20" style={{ background: 'var(--bg-2)' }}>
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-semibold tracking-widest" style={{ color: 'var(--blue)' }}>VERIFICATION</span>
          <h1
            className="font-extrabold leading-tight tracking-tight mt-3 mb-4"
            style={{ fontSize: 'clamp(32px, 4vw, 52px)', color: 'var(--navy)' }}
          >
            Verify a Certificate
          </h1>
          <p className="text-base" style={{ color: 'var(--navy)', opacity: 0.55 }}>
            Scan a QR code or upload a certificate to verify its authenticity instantly.
          </p>
        </motion.div>

        <motion.div
          className="rounded-3xl border overflow-hidden"
          style={{ background: 'white', borderColor: 'var(--bg-4)' }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {mode === 'idle' && (
            <div className="p-8">
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                <button
                  onClick={runVerification}
                  className="flex flex-col items-center gap-3 p-8 rounded-2xl border-2 border-dashed transition-all duration-200"
                  style={{ borderColor: 'var(--bg-5)', color: 'var(--navy)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.background = 'var(--light-blue)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bg-5)'; e.currentTarget.style.background = 'transparent' }}
                >
                  <QrCode size={32} strokeWidth={1.5} style={{ color: 'var(--blue)' }} />
                  <div>
                    <p className="font-bold text-sm">Scan QR Code</p>
                    <p className="text-xs mt-0.5" style={{ opacity: 0.5 }}>Use camera to scan</p>
                  </div>
                </button>
                <button
                  onClick={runVerification}
                  className="flex flex-col items-center gap-3 p-8 rounded-2xl border-2 border-dashed transition-all duration-200"
                  style={{ borderColor: 'var(--bg-5)', color: 'var(--navy)' }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--blue)'; e.currentTarget.style.background = 'var(--light-blue)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--bg-5)'; e.currentTarget.style.background = 'transparent' }}
                >
                  <Upload size={32} strokeWidth={1.5} style={{ color: 'var(--blue)' }} />
                  <div>
                    <p className="font-bold text-sm">Upload Certificate</p>
                    <p className="text-xs mt-0.5" style={{ opacity: 0.5 }}>PDF or image file</p>
                  </div>
                </button>
              </div>
              <p className="text-center text-xs" style={{ color: 'var(--navy)', opacity: 0.35 }}>
                Demo simulation — no real certificate required
              </p>
            </div>
          )}

          {mode === 'running' && (
            <div className="p-10 flex flex-col items-center gap-6">
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Loader2 size={36} style={{ color: 'var(--blue)' }} />
              </motion.div>
              <div className="flex flex-col items-center gap-2 w-full max-w-xs">
                {verificationSteps.map((step, i) => (
                  <motion.div
                    key={step}
                    className="flex items-center gap-2 text-sm w-full"
                    initial={{ opacity: 0.2 }}
                    animate={{ opacity: i <= stepIndex ? 1 : 0.2 }}
                  >
                    {i < stepIndex ? (
                      <CheckCircle size={14} style={{ color: 'var(--success)', flexShrink: 0 }} />
                    ) : i === stepIndex ? (
                      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.6, repeat: Infinity }}>
                        <div className="w-3.5 h-3.5 rounded-full border-2 shrink-0" style={{ borderColor: 'var(--blue)' }} />
                      </motion.div>
                    ) : (
                      <div className="w-3.5 h-3.5 rounded-full border-2 shrink-0" style={{ borderColor: 'var(--bg-5)' }} />
                    )}
                    <span style={{ color: i <= stepIndex ? 'var(--navy)' : 'var(--navy)', opacity: i <= stepIndex ? 0.8 : 0.3 }}>
                      {step}
                    </span>
                  </motion.div>
                ))}
              </div>
            </div>
          )}

          {mode === 'done' && (
            <motion.div
              className="p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.4 }}
            >
              {/* Success header */}
              <div className="flex items-center gap-3 mb-6 p-4 rounded-2xl" style={{ background: 'rgba(22,163,74,0.08)' }}>
                <CheckCircle size={24} style={{ color: 'var(--success)' }} />
                <div>
                  <p className="font-bold" style={{ color: 'var(--success)' }}>Certificate Authentic</p>
                  <p className="text-xs" style={{ color: 'var(--navy)', opacity: 0.5 }}>All verification checks passed</p>
                </div>
                <span
                  className="ml-auto px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: 'rgba(22,163,74,0.15)', color: 'var(--success)' }}
                >
                  VERIFIED
                </span>
              </div>

              {/* Details */}
              <div className="grid sm:grid-cols-2 gap-4 mb-6">
                {[
                  { label: 'Certificate ID', value: MOCK_RESULT.id },
                  { label: 'Issuer', value: MOCK_RESULT.issuer },
                  { label: 'Holder', value: MOCK_RESULT.holder },
                  { label: 'Qualification', value: MOCK_RESULT.degree },
                  { label: 'Issued', value: MOCK_RESULT.issued },
                ].map(item => (
                  <div key={item.label} className="p-4 rounded-2xl" style={{ background: 'var(--bg-2)' }}>
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--navy)', opacity: 0.45 }}>{item.label}</p>
                    <p className="font-semibold text-sm" style={{ color: 'var(--navy)' }}>{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Verification signals */}
              <div className="grid sm:grid-cols-3 gap-3 mb-6">
                {[
                  { icon: Blocks, label: 'Blockchain', value: MOCK_RESULT.blockchain },
                  { icon: ShieldCheck, label: 'Document Integrity', value: MOCK_RESULT.integrity },
                  { icon: BarChart3, label: 'Risk Score', value: `${MOCK_RESULT.riskScore} / 100` },
                ].map(item => (
                  <div key={item.label} className="flex flex-col items-center p-4 rounded-2xl border text-center" style={{ borderColor: 'var(--bg-4)' }}>
                    <item.icon size={20} strokeWidth={2} style={{ color: 'var(--blue)', marginBottom: '8px' }} />
                    <p className="text-xs font-semibold mb-1" style={{ color: 'var(--navy)', opacity: 0.45 }}>{item.label}</p>
                    <p className="font-bold text-sm" style={{ color: 'var(--success)' }}>{item.value}</p>
                  </div>
                ))}
              </div>

              <button
                onClick={reset}
                className="w-full py-3 rounded-2xl font-semibold text-sm transition-all duration-200"
                style={{ background: 'var(--bg-2)', color: 'var(--navy)', border: '1px solid var(--bg-5)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--light-blue)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--bg-2)' }}
              >
                Verify Another Certificate
              </button>
              <p className="text-center text-xs mt-3" style={{ color: 'var(--navy)', opacity: 0.35 }}>
                Demo simulation — mock data only
              </p>
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}
