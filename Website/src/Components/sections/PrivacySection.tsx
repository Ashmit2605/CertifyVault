import { motion } from 'framer-motion'
import { Lock, Globe } from 'lucide-react'

const privateItems = ['Student Information', 'Certificate PDF', 'Personal Data', 'Institution Records']
const publicItems = ['Cryptographic Integrity', 'Blockchain Anchor', 'Verification Status', 'Revocation Status']

export default function PrivacySection() {
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
          <span className="text-xs font-semibold tracking-widest" style={{ color: 'var(--blue)' }}>PRIVACY</span>
          <h2
            className="font-extrabold leading-tight tracking-tight mt-3"
            style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', color: 'var(--navy)' }}
          >
            Your certificate is public proof.{' '}
            <span style={{ color: 'var(--blue)' }}>Your personal data is not.</span>
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
          {/* Private */}
          <motion.div
            className="p-7 rounded-3xl border"
            style={{ background: 'white', borderColor: 'var(--bg-4)' }}
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'var(--bg-3)' }}>
                <Lock size={18} strokeWidth={2} style={{ color: 'var(--navy)' }} />
              </div>
              <span className="font-bold text-sm tracking-widest" style={{ color: 'var(--navy)', opacity: 0.5 }}>PRIVATE</span>
            </div>
            <div className="flex flex-col gap-2.5">
              {privateItems.map(item => (
                <div key={item} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl" style={{ background: 'var(--bg-2)' }}>
                  <Lock size={13} strokeWidth={2} style={{ color: 'var(--navy)', opacity: 0.4 }} />
                  <span className="text-sm font-medium" style={{ color: 'var(--navy)', opacity: 0.7 }}>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Public */}
          <motion.div
            className="p-7 rounded-3xl border"
            style={{ background: 'white', borderColor: 'var(--bg-4)' }}
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <div className="flex items-center gap-3 mb-5">
              <div className="w-10 h-10 rounded-2xl flex items-center justify-center" style={{ background: 'var(--light-blue)' }}>
                <Globe size={18} strokeWidth={2} style={{ color: 'var(--blue)' }} />
              </div>
              <span className="font-bold text-sm tracking-widest" style={{ color: 'var(--blue)', opacity: 0.7 }}>PUBLIC PROOF</span>
            </div>
            <div className="flex flex-col gap-2.5">
              {publicItems.map(item => (
                <div key={item} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl" style={{ background: 'var(--light-blue)' }}>
                  <span className="text-xs font-bold" style={{ color: 'var(--success)' }}>✓</span>
                  <span className="text-sm font-medium" style={{ color: 'var(--navy)', opacity: 0.7 }}>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
