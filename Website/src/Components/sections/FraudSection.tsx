import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, AlertTriangle, XCircle, ScanLine } from 'lucide-react'

const signals = [
  { label: 'Institution detected', status: 'ok' },
  { label: 'Certificate ID detected', status: 'ok' },
  { label: 'Text region modified', status: 'warn' },
  { label: 'QR code valid', status: 'ok' },
  { label: 'Blockchain hash mismatch', status: 'fail' },
  { label: 'Signature anomaly detected', status: 'warn' },
]

const statusConfig = {
  ok: { icon: CheckCircle, color: 'var(--success)', bg: 'rgba(22,163,74,0.08)', label: '✓' },
  warn: { icon: AlertTriangle, color: 'var(--warning)', bg: 'rgba(217,119,6,0.08)', label: '⚠' },
  fail: { icon: XCircle, color: 'var(--danger)', bg: 'rgba(220,38,38,0.08)', label: '✕' },
}

export default function FraudSection() {
  const [scanning, setScanning] = useState(false)
  const [done, setDone] = useState(false)
  const [revealed, setRevealed] = useState(0)

  const startScan = () => {
    if (scanning) return
    setScanning(true)
    setDone(false)
    setRevealed(0)
    signals.forEach((_, i) => {
      setTimeout(() => {
        setRevealed(i + 1)
        if (i === signals.length - 1) {
          setScanning(false)
          setDone(true)
        }
      }, 600 + i * 400)
    })
  }

  return (
    <section className="py-24" style={{ background: 'var(--bg)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-semibold tracking-widest" style={{ color: 'var(--blue)' }}>FRAUD DETECTION</span>
          <h2
            className="font-extrabold leading-tight tracking-tight mt-3"
            style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', color: 'var(--navy)' }}
          >
            Forgery Leaves Signals.{' '}
            <span style={{ color: 'var(--blue)' }}>CertifyVault Finds Them.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-8 items-center max-w-4xl mx-auto">
          {/* Certificate preview */}
          <div
            className="relative rounded-3xl border overflow-hidden"
            style={{ background: 'white', borderColor: 'var(--bg-4)', minHeight: '320px' }}
          >
            {/* Scan line */}
            <AnimatePresence>
              {scanning && (
                <motion.div
                  className="absolute left-0 right-0 h-0.5 z-10"
                  style={{ background: 'linear-gradient(90deg, transparent, var(--blue), transparent)' }}
                  initial={{ top: '0%' }}
                  animate={{ top: '100%' }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 2.5, ease: 'linear' }}
                />
              )}
            </AnimatePresence>

            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <p className="text-xs font-semibold tracking-widest mb-1" style={{ color: 'var(--navy)', opacity: 0.4 }}>CERTIFICATE OF COMPLETION</p>
                  <h3 className="font-bold text-lg" style={{ color: 'var(--navy)' }}>Bachelor of Technology</h3>
                  <p className="text-sm" style={{ color: 'var(--navy)', opacity: 0.55 }}>Computer Engineering</p>
                </div>
              </div>

              <div className="h-px mb-4" style={{ background: 'var(--bg-4)' }} />

              <div className="flex flex-col gap-2">
                {signals.map((sig, i) => {
                  const cfg = statusConfig[sig.status as keyof typeof statusConfig]
                  const visible = i < revealed
                  return (
                    <AnimatePresence key={sig.label}>
                      {visible && (
                        <motion.div
                          className="flex items-center gap-2 px-3 py-2 rounded-xl text-sm"
                          style={{ background: cfg.bg }}
                          initial={{ opacity: 0, x: -8 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                        >
                          <cfg.icon size={14} strokeWidth={2.5} style={{ color: cfg.color }} />
                          <span style={{ color: 'var(--navy)', opacity: 0.75 }}>{sig.label}</span>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  )
                })}
              </div>
            </div>
          </div>

          {/* Risk score + CTA */}
          <div className="flex flex-col gap-6">
            <div
              className="p-7 rounded-3xl border text-center"
              style={{ background: 'white', borderColor: 'var(--bg-4)' }}
            >
              <p className="text-xs font-semibold tracking-widest mb-4" style={{ color: 'var(--navy)', opacity: 0.45 }}>RISK SCORE</p>
              <motion.div
                className="text-6xl font-extrabold mb-2"
                style={{ color: done ? 'var(--danger)' : 'var(--navy)', opacity: done ? 1 : 0.2 }}
                animate={{ scale: done ? [1, 1.08, 1] : 1 }}
                transition={{ duration: 0.4 }}
              >
                {done ? '23' : '--'}
              </motion.div>
              <p className="text-sm font-medium mb-1" style={{ color: 'var(--navy)', opacity: 0.4 }}>/ 100</p>
              {done && (
                <motion.span
                  className="inline-block px-3 py-1 rounded-full text-xs font-bold"
                  style={{ background: 'rgba(220,38,38,0.1)', color: 'var(--danger)' }}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  HIGH RISK
                </motion.span>
              )}
            </div>

            <button
              onClick={startScan}
              disabled={scanning}
              className="flex items-center justify-center gap-2 py-4 rounded-2xl font-semibold text-white transition-all duration-200"
              style={{
                background: scanning ? 'var(--blue-4)' : 'var(--blue)',
                boxShadow: scanning ? 'none' : '0 4px 16px rgba(0,80,245,0.25)',
                cursor: scanning ? 'not-allowed' : 'pointer',
              }}
            >
              <ScanLine size={18} />
              {scanning ? 'Scanning...' : done ? 'Scan Again' : 'Run Fraud Analysis'}
            </button>

            <p className="text-xs text-center" style={{ color: 'var(--navy)', opacity: 0.4 }}>
              Interactive demo — simulated analysis only
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
