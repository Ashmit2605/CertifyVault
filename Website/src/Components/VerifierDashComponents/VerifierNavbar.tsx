import { useState } from 'react'
import { useClerk } from '@clerk/clerk-react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Bell, ChevronDown, Menu, X, LayoutDashboard, ScanLine, History, Bookmark, FileText, LogOut } from 'lucide-react'
import Logo from '../../assets/Logo.webp'

const navItems = [
  { label: 'Dashboard', href: '/verifierdashboard', icon: LayoutDashboard },
  { label: 'Verify', href: '/verifierdashboard/verify', icon: ScanLine },
  { label: 'History', href: '/verifierdashboard/history', icon: History },
  { label: 'Saved', href: '/verifierdashboard/saved', icon: Bookmark },
  { label: 'Reports', href: '/verifierdashboard/reports', icon: FileText },
]

export default function VerifierNavbar() {
  const [mobileOpen, setMobileOpen] = useState(false)
  const location = useLocation()
  const { signOut } = useClerk()

  const handleLogout = () => {
    void signOut({ redirectUrl: '/app/login' })
  }

  const isActive = (href: string) =>
    href === '/verifierdashboard'
      ? location.pathname === '/verifierdashboard'
      : location.pathname.startsWith(href)

  return (
    <>
      <motion.header
        className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur"
        initial={{ opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.25 }}
      >
        <nav
          aria-label="Verifier dashboard navigation"
          className="mx-auto flex h-16 max-w-[1440px] items-center justify-between gap-4 px-4 lg:px-6"
        >
          {/* Logo */}
          <Link to="/verifierdashboard" className="flex items-center gap-2 no-underline shrink-0">
            <img src={Logo} alt="CertifyVault logo" className="h-8 w-auto" />
            <div className="hidden sm:block">
              <p className="text-sm font-bold leading-none" style={{ color: 'var(--navy)' }}>CertifyVault</p>
              <p className="text-xs font-medium leading-none mt-0.5" style={{ color: 'var(--blue)', opacity: 0.7 }}>Verifier</p>
            </div>
          </Link>

          {/* Center nav */}
          <div className="hidden flex-1 items-center justify-center gap-1 lg:flex">
            {navItems.map(item => (
              <Link
                key={item.label}
                to={item.href}
                aria-current={isActive(item.href) ? 'page' : undefined}
                className={`group relative flex cursor-pointer items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium no-underline transition-all duration-150 ${
                  isActive(item.href)
                    ? 'text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                }`}
              >
                <item.icon
                  size={17}
                  className={isActive(item.href) ? 'text-blue-600' : 'text-gray-500'}
                />
                <span className="whitespace-nowrap">{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Right actions */}
          <div className="hidden shrink-0 items-center gap-2 lg:flex">
            <button
              className="flex h-9 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm text-gray-500 transition-colors hover:bg-gray-50"
              aria-label="Search"
            >
              <Search size={16} />
              <span className="hidden xl:inline">Search verifications...</span>
            </button>
            <button
              className="relative rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-700"
              aria-label="Notifications"
            >
              <Bell size={16} />
              <span className="absolute right-1.5 top-1.5 flex h-2 w-2 rounded-full bg-red-500" />
            </button>
            <Link
              to="/verifierdashboard/profile"
              aria-label="Open verifier profile settings"
              className="flex items-center gap-2 rounded-lg py-1 pl-2 pr-1 no-underline transition-colors hover:bg-gray-50"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-100 text-sm font-semibold text-blue-600">
                V
              </div>
              <span className="text-left">
                <span className="block text-sm font-medium leading-tight text-gray-900">Verifier</span>
                <span className="block text-xs leading-tight text-gray-500">Organization</span>
              </span>
              <ChevronDown size={14} className="text-gray-400" />
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="inline-flex h-9 items-center gap-2 rounded-lg border border-gray-200 px-3 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-50 hover:text-gray-900"
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>

          {/* Mobile toggle */}
          <button
            className="rounded-lg p-2 text-gray-600 hover:bg-gray-100 lg:hidden"
            onClick={() => setMobileOpen(v => !v)}
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </nav>
      </motion.header>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            className="absolute left-0 right-0 top-full z-40 flex max-h-[calc(100vh-4rem)] flex-col overflow-y-auto border-b border-gray-200 bg-white px-4 py-2 shadow-lg lg:hidden"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
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
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 rounded-lg px-3 py-3 no-underline transition-colors ${
                      isActive(item.href)
                        ? 'bg-blue-50 text-blue-600'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                    style={{
                      color: isActive(item.href) ? 'var(--blue)' : 'var(--navy)',
                    }}
                  >
                    <item.icon size={18} strokeWidth={2} />
                    <span className="font-semibold">{item.label}</span>
                  </Link>
                </motion.div>
              ))}
              <button
                type="button"
                onClick={handleLogout}
                className="flex items-center gap-3 rounded-lg px-3 py-3 text-left font-semibold text-red-600 transition-colors hover:bg-red-50"
              >
                <LogOut size={18} strokeWidth={2} />
                <span>Logout</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
