import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, ScanLine } from 'lucide-react'

export default function CTASection() {
  return (
    <section className="py-28 relative overflow-hidden" style={{ background: 'var(--navy)' }}>
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '48px 48px',
        }}
      />
      {/* Glow */}
      <div
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] pointer-events-none"
        style={{ background: 'radial-gradient(ellipse, rgba(0,80,245,0.15) 0%, transparent 70%)' }}
      />

      <div className="relative max-w-4xl mx-auto px-6 text-center">
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7 }}
        >
          <h2
            className="font-extrabold leading-tight tracking-tight mb-4 text-white"
            style={{ fontSize: 'clamp(36px, 5vw, 64px)' }}
          >
            Your credentials.
            <br />
            Their trust.
            <br />
            <span style={{ color: 'var(--blue-4)' }}>One platform.</span>
          </h2>
          <p className="text-lg mb-10 max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Build a future where every achievement can be verified — instantly, securely, and without doubt.
          </p>

          <div className="flex flex-wrap justify-center gap-4">
            <Link
              to="/app/register"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold text-white no-underline transition-all duration-200"
              style={{ background: 'var(--blue)', boxShadow: '0 4px 20px rgba(0,80,245,0.40)' }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(0,80,245,0.50)' }}
              onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,80,245,0.40)' }}
            >
              Get Started <ArrowRight size={16} />
            </Link>
            <Link
              to="/verify"
              className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-semibold no-underline transition-all duration-200"
              style={{ color: 'white', border: '1px solid rgba(255,255,255,0.20)', background: 'rgba(255,255,255,0.06)' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.12)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.06)' }}
            >
              <ScanLine size={16} /> Verify a Certificate
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  )
}
