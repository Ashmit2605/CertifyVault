import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Rocket,
  Network,
  RefreshCw,
  ShieldCheck,
  Code2,
  Lock,
  FileSignature,
  FileOutput,
  Hash,
  Archive,
  Link2,
  QrCode,
  User,
  Eye,
  CheckCircle2,
  ArrowRight,
  ChevronRight,
} from 'lucide-react'

const navItems = [
  { icon: Rocket, label: 'Quick Start' },
  { icon: Network, label: 'Architecture' },
  { icon: RefreshCw, label: 'Certificate Lifecycle' },
  { icon: ShieldCheck, label: 'Verification' },
  { icon: Code2, label: 'API' },
  { icon: Lock, label: 'Security' },
]

const quickStart = [
  { icon: User, label: 'Issuer' },
  { icon: FileSignature, label: 'Issue Certificate' },
  { icon: FileOutput, label: 'Generate PDF' },
  { icon: Hash, label: 'Generate SHA-256' },
  { icon: Archive, label: 'Store Securely' },
  { icon: Link2, label: 'Blockchain Proof' },
  { icon: QrCode, label: 'QR Generated' },
  { icon: User, label: 'Holder' },
  { icon: Eye, label: 'Verifier' },
  { icon: CheckCircle2, label: 'Verification' },
]

const lifecycle = [
  { n: '01', title: 'Issue', desc: 'The institution creates the certificate.' },
  { n: '02', title: 'Protect', desc: 'The certificate is stored securely and its integrity fingerprint is generated.' },
  { n: '03', title: 'Anchor', desc: 'The integrity proof is recorded on the blockchain.' },
  { n: '04', title: 'Verify', desc: 'A verifier validates via QR, certificate data, cryptographic integrity, and blockchain proof.' },
]

const architecture = ['Frontend', 'Node.js / Express API', 'PostgreSQL + Secure Object Storage + Python AI Service + Blockchain Service', 'Verification Result']



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
    <Link to="/app/login">
    <button
      className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
      style={{ background: 'var(--blue)' }}
    >
      {children}
    </button>
    </Link>
  )
}

export default function DocumentationPage() {
  return (
    <>
      {/* Hero */}
      <div className="pt-28 pb-10" style={{ background: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1
              className="font-extrabold leading-tight tracking-tight mb-4"
              style={{ fontSize: 'clamp(32px, 5vw, 54px)', color: 'var(--navy)' }}
            >
              CertifyVault Documentation
            </h1>
            <p className="text-lg max-w-xl mx-auto mb-8" style={{ color: 'var(--navy)', opacity: 0.55 }}>
              Understand how certificates are issued, protected, verified, and evaluated across the
              CertifyVault platform.
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              {navItems.map((item) => {
                const Icon = item.icon
                return (
                  <span
                    key={item.label}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full"
                    style={{ background: 'var(--light-blue, #EAF1FF)', color: 'var(--blue)' }}
                  >
                    <Icon size={13} />
                    {item.label}
                  </span>
                )
              })}
            </div>
          </motion.div>
        </div>
      </div>

      {/* Quick start */}
      <section className="py-14 md:py-16" style={{ background: 'var(--light-blue, #EAF1FF)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: 'var(--navy)' }}>
            Quick Start
          </h2>
          <div className="flex flex-wrap items-center justify-center gap-y-6">
            {quickStart.map((step, i) => {
              const Icon = step.icon
              return (
                <motion.div
                  key={step.label + i}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.04 }}
                  className="flex items-center"
                >
                  <div className="flex flex-col items-center gap-2 px-3 text-center">
                    <div
                      className="w-11 h-11 rounded-full flex items-center justify-center bg-white border"
                      style={{ borderColor: 'var(--blue)' }}
                    >
                      <Icon size={18} color="var(--blue)" />
                    </div>
                    <span className="text-xs font-medium" style={{ color: 'var(--navy)', opacity: 0.75 }}>
                      {step.label}
                    </span>
                  </div>
                  {i < quickStart.length - 1 && (
                    <ChevronRight size={16} className="hidden sm:block shrink-0" style={{ color: 'var(--navy)', opacity: 0.25 }} />
                  )}
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* Lifecycle */}
      <section className="py-14 md:py-16" style={{ background: 'var(--bg)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-10" style={{ color: 'var(--navy)' }}>
            Certificate Lifecycle
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {lifecycle.map((l, i) => (
              <motion.div
                key={l.n}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.06 }}
              >
                <Card className="h-full">
                  <span className="text-xs font-bold tracking-widest" style={{ color: 'var(--blue)' }}>
                    {l.n}
                  </span>
                  <h3 className="font-semibold mt-2 mb-1.5" style={{ color: 'var(--navy)' }}>
                    {l.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--navy)', opacity: 0.6 }}>
                    {l.desc}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture + API */}
      <section className="py-14 md:py-16" style={{ background: 'var(--light-blue, #EAF1FF)' }}>
        <div className="max-w-3xl mx-auto px-6 ">
          <div>
            <h2 className="text-xl font-bold mb-5" style={{ color: 'var(--navy)' }}>
              Verification Architecture
            </h2>
            <div className="flex flex-col gap-2">
              {architecture.map((layer, i) => (
                <motion.div
                  key={layer}
                  initial={{ opacity: 0, x: -12 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.08 }}
                >
                  <div
                    className="rounded-xl px-4 py-3 text-sm font-medium bg-white border text-center"
                    style={{ borderColor: 'rgba(0,15,62,0.08)', color: 'var(--navy)' }}
                  >
                    {layer}
                  </div>
                  {i < architecture.length - 1 && (
                    <div className="flex justify-center py-1">
                      <div className="w-px h-4" style={{ background: 'var(--blue)', opacity: 0.4 }} />
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </div>

          
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: 'var(--navy)' }}>
            Ready to explore CertifyVault?
          </h2>
          <PrimaryButton>
            Get Started <ArrowRight size={16} />
          </PrimaryButton>
        </div>
      </section>
    </>
  )
}