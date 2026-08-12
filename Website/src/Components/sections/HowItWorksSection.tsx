import { motion } from 'framer-motion'
import { FilePlus, ShieldCheck, Blocks, BadgeCheck } from 'lucide-react'

const steps = [
  {
    num: '01',
    icon: FilePlus,
    title: 'Issue',
    desc: 'Institution creates and issues a certificate through CertifyVault. Templates, bulk issuance, and custom fields supported.',
  },
  {
    num: '02',
    icon: ShieldCheck,
    title: 'Protect',
    desc: 'Certificate is securely stored with AES-256 encryption and cryptographically fingerprinted with SHA-256.',
  },
  {
    num: '03',
    icon: Blocks,
    title: 'Anchor',
    desc: 'The integrity proof is recorded on blockchain — creating an immutable, tamper-evident record.',
  },
  {
    num: '04',
    icon: BadgeCheck,
    title: 'Verify',
    desc: 'Employers and organizations verify authenticity instantly via QR scan or certificate upload — no account required.',
  },
]

export default function HowItWorksSection() {
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
          <span className="text-xs font-semibold tracking-widest" style={{ color: 'var(--blue)' }}>HOW IT WORKS</span>
          <h2
            className="font-extrabold leading-tight tracking-tight mt-3"
            style={{ fontSize: 'clamp(28px, 3.5vw, 48px)', color: 'var(--navy)' }}
          >
            From Issuance to Verification in Four Steps
          </h2>
        </motion.div>

        <div className="relative grid md:grid-cols-4 gap-6">
          {/* Connecting line (desktop) */}
          <div
            className="absolute top-10 left-[12.5%] right-[12.5%] h-px hidden md:block"
            style={{ background: 'linear-gradient(90deg, var(--blue), var(--light-blue-3))' }}
          />

          {steps.map((step, i) => (
            <motion.div
              key={step.num}
              className="relative flex flex-col items-center text-center p-6 rounded-3xl border"
              style={{ background: 'white', borderColor: 'var(--bg-4)' }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,15,62,0.08)' }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4 relative z-10"
                style={{ background: 'var(--navy)' }}
              >
                <step.icon size={20} color="white" strokeWidth={2} />
              </div>
              <span className="text-xs font-bold tracking-widest mb-2" style={{ color: 'var(--blue)', opacity: 0.6 }}>
                {step.num}
              </span>
              <h3 className="font-bold text-lg mb-2" style={{ color: 'var(--navy)' }}>{step.title}</h3>
              <p className="text-sm leading-relaxed" style={{ color: 'var(--navy)', opacity: 0.55 }}>{step.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
