import { motion } from 'framer-motion'

// Demo/placeholder testimonials
const testimonials = [
  {
    quote: "CertifyVault has completely transformed how we issue and manage academic credentials. Our verification process went from days to seconds.",
    name: "University Administrator",
    role: "Engineering Institution",
    initials: "UA",
  },
  {
    quote: "Having all my certificates in one secure vault that I can share with a QR code is incredibly convenient. Employers trust it immediately.",
    name: "Graduate",
    role: "Class of 2026",
    initials: "GR",
  },
  {
    quote: "We verify dozens of credentials weekly. CertifyVault's instant verification and fraud detection has saved us significant time and risk.",
    name: "Talent Acquisition Manager",
    role: "Technology Company",
    initials: "TA",
  },
]

export default function TestimonialsSection() {
  return (
    <section className="py-24" style={{ background: 'var(--bg)' }}>
      <div className="max-w-6xl mx-auto px-6">
        <motion.div
          className="text-center max-w-xl mx-auto mb-16"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-semibold tracking-widest" style={{ color: 'var(--blue)' }}>TRUSTED BY</span>
          <h2
            className="font-extrabold leading-tight tracking-tight mt-3"
            style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', color: 'var(--navy)' }}
          >
            Trusted Across the Credential Lifecycle
          </h2>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-6">
          {testimonials.map((t, i) => (
            <motion.div
              key={t.name}
              className="p-7 rounded-3xl border flex flex-col"
              style={{ background: 'white', borderColor: 'var(--bg-4)' }}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12, duration: 0.5 }}
              whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,15,62,0.08)' }}
            >
              {/* Stars */}
              <div className="flex gap-1 mb-5">
                {Array.from({ length: 5 }).map((_, j) => (
                  <span key={j} style={{ color: '#F59E0B', fontSize: '14px' }}>★</span>
                ))}
              </div>
              <p className="text-sm leading-relaxed flex-1 mb-6" style={{ color: 'var(--navy)', opacity: 0.65 }}>
                "{t.quote}"
              </p>
              <div className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                  style={{ background: 'var(--navy)' }}
                >
                  {t.initials}
                </div>
                <div>
                  <p className="font-bold text-sm" style={{ color: 'var(--navy)' }}>{t.name}</p>
                  <p className="text-xs" style={{ color: 'var(--navy)', opacity: 0.45 }}>{t.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-xs mt-6" style={{ color: 'var(--navy)', opacity: 0.35 }}>
          Placeholder testimonials — demo content only
        </p>
      </div>
    </section>
  )
}
