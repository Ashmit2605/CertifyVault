import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
  {
    q: 'What is CertifyVault?',
    a: 'CertifyVault is a secure digital credential platform that enables institutions to issue, store, and verify academic certificates using blockchain integrity, SHA-256 cryptographic hashing, AI-powered fraud detection, and QR verification.',
  },
  {
    q: 'How does certificate verification work?',
    a: 'Verifiers can scan a QR code or upload a certificate. CertifyVault extracts the certificate data via OCR, checks the cryptographic hash, verifies the blockchain proof, runs AI fraud analysis, and returns a comprehensive verification result with a risk score.',
  },
  {
    q: 'Is my certificate stored on blockchain?',
    a: 'No — sensitive certificate documents and personal data are stored in secure, encrypted off-chain storage. Only the cryptographic integrity proof (hash) is anchored on blockchain. This protects your privacy while still providing tamper-evident verification.',
  },
  {
    q: 'Can certificates be revoked?',
    a: 'Yes. Issuing institutions can revoke certificates at any time. Revoked certificates will show as invalid during verification, and the revocation is recorded in the audit trail.',
  },
  {
    q: 'Can employers verify certificates without an account?',
    a: 'Yes. Verifiers can verify any certificate by scanning its QR code or uploading the document — no account or login required.',
  },
  {
    q: 'How does fraud detection work?',
    a: 'CertifyVault uses AI-powered image forensics and structural analysis to detect visual manipulation, metadata anomalies, font inconsistencies, and other signals of document forgery. Results are combined into a risk score.',
  },
  {
    q: 'Is blockchain required for every verification?',
    a: 'No. Verification can use multiple layers independently. Blockchain provides the strongest integrity guarantee, but QR verification, OCR matching, and hash comparison can also confirm authenticity.',
  },
  {
    q: 'Can universities issue certificates in bulk?',
    a: 'Yes. CertifyVault supports bulk certificate issuance with customizable templates, allowing institutions to issue hundreds or thousands of certificates efficiently.',
  },
]

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  return (
    <div
      className="border-b last:border-b-0"
      style={{ borderColor: 'var(--bg-4)' }}
    >
      <button
        className="w-full flex items-center justify-between py-5 text-left gap-4"
        onClick={() => setOpen(v => !v)}
        aria-expanded={open}
      >
        <span className="font-semibold text-base" style={{ color: 'var(--navy)' }}>{q}</span>
        <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
          <ChevronDown size={18} style={{ color: 'var(--navy)', opacity: 0.4, flexShrink: 0 }} />
        </motion.div>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.25, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <p className="pb-5 text-sm leading-relaxed" style={{ color: 'var(--navy)', opacity: 0.6 }}>{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default function FAQSection() {
  return (
    <section id="faq" className="py-24" style={{ background: 'var(--bg-2)' }}>
      <div className="max-w-3xl mx-auto px-6">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <span className="text-xs font-semibold tracking-widest" style={{ color: 'var(--blue)' }}>FAQ</span>
          <h2
            className="font-extrabold leading-tight tracking-tight mt-3"
            style={{ fontSize: 'clamp(28px, 3.5vw, 44px)', color: 'var(--navy)' }}
          >
            Frequently Asked Questions
          </h2>
        </motion.div>

        <motion.div
          className="rounded-3xl border overflow-hidden"
          style={{ background: 'white', borderColor: 'var(--bg-4)' }}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <div className="px-7">
            {faqs.map(faq => (
              <FAQItem key={faq.q} q={faq.q} a={faq.a} />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  )
}
