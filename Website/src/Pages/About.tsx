import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import {
  Shield, Target, Users, Zap, Lock, Brain,
  GitBranch, CheckCircle2, ArrowRight, Globe,
  Building2, GraduationCap, Briefcase, Eye,
  FileCheck2, Heart, Lightbulb,
} from 'lucide-react'
import CTASection from '../Components/sections/CTASection'

/* ─── Data ────────────────────────────────────────────── */
const stats = [
  { value: '100%', label: 'Tamper-proof certificates' },
  { value: '3',    label: 'User roles supported' },
  { value: '< 2s', label: 'Average verification time' },
  { value: '0',    label: 'Certificates sold or shared' },
]

const pillars = [
  {
    icon: Target, color: '#0050f5',
    title: 'Our Mission',
    desc: 'Make every academic credential instantly verifiable and impossible to forge — for institutions, graduates, and employers worldwide.',
    points: [
      'Eliminate credential fraud at the source',
      'Give graduates ownership of their achievements',
      'Give employers instant, trustworthy verification',
    ],
  },
  {
    icon: Lightbulb, color: '#7c3aed',
    title: 'Our Vision',
    desc: 'A world where a credential\'s authenticity is never in doubt — where trust in qualifications is universal, instant, and free from gatekeepers.',
    points: [
      'Global interoperability of credentials',
      'Decentralised proof, no single point of failure',
      'Open verification accessible to anyone',
    ],
  },
  {
    icon: Heart, color: '#dc2626',
    title: 'Our Values',
    desc: 'We build with integrity, transparency, and a deep respect for the privacy of every person whose credentials pass through our platform.',
    points: [
      'Privacy by design — not an afterthought',
      'Security at every layer of the stack',
      'Simplicity for users, rigour under the hood',
    ],
  },
]

const whoWeServe = [
  {
    icon: Building2, color: '#0050f5',
    role: 'Institutions & Issuers',
    desc: 'Universities, colleges, and training providers that need a reliable, auditable way to issue and manage credentials at scale.',
    features: ['Bulk certificate issuance', 'Custom templates & branding', 'Revocation management', 'Audit logs & reports'],
  },
  {
    icon: GraduationCap, color: '#7c3aed',
    role: 'Graduates & Holders',
    desc: 'Students and professionals who want to own, share, and prove their credentials without depending on their institution\'s availability.',
    features: ['Lifetime certificate access', 'One-click sharing', 'QR code for instant proof', 'Privacy controls'],
  },
  {
    icon: Briefcase, color: '#16a34a',
    role: 'Employers & Verifiers',
    desc: 'Hiring teams, background check services, and any organisation that needs to confirm a credential is genuine in seconds.',
    features: ['Instant QR verification', 'No account required', 'Blockchain proof lookup', 'Fraud risk scoring'],
  },
]

const differentiators = [
  { icon: GitBranch, title: 'Blockchain Anchoring',   desc: 'Every certificate hash is anchored on-chain, creating an immutable public record that cannot be altered or deleted.' },
  { icon: Brain,     title: 'AI Fraud Detection',     desc: 'A dedicated Python ML service analyses verification patterns in real time to flag anomalous or suspicious activity.' },
  { icon: Lock,      title: 'Privacy-First Storage',  desc: 'Certificate PDFs live in private encrypted storage. Only a cryptographic hash ever touches the public blockchain.' },
  { icon: Zap,       title: 'Sub-2s Verification',    desc: 'The entire verification pipeline — hash recomputation, blockchain lookup, and fraud scoring — completes in under 2 seconds.' },
  { icon: Eye,       title: 'Zero-Knowledge Sharing', desc: 'Verifiers confirm authenticity without accessing the underlying document or any personal data beyond what\'s necessary.' },
  { icon: FileCheck2,title: 'End-to-End Audit Trail', desc: 'Every issuance, access, and verification event is logged, giving institutions a complete, tamper-evident audit history.' },
]

const problems = [
  { pain: 'Forged certificates are undetectable by eye',         fix: 'Every certificate has a SHA-256 hash anchored on-chain — any alteration is instantly detectable.' },
  { pain: 'Verification requires contacting the institution',    fix: 'Anyone can verify a credential in under 2 seconds via QR code or certificate ID — no calls, no emails.' },
  { pain: 'Institutions have no visibility into who is verifying', fix: 'Every verification event is logged with a full audit trail accessible to the issuing institution.' },
  { pain: 'Graduates lose access to credentials after graduation', fix: 'Holders own their certificates for life and can share them at any time, independent of the institution.' },
  { pain: 'No way to flag or revoke a fraudulent certificate',   fix: 'Issuers can revoke any certificate instantly; revocation is reflected in all future verification results.' },
  { pain: 'AI-assisted fraud goes undetected by manual checks',  fix: 'A dedicated ML service scores every verification for anomalous patterns in real time.' },
]

/* ─── Helpers ─────────────────────────────────────────── */
function StatCard({ value, label }: { value: string; label: string }) {
  return (
    <div className="text-center rounded-2xl border p-6" style={{ borderColor: 'rgba(255,255,255,0.15)', background: 'rgba(255,255,255,0.07)' }}>
      <p className="font-extrabold text-3xl text-white mb-1">{value}</p>
      <p className="text-xs font-medium" style={{ color: 'rgba(255,255,255,0.6)' }}>{label}</p>
    </div>
  )
}

/* ─── Page ────────────────────────────────────────────── */
export default function AboutPage() {
  return (
    <div style={{ background: 'var(--bg)' }}>

      {/* ── Hero ── */}
      <div className="pt-28 pb-16" style={{ background: 'linear-gradient(135deg, var(--navy) 0%, #002a7a 100%)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-2 mb-4">
              <Users size={16} color="#99bcff" />
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#99bcff' }}>About Us</span>
            </div>
            <h1 className="font-extrabold leading-tight tracking-tight mb-5 text-white" style={{ fontSize: 'clamp(30px, 5vw, 54px)' }}>
              Trust Infrastructure for<br className="hidden md:block" /> Academic Credentials
            </h1>
            <p className="text-base max-w-2xl mb-10" style={{ color: 'rgba(255,255,255,0.65)' }}>
              CertifyVault was built to solve a fundamental problem: academic credentials are easy to forge
              and hard to verify. We're building the trust layer that makes every credential verifiable,
              every achievement provable.
            </p>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              {stats.map((s) => <StatCard key={s.label} {...s} />)}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Mission / Vision / Values ── */}
      <section className="py-16" style={{ background: 'var(--bg)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: 'var(--blue)' }}>Why We Exist</p>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--navy)' }}>Mission, Vision & Values</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {pillars.map((p, i) => {
              const Icon = p.icon
              return (
                <motion.div
                  key={p.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="rounded-2xl border overflow-hidden"
                  style={{ borderColor: 'rgba(0,15,62,0.08)' }}
                >
                  <div className="px-5 py-4 flex items-center gap-3" style={{ background: `${p.color}08`, borderBottom: '1px solid rgba(0,15,62,0.07)' }}>
                    <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${p.color}18` }}>
                      <Icon size={17} color={p.color} />
                    </div>
                    <h3 className="font-bold text-base" style={{ color: 'var(--navy)' }}>{p.title}</h3>
                  </div>
                  <div className="px-5 py-5 bg-white space-y-4">
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--navy)', opacity: 0.65 }}>{p.desc}</p>
                    <ul className="space-y-2">
                      {p.points.map(pt => (
                        <li key={pt} className="flex items-start gap-2 text-xs" style={{ color: 'var(--navy)', opacity: 0.7 }}>
                          <CheckCircle2 size={13} color={p.color} className="mt-0.5 shrink-0" />
                          {pt}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── Who We Serve ── */}
      <section className="py-16" style={{ background: 'var(--bg-2)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: 'var(--blue)' }}>Our Users</p>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--navy)' }}>Who We Serve</h2>
            <p className="text-sm mt-2 max-w-xl mx-auto" style={{ color: 'var(--navy)', opacity: 0.55 }}>
              CertifyVault is built for every stakeholder in the credential lifecycle.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {whoWeServe.map((w, i) => {
              const Icon = w.icon
              return (
                <motion.div
                  key={w.role}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                  className="rounded-2xl border bg-white overflow-hidden"
                  style={{ borderColor: 'rgba(0,15,62,0.08)' }}
                >
                  <div className="px-5 pt-5 pb-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${w.color}15` }}>
                      <Icon size={18} color={w.color} />
                    </div>
                    <h3 className="font-bold text-base mb-2" style={{ color: 'var(--navy)' }}>{w.role}</h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'var(--navy)', opacity: 0.6 }}>{w.desc}</p>
                  </div>
                  <div className="px-5 pb-5 pt-3" style={{ borderTop: '1px solid rgba(0,15,62,0.06)' }}>
                    <ul className="space-y-1.5">
                      {w.features.map(f => (
                        <li key={f} className="flex items-center gap-2 text-xs font-medium" style={{ color: 'var(--navy)', opacity: 0.7 }}>
                          <div className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: w.color }} />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── What Makes Us Different ── */}
      <section className="py-16" style={{ background: 'var(--bg)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: 'var(--blue)' }}>Our Approach</p>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--navy)' }}>What Makes Us Different</h2>
            <p className="text-sm mt-2 max-w-xl mx-auto" style={{ color: 'var(--navy)', opacity: 0.55 }}>
              We combine multiple layers of technology so no single point of failure can compromise a credential.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {differentiators.map((d, i) => {
              const Icon = d.icon
              return (
                <motion.div
                  key={d.title}
                  initial={{ opacity: 0, y: 16 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.35, delay: i * 0.06 }}
                  className="rounded-xl border p-4 bg-white"
                  style={{ borderColor: 'rgba(0,15,62,0.08)' }}
                >
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: 'var(--light-blue)' }}>
                    <Icon size={16} color="var(--blue)" />
                  </div>
                  <p className="text-sm font-semibold mb-1" style={{ color: 'var(--navy)' }}>{d.title}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--navy)', opacity: 0.6 }}>{d.desc}</p>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── The Problem We Solve ── */}
      <section className="py-16" style={{ background: 'var(--bg-2)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-10">
            <p className="text-xs font-bold tracking-widest uppercase mb-2" style={{ color: 'var(--blue)' }}>The Problem We Solve</p>
            <h2 className="text-2xl font-bold" style={{ color: 'var(--navy)' }}>Credential fraud is a real, unsolved problem</h2>
            <p className="text-sm mt-2 max-w-xl mx-auto" style={{ color: 'var(--navy)', opacity: 0.55 }}>
              Here's what the world looks like without CertifyVault — and what we do about it.
            </p>
          </div>

          {/* Column headers */}
          <div className="grid grid-cols-2 gap-4 mb-3 px-1">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-red-500" />
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: '#dc2626' }}>Without CertifyVault</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ background: 'var(--blue)' }} />
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--blue)' }}>With CertifyVault</span>
            </div>
          </div>

          <div className="space-y-3">
            {problems.map((p, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: i * 0.06 }}
                className="grid grid-cols-2 gap-4"
              >
                {/* Pain */}
                <div className="flex items-start gap-3 rounded-xl border p-4" style={{ background: '#fff5f5', borderColor: '#fecaca' }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: '#fee2e2' }}>
                    <span className="text-xs font-bold" style={{ color: '#dc2626' }}>✕</span>
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: '#7f1d1d' }}>{p.pain}</p>
                </div>
                {/* Fix */}
                <div className="flex items-start gap-3 rounded-xl border p-4" style={{ background: '#f0f6ff', borderColor: '#bfdbfe' }}>
                  <div className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: 'var(--light-blue)' }}>
                    <CheckCircle2 size={12} color="var(--blue)" />
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: 'var(--navy)', opacity: 0.8 }}>{p.fix}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Global reach strip ── */}
      <section className="py-12" style={{ background: 'linear-gradient(135deg, var(--navy) 0%, #002a7a 100%)' }}>
        <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center" style={{ background: 'rgba(255,255,255,0.1)' }}>
              <Globe size={22} color="white" />
            </div>
            <div>
              <p className="font-bold text-white text-lg">Built for global scale</p>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>Credentials verified anywhere, by anyone, instantly.</p>
            </div>
          </div>
          <div className="flex gap-3 shrink-0">
            <Link to="/docs">
              <button className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold transition-opacity hover:opacity-80" style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                Read Docs
              </button>
            </Link>
            <Link to="/app/login">
              <button className="inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold text-white transition-opacity hover:opacity-90" style={{ background: 'var(--blue)' }}>
                Get Started <ArrowRight size={15} />
              </button>
            </Link>
          </div>
        </div>
      </section>

      <CTASection />
    </div>
  )
}
