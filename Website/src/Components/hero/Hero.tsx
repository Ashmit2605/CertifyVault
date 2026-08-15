import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ScanLine } from 'lucide-react'
import CertificateCard from './CertificateCard'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 24 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, delay, ease: [0.22, 1, 0.36, 1] as const },
})

export default function Hero() {
  return (
    <section
      className="relative min-h-screen flex items-center pt-28 pb-20 overflow-hidden"
      style={{ background: 'var(--bg)' }}
    >
      {/* Background grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(0,80,245,0.04) 1px, transparent 1px),
            linear-gradient(90deg, rgba(0,80,245,0.04) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />
      {/* Radial glow */}
      <div
        className="absolute top-0 right-0 w-150 h-150 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 70% 30%, rgba(0,80,245,0.07) 0%, transparent 70%)',
        }}
      />

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 w-full">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
          {/* Left: copy */}
          <div className="text-center lg:text-left">
            <motion.div {...fadeUp(0.1)}>
              <span
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold tracking-widest mb-6"
                style={{ background: 'var(--light-blue)', color: 'var(--blue)' }}
              >
                <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--blue)' }} />
                TRUSTED DIGITAL CREDENTIALS
              </span>
            </motion.div>

            <motion.h1
              className="font-extrabold leading-[1.08] tracking-tight mb-6"
              style={{ fontSize: 'clamp(42px, 5.5vw, 72px)', color: 'var(--navy)' }}
              {...fadeUp(0.2)}
            >
              Verify Every Credential.{' '}
              <span style={{ color: 'var(--blue)' }}>Trust Every Achievement.</span>
            </motion.h1>

            <motion.p
              className="text-lg leading-relaxed mb-8 max-w-lg mx-auto lg:mx-0"
              style={{ color: 'var(--navy)', opacity: 0.6 }}
              {...fadeUp(0.3)}
            >
              CertifyVault lets institutions securely issue, store, and verify academic credentials — while detecting fraudulent or manipulated certificates with AI-powered analysis.
            </motion.p>

            <motion.div className="flex flex-wrap justify-center lg:justify-start gap-3 mb-8" {...fadeUp(0.4)}>
              <Link
                to="/app/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-white transition-all duration-200 no-underline"
                style={{ background: 'var(--blue)', boxShadow: '0 4px 16px rgba(0,80,245,0.30)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'translateY(-1px)'
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,80,245,0.35)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,80,245,0.30)'
                }}
              >
                Start Issuing <ArrowRight size={16} />
              </Link>
              <Link
                to="/verify"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold transition-all duration-200 no-underline"
                style={{ color: 'var(--navy)', background: 'white', border: '1px solid var(--bg-5)', boxShadow: '0 2px 8px rgba(0,15,62,0.06)' }}
                onMouseEnter={e => {
                  e.currentTarget.style.background = 'var(--light-blue)'
                  e.currentTarget.style.borderColor = 'var(--blue-5)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.background = 'white'
                  e.currentTarget.style.borderColor = 'var(--bg-5)'
                }}
              >
                <ScanLine size={16} /> Verify a Certificate
              </Link>
            </motion.div>

            <motion.p
              className="text-sm"
              style={{ color: 'var(--navy)', opacity: 0.4 }}
              {...fadeUp(0.5)}
            >
              No complex blockchain setup required.
            </motion.p>
          </div>

          {/* Right: certificate visual */}
          <motion.div
            className="hidden sm:flex justify-center lg:justify-end"
            initial={{ opacity: 0, x: 40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
          >
            <CertificateCard />
          </motion.div>
        </div>
      </div>
    </section>
  )
}
