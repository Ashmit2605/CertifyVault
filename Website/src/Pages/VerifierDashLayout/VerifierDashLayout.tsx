import { Outlet } from 'react-router-dom'
import VerifierNavbar from '../../Components/VerifierDashComponents/VerifierNavbar'

export default function VerifierDashLayout() {
  return (
    <div className="min-h-screen" style={{ background: 'var(--bg-2)', fontFamily: 'Figtree, system-ui, sans-serif' }}>
      <VerifierNavbar />
      <Outlet />
    </div>
  )
}
