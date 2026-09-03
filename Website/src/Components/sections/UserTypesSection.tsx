import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Building2, GraduationCap, Search, ArrowRight } from 'lucide-react'

const userTypes = [
  {
    icon: Building2,
    role: 'ISSUERS',
    title: 'For Universities & Institutions',
    desc: 'Issue, manage, and protect academic credentials at scale. Full lifecycle control from issuance to revocation.',
    features: ['Bulk certificate issuance', 'Custom certificate templates', 'Secure encrypted storage', 'Certificate revocation', 'Verification monitoring', 'Audit trails'],
    cta: 'Explore for Issuers',
    href: '/for-issuers',
    accent: 'var(--blue)',
    bg: 'var(--light-blue)',
  },
  {
    icon: GraduationCap,
    role: 'HOLDERS',
    title: 'For Students & Graduates',
    desc: 'Your achievements, secured in one digital vault. Share verified credentials with anyone, anywhere, instantly.',
    features: ['Digital certificate vault', 'Access from any device', 'Share verification links', 'QR-based sharing', 'Track certificate status', 'Privacy controls'],
    cta: 'Explore for Holders',
    href: '/for-holders',
    accent: 'var(--navy)',
    bg: 'var(--bg-3)',
  },
  {
    icon: Search,
    role: 'VERIFIERS',
    title: 'For Employers & Organizations',
    desc: 'Verify any credential in seconds. Get instant fraud analysis and a clear trust score — no account required.',
    features: ['Scan QR code', 'Upload certificate', 'Instant verification', 'AI fraud detection', 'Verification reports', 'Risk scoring'],
    cta: 'Explore for Verifiers',
    href: '/for-verifiers',
    accent: 'var(--blue-2)',
    bg: 'var(--light-blue-2)',
  },
]

export default function UserTypesSection() {
  return (
    <section className="min-h-screen flex items-center py-12" style={{ background: 'var(--bg)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-semibold tracking-widest" style={{ color: 'var(--blue)' }}>BUILT FOR EVERYONE</span>
          <h2
            className="font-extrabold leading-tight tracking-tight mt-3"
            style={{ fontSize: 'clamp(32px, 4vw, 52px)', color: 'var(--navy)' }}
          >
            Built for Everyone Who Touches a Credential
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {userTypes.map((u, i) => (
            <motion.div
              key={u.role}
              className="flex flex-col p-7 rounded-3xl border transition-all duration-200"
              style={{ background: 'white', borderColor: 'var(--bg-4)' }}
              initial={{ opacity: 0, y: 32 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.6 }}
              whileHover={{ y: -6, boxShadow: '0 16px 48px rgba(0,15,62,0.10)' }}
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center mb-5"
                style={{ background: u.bg }}
              >
                <u.icon size={22} strokeWidth={2} style={{ color: u.accent }} />
              </div>

              <span className="text-xs font-bold tracking-widest mb-2" style={{ color: u.accent, opacity: 0.7 }}>
                {u.role}
              </span>
              <h3 className="font-bold text-xl mb-3" style={{ color: 'var(--navy)' }}>{u.title}</h3>
              <p className="text-sm leading-relaxed mb-6" style={{ color: 'var(--navy)', opacity: 0.55 }}>{u.desc}</p>

              <ul className="flex flex-col gap-2 mb-8 flex-1">
                {u.features.map(f => (
                  <li key={f} className="flex items-center gap-2 text-sm" style={{ color: 'var(--navy)', opacity: 0.7 }}>
                    <span className="w-1.5 h-1.5 rounded-full shrink-0" style={{ background: u.accent }} />
                    {f}
                  </li>
                ))}
              </ul>

              <Link
                to={u.href}
                className="inline-flex items-center gap-2 text-sm font-semibold no-underline transition-all duration-150"
                style={{ color: u.accent }}
                onMouseEnter={e => { e.currentTarget.style.gap = '10px' }}
                onMouseLeave={e => { e.currentTarget.style.gap = '8px' }}
              >
                {u.cta} <ArrowRight size={15} />
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
