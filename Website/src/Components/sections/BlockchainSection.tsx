import { motion } from 'framer-motion'
import { FileText, ShieldCheck, Database, Blocks, BadgeCheck } from 'lucide-react'

const nodes = [
  { icon: FileText, label: 'Certificate', sub: 'Original document' },
  { icon: ShieldCheck, label: 'SHA-256 Hash', sub: 'Cryptographic fingerprint' },
  { icon: Database, label: 'Secure Storage', sub: 'Encrypted off-chain', branch: true },
  { icon: Blocks, label: 'Blockchain Proof', sub: 'Immutable on-chain anchor' },
  { icon: BadgeCheck, label: 'Independent Verification', sub: 'Anyone can verify' },
]

export default function BlockchainSection() {
  return (
    <section className="py-24" style={{ background: 'var(--bg-2)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-semibold tracking-widest" style={{ color: 'var(--blue)' }}>BLOCKCHAIN</span>
            <h2
              className="font-extrabold leading-tight tracking-tight mt-3 mb-5"
              style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', color: 'var(--navy)' }}
            >
              Blockchain Where It Matters.{' '}
              <span style={{ color: 'var(--blue)' }}>Invisible Where It Doesn't.</span>
            </h2>
            <p className="text-base leading-relaxed mb-6" style={{ color: 'var(--navy)', opacity: 0.6 }}>
              CertifyVault uses blockchain as a tamper-evident trust layer while keeping sensitive certificate information in secure off-chain encrypted storage. You get the integrity guarantees of blockchain without exposing private data.
            </p>
            <div className="flex flex-col gap-3">
              {[
                'Certificate data stays private and encrypted',
                'Only cryptographic proofs are stored on-chain',
                'Anyone can verify without accessing private data',
                'Tamper-evident — any change breaks the proof',
              ].map(point => (
                <div key={point} className="flex items-start gap-2.5">
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'var(--light-blue)' }}>
                    <div className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--blue)' }} />
                  </div>
                  <p className="text-sm" style={{ color: 'var(--navy)', opacity: 0.65 }}>{point}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Architecture diagram */}
          <motion.div
            className="flex flex-col items-center gap-0"
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {nodes.map((node, i) => (
              <div key={node.label} className="flex flex-col items-center w-full">
                <motion.div
                  className="flex items-center gap-4 px-5 py-4 rounded-2xl border w-full max-w-xs"
                  style={{ background: 'white', borderColor: 'var(--bg-4)' }}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ boxShadow: '0 8px 24px rgba(0,80,245,0.08)' }}
                >
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'var(--light-blue)' }}>
                    <node.icon size={16} strokeWidth={2} style={{ color: 'var(--blue)' }} />
                  </div>
                  <div>
                    <p className="font-bold text-sm" style={{ color: 'var(--navy)' }}>{node.label}</p>
                    <p className="text-xs" style={{ color: 'var(--navy)', opacity: 0.5 }}>{node.sub}</p>
                  </div>
                  {node.branch && (
                    <span className="ml-auto text-xs px-2 py-0.5 rounded-full font-semibold" style={{ background: 'var(--light-blue)', color: 'var(--blue)' }}>
                      Private
                    </span>
                  )}
                </motion.div>
                {i < nodes.length - 1 && (
                  <motion.div
                    className="w-px h-6"
                    style={{ background: 'linear-gradient(to bottom, var(--blue-4), var(--light-blue-3))' }}
                    initial={{ scaleY: 0 }}
                    whileInView={{ scaleY: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 + 0.1 }}
                  />
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  )
}
