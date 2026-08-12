import { motion } from 'framer-motion'
import { Shield, Target, Users } from 'lucide-react'
import CTASection from '../Components/sections/CTASection'

const cards = [
  {
    icon: Target,
    title: 'Our Mission',
    desc: 'Make every academic credential instantly verifiable and impossible to forge — for institutions, graduates, and employers worldwide.',
  },
  {
    icon: Shield,
    title: 'Our Approach',
    desc: 'Combine blockchain integrity, cryptographic hashing, AI fraud detection, and secure storage into one seamless platform.',
  },
  {
    icon: Users,
    title: 'Who We Serve',
    desc: 'Universities, colleges, graduates, employers, and any organization that needs to trust a credential.',
  },
]

export default function AboutPage() {
  return (
    <>
      <div className="pt-28 pb-20" style={{ background: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-semibold tracking-widest" style={{ color: 'var(--blue)' }}>ABOUT</span>
            <h1
              className="font-extrabold leading-tight tracking-tight mt-3 mb-5"
              style={{ fontSize: 'clamp(36px, 5vw, 64px)', color: 'var(--navy)' }}
            >
              Trust Infrastructure for Academic Credentials
            </h1>
            <p className="text-lg leading-relaxed max-w-2xl mx-auto" style={{ color: 'var(--navy)', opacity: 0.6 }}>
              CertifyVault was built to solve a fundamental problem: academic credentials are easy to forge and hard to verify. We're building the trust layer that makes every credential verifiable, every achievement provable.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {cards.map((item, i) => (
              <motion.div
                key={item.title}
                className="p-7 rounded-3xl border"
                style={{ background: 'white', borderColor: 'var(--bg-4)' }}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 }}
                whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,15,62,0.08)' }}
              >
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: 'var(--light-blue)' }}
                >
                  <item.icon size={18} strokeWidth={2} style={{ color: 'var(--blue)' }} />
                </div>
                <h3 className="font-bold text-base mb-2" style={{ color: 'var(--navy)' }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--navy)', opacity: 0.55 }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      <CTASection />
    </>
  )
}
