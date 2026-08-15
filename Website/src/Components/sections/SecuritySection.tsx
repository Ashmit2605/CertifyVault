import { motion } from 'framer-motion'
import { Lock, ShieldCheck, Blocks, Users, ScanLine, ClipboardList } from 'lucide-react'

const securityItems = [
  { icon: Lock, label: 'Encrypted Storage', desc: 'AES-256 encryption for all stored credentials' },
  { icon: ShieldCheck, label: 'Cryptographic Hashing', desc: 'SHA-256 fingerprinting for every certificate' },
  { icon: Blocks, label: 'Blockchain Anchoring', desc: 'Immutable on-chain integrity proofs' },
  { icon: Users, label: 'Role-Based Access', desc: 'Granular permissions for issuers, holders, verifiers' },
  { icon: ScanLine, label: 'Secure Verification', desc: 'Verification without exposing private data' },
  { icon: ClipboardList, label: 'Audit Trails', desc: 'Complete tamper-evident activity logs' },
]

export default function SecuritySection() {
  return (
    <section id="security" className="py-24" style={{ background: 'var(--bg)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Shield visual */}
          <motion.div
            className="flex justify-center"
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <div className="relative w-64 h-64">
              {/* Outer rings */}
              {[1, 2, 3].map(ring => (
                <motion.div
                  key={ring}
                  className="absolute inset-0 rounded-full border"
                  style={{
                    borderColor: `rgba(0,80,245,${0.08 - ring * 0.02})`,
                    transform: `scale(${1 + ring * 0.18})`,
                  }}
                  animate={{ rotate: ring % 2 === 0 ? 360 : -360 }}
                  transition={{ duration: 20 + ring * 8, repeat: Infinity, ease: 'linear' }}
                />
              ))}
              {/* Shield */}
              <div
                className="absolute inset-0 flex items-center justify-center"
              >
                <div
                  className="w-32 h-32 flex items-center justify-center rounded-3xl"
                  style={{ background: 'var(--navy)', boxShadow: '0 16px 48px rgba(0,15,62,0.20)' }}
                >
                  <ShieldCheck size={56} color="white" strokeWidth={1.5} />
                </div>
              </div>
              {/* Orbiting dots */}
              {securityItems.map((item, i) => {
                const angle = (i / securityItems.length) * 360
                const rad = (angle * Math.PI) / 180
                const r = 110
                const x = Math.cos(rad) * r
                const y = Math.sin(rad) * r
                return (
                  <motion.div
                    key={item.label}
                    className="absolute w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{
                      background: 'white',
                      border: '1px solid var(--bg-4)',
                      boxShadow: '0 4px 12px rgba(0,15,62,0.08)',
                      left: `calc(50% + ${x}px - 16px)`,
                      top: `calc(50% + ${y}px - 16px)`,
                    }}
                    initial={{ opacity: 0, scale: 0 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.3 }}
                  >
                    <item.icon size={14} strokeWidth={2} style={{ color: 'var(--blue)' }} />
                  </motion.div>
                )
              })}
            </div>
          </motion.div>

          {/* Content */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <span className="text-xs font-semibold tracking-widest" style={{ color: 'var(--blue)' }}>SECURITY</span>
            <h2
              className="font-extrabold leading-tight tracking-tight mt-3 mb-8"
              style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', color: 'var(--navy)' }}
            >
              Your Credentials Deserve More Than a Password.
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {securityItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  className="flex items-start gap-3 p-4 rounded-2xl border"
                  style={{ background: 'var(--bg-2)', borderColor: 'var(--bg-4)' }}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 + 0.3 }}
                >
                  <div className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--light-blue)' }}>
                    <item.icon size={14} strokeWidth={2} style={{ color: 'var(--blue)' }} />
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: 'var(--navy)' }}>{item.label}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--navy)', opacity: 0.5 }}>{item.desc}</p>
                  </div>
                  <div className="ml-auto shrink-0">
                    <span className="text-xs font-bold" style={{ color: 'var(--success)' }}>✓</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
