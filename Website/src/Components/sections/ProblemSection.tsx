import { motion } from 'framer-motion'
import { FileWarning, Clock, Database, AlertTriangle } from 'lucide-react'

const problems = [
  {
    icon: FileWarning,
    title: 'Forged Documents',
    desc: 'Certificates can be edited, duplicated, or digitally manipulated with widely available tools — making visual inspection unreliable.',
  },
  {
    icon: Clock,
    title: 'Manual Verification',
    desc: 'Institutions and employers often depend on slow, error-prone manual verification processes that take days or weeks.',
  },
  {
    icon: Database,
    title: 'Fragmented Records',
    desc: 'Certificate information is scattered across documents, databases, and institutions with no unified source of truth.',
  },
  {
    icon: AlertTriangle,
    title: 'No Instant Proof',
    desc: 'A visual certificate alone cannot prove authenticity. Without cryptographic verification, trust is based on appearance.',
  },
]

export default function ProblemSection() {
  return (
    <section className="py-24" style={{ background: 'var(--bg)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="max-w-2xl mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-semibold tracking-widest" style={{ color: 'var(--blue)' }}>THE PROBLEM</span>
          <h2
            className="font-extrabold leading-tight tracking-tight mt-3"
            style={{ fontSize: 'clamp(32px, 4vw, 52px)', color: 'var(--navy)' }}
          >
            A Certificate Shouldn't Need a Phone Call to Be Trusted.
          </h2>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {problems.map((p, i) => (
            <motion.div
              key={p.title}
              className="p-6 rounded-3xl border transition-all duration-200"
              style={{ background: 'white', borderColor: 'var(--bg-4)' }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,15,62,0.08)' }}
            >
              <div
                className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4"
                style={{ background: 'var(--bg-3)' }}
              >
                <p.icon size={18} strokeWidth={2} style={{ color: 'var(--navy)', opacity: 0.7 }} />
              </div>
              <h3 className="font-bold text-base mb-2" style={{ color: 'var(--navy)' }}>{p.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--navy)', opacity: 0.55 }}>{p.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
