import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Menu, X } from 'lucide-react'
import Logo from '../../assets/Logo.png'

const navLinks = [
  { label: 'Product', href: '/#features' },
  { label: 'How It Works', href: '/how-it-works' },
  { label: 'For Issuers', href: '/for-issuers' },
  { label: 'For Holders', href: '/for-holders' },
  { label: 'For Verifiers', href: '/for-verifiers' },
  { label: 'Security', href: '/security' },
]

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => { setMobileOpen(false) }, [location.pathname])

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-4"
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
      >
        <nav
          className="w-full max-w-6xl flex items-center justify-between px-5 transition-all duration-300"
          style={{
            background: scrolled ? 'rgba(255,255,255,0.94)' : 'rgba(255,255,255,0.80)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
            borderRadius: '9999px',
            border: scrolled ? '1px solid rgba(0,15,62,0.10)' : '1px solid rgba(0,15,62,0.06)',
            boxShadow: scrolled ? '0 4px 16px rgba(0,15,62,0.08)' : 'none',
            height: scrolled ? '52px' : '60px',
          }}
        >
          <Link to="/" className="flex items-center gap-2 font-bold text-lg" style={{ color: 'var(--navy)', textDecoration: 'none' }}>
            <img src={Logo} alt="CertifyVault" className="h-8 w-auto" />
            CertifyVault
          </Link>

          <div className="hidden md:flex items-center gap-0.5">
            {navLinks.map(link => (
              <Link
                key={link.label}
                to={link.href}
                className="px-3 py-1.5 text-sm font-medium rounded-full transition-all duration-150 hover:opacity-100"
                style={{ color: 'var(--navy)', opacity: 0.7, textDecoration: 'none' }}
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.opacity = '1'
                  el.style.background = 'var(--light-blue)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.opacity = '0.7'
                  el.style.background = 'transparent'
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden md:flex items-center gap-2">
            <Link
              to="/app/login"
              className="px-4 py-2 text-sm font-semibold rounded-full transition-all duration-150"
              style={{ color: 'var(--navy)', textDecoration: 'none', opacity: 0.75 }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '1' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '0.75' }}
            >
              Login
            </Link>
            <Link
              to="/app/register"
              className="px-5 py-2 text-sm font-semibold rounded-full text-white transition-all duration-150"
              style={{ background: 'var(--blue)', boxShadow: '0 2px 8px rgba(0,80,245,0.30)', textDecoration: 'none' }}
              onMouseEnter={e => { e.currentTarget.style.background = 'var(--blue-2)' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'var(--blue)' }}
            >
              Get Started
            </Link>
          </div>

          <button
            className="md:hidden p-2 rounded-full"
            style={{ color: 'var(--navy)' }}
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col pt-24 px-6 pb-8"
            style={{ background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)' }}
            initial={{ opacity: 0, y: -16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-1">
              {navLinks.map((link, i) => (
                <motion.div
                  key={link.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={link.href}
                    className="block px-4 py-3 text-lg font-semibold rounded-2xl transition-colors"
                    style={{ color: 'var(--navy)', textDecoration: 'none' }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--light-blue)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'transparent' }}
                  >
                    {link.label}
                  </Link>
                </motion.div>
              ))}
            </div>
            <div className="mt-8 flex flex-col gap-3">
              <Link to="/app/login" className="w-full py-3 text-center font-semibold rounded-2xl border" style={{ color: 'var(--navy)', borderColor: 'var(--bg-5)', textDecoration: 'none' }}>
                Login
              </Link>
              <Link to="/app/register" className="w-full py-3 text-center font-semibold rounded-2xl text-white" style={{ background: 'var(--blue)', textDecoration: 'none' }}>
                Get Started
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
