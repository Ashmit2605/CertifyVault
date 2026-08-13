import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Upload,
  ShieldCheck,
  Cloud,
  ScanText,
  Cpu,
  ScanEye,
  Lock,
  KeyRound,
  Clock,
  FileCheck2,
  Link2,
  ArrowRight,
  Server,
  FileCheck,
} from 'lucide-react'

const protections = [
  { icon: Cloud, title: 'Private Storage', desc: 'Uploaded documents are stored in private object storage rather than publicly accessible URLs.' },
  { icon: Lock, title: 'Encryption', desc: 'Data is protected during transmission and storage using appropriate encryption mechanisms.' },
  { icon: KeyRound, title: 'Access Control', desc: 'Only authorized users and services can access protected documents.' },
  { icon: Clock, title: 'Temporary Access', desc: 'Controlled, time-limited access links are used when a document needs to be retrieved.' },
  { icon: ShieldCheck, title: 'File Security', desc: 'File types, sizes, signatures, and content are validated before processing uploads.' },
  { icon: Link2, title: 'Minimal Blockchain Exposure', desc: 'The certificate itself is never placed on the public blockchain — only cryptographic proof is used.' },
]

const privateData = ['Certificate PDF', 'Student Data', 'Personal Data', 'AI Analysis']
const publicData = ['SHA-256 Hash', 'Certificate Reference', 'Issuer Reference', 'Blockchain Timestamp']

const verifierFlow = ['Verifier', 'Certificate ID / QR', 'Verification Service', 'Trusted Record', 'Proof Validation', 'Verification Result']

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
    <Link to="/contact">
    <button
      className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
      style={{ background: 'var(--blue)' }}
    >
      {children}
    </button>
    </Link>
  )
}

export default function DocumentPrivacyPage() {
  return (
    <>
      {/* Hero */}
      <div className="pt-28 pb-10" style={{ background: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1
              className="font-extrabold leading-tight tracking-tight mb-4"
              style={{ fontSize: 'clamp(30px, 5vw, 54px)', color: 'var(--navy)' }}
            >
              Your Certificate Is Private.
              <br className="hidden md:block" /> Its Proof Can Be Verified.
            </h1>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--navy)', opacity: 0.55 }}>
              CertifyVault separates sensitive documents from public integrity proofs, allowing
              credentials to be verified without exposing the underlying document.
            </p>
          </motion.div>
        </div>
      </div>

      {/* Privacy architecture */}
      <section className="py-14 md:py-16" style={{ background: 'var(--light-blue, #EAF1FF)' }}>
        <div className="max-w-3xl mx-auto px-6">
          <div className="flex flex-col items-center gap-1.5">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 bg-white border text-sm font-semibold"
              style={{ borderColor: 'rgba(0,15,62,0.08)', color: 'var(--navy)' }}
            >
              <Upload size={16} color="var(--blue)" />
              Uploaded Certificate
            </motion.div>
            <div className="w-px h-5" style={{ background: 'var(--blue)', opacity: 0.4 }} />
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.06 }}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 bg-white border text-sm font-semibold"
              style={{ borderColor: 'rgba(0,15,62,0.08)', color: 'var(--navy)' }}
            >
              <ShieldCheck size={16} color="var(--blue)" />
              Security Checks
            </motion.div>
            <div className="w-px h-5" style={{ background: 'var(--blue)', opacity: 0.4 }} />

            <div className="grid grid-cols-2 gap-6 w-full max-w-lg">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.12 }}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 border text-xs font-semibold"
                  style={{ background: 'var(--navy)', color: 'white', borderColor: 'rgba(0,15,62,0.08)' }}
                >
                  <Server size={15} />
                  Private Storage (R2 / S3)
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.18 }}
                className="flex flex-col items-center gap-2"
              >
                <div
                  className="flex items-center gap-2 rounded-xl px-3 py-2.5 border text-xs font-semibold bg-white"
                  style={{ color: 'var(--navy)', borderColor: 'rgba(0,15,62,0.08)' }}
                >
                  <Cpu size={15} color="var(--blue)" />
                  Verification Engine
                </div>
                <div className="flex gap-2">
                  {[ScanText, Cpu, ScanEye].map((Icon, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full flex items-center justify-center bg-white border"
                      style={{ borderColor: 'var(--blue)' }}
                    >
                      <Icon size={13} color="var(--blue)" />
                    </div>
                  ))}
                </div>
              </motion.div>
            </div>

            <div className="w-px h-5" style={{ background: 'var(--blue)', opacity: 0.4 }} />
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.24 }}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 bg-white border text-sm font-semibold"
              style={{ borderColor: 'rgba(0,15,62,0.08)', color: 'var(--navy)' }}
            >
              <Lock size={16} color="var(--blue)" />
              Controlled Access
            </motion.div>
            <div className="w-px h-5" style={{ background: 'var(--blue)', opacity: 0.4 }} />
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold"
              style={{ background: 'var(--navy)', color: 'white' }}
            >
              <FileCheck2 size={16} />
              Authorized Result
            </motion.div>
          </div>
        </div>
      </section>

      {/* Protections grid */}
      <section className="py-14 md:py-16" style={{ background: 'var(--bg)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-10" style={{ color: 'var(--navy)' }}>
            How Documents Are Protected
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {protections.map((p, i) => (
              <motion.div
                key={p.title}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.05 }}
              >
                <Card className="h-full">
                  <p.icon size={20} color="var(--blue)" className="mb-3" />
                  <h3 className="font-semibold mb-1.5" style={{ color: 'var(--navy)' }}>
                    {p.title}
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--navy)', opacity: 0.6 }}>
                    {p.desc}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Data separation */}
      <section className="py-14 md:py-16" style={{ background: 'var(--light-blue, #EAF1FF)' }}>
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-2xl font-bold text-center mb-2" style={{ color: 'var(--navy)' }}>
            Private data stays private. Integrity remains verifiable.
          </h2>
          <div className="grid md:grid-cols-2 gap-4 mt-8">
            <Card>
              <h3 className="font-semibold mb-3" style={{ color: 'var(--navy)' }}>
                Private
              </h3>
              <ul className="space-y-2 text-sm" style={{ color: 'var(--navy)', opacity: 0.75 }}>
                {privateData.map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <Lock size={13} style={{ color: 'var(--navy)', opacity: 0.5 }} />
                    {t}
                  </li>
                ))}
              </ul>
            </Card>
            <Card>
              <h3 className="font-semibold mb-3" style={{ color: 'var(--navy)' }}>
                Public Proof
              </h3>
              <ul className="space-y-2 text-sm" style={{ color: 'var(--navy)', opacity: 0.75 }}>
                {publicData.map((t) => (
                  <li key={t} className="flex items-center gap-2">
                    <FileCheck size={13} color="var(--blue)" />
                    {t}
                  </li>
                ))}
              </ul>
            </Card>
          </div>
        </div>
      </section>

      {/* Verification without exposure */}
      <section className="py-14 md:py-16" style={{ background: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-2xl font-bold mb-3" style={{ color: 'var(--navy)' }}>
            Verification Without Exposure
          </h2>
          <p className="text-sm max-w-2xl mx-auto mb-10" style={{ color: 'var(--navy)', opacity: 0.6 }}>
            A verifier doesn't need access to an institution's entire database or a student's private
            records. CertifyVault exposes only what's necessary to establish verification status.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {verifierFlow.map((step, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.05 }}
                className="flex items-center gap-2"
              >
                <span
                  className="text-xs font-semibold px-3 py-2 rounded-full bg-white border"
                  style={{ color: 'var(--navy)', borderColor: 'rgba(0,15,62,0.08)' }}
                >
                  {step}
                </span>
                {i < verifierFlow.length - 1 && (
                  <ArrowRight size={14} style={{ color: 'var(--navy)', opacity: 0.3 }} />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16" style={{ background: 'var(--light-blue, #EAF1FF)' }}>
        <div className="max-w-3xl mx-auto px-6 text-center">
          <h2 className="text-2xl md:text-3xl font-bold mb-6" style={{ color: 'var(--navy)' }}>
            Questions about your data?
          </h2>
          <PrimaryButton>
            Contact Us <ArrowRight size={16} />
          </PrimaryButton>
        </div>
      </section>
    </>
  )
}