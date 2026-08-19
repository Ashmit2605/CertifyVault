import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  Rocket, Network, RefreshCw, ShieldCheck, Code2, Lock,
  FileSignature, FileOutput, Hash, Archive, Link2, QrCode,
  User, Eye, CheckCircle2, ArrowRight, ChevronRight,
  Terminal, Globe, Database, Cpu, AlertTriangle, BookOpen,
  Zap, Shield, Key, GitBranch,
} from 'lucide-react'

/* ─── Nav ─────────────────────────────────────────────── */
const navSections = [
  { id: 'quickstart',  icon: Rocket,      label: 'Quick Start' },
  { id: 'architecture',icon: Network,     label: 'Architecture' },
  { id: 'lifecycle',   icon: RefreshCw,   label: 'Certificate Lifecycle' },
  { id: 'verification',icon: ShieldCheck, label: 'Verification' },
  { id: 'api',         icon: Code2,       label: 'API Reference' },
  { id: 'security',    icon: Lock,        label: 'Security' },
]

/* ─── Quick-start flow ────────────────────────────────── */
const quickStart = [
  { icon: User,          label: 'Issuer',          desc: 'Institution registers and configures their profile.' },
  { icon: FileSignature, label: 'Issue Certificate',desc: 'Fill in recipient details and certificate metadata.' },
  { icon: FileOutput,    label: 'Generate PDF',     desc: 'A tamper-evident PDF is rendered from the template.' },
  { icon: Hash,          label: 'SHA-256 Hash',     desc: 'A cryptographic fingerprint of the document is created.' },
  { icon: Archive,       label: 'Secure Storage',   desc: 'PDF and metadata are stored in encrypted object storage.' },
  { icon: Link2,         label: 'Blockchain Proof', desc: 'The hash is anchored on-chain for immutable proof.' },
  { icon: QrCode,        label: 'QR Generated',     desc: 'A unique QR code linking to the verification page is embedded.' },
  { icon: User,          label: 'Holder',           desc: 'Recipient receives and manages their certificate.' },
  { icon: Eye,           label: 'Verifier',         desc: 'Third party scans QR or enters certificate ID.' },
  { icon: CheckCircle2,  label: 'Verified ✓',       desc: 'Result returned with full integrity and blockchain proof.' },
]

/* ─── Lifecycle ───────────────────────────────────────── */
const lifecycle = [
  {
    n: '01', title: 'Issue', icon: FileSignature, color: '#0050f5',
    desc: 'The institution creates the certificate through the issuer dashboard, selecting a template and filling in recipient details.',
    details: ['Template selection', 'Recipient metadata', 'Digital signature applied', 'PDF rendered'],
  },
  {
    n: '02', title: 'Protect', icon: Shield, color: '#16a34a',
    desc: 'The certificate is stored securely and its integrity fingerprint is generated using SHA-256 hashing.',
    details: ['AES-256 encrypted storage', 'SHA-256 fingerprint', 'Metadata indexed', 'Audit log created'],
  },
  {
    n: '03', title: 'Anchor', icon: Link2, color: '#d97706',
    desc: 'The integrity proof is recorded on the blockchain, creating an immutable and publicly verifiable record.',
    details: ['Hash submitted to chain', 'Transaction ID stored', 'Block confirmation', 'Timestamp recorded'],
  },
  {
    n: '04', title: 'Verify', icon: CheckCircle2, color: '#7c3aed',
    desc: 'A verifier validates via QR, certificate data, cryptographic integrity check, and blockchain proof lookup.',
    details: ['QR / ID lookup', 'Hash recomputed', 'Blockchain proof checked', 'AI fraud analysis'],
  },
]

/* ─── Architecture layers ─────────────────────────────── */
const archLayers = [
  { icon: Globe,    label: 'Frontend',              sub: 'React + TypeScript — Issuer, Holder & Verifier dashboards' },
  { icon: Terminal, label: 'Node.js / Express API', sub: 'REST endpoints, JWT auth, business logic' },
  { icon: Database, label: 'PostgreSQL',            sub: 'Relational data — users, certificates, audit logs' },
  { icon: Archive,  label: 'Object Storage',        sub: 'Encrypted PDF & asset storage' },
  { icon: Cpu,      label: 'Python AI Service',     sub: 'Fraud detection & anomaly scoring' },
  { icon: GitBranch,label: 'Blockchain Service',    sub: 'On-chain hash anchoring & proof retrieval' },
]

/* ─── API endpoints ───────────────────────────────────── */
const apiEndpoints = [
  { method: 'POST', path: '/api/certificates/issue',        desc: 'Issue a new certificate',              auth: true },
  { method: 'GET',  path: '/api/certificates/:id',          desc: 'Retrieve certificate by ID',           auth: false },
  { method: 'GET',  path: '/api/verify/:id',                desc: 'Verify certificate integrity',         auth: false },
  { method: 'POST', path: '/api/certificates/:id/revoke',   desc: 'Revoke an issued certificate',         auth: true },
  { method: 'GET',  path: '/api/certificates/:id/blockchain',desc: 'Get blockchain proof for certificate', auth: false },
  { method: 'GET',  path: '/api/holders/:id/certificates',  desc: 'List all certificates for a holder',   auth: true },
]

const methodColor: Record<string, string> = {
  GET:  '#16a34a',
  POST: '#0050f5',
  PUT:  '#d97706',
  DELETE: '#dc2626',
}

/* ─── Security features ───────────────────────────────── */
const securityFeatures = [
  { icon: Key,          title: 'JWT Authentication',    desc: 'All protected endpoints require a signed JWT token with role-based claims.' },
  { icon: Lock,         title: 'AES-256 Encryption',    desc: 'Certificate PDFs and sensitive metadata are encrypted at rest.' },
  { icon: Hash,         title: 'SHA-256 Integrity',     desc: 'Every certificate has a cryptographic fingerprint that detects any tampering.' },
  { icon: GitBranch,    title: 'Blockchain Anchoring',  desc: 'Hashes are anchored on-chain, making forgery mathematically infeasible.' },
  { icon: AlertTriangle,title: 'AI Fraud Detection',    desc: 'A Python ML service scores each verification for anomalous patterns.' },
  { icon: Zap,          title: 'Rate Limiting',         desc: 'API endpoints are rate-limited to prevent abuse and brute-force attacks.' },
]

/* ─── Helpers ─────────────────────────────────────────── */
function SectionHeading({ id, icon: Icon, label, sub }: { id: string; icon: React.ElementType; label: string; sub?: string }) {
  return (
    <div id={id} className="mb-8 scroll-mt-24">
      <div className="flex items-center gap-3 mb-2">
        <span className="w-9 h-9 rounded-xl flex items-center justify-center" style={{ background: 'var(--light-blue)' }}>
          <Icon size={18} color="var(--blue)" />
        </span>
        <h2 className="text-2xl font-bold" style={{ color: 'var(--navy)' }}>{label}</h2>
      </div>
      {sub && <p className="text-sm ml-12" style={{ color: 'var(--navy)', opacity: 0.55 }}>{sub}</p>}
      <div className="mt-4 h-px" style={{ background: 'rgba(0,15,62,0.07)' }} />
    </div>
  )
}

function CodeBlock({ code }: { code: string }) {
  return (
    <pre
      className="rounded-xl text-sm leading-relaxed overflow-x-auto p-4 mt-3"
      style={{ background: '#0d1117', color: '#c9d1d9', fontFamily: 'monospace' }}
    >
      <code>{code}</code>
    </pre>
  )
}

/* ─── Page ────────────────────────────────────────────── */
export default function DocumentationPage() {
  const [activeSection, setActiveSection] = useState('quickstart')

  const scrollTo = (id: string) => {
    setActiveSection(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div style={{ background: 'var(--bg)' }}>

      {/* ── Hero ── */}
      <div className="pt-28 pb-14" style={{ background: 'linear-gradient(135deg, var(--navy) 0%, #002a7a 100%)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-2 mb-4">
              <BookOpen size={18} color="#99bcff" />
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#99bcff' }}>Documentation</span>
            </div>
            <h1 className="font-extrabold leading-tight tracking-tight mb-4 text-white" style={{ fontSize: 'clamp(30px, 5vw, 52px)' }}>
              CertifyVault<br />Developer Docs
            </h1>
            <p className="text-base max-w-xl mb-8" style={{ color: 'rgba(255,255,255,0.65)' }}>
              Everything you need to understand, integrate, and build on the CertifyVault platform —
              from certificate issuance to blockchain-backed verification.
            </p>
            <div className="flex flex-wrap gap-2">
              {navSections.map(({ id, icon: Icon, label }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full transition-all hover:opacity-80"
                  style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}
                >
                  <Icon size={12} /> {label}
                </button>
              ))}
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Body: sidebar + content ── */}
      <div className="max-w-6xl mx-auto px-6 py-14 flex gap-10 items-start">

        {/* Sticky sidebar */}
        <aside className="hidden lg:block w-52 shrink-0 sticky top-24">
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--navy)', opacity: 0.4 }}>On this page</p>
          <nav className="flex flex-col gap-1">
            {navSections.map(({ id, icon: Icon, label }) => {
              const active = activeSection === id
              return (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="flex items-center gap-2.5 text-sm font-medium px-3 py-2 rounded-lg text-left transition-all"
                  style={{
                    background: active ? 'var(--light-blue)' : 'transparent',
                    color: active ? 'var(--blue)' : 'var(--navy)',
                    opacity: active ? 1 : 0.6,
                  }}
                >
                  <Icon size={14} />
                  {label}
                </button>
              )
            })}
          </nav>

          <div className="mt-8 rounded-xl p-4" style={{ background: 'var(--light-blue)' }}>
            <p className="text-xs font-semibold mb-2" style={{ color: 'var(--navy)' }}>Need help?</p>
            <p className="text-xs mb-3" style={{ color: 'var(--navy)', opacity: 0.6 }}>Contact our support team or open an issue.</p>
            <Link to="/contact" className="text-xs font-semibold" style={{ color: 'var(--blue)' }}>
              Contact Support →
            </Link>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0 space-y-16">

          {/* ── Quick Start ── */}
          <section>
            <SectionHeading id="quickstart" icon={Rocket} label="Quick Start" sub="Get up and running with CertifyVault in minutes." />
            <div className="grid sm:grid-cols-2 gap-4 mb-8">
              {quickStart.map((step, i) => {
                const Icon = step.icon
                return (
                  <motion.div
                    key={step.label + i}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.04 }}
                    className="flex items-start gap-3 rounded-xl p-4 border"
                    style={{ borderColor: 'rgba(0,15,62,0.08)', background: 'var(--bg-2)' }}
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--light-blue)' }}>
                      <Icon size={16} color="var(--blue)" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="text-xs font-bold" style={{ color: 'var(--blue)' }}>Step {i + 1}</span>
                        <span className="text-sm font-semibold" style={{ color: 'var(--navy)' }}>{step.label}</span>
                      </div>
                      <p className="text-xs leading-relaxed" style={{ color: 'var(--navy)', opacity: 0.6 }}>{step.desc}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>

            {/* Flow arrows */}
            <div className="rounded-2xl border p-5" style={{ borderColor: 'rgba(0,15,62,0.08)', background: 'var(--bg-2)' }}>
              <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--navy)', opacity: 0.4 }}>Verification Flow</p>
              <div className="flex flex-wrap items-center gap-1">
                {['Issue', 'Hash', 'Anchor', 'QR Code', 'Scan', 'Verify', 'Result'].map((s, i, arr) => (
                  <span key={s} className="flex items-center gap-1">
                    <span className="text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: 'var(--light-blue)', color: 'var(--blue)' }}>{s}</span>
                    {i < arr.length - 1 && <ChevronRight size={14} style={{ color: 'var(--navy)', opacity: 0.3 }} />}
                  </span>
                ))}
              </div>
            </div>
          </section>

          {/* ── Architecture ── */}
          <section>
            <SectionHeading id="architecture" icon={Network} label="Architecture" sub="How the platform layers communicate end-to-end." />
            <div className="grid sm:grid-cols-2 gap-4 mb-6">
              {archLayers.map((layer, i) => {
                const Icon = layer.icon
                return (
                  <motion.div
                    key={layer.label}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.07 }}
                    className="flex items-start gap-3 rounded-xl border p-4"
                    style={{ borderColor: 'rgba(0,15,62,0.08)', background: 'var(--bg-2)' }}
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0" style={{ background: 'var(--light-blue)' }}>
                      <Icon size={16} color="var(--blue)" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold" style={{ color: 'var(--navy)' }}>{layer.label}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--navy)', opacity: 0.55 }}>{layer.sub}</p>
                    </div>
                  </motion.div>
                )
              })}
            </div>
            <CodeBlock code={`// Simplified request flow
Client → POST /api/verify/:id
  → Express API validates JWT
  → Fetch certificate from PostgreSQL
  → Recompute SHA-256 hash
  → Query Blockchain Service for proof
  → Run AI fraud score (Python)
  → Return { valid, hash, blockchainProof, fraudScore }`} />
          </section>

          {/* ── Lifecycle ── */}
          <section>
            <SectionHeading id="lifecycle" icon={RefreshCw} label="Certificate Lifecycle" sub="From issuance to verification — every stage explained." />
            <div className="grid sm:grid-cols-2 gap-5">
              {lifecycle.map((l, i) => {
                const Icon = l.icon
                return (
                  <motion.div
                    key={l.n}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: i * 0.08 }}
                    className="rounded-2xl border p-5"
                    style={{ borderColor: 'rgba(0,15,62,0.08)', background: 'var(--bg-2)' }}
                  >
                    <div className="flex items-center gap-3 mb-3">
                      <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ background: `${l.color}18` }}>
                        <Icon size={18} color={l.color} />
                      </div>
                      <div>
                        <span className="text-xs font-bold tracking-widest" style={{ color: l.color }}>{l.n}</span>
                        <h3 className="font-bold text-base leading-none mt-0.5" style={{ color: 'var(--navy)' }}>{l.title}</h3>
                      </div>
                    </div>
                    <p className="text-sm leading-relaxed mb-3" style={{ color: 'var(--navy)', opacity: 0.65 }}>{l.desc}</p>
                    <ul className="space-y-1">
                      {l.details.map(d => (
                        <li key={d} className="flex items-center gap-2 text-xs" style={{ color: 'var(--navy)', opacity: 0.7 }}>
                          <CheckCircle2 size={12} color={l.color} />
                          {d}
                        </li>
                      ))}
                    </ul>
                  </motion.div>
                )
              })}
            </div>
          </section>

          {/* ── Verification ── */}
          <section>
            <SectionHeading id="verification" icon={ShieldCheck} label="Verification" sub="Multi-layer verification ensures every certificate is genuine." />
            <div className="grid sm:grid-cols-3 gap-4 mb-6">
              {[
                { label: 'QR Code Scan', desc: 'Scan the embedded QR to instantly open the verification page.', icon: QrCode },
                { label: 'Certificate ID', desc: 'Enter the unique certificate ID manually on the verify page.', icon: Hash },
                { label: 'Blockchain Proof', desc: 'On-chain hash lookup confirms the certificate has not been altered.', icon: Link2 },
              ].map(({ label, desc, icon: Icon }) => (
                <div key={label} className="rounded-xl border p-4" style={{ borderColor: 'rgba(0,15,62,0.08)', background: 'var(--bg-2)' }}>
                  <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: 'var(--light-blue)' }}>
                    <Icon size={16} color="var(--blue)" />
                  </div>
                  <p className="text-sm font-semibold mb-1" style={{ color: 'var(--navy)' }}>{label}</p>
                  <p className="text-xs leading-relaxed" style={{ color: 'var(--navy)', opacity: 0.6 }}>{desc}</p>
                </div>
              ))}
            </div>
            <CodeBlock code={`// Verification response shape
{
  "valid": true,
  "certificateId": "cv_abc123",
  "issuedTo": "Jane Doe",
  "issuedBy": "MIT",
  "issuedAt": "2024-06-01T10:00:00Z",
  "hash": "e3b0c44298fc1c149afb...",
  "blockchainProof": {
    "txHash": "0xabc...",
    "blockNumber": 18204512,
    "confirmedAt": "2024-06-01T10:01:05Z"
  },
  "fraudScore": 0.02,
  "revoked": false
}`} />
          </section>

          {/* ── API Reference ── */}
          <section>
            <SectionHeading id="api" icon={Code2} label="API Reference" sub="Base URL: https://api.certifyvault.io/v1" />
            <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(0,15,62,0.08)' }}>
              <table className="w-full text-sm">
                <thead>
                  <tr style={{ background: 'var(--bg-2)', borderBottom: '1px solid rgba(0,15,62,0.08)' }}>
                    <th className="text-left px-4 py-3 text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--navy)', opacity: 0.5 }}>Method</th>
                    <th className="text-left px-4 py-3 text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--navy)', opacity: 0.5 }}>Endpoint</th>
                    <th className="text-left px-4 py-3 text-xs font-bold tracking-widest uppercase hidden md:table-cell" style={{ color: 'var(--navy)', opacity: 0.5 }}>Description</th>
                    <th className="text-left px-4 py-3 text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--navy)', opacity: 0.5 }}>Auth</th>
                  </tr>
                </thead>
                <tbody>
                  {apiEndpoints.map((ep, i) => (
                    <tr
                      key={ep.path}
                      style={{ borderBottom: i < apiEndpoints.length - 1 ? '1px solid rgba(0,15,62,0.06)' : 'none' }}
                    >
                      <td className="px-4 py-3">
                        <span className="text-xs font-bold px-2 py-1 rounded-md" style={{ background: `${methodColor[ep.method]}18`, color: methodColor[ep.method] }}>
                          {ep.method}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <code className="text-xs" style={{ color: 'var(--navy)', fontFamily: 'monospace' }}>{ep.path}</code>
                      </td>
                      <td className="px-4 py-3 hidden md:table-cell text-xs" style={{ color: 'var(--navy)', opacity: 0.6 }}>{ep.desc}</td>
                      <td className="px-4 py-3">
                        {ep.auth
                          ? <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: '#fef3c7', color: '#d97706' }}>JWT</span>
                          : <span className="text-xs font-semibold px-2 py-0.5 rounded-full" style={{ background: '#dcfce7', color: '#16a34a' }}>Public</span>
                        }
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <CodeBlock code={`// Example: Issue a certificate
POST /api/certificates/issue
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "recipientName": "Jane Doe",
  "recipientEmail": "jane@example.com",
  "courseName": "BSc Computer Science",
  "issueDate": "2024-06-01",
  "templateId": "tpl_xyz"
}`} />
          </section>

          {/* ── Security ── */}
          <section>
            <SectionHeading id="security" icon={Lock} label="Security" sub="CertifyVault is built with security at every layer." />
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {securityFeatures.map((f, i) => {
                const Icon = f.icon
                return (
                  <motion.div
                    key={f.title}
                    initial={{ opacity: 0, y: 12 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: i * 0.06 }}
                    className="rounded-xl border p-4"
                    style={{ borderColor: 'rgba(0,15,62,0.08)', background: 'var(--bg-2)' }}
                  >
                    <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: 'var(--light-blue)' }}>
                      <Icon size={16} color="var(--blue)" />
                    </div>
                    <p className="text-sm font-semibold mb-1" style={{ color: 'var(--navy)' }}>{f.title}</p>
                    <p className="text-xs leading-relaxed" style={{ color: 'var(--navy)', opacity: 0.6 }}>{f.desc}</p>
                  </motion.div>
                )
              })}
            </div>
          </section>

          {/* ── CTA ── */}
          <section className="rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(135deg, var(--navy) 0%, #002a7a 100%)' }}>
            <h2 className="text-2xl font-bold mb-3 text-white">Ready to explore CertifyVault?</h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Start issuing, managing, and verifying certificates on a blockchain-backed platform.
            </p>
            <Link to="/app/login">
              <button
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--blue)' }}
              >
                Get Started <ArrowRight size={16} />
              </button>
            </Link>
          </section>

        </main>
      </div>
    </div>
  )
}
