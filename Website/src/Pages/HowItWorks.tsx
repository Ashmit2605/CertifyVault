import { motion } from 'framer-motion'
import HowItWorksSection from '../Components/sections/HowItWorksSection'
import SolutionSection from '../Components/sections/SolutionSection'
import CTASection from '../Components/sections/CTASection'

export default function HowItWorksPage() {
  return (
    <>
      <div className="pt-28 pb-12" style={{ background: 'var(--bg)' }}>
        <div className="max-w-6xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-semibold tracking-widest" style={{ color: 'var(--blue)' }}>
              HOW IT WORKS
            </span>
            <h1
              className="font-extrabold leading-tight tracking-tight mt-3 mb-4"
              style={{ fontSize: 'clamp(36px, 5vw, 64px)', color: 'var(--navy)' }}
            >
              A Certificate Traveling Through{' '}
              <span style={{ color: 'var(--blue)' }}>Layers of Trust</span>
            </h1>
            <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--navy)', opacity: 0.55 }}>
              From issuance to verification, every step is secured, recorded, and verifiable.
            </p>
          </motion.div>
        </div>
      </div>
      <HowItWorksSection />
      <SolutionSection />
      <CTASection />
    </>
  )
}
