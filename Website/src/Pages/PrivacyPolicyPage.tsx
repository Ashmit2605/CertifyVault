import { Link } from 'react-router-dom'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  Info,
  Database,
  Settings2,
  FileText,
  Share2,
  Clock,
  Lock,
  UserCheck,
  Cookie,
  Mail,
  ArrowRight,
} from 'lucide-react'

const sections = [
  {
    id: 'overview',
    label: 'Overview',
    icon: Info,
    body: (
      <p>
        This policy explains how CertifyVault collects, uses, protects, and manages information across
        its certificate issuance, verification, and reporting platform.
      </p>
    ),
  },
  {
    id: 'collect',
    label: 'Information We Collect',
    icon: Database,
    body: (
      <ul className="list-disc pl-5 space-y-1.5">
        <li>Account information</li>
        <li>Institution information</li>
        <li>Certificate metadata</li>
        <li>Verification activity</li>
        <li>Uploaded documents, when submitted for verification</li>
        <li>Technical and log information</li>
      </ul>
    ),
  },
  {
    id: 'use',
    label: 'How We Use Information',
    icon: Settings2,
    body: (
      <ul className="list-disc pl-5 space-y-1.5">
        <li>Issue certificates</li>
        <li>Verify credentials</li>
        <li>Detect potential fraud</li>
        <li>Maintain platform security</li>
        <li>Generate verification reports</li>
        <li>Improve platform reliability</li>
      </ul>
    ),
  },
  {
    id: 'cert-data',
    label: 'Certificate Data',
    icon: FileText,
    body: (
      <p>
        Certificate data — such as recipient name, credential details, and issuer records — is used
        specifically to issue and verify credentials, and is handled under the same security controls as
        the rest of the platform.
      </p>
    ),
  },
  {
    id: 'sharing',
    label: 'Data Sharing',
    icon: Share2,
    body: (
      <p>
        CertifyVault does not sell personal information. Information may be processed by trusted
        infrastructure and service providers only where necessary to operate the platform.
      </p>
    ),
  },
  {
    id: 'retention',
    label: 'Data Retention',
    icon: Clock,
    body: (
      <p>
        Data is retained only as long as necessary to meet legitimate platform, contractual, security,
        legal, and institutional requirements.
      </p>
    ),
  },
  {
    id: 'security',
    label: 'Security',
    icon: Lock,
    body: (
      <ul className="list-disc pl-5 space-y-1.5">
        <li>Encryption in transit</li>
        <li>Secure storage</li>
        <li>Access control</li>
        <li>Authentication</li>
        <li>Audit logging</li>
        <li>File validation</li>
        <li>Controlled document access</li>
      </ul>
    ),
  },
  {
    id: 'rights',
    label: 'User Rights',
    icon: UserCheck,
    body: (
      <p>
        Users may request access to, correction of, or deletion of their information where applicable.
        Contact our support team to exercise these rights.
      </p>
    ),
  },
  {
    id: 'cookies',
    label: 'Cookies',
    icon: Cookie,
    body: (
      <p>
        CertifyVault uses essential cookies to operate the platform securely, along with limited
        analytics to understand platform usage and improve reliability.
      </p>
    ),
  },
  {
    id: 'contact',
    label: 'Contact',
    icon: Mail,
    body: (
      <p>
        Questions about this policy or your data can be directed to our support team at any time.
        <br/>
        Mail: <a href="mailto:hello@certifyvault.in">hello@certifyvault.in</a>

      </p>
    ),
  },
]

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

export default function PrivacyPolicyPage() {
  const [active, setActive] = useState(sections[0].id)
  const activeSection = sections.find((s) => s.id === active)!

  return (
    <>
      {/* Hero */}
      <div className="pt-28 pb-10" style={{ background: 'var(--bg)' }}>
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1
              className="font-extrabold leading-tight tracking-tight mb-4"
              style={{ fontSize: 'clamp(32px, 5vw, 54px)', color: 'var(--navy)' }}
            >
              Privacy Policy
            </h1>
            <p className="text-lg max-w-xl mx-auto mb-3" style={{ color: 'var(--navy)', opacity: 0.55 }}>
              How CertifyVault collects, uses, protects, and manages information across its certificate
              verification platform.
            </p>
            <span
              className="inline-block text-xs font-semibold px-3 py-1 rounded-full"
              style={{ background: 'var(--light-blue, #EAF1FF)', color: 'var(--blue)' }}
            >
              Last Updated: August 2026
            </span>
          </motion.div>
        </div>
      </div>

      {/* Policy content */}
      <section className="py-10 md:py-14" style={{ background: 'var(--bg)' }}>
        <div className="max-w-5xl mx-auto px-6">
          <div className="grid md:grid-cols-[240px_1fr] gap-8">
            {/* Nav */}
            <nav className="flex md:flex-col gap-1 overflow-x-auto md:overflow-visible pb-2 md:pb-0">
              {sections.map((s) => {
                const Icon = s.icon
                const isActive = s.id === active
                return (
                  <button
                    key={s.id}
                    onClick={() => setActive(s.id)}
                    className="flex items-center gap-2 text-left text-sm font-medium px-3 py-2.5 rounded-xl whitespace-nowrap transition-colors shrink-0"
                    style={{
                      background: isActive ? 'var(--light-blue, #EAF1FF)' : 'transparent',
                      color: isActive ? 'var(--blue)' : 'var(--navy)',
                      opacity: isActive ? 1 : 0.65,
                    }}
                  >
                    <Icon size={16} />
                    {s.label}
                  </button>
                )
              })}
            </nav>

            {/* Content */}
            <div
              className="rounded-2xl border p-6 md:p-8 bg-white min-h-65"
              style={{ borderColor: 'rgba(0,15,62,0.08)' }}
            >
              <AnimatePresence mode="wait">
                <motion.div
                  key={active}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  <h2 className="text-xl font-bold mb-3" style={{ color: 'var(--navy)' }}>
                    {activeSection.label}
                  </h2>
                  <div className="text-sm leading-relaxed" style={{ color: 'var(--navy)', opacity: 0.7 }}>
                    {activeSection.body}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
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