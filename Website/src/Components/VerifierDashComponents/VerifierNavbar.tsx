import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, ChevronDown, Menu, X, LayoutDashboard, ScanLine, History, Bookmark, FileText } from 'lucide-react'
import Logo from '../../assets/Logo.png'

const navItems = [
  { label: 'Dashboard', href: '/verifierdashboard',          icon: LayoutDashboard },
  { label: 'Verify',    href: '/verifierdashboard/verify',   icon: ScanLine        },
  { label: 'History',   href: '/verifierdashboard/history',  icon: History         },
  { label: 'Saved',     href: '/verifierdashboard/saved',    icon: Bookmark        },
  { label: 'Reports',   href: '/verifierdashboard/reports',  icon: FileText        },
]

export default function VerifierNavbar() {
  const [scrolled, setScrolled] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => setMobileOpen(false), [location.pathname])

  const isActive = (href: string) =>
    href === '/verifierdashboard'   
      ? location.pathname === '/verifierdashboard'
      : location.pathname.startsWith(href)

  return (
    <>
      <motion.header
        className="fixed top-0 left-0 right-0 z-50 flex justify-center px-4 pt-3"
        initial={{ y: -72, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      >
        <nav
          className="w-full max-w-7xl flex items-center justify-between px-4 transition-all duration-300"
          style={{
            background: scrolled ? 'rgba(255,255,255,0.95)' : 'rgba(255,255,255,0.82)',
            backdropFilter: 'blur(20px)',
            WebkitBackdropFilter: 'blur(20px)',
            borderRadius: '9999px',
            border: scrolled ? '1px solid rgba(0,15,62,0.10)' : '1px solid rgba(0,15,62,0.06)',
            boxShadow: scrolled ? '0 4px 20px rgba(0,15,62,0.08)' : 'none',
            height: scrolled ? '52px' : '60px',
          }}
        >
          {/* Logo */}
          <Link to="/app/verifier" className="flex items-center gap-2 no-underline shrink-0">
            <img src={Logo} alt="CertifyVault logo" className="h-8 w-auto" />
            <div className="hidden sm:block">
              <p className="text-sm font-bold leading-none" style={{ color: 'var(--navy)' }}>CertifyVault</p>
              <p className="text-xs font-medium leading-none mt-0.5" style={{ color: 'var(--blue)', opacity: 0.7 }}>Verifier</p>
            </div>
          </Link>

          {/* Center nav */}
          <div className="hidden md:flex items-center gap-0.5 p-1 rounded-full" style={{ background: 'var(--bg-3)' }}>
            {navItems.map(item => (
              <Link
                key={item.label}
                to={item.href}
                className="relative px-4 py-1.5 rounded-full text-sm font-medium no-underline transition-colors duration-150"
                style={{ color: isActive(item.href) ? 'var(--navy)' : 'var(--navy)', opacity: isActive(item.href) ? 1 : 0.5 }}
              >
                {isActive(item.href) && (
                  <motion.div
                    layoutId="nav-pill"
                    className="absolute inset-0 rounded-full"
                    style={{ background: 'white', boxShadow: '0 1px 6px rgba(0,15,62,0.08)' }}
                    transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden md:flex items-center gap-2">
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center transition-colors"
              style={{ color: 'var(--navy)', opacity: 0.5 }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.background = 'var(--bg-3)' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.background = 'transparent' }}
              aria-label="Search"
            >
              <Search size={16} />
            </button>
            <button
              className="w-8 h-8 rounded-full flex items-center justify-center relative transition-colors"
              style={{ color: 'var(--navy)', opacity: 0.5 }}
              onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.background = 'var(--bg-3)' }}
              onMouseLeave={e => { e.currentTarget.style.opacity = '0.5'; e.currentTarget.style.background = 'transparent' }}
              aria-label="Notifications"
            >
              <Bell size={16} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full" style={{ background: 'var(--blue)' }} />
            </button>
            <div className="flex items-center gap-2 pl-2 border-l" style={{ borderColor: 'var(--bg-5)' }}>
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white" style={{ background: 'var(--navy)' }}>
                V
              </div>
              <span className="text-sm font-semibold" style={{ color: 'var(--navy)' }}>Verifier</span>
              <ChevronDown size={13} style={{ color: 'var(--navy)', opacity: 0.4 }} />
            </div>
          </div>

          {/* Mobile toggle */}
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

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="fixed inset-0 z-40 flex flex-col pt-20 px-5 pb-8"
            style={{ background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(20px)' }}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.2 }}
          >
            <div className="flex flex-col gap-1">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                >
                  <Link
                    to={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-2xl no-underline transition-colors"
                    style={{
                      background: isActive(item.href) ? 'var(--light-blue)' : 'transparent',
                      color: 'var(--navy)',
                    }}
                  >
                    <item.icon size={18} strokeWidth={2} style={{ color: isActive(item.href) ? 'var(--blue)' : 'var(--navy)', opacity: isActive(item.href) ? 1 : 0.5 }} />
                    <span className="font-semibold">{item.label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
