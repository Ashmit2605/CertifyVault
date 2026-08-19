import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Search, Upload, BadgeCheck, BarChart3, FileText, Brain, ArrowRight } from 'lucide-react'
import CTASection from '../Components/sections/CTASection'

const steps = [
  { icon: Upload,     label: 'Upload',  desc: 'Upload a certificate or scan its QR code.' },
  { icon: Brain,      label: 'Analyze', desc: 'AI and cryptographic analysis runs automatically.' },
  { icon: BadgeCheck, label: 'Verify',  desc: 'Blockchain and hash verification confirms authenticity.' },
  { icon: BarChart3,  label: 'Trust',   desc: 'Receive a full report with risk score.' },
]

const features = [
  { icon: Search,     title: 'Scan QR Code',         desc: 'Instant verification by scanning the embedded QR code.' },
  { icon: Upload,     title: 'Upload Certificate',    desc: 'Upload a PDF or image for full analysis.' },
  { icon: BadgeCheck, title: 'Instant Verification',  desc: 'Results in seconds, not days.' },
  { icon: Brain,      title: 'Fraud Detection',       desc: 'AI-powered analysis detects manipulation signals.' },
  { icon: FileText,   title: 'Verification Reports',  desc: 'Detailed reports with full audit trail.' },
  { icon: BarChart3,  title: 'Risk Scoring',          desc: 'Clear trust score combining all verification signals.' },
]

export default function VerifiersPage() {
  return (
    <>
      <div className="pt-28 pb-16" style={{ background: 'var(--bg)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-16"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-semibold tracking-widest" style={{ color: 'var(--blue)' }}>
              FOR VERIFIERS
            </span>
            <h1
              className="font-extrabold leading-tight tracking-tight mt-3 mb-5"
              style={{ fontSize: 'clamp(36px, 4.5vw, 60px)', color: 'var(--navy)' }}
            >
              Verification in Seconds,{' '}
              <span style={{ color: 'var(--blue)' }}>Not Days.</span>
            </h1>
            <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--navy)', opacity: 0.6 }}>
              Verify any academic credential instantly. No account required. Get a full fraud analysis and risk score.
            </p>
            <Link
              to="/verify"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-white no-underline"
              style={{ background: 'var(--blue)', boxShadow: '0 4px 16px rgba(0,80,245,0.25)' }}
            >
              Verify a Certificate <ArrowRight size={16} />
            </Link>
          </motion.div>

          <div className="grid sm:grid-cols-4 gap-5">
            {steps.map((step, i) => (
              <motion.div
                key={step.label}
                className="flex flex-col items-center text-center p-6 rounded-3xl border"
                style={{ background: 'white', borderColor: 'var(--bg-4)' }}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,15,62,0.08)' }}
              >
                <div
                  className="w-12 h-12 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: 'var(--navy)' }}
                >
                  <step.icon size={20} color="white" strokeWidth={2} />
                </div>
                <h3 className="font-bold text-base mb-2" style={{ color: 'var(--navy)' }}>{step.label}</h3>
                <p className="text-sm" style={{ color: 'var(--navy)', opacity: 0.55 }}>{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <section className="py-20" style={{ background: 'var(--bg-2)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2
            className="font-extrabold text-center mb-12"
            style={{ fontSize: 'clamp(24px, 3vw, 40px)', color: 'var(--navy)' }}
          >
            Everything You Need to Trust a Credential
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="p-6 rounded-3xl border"
                style={{ background: 'white', borderColor: 'var(--bg-4)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,15,62,0.08)' }}
              >
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: 'var(--light-blue)' }}
                >
                  <f.icon size={18} strokeWidth={2} style={{ color: 'var(--blue)' }} />
                </div>
                <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--navy)' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--navy)', opacity: 0.55 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
