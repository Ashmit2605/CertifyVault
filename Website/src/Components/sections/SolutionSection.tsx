

import { motion } from 'framer-motion'
import { FileText, QrCode, ScanText, Brain, ShieldCheck, Blocks, BarChart3, BadgeCheck } from 'lucide-react'

const steps = [
  { icon: FileText, label: 'Certificate', desc: 'Document submitted for verification' },
  { icon: QrCode, label: 'QR Verification', desc: 'Embedded QR code is scanned and decoded' },
  { icon: ScanText, label: 'OCR & Data Matching', desc: 'Text extracted and matched against records' },
  { icon: Brain, label: 'AI Fraud Detection', desc: 'Visual and structural anomalies analyzed' },
  { icon: ShieldCheck, label: 'SHA-256 Integrity', desc: 'Cryptographic hash compared against original' },
  { icon: Blocks, label: 'Blockchain Verification', desc: 'Immutable proof checked on-chain' },
  { icon: BarChart3, label: 'Risk Score', desc: 'All signals combined into a trust score' },
  { icon: BadgeCheck, label: 'Trusted Result', desc: 'Verification complete with full audit trail' },
]

export default function SolutionSection() {
 

  return (
    <section className="py-24" style={{ background: 'var(--bg-2)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-semibold tracking-widest" style={{ color: 'var(--blue)' }}>THE SOLUTION</span>
          <h2
            className="font-extrabold leading-tight tracking-tight mt-3"
            style={{ fontSize: 'clamp(32px, 4vw, 52px)', color: 'var(--navy)' }}
          >
            One Credential.{' '}
            <span style={{ color: 'var(--blue)' }}>Multiple Layers of Trust.</span>
          </h2>
        </motion.div>

        <div className="relative max-w-3xl mx-auto">
          {/* Vertical line */}
          <div
            className="absolute left-8 top-8 bottom-8 w-px hidden md:block "
            style={{ background: 'linear-gradient(to bottom, var(--blue), var(--light-blue-3))' }}
          />

          <div className="flex flex-col gap-4" style={{ position: 'relative', zIndex: 1 }}>
            {steps.map((step, i) => (
              <motion.div
                key={step.label}
                className="flex items-start gap-5 p-5 rounded-2xl border transition-all duration-200"
                style={{ background: 'white', borderColor: 'var(--bg-4)' }}
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                whileHover={{ x: 4, boxShadow: '0 8px 24px rgba(0,80,245,0.08)' }}
              >
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center shrink-0"
                  style={{ background: i === steps.length - 1 ? 'var(--blue)' : 'var(--light-blue)' }}
                >
                  <step.icon
                    size={18}
                    strokeWidth={2}
                    style={{ color: i === steps.length - 1 ? 'white' : 'var(--blue)' }}
                  />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-bold tabular-nums" style={{ color: 'var(--blue)', opacity: 0.5 }}>
                      {String(i + 1).padStart(2, '0')}
                    </span>
                    <h3 className="font-bold text-sm" style={{ color: 'var(--navy)' }}>{step.label}</h3>
                  </div>
                  <p className="text-sm mt-0.5" style={{ color: 'var(--navy)', opacity: 0.55 }}>{step.desc}</p>
                </div>
                {i === steps.length - 1 && (
                  <span
                    className="px-2.5 py-1 rounded-full text-xs font-bold"
                    style={{ background: 'rgba(22,163,74,0.1)', color: 'var(--success)' }}
                  >
                    VERIFIED
                  </span>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
