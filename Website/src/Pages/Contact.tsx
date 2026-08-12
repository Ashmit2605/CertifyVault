import { useState } from 'react'
import { motion } from 'framer-motion'
import { Mail, MessageSquare, Send } from 'lucide-react'

export default function ContactPage() {
  const [sent, setSent] = useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSent(true)
  }

  const inputStyle = {
    borderColor: 'var(--bg-5)',
    color: 'var(--navy)',
    background: 'white',
  }

  const onFocus = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = 'var(--blue)'
    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(0,80,245,0.08)'
  }
  const onBlur = (e: React.FocusEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    e.currentTarget.style.borderColor = 'var(--bg-5)'
    e.currentTarget.style.boxShadow = 'none'
  }

  return (
    <div className="min-h-screen pt-28 pb-20" style={{ background: 'var(--bg-2)' }}>
      <div className="max-w-2xl mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-semibold tracking-widest" style={{ color: 'var(--blue)' }}>CONTACT</span>
          <h1
            className="font-extrabold leading-tight tracking-tight mt-3 mb-4"
            style={{ fontSize: 'clamp(32px, 4vw, 52px)', color: 'var(--navy)' }}
          >
            Get in Touch
          </h1>
          <p className="text-base" style={{ color: 'var(--navy)', opacity: 0.55 }}>
            Have questions about CertifyVault? We'd love to hear from you.
          </p>
        </motion.div>

        <motion.div
          className="rounded-3xl border overflow-hidden"
          style={{ background: 'white', borderColor: 'var(--bg-4)' }}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          {!sent ? (
            <form onSubmit={handleSubmit} className="p-8 flex flex-col gap-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--navy)', opacity: 0.6 }}>Name</label>
                  <input type="text" required placeholder="Your name" className="w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                </div>
                <div>
                  <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--navy)', opacity: 0.6 }}>Email</label>
                  <input type="email" required placeholder="your@email.com" className="w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--navy)', opacity: 0.6 }}>Subject</label>
                <input type="text" required placeholder="How can we help?" className="w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
              </div>
              <div>
                <label className="block text-xs font-semibold mb-1.5" style={{ color: 'var(--navy)', opacity: 0.6 }}>Message</label>
                <textarea required rows={5} placeholder="Tell us more..." className="w-full px-4 py-3 rounded-2xl border text-sm outline-none transition-all resize-none" style={inputStyle} onFocus={onFocus} onBlur={onBlur} />
              </div>
              <button
                type="submit"
                className="flex items-center justify-center gap-2 py-3.5 rounded-2xl font-semibold text-white transition-all duration-200"
                style={{ background: 'var(--blue)', boxShadow: '0 4px 16px rgba(0,80,245,0.25)' }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue-2)' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--blue)' }}
              >
                <Send size={16} /> Send Message
              </button>
            </form>
          ) : (
            <motion.div
              className="p-12 flex flex-col items-center text-center gap-4"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
            >
              <div className="w-14 h-14 rounded-full flex items-center justify-center" style={{ background: 'rgba(22,163,74,0.1)' }}>
                <MessageSquare size={24} style={{ color: 'var(--success)' }} />
              </div>
              <h3 className="font-bold text-xl" style={{ color: 'var(--navy)' }}>Message Sent</h3>
              <p className="text-sm" style={{ color: 'var(--navy)', opacity: 0.55 }}>
                Thanks for reaching out. We'll get back to you shortly.
              </p>
            </motion.div>
          )}
        </motion.div>

        <div className="mt-8 flex justify-center gap-2 items-center">
          <Mail size={14} style={{ color: 'var(--navy)', opacity: 0.4 }} />
          <span className="text-sm" style={{ color: 'var(--navy)', opacity: 0.4 }}>hello@certifyvault.com</span>
        </div>
      </div>
    </div>
  )
}
