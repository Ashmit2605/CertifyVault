import { motion } from 'framer-motion'
import { ShieldCheck, Blocks, Lock, Brain, QrCode, FileSignature, History, Globe } from 'lucide-react'

const items = [
  { icon: Lock, label: 'Encrypted Storage' },
  { icon: ShieldCheck, label: 'SHA-256 Hashing' },
  { icon: Blocks, label: 'Blockchain Anchored' },
  { icon: Brain, label: 'AI Fraud Detection' },
  { icon: QrCode, label: 'QR Verification' },
  { icon: FileSignature, label: 'Digital Signatures' },
  { icon: History, label: 'Full Audit Trail' },
  { icon: Globe, label: 'GDPR Compliant' },
]

export default function TrustBar() {
  return (
    <section className="py-10 border-y" style={{ borderColor: 'var(--bg-4)', background: 'var(--bg-2)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-0">
          <p className="text-xs font-semibold tracking-widest md:mr-10 shrink-0" style={{ color: 'var(--navy)', opacity: 0.4 }}>
            SECURE BY DESIGN
          </p>
          <div className="grid grid-cols-2 md:grid-cols-4 justify-center md:justify-start items-center gap-6 md:gap-8">
            {items.map((item, i) => (
              <motion.div
                key={item.label}
                className="relative flex items-center gap-2 px-4"
                initial={{ opacity: 0, y: 8 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
              >
                <item.icon
                  size={16}
                  strokeWidth={2}
                  style={{ color: 'var(--blue)' }}
                  className="shrink-0"
                />

                <span
                  className="text-sm font-medium whitespace-nowrap"
                  style={{
                    color: 'var(--navy)',
                    opacity: 0.65,
                  }}
                >
                  {item.label}
                </span>

                {/* Vertical separator between columns */}
                {i % 4 !== 3 && (
                  <span
                    className="hidden md:block absolute right-0 top-1/2 -translate-y-1/2 w-px h-4"
                    style={{ background: 'var(--bg-5)' }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
