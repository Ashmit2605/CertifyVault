import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  FileText,
  Hash,
  Cloud,
  Database,
  FileCode2,
  Network,
  Globe,
  ShieldCheck,
  Search,
  History,
  ArrowRight,
} from 'lucide-react'

const privateItems = [
  'Certificate PDF',
  'Student information',
  'Personal information',
  'Certificate metadata',
  'Uploaded verification documents',
  'AI analysis results',
]

const chainItems = [
  'Cryptographic proof',
  'Certificate reference / identifier',
  'Issuer reference',
  'Timestamp / status information as required',
]

const whyCards = [
  {
    icon: ShieldCheck,
    title: 'Tamper Evidence',
    desc: 'Recorded proofs cannot be silently modified without detection.',
  },
  {
    icon: Search,
    title: 'Independent Verification',
    desc: "Verification can compare a document's cryptographic proof against the blockchain record.",
  },
  {
    icon: History,
    title: 'Long-Term Trust',
    desc: 'The blockchain acts as an external integrity anchor rather than the primary database.',
  },
]

const stack = ['Polygon PoS', 'Solidity', 'SHA-256', 'ethers.js', 'Smart Contracts']

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

export default function BlockchainPage() {
  return (
    <>
      {/* Hero */}
      <div className="pt-28 pb-10" style={{ background: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-xs font-semibold tracking-widest" style={{ color: 'var(--blue)' }}>
              BLOCKCHAIN TRUST LAYER
            </span>
            <h1
              className="font-extrabold leading-tight tracking-tight mt-3 mb-4"
              style={{ fontSize: 'clamp(30px, 5vw, 54px)', color: 'var(--navy)' }}
            >
              Blockchain Where It Matters.
              <br className="hidden md:block" /> Invisible Where It Doesn't.
            </h1>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--navy)', opacity: 0.55 }}>
              CertifyVault uses blockchain as a tamper-evident integrity layer while keeping sensitive
              certificate information outside the public blockchain.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Architecture visual */}
      <section className="py-14 md:py-16" style={{ background: 'var(--light-blue, #EAF1FF)' }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex flex-col items-center gap-1.5">
            {[
              { icon: FileText, label: 'Certificate' },
              { icon: Hash, label: 'SHA-256' },
            ].map((n, i) => (
              <motion.div
                key={n.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.08 }}
                className="flex flex-col items-center gap-1.5"
              >
                <div
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 bg-white border text-sm font-semibold"
                  style={{ borderColor: 'rgba(0,15,62,0.08)', color: 'var(--navy)' }}
                >
                  <n.icon size={16} color="var(--blue)" />
                  {n.label}
                </div>
                <div className="w-px h-5" style={{ background: 'var(--blue)', opacity: 0.4 }} />
              </motion.div>
            ))}

            <div className="grid grid-cols-2 gap-4 w-full max-w-md">
              {[
                { icon: Cloud, label: 'Secure Storage (R2 / S3)' },
                { icon: Database, label: 'PostgreSQL (Certificate Data)' },
              ].map((n, i) => (
                <motion.div
                  key={n.label}
                  initial={{ opacity: 0, y: 12 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.08 }}
                  className="flex items-center gap-2 rounded-xl px-3 py-3 bg-white border text-xs font-semibold text-center justify-center"
                  style={{ borderColor: 'rgba(0,15,62,0.08)', color: 'var(--navy)' }}
                >
                  <n.icon size={16} color="var(--blue)" className="shrink-0" />
                  {n.label}
                </motion.div>
              ))}
            </div>

            <div className="w-px h-5 mt-2" style={{ background: 'var(--blue)', opacity: 0.4 }} />

            {[
              { icon: FileCode2, label: 'Blockchain Smart Contract' },
              { icon: Network, label: 'Polygon PoS' },
              { icon: Globe, label: 'Public Integrity Proof' },
            ].map((n, i) => (
              <motion.div
                key={n.label}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: 0.16 + i * 0.08 }}
                className="flex flex-col items-center gap-1.5"
              >
                <div
                  className="flex items-center gap-2 rounded-xl px-4 py-2.5 border text-sm font-semibold"
                  style={{
                    background: i === 2 ? 'var(--navy)' : 'white',
                    color: i === 2 ? 'white' : 'var(--navy)',
                    borderColor: 'rgba(0,15,62,0.08)',
                  }}
                >
                  <n.icon size={16} color={i === 2 ? 'white' : 'var(--blue)'} />
                  {n.label}
                </div>
                {i < 2 && <div className="w-px h-5" style={{ background: 'var(--blue)', opacity: 0.4 }} />}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What goes where */}
      <section className="py-14 md:py-16" style={{ background: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-2" style={{ color: 'var(--navy)' }}>
            What Goes Where?
          </h2>
          <p className="text-center text-sm mb-10" style={{ color: 'var(--navy)', opacity: 0.55 }}>
            Sensitive certificate documents and personal information are not stored directly on the
            public blockchain.
          </p>
          <div className="grid md:grid-cols-2 gap-4">
            <Card>
              <h3 className="font-semibold mb-3" style={{ color: 'var(--navy)' }}>
                Stored Privately
              </h3>
              <ul className="space-y-2 text-sm" style={{ color: 'var(--navy)', opacity: 0.75 }}>
                {privateItems.map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <span style={{ color: '#16A34A' }}>✓</span>
                    {t}
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <h3 className="font-semibold mb-3" style={{ color: 'var(--navy)' }}>
                Blockchain
              </h3>
              <ul className="space-y-2 text-sm" style={{ color: 'var(--navy)', opacity: 0.75 }}>
                {chainItems.map((t) => (
                  <li key={t} className="flex items-start gap-2">
                    <span style={{ color: 'var(--blue)' }}>✓</span>
                    {t}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Why blockchain + stack */}
      <section className="py-14 md:py-16" style={{ background: 'var(--light-blue, #EAF1FF)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-8" style={{ color: 'var(--navy)' }}>
            Why Blockchain?
          </h2>
          <div className="grid sm:grid-cols-3 gap-4 mb-12">
            {whyCards.map((c, i) => (
              <motion.div
                key={c.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.08 }}
              >
                <Card className="h-full">
                  <c.icon size={20} color="var(--blue)" className="mb-3" />
                  <h3 className="font-semibold mb-1.5" style={{ color: 'var(--navy)' }}>
                    {c.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--navy)', opacity: 0.6 }}>
                    {c.desc}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <span className="text-xs font-semibold tracking-widest" style={{ color: 'var(--blue)' }}>
              TECHNICAL STACK
            </span>
            <div className="flex flex-wrap justify-center gap-2 mt-4">
              {stack.map((s) => (
                <span
                  key={s}
                  className="text-xs font-semibold px-3 py-1.5 rounded-full bg-white border"
                  style={{ color: 'var(--navy)', borderColor: 'rgba(0,15,62,0.08)' }}
                >
                  {s}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ background: 'var(--bg)' }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-2" style={{ color: 'var(--navy)' }}>
            Trust should be verifiable.
          </h2>
          <p className="mb-6 text-sm" style={{ color: 'var(--navy)', opacity: 0.55 }}>
            Verify. Protect. Trust.
          </p>
          <PrimaryButton>
            Verify a Certificate <ArrowRight size={16} />
          </PrimaryButton>
        </div>
      </section>
    </>
  )
}