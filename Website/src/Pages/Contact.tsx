import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ShieldCheck, Clock, Mail, ArrowRight, CheckCircle2 } from 'lucide-react'

export default function ContactPage() {
  const [sent, setSent] = useState(false)
  const [focused, setFocused] = useState<string | null>(null)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  const fieldStyle = (name: string) => ({
    borderColor: focused === name ? 'var(--blue)' : 'var(--bg-5)',
    boxShadow: focused === name ? '0 0 0 3px rgba(0,80,245,0.10)' : 'none',
    color: 'var(--navy)',
    background: 'white',
  })

  const fields = [
    { name: 'name', label: 'Name', type: 'text', placeholder: 'Your name', span: true },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'your@email.com', span: true },
    { name: 'subject', label: 'Subject', type: 'text', placeholder: 'How can we help?', span: false },
  ]

  return (
    <div className="min-h-screen pt-28 pb-20" style={{ background: 'var(--bg-2)' }}>
      <div className="max-w-5xl mx-auto px-6">
        <motion.div
          className="mb-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <span className="text-xs font-semibold tracking-widest" style={{ color: 'var(--blue)' }}>
            CONTACT
          </span>
          <h1
            className="font-extrabold leading-tight tracking-tight mt-3"
            style={{ fontSize: 'clamp(32px, 4vw, 52px)', color: 'var(--navy)' }}
          >
            Let's talk credentials.
          </h1>
        </motion.div>

        <motion.div
          className="rounded-3xl overflow-hidden grid md:grid-cols-5"
          style={{ background: 'white', border: '1px solid var(--bg-4)', boxShadow: '0 20px 60px -20px rgba(10,20,60,0.15)' }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {/* Left info panel — signature element */}
          <div
            className="md:col-span-2 p-8 md:p-10 flex flex-col justify-between relative overflow-hidden"
            style={{ background: 'var(--navy)' }}
          >
            {/* faint watermark seal, nods to a certificate stamp */}
            <ShieldCheck
              size={220}
              strokeWidth={0.75}
              className="absolute -right-10 -bottom-10 pointer-events-none"
              style={{ color: 'white', opacity: 0.06 }}
            />

            <div className="relative">
              <p className="text-white text-lg font-semibold leading-snug mb-8">
                Questions about verifying, issuing, or storing credentials — our team responds personally.
              </p>

              <div className="flex flex-col gap-5">
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <Clock size={16} style={{ color: 'white' }} />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">Under 1 business day</p>
                    <p className="text-white text-xs opacity-60">Typical response time</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <ShieldCheck size={16} style={{ color: 'white' }} />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">Encrypted end to end</p>
                    <p className="text-white text-xs opacity-60">Nothing you send us leaves the vault unprotected</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0" style={{ background: 'rgba(255,255,255,0.1)' }}>
                    <Mail size={16} style={{ color: 'white' }} />
                  </div>
                  <div>
                    <p className="text-white text-sm font-semibold">support@certifyvault.com</p>
                    <p className="text-white text-xs opacity-60">For urgent verification requests</p>
                  </div>
                </div>
              </div>
            </div>

            <p className="relative text-white text-xs opacity-40 mt-10">
              CertifyVault, Inc.
            </p>
          </div>

          {/* Right form panel */}
          <div className="md:col-span-3 p-8 md:p-10">
            <AnimatePresence mode="wait">
              {!sent ? (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-5"
                  initial={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div className="grid sm:grid-cols-2 gap-4">
                    {fields.filter(f => f.span).map((f, i) => (
                      <motion.div
                        key={f.name}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.15 + i * 0.05 }}
                      >
                        <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--navy)', opacity: 0.6 }}>
                          {f.label}
                        </label>
                        <input
                          type={f.type}
                          required
                          placeholder={f.placeholder}
                          className="w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all duration-150"
                          style={fieldStyle(f.name)}
                          onFocus={() => setFocused(f.name)}
                          onBlur={() => setFocused(null)}
                        />
                      </motion.div>
                    ))}
                  </div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.25 }}
                  >
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--navy)', opacity: 0.6 }}>
                      Subject
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="How can we help?"
                      className="w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all duration-150"
                      style={fieldStyle('subject')}
                      onFocus={() => setFocused('subject')}
                      onBlur={() => setFocused(null)}
                    />
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--navy)', opacity: 0.6 }}>
                      Message
                    </label>
                    <textarea
                      required
                      rows={5}
                      placeholder="Tell us more..."
                      className="w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all duration-150 resize-none"
                      style={fieldStyle('message')}
                      onFocus={() => setFocused('message')}
                      onBlur={() => setFocused(null)}
                    />
                  </motion.div>

                  <motion.button
                    type="submit"
                    className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-white transition-all duration-200 mt-1"
                    style={{ background: 'var(--blue)', boxShadow: '0 4px 16px rgba(0,80,245,0.25)' }}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: 0.35 }}
                    whileHover={{ y: -1 }}
                    whileTap={{ scale: 0.98 }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue-2)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--blue)' }}
                  >
                    Send Message <ArrowRight size={16} />
                  </motion.button>
                </motion.form>
              ) : (
                <motion.div
                  key="sent"
                  className="h-full flex flex-col items-center justify-center text-center gap-4 py-10"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  <motion.div
                    className="w-16 h-16 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(22,163,74,0.1)' }}
                    initial={{ scale: 0.6, rotate: -20, opacity: 0 }}
                    animate={{ scale: 1, rotate: 0, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 260, damping: 18 }}
                  >
                    <CheckCircle2 size={28} style={{ color: 'var(--success)' }} />
                  </motion.div>
                  <div>
                    <h3 className="font-bold text-xl" style={{ color: 'var(--navy)' }}>Message received</h3>
                    <p className="text-sm mt-1" style={{ color: 'var(--navy)', opacity: 0.55 }}>
                      We'll reply within one business day, at the email you gave us.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  )
}