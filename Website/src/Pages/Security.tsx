import { motion } from 'framer-motion'
import SecuritySection from '../Components/sections/SecuritySection'
import BlockchainSection from '../Components/sections/BlockchainSection'
import PrivacySection from '../Components/sections/PrivacySection'
import CTASection from '../Components/sections/CTASection'

export default function SecurityPage() {
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
              SECURITY
            </span>
            <h1
              className="font-extrabold leading-tight tracking-tight mt-3 mb-4"
              style={{ fontSize: 'clamp(36px, 5vw, 64px)', color: 'var(--navy)' }}
            >
              Security at Every Layer
            </h1>
            <p className="text-lg max-w-xl mx-auto" style={{ color: 'var(--navy)', opacity: 0.55 }}>
              CertifyVault is built with security as the foundation — not an afterthought.
            </p>
          </motion.div>
        </div>
      </div>
      <SecuritySection />
      <BlockchainSection />
      <PrivacySection />
      <CTASection />
    </>
  )
}
