import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { Building2, FilePlus, FileStack, ShieldCheck, XCircle, BarChart3, ArrowRight } from 'lucide-react'
import CTASection from '../Components/sections/CTASection'

const features = [
  { icon: FilePlus,    title: 'Issue Certificates',      desc: 'Create and issue digital certificates with custom templates and fields.' },
  { icon: FileStack,   title: 'Bulk Issuance',           desc: 'Issue hundreds of certificates at once via CSV upload or API.' },
  { icon: ShieldCheck, title: 'Secure Storage',          desc: 'All certificates stored with AES-256 encryption and access controls.' },
  { icon: XCircle,     title: 'Certificate Revocation',  desc: 'Revoke invalid or incorrectly issued credentials at any time.' },
  { icon: BarChart3,   title: 'Verification Monitoring', desc: 'Track when and how your certificates are being verified.' },
  { icon: Building2,   title: 'Institution Management',  desc: 'Manage multiple departments, signatories, and certificate types.' },
]

const lifecycle = ['Create', 'Issue', 'Protect', 'Anchor', 'Share', 'Verify', 'Revoke']

export default function IssuersPage() {
  return (
    <>
      <div className="pt-28 pb-16" style={{ background: 'var(--bg)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-xs font-semibold tracking-widest" style={{ color: 'var(--blue)' }}>
                FOR ISSUERS
              </span>
              <h1
                className="font-extrabold leading-tight tracking-tight mt-3 mb-5"
                style={{ fontSize: 'clamp(36px, 4.5vw, 60px)', color: 'var(--navy)' }}
              >
                From Issuance to Verification,{' '}
                <span style={{ color: 'var(--blue)' }}>Under One Roof.</span>
              </h1>
              <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--navy)', opacity: 0.6 }}>
                CertifyVault gives universities and institutions complete control over the certificate lifecycle — from creation to revocation.
              </p>
              <Link
                to="/app/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-white no-underline"
                style={{ background: 'var(--blue)', boxShadow: '0 4px 16px rgba(0,80,245,0.25)' }}
              >
                Start Issuing <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Lifecycle visual */}
            <motion.div
              className="flex flex-col items-center gap-0"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {lifecycle.map((step, i) => (
                <div key={step} className="flex flex-col items-center">
                  <motion.div
                    className="px-6 py-3 rounded-2xl border font-semibold text-sm"
                    style={{
                      background: i === 0 || i === lifecycle.length - 1 ? 'var(--navy)' : 'white',
                      color: i === 0 || i === lifecycle.length - 1 ? 'white' : 'var(--navy)',
                      borderColor: 'var(--bg-4)',
                      minWidth: '140px',
                      textAlign: 'center',
                    }}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    {step}
                  </motion.div>
                  {i < lifecycle.length - 1 && (
                    <div className="w-px h-5" style={{ background: 'var(--bg-5)' }} />
                  )}
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>

      <section className="py-20" style={{ background: 'var(--bg-2)' }}>
        <div className="max-w-6xl mx-auto px-6">
          <h2
            className="font-extrabold text-center mb-12"
            style={{ fontSize: 'clamp(24px, 3vw, 40px)', color: 'var(--navy)' }}
          >
            Everything an Institution Needs
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                className="p-6 rounded-3xl border"
                style={{ background: 'white', borderColor: 'var(--bg-4)' }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                whileHover={{ y: -4, boxShadow: '0 12px 32px rgba(0,15,62,0.08)' }}
              >
                <div
                  className="w-10 h-10 rounded-2xl flex items-center justify-center mb-4"
                  style={{ background: 'var(--light-blue)' }}
                >
                  <f.icon size={18} strokeWidth={2} style={{ color: 'var(--blue)' }} />
                </div>
                <h3 className="font-bold text-sm mb-2" style={{ color: 'var(--navy)' }}>{f.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: 'var(--navy)', opacity: 0.55 }}>{f.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </>
  )
}
