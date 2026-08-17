import { Link } from 'react-router-dom'
import Logo from '../../assets/Logo2.png'

const footerLinks = {
  Product: [
    { label: 'Features', href: '/#features' },
    { label: 'How It Works', href: '/how-it-works' },
    { label: 'For Issuers', href: '/for-issuers' },
    { label: 'For Holders', href: '/for-holders' },
    { label: 'For Verifiers', href: '/for-verifiers' },
  ],
  Security: [
    { label: 'Security', href: '/security' },
    { label: 'Privacy', href: '/product-privacy' },
    { label: 'Blockchain', href: '/blockchain' },
    { label: 'Fraud Detection', href: '/fraud-detection' },
  ],
  Company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Documentation', href: '/docs' },
    { label: 'Privacy Policy', href: '/privacy' },
  ],
 
}

export default function Footer() {
  return (
    <footer style={{ background: 'var(--navy)', color: 'white' }} className="pt-16 pb-8">
      <div className="max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-25 pb-12 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-1">
            <Link to="/" className="flex items-center gap-2 font-bold text-lg text-white no-underline mb-4">
             
                <img src={Logo} alt="CertifyVault" className="h-15 w-auto" />
              
              CertifyVault
            </Link>
            <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)', lineHeight: '1.6' }}>
              Secure digital credential infrastructure for institutions, graduates, and employers.
            </p>
          </div>

          {Object.entries(footerLinks).map(([section, links]) => (
            <div key={section}>
              <h4 className="text-xs font-semibold uppercase tracking-widest mb-4" style={{ color: 'rgba(255,255,255,0.35)' }}>
                {section}
              </h4>
              <ul className="flex flex-col gap-2.5">
                {links.map(link => (
                  <li key={link.label}>
                    <Link
                      to={link.href}
                      className="text-sm transition-colors duration-150 no-underline"
                      style={{ color: 'rgba(255,255,255,0.55)' }}
                      onMouseEnter={e => { e.currentTarget.style.color = 'white' }}
                      onMouseLeave={e => { e.currentTarget.style.color = 'rgba(255,255,255,0.55)' }}
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.35)' }}>
            © 2026 CertifyVault. All rights reserved.
          </p>
          <p className="text-sm font-medium" style={{ color: 'rgba(255,255,255,0.45)' }}>
            Verify. Protect. Trust.
          </p>
        </div>
      </div>
    </footer>
  )
}
