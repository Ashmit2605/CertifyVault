import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Upload,
  ShieldCheck,
  ImagePlus,
  ScanText,
  QrCode,
  Database,
  ScanEye,
  PenTool,
  LayoutTemplate,
  Link2,
  Gauge,
  FileCheck2,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  ArrowRight,
} from 'lucide-react'

const pipelineSteps = [
  { icon: Upload, label: 'Certificate Upload' },
  { icon: ShieldCheck, label: 'File Security Check' },
  { icon: ImagePlus, label: 'Image Preprocessing' },
  { icon: ScanText, label: 'OCR Analysis' },
  { icon: QrCode, label: 'QR Verification' },
  { icon: Database, label: 'Database Matching' },
  { icon: ScanEye, label: 'Image Forensics' },
  { icon: PenTool, label: 'Signature Detection' },
  { icon: LayoutTemplate, label: 'Logo / Template Matching' },
  { icon: Link2, label: 'Blockchain Hash Verification' },
  { icon: Gauge, label: 'Risk Score' },
  { icon: FileCheck2, label: 'Verification Report' },
]

const checks = [
  {
    n: '01',
    title: 'OCR & Text Matching',
    desc: 'Extracts certificate data and compares name, certificate ID, degree, institution, and dates.',
  },
  {
    n: '02',
    title: 'QR Verification',
    desc: 'Confirms the QR code exists, resolves to a valid reference, and matches the certificate record.',
  },
  {
    n: '03',
    title: 'Image Forensics',
    desc: 'Flags text manipulation, copy/paste regions, compression artifacts, and visual tampering.',
  },
  {
    n: '04',
    title: 'Signature Detection',
    desc: 'Checks the expected signature region and compares it against authorized reference data.',
  },
  {
    n: '05',
    title: 'Logo & Template Verification',
    desc: 'Validates institutional branding and layout against trusted certificate templates.',
  },
  {
    n: '06',
    title: 'Database Matching',
    desc: "Cross-references extracted fields with the issuer's trusted certificate record.",
  },
  {
    n: '07',
    title: 'SHA-256 Integrity',
    desc: 'Generates and compares the cryptographic fingerprint of the issued document.',
  },
  {
    n: '08',
    title: 'Blockchain Verification',
    desc: "Checks the certificate's recorded integrity proof against the blockchain.",
  },
]

function Card({ children, className = '' }: { children: React.ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-2xl border p-6 bg-white ${className}`}
      style={{ borderColor: 'rgba(0,15,62,0.08)', boxShadow: '0 1px 2px rgba(0,15,62,0.04)' }}
    >
      {children}
    </div>
  )
}

function PrimaryButton({ children }: { children: React.ReactNode }) {
  return (
    <Link to="/verify">
    <button 
      className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
      style={{ background: 'var(--blue)' }}
    >
      {children}
    </button>
    </Link>
  )
}

export default function FraudDetectionPage() {
  return (
    <>
      {/* Hero */}
      <div className="pt-28 pb-12" style={{ background: 'var(--bg)' }}>
        <div className="max-w-5xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-xs font-semibold tracking-widest" style={{ color: 'var(--blue)' }}>
              AI-POWERED FRAUD DETECTION
            </span>
            <h1
              className="font-extrabold leading-tight tracking-tight mt-3 mb-4"
              style={{ fontSize: 'clamp(32px, 5vw, 58px)', color: 'var(--navy)' }}
            >
              Forgery Leaves Signals.
              <br className="hidden md:block" /> CertifyVault Finds Them.
            </h1>
            <p className="text-lg max-w-2xl mx-auto mb-8" style={{ color: 'var(--navy)', opacity: 0.55 }}>
              CertifyVault combines document analysis, OCR, image forensics, QR validation, certificate
              records, and blockchain integrity checks to identify suspicious academic credentials.
            </p>
            <a href="#pipeline" className="inline-flex items-center gap-2 font-semibold" style={{ color: 'var(--blue)' }}>
              See How Verification Works <ArrowRight size={16} />
            </a>
          </motion.div>
        </div>
      </div>

      {/* Pipeline */}
      <section id="pipeline" className="py-14 md:py-20" style={{ background: 'var(--light-blue, #EAF1FF)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="text-2xl md:text-3xl font-bold text-center mb-10"
            style={{ color: 'var(--navy)' }}
          >
            The Fraud Detection Pipeline
          </motion.h2>

          <div className="relative">
            {/* connecting line */}
            <div
              className="hidden md:block absolute left-0 right-0 top-6 h-px"
              style={{ background: 'rgba(0,15,62,0.12)' }}
            />
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-x-4 gap-y-10">
              {pipelineSteps.map((step, i) => {
                const Icon = step.icon
                return (
                  <motion.div
                    key={step.label}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.05 }}
                    className="relative flex flex-col items-center text-center gap-2"
                  >
                    <div
                      className="w-12 h-12 rounded-full flex items-center justify-center border relative z-10"
                      style={{ background: 'white', borderColor: 'var(--blue)' }}
                    >
                      <Icon size={20} color="var(--blue)" />
                    </div>
                    <span className="text-xs font-medium leading-tight" style={{ color: 'var(--navy)', opacity: 0.75 }}>
                      {step.label}
                    </span>
                  </motion.div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Verification checks */}
      <section className="py-14 md:py-20" style={{ background: 'var(--bg)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-10" style={{ color: 'var(--navy)' }}>
            Verification Checks
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {checks.map((c, i) => (
              <motion.div
                key={c.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.04 }}
              >
                <Card className="h-full">
                  <span className="text-xs font-bold tracking-widest" style={{ color: 'var(--blue)' }}>
                    {c.n}
                  </span>
                  <h3 className="font-semibold mt-2 mb-1.5" style={{ color: 'var(--navy)' }}>
                    {c.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--navy)', opacity: 0.6 }}>
                    {c.desc}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Risk score */}
      <section className="py-14 md:py-20" style={{ background: 'var(--light-blue, #EAF1FF)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3" style={{ color: 'var(--navy)' }}>
            One Score. Many Signals.
          </h2>
          <p className="text-center text-sm max-w-xl mx-auto mb-10" style={{ color: 'var(--navy)', opacity: 0.55 }}>
            The trust score reflects a risk assessment across multiple signals — not a claim of absolute
            authenticity.
          </p>
          <div className="grid md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card>
                <div className="text-center mb-4">
                  <div className="text-5xl font-extrabold" style={{ color: 'var(--blue)' }}>
                    96<span className="text-xl opacity-50">/100</span>
                  </div>
                  <span className="text-xs font-semibold tracking-widest" style={{ color: 'var(--blue)' }}>
                    TRUST SCORE
                  </span>
                </div>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--navy)' }}>
                  {['QR Valid', 'OCR Matched', 'Issuer Verified', 'Blockchain Matched', 'No Major Image Anomaly'].map(
                    (t) => (
                      <li key={t} className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="shrink-0" style={{ color: '#16A34A' }} />
                        {t}
                      </li>
                    )
                  )}
                </ul>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <Card>
                <div className="text-center mb-4">
                  <div className="text-5xl font-extrabold" style={{ color: '#DC2626' }}>
                    23<span className="text-xl opacity-50">/100</span>
                  </div>
                  <span className="text-xs font-semibold tracking-widest" style={{ color: '#DC2626' }}>
                    HIGH RISK
                  </span>
                </div>
                <ul className="space-y-2 text-sm" style={{ color: 'var(--navy)' }}>
                  <li className="flex items-center gap-2">
                    <XCircle size={16} className="shrink-0" style={{ color: '#DC2626' }} />
                    Blockchain Mismatch
                  </li>
                  <li className="flex items-center gap-2">
                    <XCircle size={16} className="shrink-0" style={{ color: '#DC2626' }} />
                    Certificate ID Mismatch
                  </li>
                  <li className="flex items-center gap-2">
                    <AlertTriangle size={16} className="shrink-0" style={{ color: '#D97706' }} />
                    Image Anomaly
                  </li>
                </ul>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: 'var(--navy)' }}>
            Don't just look at a certificate. Verify it.
          </h2>
          <PrimaryButton>
            Verify a Certificate <ArrowRight size={16} />
          </PrimaryButton>
        </div>
      </section>
    </>
  )
}