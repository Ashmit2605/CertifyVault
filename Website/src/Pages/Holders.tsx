import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { GraduationCap, Vault, Share2, QrCode, Globe, ShieldCheck, ArrowRight } from 'lucide-react'
import CTASection from '../Components/sections/CTASection'

const features = [
  { icon: Vault,       title: 'Digital Certificate Vault', desc: 'All your credentials in one secure, encrypted place.' },
  { icon: Globe,       title: 'Access Anywhere',           desc: 'Access your certificates from any device, anytime.' },
  { icon: Share2,      title: 'Share Verification Links',  desc: 'Send a secure link that lets anyone verify your credential.' },
  { icon: QrCode,      title: 'QR-Based Sharing',          desc: 'Share a QR code that instantly verifies your certificate.' },
  { icon: ShieldCheck, title: 'Track Certificate Status',  desc: 'Know when your certificates are verified or revoked.' },
  { icon: GraduationCap, title: 'Privacy Controls',        desc: 'Control who can see your credentials and for how long.' },
]

const mockCerts = [
  { title: 'Bachelor of Technology',  sub: 'Computer Engineering',       status: 'Verified' },
  { title: 'Internship Certificate',  sub: 'Software Engineering Intern', status: 'Verified' },
  { title: 'Research Certificate',    sub: 'AI & Machine Learning',       status: 'Verified' },
]

export default function HoldersPage() {
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
                FOR HOLDERS
              </span>
              <h1
                className="font-extrabold leading-tight tracking-tight mt-3 mb-5"
                style={{ fontSize: 'clamp(36px, 4.5vw, 60px)', color: 'var(--navy)' }}
              >
                Every Achievement.{' '}
                <span style={{ color: 'var(--blue)' }}>One Secure Vault.</span>
              </h1>
              <p className="text-lg leading-relaxed mb-8" style={{ color: 'var(--navy)', opacity: 0.6 }}>
                Your academic credentials, secured and always accessible. Share verified proof of your achievements with anyone, instantly.
              </p>
              <Link
                to="/app/register"
                className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl font-semibold text-white no-underline"
                style={{ background: 'var(--blue)', boxShadow: '0 4px 16px rgba(0,80,245,0.25)' }}
              >
                Access My Vault <ArrowRight size={16} />
              </Link>
            </motion.div>

            {/* Phone mockup */}
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div
                className="w-64 rounded-3xl border-4 overflow-hidden"
                style={{ borderColor: 'var(--navy)', boxShadow: '0 24px 64px rgba(0,15,62,0.15)' }}
              >
                <div className="px-4 py-3" style={{ background: 'var(--navy)' }}>
                  <p className="text-white text-xs font-bold text-center">My Certificates</p>
                </div>
                <div className="p-3 flex flex-col gap-2" style={{ background: 'var(--bg-2)' }}>
                  {mockCerts.map((cert, i) => (
                    <motion.div
                      key={cert.title}
                      className="p-3 rounded-2xl border"
                      style={{ background: 'white', borderColor: 'var(--bg-4)' }}
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 + i * 0.1 }}
                    >
                      <p className="font-bold text-xs" style={{ color: 'var(--navy)' }}>{cert.title}</p>
                      <p className="text-xs mt-0.5" style={{ color: 'var(--navy)', opacity: 0.5 }}>{cert.sub}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <ShieldCheck size={10} style={{ color: 'var(--success)' }} />
                        <span className="text-xs font-semibold" style={{ color: 'var(--success)' }}>{cert.status}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
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
            Your Credentials, Your Control
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
