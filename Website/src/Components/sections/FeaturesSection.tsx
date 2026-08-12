import { motion } from 'framer-motion'
import { Lock, Blocks, Brain, ScanText, QrCode, PenLine, XCircle, BarChart3 } from 'lucide-react'

const features = [
  { icon: Lock, title: 'Secure Certificate Vault', desc: 'Encrypted, access-controlled certificate storage with role-based permissions.' },
  { icon: Blocks, title: 'Blockchain Integrity', desc: 'Immutable on-chain proof that a certificate record existed and has not been altered.' },
  { icon: Brain, title: 'AI Fraud Detection', desc: 'Analyze suspicious certificates for visual and structural manipulation signals.' },
  { icon: ScanText, title: 'OCR Comparison', desc: 'Extract certificate text and compare it against trusted institutional records.' },
  { icon: QrCode, title: 'QR Verification', desc: 'Scan and verify any certificate in seconds with a single QR scan.' },
  { icon: PenLine, title: 'Digital Signatures', desc: 'Issuer-authenticated credential workflows with cryptographic signature support.' },
  { icon: XCircle, title: 'Certificate Revocation', desc: 'Institutions can revoke invalid or incorrectly issued credentials at any time.' },
  { icon: BarChart3, title: 'Risk Scoring', desc: 'Combine multiple verification signals into a single, clear trust assessment.' },
]

export default function FeaturesSection() {
  return (
    <section id="features" className="py-24" style={{ background: 'var(--bg-2)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-semibold tracking-widest" style={{ color: 'var(--blue)' }}>FEATURES</span>
          <h2
            className="font-extrabold leading-tight tracking-tight mt-3"
            style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', color: 'var(--navy)' }}
          >
            More Than Verification.{' '}
            <span style={{ color: 'var(--blue)' }}>A Complete Credential Trust Layer.</span>
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="p-6 rounded-3xl border transition-all duration-200 cursor-default"
              style={{ background: 'white', borderColor: 'var(--bg-4)' }}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.07, duration: 0.5 }}
              whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,80,245,0.08)', borderColor: 'var(--light-blue-3)' }}
            >
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'var(--light-blue)' }}
              >
                <f.icon size={18} strokeWidth={2} style={{ color: 'var(--blue)' }} />
              </div>
              <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--navy)' }}>{f.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--navy)', opacity: 0.55 }}>{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
