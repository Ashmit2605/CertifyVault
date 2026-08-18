import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Info, Database, Settings2, FileText, Share2, Clock,
  Lock, UserCheck, Cookie, Mail, ArrowRight, ShieldCheck,
  CheckCircle2, AlertTriangle, Eye, Trash2, RefreshCw, Globe,
} from 'lucide-react'

/* ─── Sections ────────────────────────────────────────── */
const sections = [
  {
    id: 'overview',
    label: 'Overview',
    icon: Info,
    color: '#0050f5',
    summary: 'What this policy covers',
    content: {
      intro: 'This policy explains how CertifyVault collects, uses, protects, and manages information across its certificate issuance, verification, and reporting platform.',
      highlights: [
        { icon: ShieldCheck, text: 'We never sell your personal data to third parties.' },
        { icon: Lock,        text: 'All data is encrypted in transit and at rest.' },
        { icon: Eye,         text: 'You have full rights to access, correct, or delete your data.' },
        { icon: Globe,       text: 'We operate under applicable data protection regulations.' },
      ],
    },
  },
  {
    id: 'collect',
    label: 'Information We Collect',
    icon: Database,
    color: '#7c3aed',
    summary: 'Data collected during platform use',
    content: {
      intro: 'We collect only the information necessary to operate the platform securely and effectively.',
      items: [
        { label: 'Account Information',    desc: 'Name, email address, password hash, and role.' },
        { label: 'Institution Information',desc: 'Organisation name, logo, and contact details for issuers.' },
        { label: 'Certificate Metadata',   desc: 'Recipient name, credential title, issue date, and template used.' },
        { label: 'Verification Activity',  desc: 'Timestamps, certificate IDs, and verification outcomes.' },
        { label: 'Uploaded Documents',     desc: 'Files submitted for verification, stored in private encrypted storage.' },
        { label: 'Technical & Log Data',   desc: 'IP addresses, browser type, and request logs for security and debugging.' },
      ],
    },
  },
  {
    id: 'use',
    label: 'How We Use Information',
    icon: Settings2,
    color: '#16a34a',
    summary: 'Purposes for which data is processed',
    content: {
      intro: 'Information is used strictly for operating, securing, and improving the CertifyVault platform.',
      items: [
        { label: 'Certificate Issuance',    desc: 'To create, sign, and deliver certificates to recipients.' },
        { label: 'Credential Verification', desc: 'To validate certificate authenticity on demand.' },
        { label: 'Fraud Detection',         desc: 'To identify and flag suspicious verification patterns using AI analysis.' },
        { label: 'Platform Security',       desc: 'To monitor for unauthorised access and protect user accounts.' },
        { label: 'Verification Reports',    desc: 'To generate audit-ready reports for institutions.' },
        { label: 'Platform Improvement',    desc: 'To analyse usage patterns and improve reliability and performance.' },
      ],
    },
  },
  {
    id: 'cert-data',
    label: 'Certificate Data',
    icon: FileText,
    color: '#d97706',
    summary: 'How certificate content is handled',
    content: {
      intro: 'Certificate data — such as recipient name, credential details, and issuer records — is handled with the same security controls as all other platform data.',
      highlights: [
        { icon: Lock,        text: 'Certificate PDFs are stored in private, encrypted object storage.' },
        { icon: ShieldCheck, text: 'Only a cryptographic hash is anchored on the blockchain — never the document itself.' },
        { icon: Eye,         text: 'Access to certificate files is controlled and time-limited.' },
        { icon: FileText,    text: 'Metadata is indexed in a secured relational database.' },
      ],
    },
  },
  {
    id: 'sharing',
    label: 'Data Sharing',
    icon: Share2,
    color: '#0891b2',
    summary: 'Who we share data with and why',
    content: {
      intro: 'CertifyVault does not sell personal information. Data may be processed by trusted infrastructure providers only where necessary to operate the platform.',
      items: [
        { label: 'Infrastructure Providers', desc: 'Cloud hosting, object storage, and database services used to run the platform.' },
        { label: 'Blockchain Networks',       desc: 'Only cryptographic hashes (no personal data) are submitted to the blockchain.' },
        { label: 'AI / ML Services',          desc: 'Anonymised verification patterns are analysed for fraud detection.' },
        { label: 'Legal Obligations',         desc: 'Data may be disclosed if required by law or to protect platform integrity.' },
      ],
      note: 'We never share personal data with advertisers, data brokers, or unrelated third parties.',
    },
  },
  {
    id: 'retention',
    label: 'Data Retention',
    icon: Clock,
    color: '#dc2626',
    summary: 'How long we keep your data',
    content: {
      intro: 'Data is retained only as long as necessary to meet legitimate platform, contractual, security, legal, and institutional requirements.',
      items: [
        { label: 'Account Data',        desc: 'Retained for the duration of your account and a reasonable period after deletion.' },
        { label: 'Certificate Records', desc: 'Retained for the lifetime of the issuing institution\'s contract.' },
        { label: 'Verification Logs',   desc: 'Retained for audit and compliance purposes, typically up to 3 years.' },
        { label: 'Uploaded Documents',  desc: 'Retained only as long as required for the verification process.' },
        { label: 'Technical Logs',      desc: 'Retained for up to 90 days for security monitoring.' },
      ],
    },
  },
  {
    id: 'security',
    label: 'Security',
    icon: Lock,
    color: '#0050f5',
    summary: 'Technical and organisational safeguards',
    content: {
      intro: 'CertifyVault applies multiple layers of security to protect your data at every stage.',
      items: [
        { label: 'Encryption in Transit', desc: 'All data is transmitted over TLS/HTTPS.' },
        { label: 'Encryption at Rest',    desc: 'Stored data and files are encrypted using AES-256.' },
        { label: 'Access Control',        desc: 'Role-based permissions restrict data access to authorised users only.' },
        { label: 'Authentication',        desc: 'JWT-based authentication with secure session management.' },
        { label: 'Audit Logging',         desc: 'All sensitive actions are logged for accountability and review.' },
        { label: 'File Validation',       desc: 'Uploaded files are validated for type, size, and content before processing.' },
        { label: 'Controlled Access',     desc: 'Document access uses time-limited signed URLs, not permanent public links.' },
      ],
    },
  },
  {
    id: 'rights',
    label: 'Your Rights',
    icon: UserCheck,
    color: '#16a34a',
    summary: 'What you can request regarding your data',
    content: {
      intro: 'You have rights over your personal data. Contact our support team to exercise any of the following.',
      highlights: [
        { icon: Eye,         text: 'Access — Request a copy of the personal data we hold about you.' },
        { icon: RefreshCw,   text: 'Correction — Ask us to correct inaccurate or incomplete data.' },
        { icon: Trash2,      text: 'Deletion — Request deletion of your personal data where applicable.' },
        { icon: AlertTriangle, text: 'Objection — Object to certain types of processing of your data.' },
      ],
    },
  },
  {
    id: 'cookies',
    label: 'Cookies',
    icon: Cookie,
    color: '#d97706',
    summary: 'How we use cookies and tracking',
    content: {
      intro: 'CertifyVault uses a minimal set of cookies to operate the platform securely and understand usage.',
      items: [
        { label: 'Essential Cookies',  desc: 'Required for authentication, session management, and platform security.' },
        { label: 'Analytics Cookies',  desc: 'Limited, anonymised analytics to understand how the platform is used and improve reliability.' },
        { label: 'No Ad Tracking',     desc: 'We do not use advertising cookies or cross-site tracking technologies.' },
      ],
      note: 'You can manage cookie preferences through your browser settings. Disabling essential cookies may affect platform functionality.',
    },
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: Mail,
    color: '#0891b2',
    summary: 'How to reach us about privacy',
    content: {
      intro: 'If you have questions about this policy, your data, or wish to exercise your rights, please reach out to our team.',
      highlights: [
        { icon: Mail,  text: 'Email: hello@certifyvault.in' },
        { icon: Globe, text: 'Website: certifyvault.in' },
        { icon: Clock, text: 'Response time: within 5 business days' },
        { icon: ShieldCheck, text: 'All requests are handled confidentially.' },
      ],
    },
  },
]

/* ─── Helpers ─────────────────────────────────────────── */
function HighlightItem({ icon: Icon, text, color }: { icon: React.ElementType; text: string; color: string }) {
  return (
    <div className="flex items-start gap-3 rounded-xl p-3.5" style={{ background: `${color}0d`, border: `1px solid ${color}22` }}>
      <div className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0" style={{ background: `${color}18` }}>
        <Icon size={14} color={color} />
      </div>
      <p className="text-sm leading-relaxed" style={{ color: 'var(--navy)', opacity: 0.8 }}>{text}</p>
    </div>
  )
}

function DataItem({ label, desc }: { label: string; desc: string }) {
  return (
    <div className="flex items-start gap-3 py-3" style={{ borderBottom: '1px solid rgba(0,15,62,0.06)' }}>
      <CheckCircle2 size={15} color="var(--blue)" className="mt-0.5 shrink-0" />
      <div>
        <span className="text-sm font-semibold" style={{ color: 'var(--navy)' }}>{label}</span>
        <p className="text-xs mt-0.5 leading-relaxed" style={{ color: 'var(--navy)', opacity: 0.6 }}>{desc}</p>
      </div>
    </div>
  )
}

/* ─── Page ────────────────────────────────────────────── */
export default function PrivacyPolicyPage() {
  const [active, setActive] = useState(sections[0].id)
  const activeSection = sections.find((s) => s.id === active)!

  const scrollToContent = (id: string) => {
    setActive(id)
    document.getElementById('policy-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }

  return (
    <div style={{ background: 'var(--bg)' }}>

      {/* ── Hero ── */}
      <div className="pt-28 pb-14" style={{ background: 'linear-gradient(135deg, var(--navy) 0%, #002a7a 100%)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <div className="flex items-center gap-2 mb-4">
              <Lock size={16} color="#99bcff" />
              <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: '#99bcff' }}>Legal</span>
            </div>
            <h1 className="font-extrabold leading-tight tracking-tight mb-4 text-white" style={{ fontSize: 'clamp(30px, 5vw, 52px)' }}>
              Privacy Policy
            </h1>
            <p className="text-base max-w-xl mb-8" style={{ color: 'rgba(255,255,255,0.65)' }}>
              How CertifyVault collects, uses, protects, and manages your information across the
              certificate issuance and verification platform.
            </p>
            <div className="flex flex-wrap items-center gap-3">
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Clock size={12} /> Last Updated: August 2026
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                <ShieldCheck size={12} /> GDPR Aligned
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-full" style={{ background: 'rgba(255,255,255,0.12)', color: 'white', border: '1px solid rgba(255,255,255,0.2)' }}>
                <Globe size={12} /> {sections.length} Sections
              </span>
            </div>
          </motion.div>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="max-w-6xl mx-auto px-6 py-14 flex gap-10 items-start">

        {/* Sticky sidebar */}
        <aside className="hidden lg:block w-56 shrink-0 sticky top-24">
          <p className="text-xs font-bold tracking-widest uppercase mb-4" style={{ color: 'var(--navy)', opacity: 0.4 }}>Sections</p>
          <nav className="flex flex-col gap-1">
            {sections.map(({ id, icon: Icon, label, color }) => {
              const isActive = active === id
              return (
                <button
                  key={id}
                  onClick={() => scrollToContent(id)}
                  className="flex items-center gap-2.5 text-sm font-medium px-3 py-2 rounded-lg text-left transition-all"
                  style={{
                    background: isActive ? `${color}12` : 'transparent',
                    color: isActive ? color : 'var(--navy)',
                    opacity: isActive ? 1 : 0.6,
                  }}
                >
                  <Icon size={14} />
                  {label}
                </button>
              )
            })}
          </nav>

          <div className="mt-8 rounded-xl p-4" style={{ background: 'var(--light-blue)' }}>
            <p className="text-xs font-semibold mb-1" style={{ color: 'var(--navy)' }}>Questions?</p>
            <p className="text-xs mb-3" style={{ color: 'var(--navy)', opacity: 0.6 }}>Reach out to our privacy team at any time.</p>
            <a href="mailto:hello@certifyvault.in" className="text-xs font-semibold" style={{ color: 'var(--blue)' }}>
              hello@certifyvault.in →
            </a>
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 min-w-0" id="policy-content">

          {/* Mobile section tabs */}
          <div className="flex lg:hidden gap-1 overflow-x-auto pb-4 mb-6">
            {sections.map(({ id, icon: Icon, label }) => {
              const isActive = active === id
              return (
                <button
                  key={id}
                  onClick={() => setActive(id)}
                  className="flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-full whitespace-nowrap shrink-0 transition-all"
                  style={{
                    background: isActive ? 'var(--light-blue)' : 'var(--bg-2)',
                    color: isActive ? 'var(--blue)' : 'var(--navy)',
                    border: '1px solid rgba(0,15,62,0.08)',
                  }}
                >
                  <Icon size={12} /> {label}
                </button>
              )
            })}
          </div>

          {/* Section counter */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--navy)', opacity: 0.35 }}>
                Section {sections.findIndex(s => s.id === active) + 1} of {sections.length}
              </span>
            </div>
            <div className="flex gap-1">
              {sections.map(s => (
                <button
                  key={s.id}
                  onClick={() => scrollToContent(s.id)}
                  className="w-1.5 h-1.5 rounded-full transition-all"
                  style={{ background: active === s.id ? 'var(--blue)' : 'rgba(0,15,62,0.15)' }}
                />
              ))}
            </div>
          </div>

          {/* Animated content panel */}
          <AnimatePresence mode="wait">
            <motion.div
              key={active}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.25 }}
            >
              {(() => {
                const s = activeSection
                const Icon = s.icon
                const c = s.content as any
                return (
                  <div className="rounded-2xl border overflow-hidden" style={{ borderColor: 'rgba(0,15,62,0.08)', minHeight: '100%' }}>

                    {/* Section header */}
                    <div className="px-6 py-5 flex items-start gap-4" style={{ background: `${s.color}08`, borderBottom: '1px solid rgba(0,15,62,0.07)' }}>
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center shrink-0" style={{ background: `${s.color}18` }}>
                        <Icon size={20} color={s.color} />
                      </div>
                      <div>
                        <h2 className="text-xl font-bold" style={{ color: 'var(--navy)' }}>{s.label}</h2>
                        <p className="text-xs mt-0.5" style={{ color: 'var(--navy)', opacity: 0.5 }}>{s.summary}</p>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="px-6 py-6 bg-white space-y-5">
                      <p className="text-sm leading-relaxed" style={{ color: 'var(--navy)', opacity: 0.7 }}>{c.intro}</p>

                      {/* Highlight cards */}
                      {c.highlights && (
                        <div className="grid sm:grid-cols-2 gap-3">
                          {c.highlights.map((h: any, i: number) => (
                            <HighlightItem key={i} icon={h.icon} text={h.text} color={s.color} />
                          ))}
                        </div>
                      )}

                      {/* Data items list */}
                      {c.items && (
                        <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'rgba(0,15,62,0.08)' }}>
                          <div className="px-4 py-2.5" style={{ background: 'var(--bg-2)', borderBottom: '1px solid rgba(0,15,62,0.07)' }}>
                            <span className="text-xs font-bold tracking-widest uppercase" style={{ color: 'var(--navy)', opacity: 0.4 }}>Details</span>
                          </div>
                          <div className="px-4 divide-y" style={{ borderColor: 'rgba(0,15,62,0.06)' }}>
                            {c.items.map((item: any, i: number) => (
                              <DataItem key={i} label={item.label} desc={item.desc} />
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Note callout */}
                      {c.note && (
                        <div className="flex items-start gap-3 rounded-xl p-4" style={{ background: '#fef3c7', border: '1px solid #fde68a' }}>
                          <AlertTriangle size={15} color="#d97706" className="mt-0.5 shrink-0" />
                          <p className="text-xs leading-relaxed" style={{ color: '#92400e' }}>{c.note}</p>
                        </div>
                      )}
                    </div>

                    {/* Footer nav */}
                    <div className="px-6 py-4 flex items-center justify-between" style={{ background: 'var(--bg-2)', borderTop: '1px solid rgba(0,15,62,0.07)' }}>
                      {(() => {
                        const idx = sections.findIndex(s => s.id === active)
                        const prev = sections[idx - 1]
                        const next = sections[idx + 1]
                        return (
                          <>
                            {prev
                              ? <button onClick={() => scrollToContent(prev.id)} className="text-xs font-semibold flex items-center gap-1.5 transition-opacity hover:opacity-70" style={{ color: 'var(--navy)', opacity: 0.5 }}>
                                  ← {prev.label}
                                </button>
                              : <span />
                            }
                            {next
                              ? <button onClick={() => scrollToContent(next.id)} className="text-xs font-semibold flex items-center gap-1.5 transition-opacity hover:opacity-80" style={{ color: 'var(--blue)' }}>
                                  {next.label} →
                                </button>
                              : <span />
                            }
                          </>
                        )
                      })()}
                    </div>
                  </div>
                )
              })()}
            </motion.div>
          </AnimatePresence>

          {/* CTA */}
          <div className="mt-8 rounded-2xl p-8 text-center" style={{ background: 'linear-gradient(135deg, var(--navy) 0%, #002a7a 100%)' }}>
            <h2 className="text-xl font-bold mb-2 text-white">Questions about your data?</h2>
            <p className="text-sm mb-6" style={{ color: 'rgba(255,255,255,0.6)' }}>
              Our team is happy to help with any privacy-related requests or concerns.
            </p>
            <Link to="/contact">
              <button
                className="inline-flex items-center gap-2 rounded-full px-6 py-3 font-semibold text-white transition-opacity hover:opacity-90"
                style={{ background: 'var(--blue)' }}
              >
                Contact Us <ArrowRight size={16} />
              </button>
            </Link>
          </div>

        </main>
      </div>
    </div>
  )
}
