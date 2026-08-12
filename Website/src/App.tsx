import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './Components/layout/Layout'
import Home from './Pages/Home'
import HowItWorks from './Pages/HowItWorks'
import Issuers from './Pages/Issuers'
import Holders from './Pages/Holders'
import Verifiers from './Pages/Verifiers'
import Security from './Pages/Security'
import Verify from './Pages/Verify'
import About from './Pages/About'
import Contact from './Pages/Contact'
import LoginPage from './Pages/Login'
import SignupPage from './Pages/Signup'

// Verifier dashboard
import VerifierDashLayout from './Pages/VerifierDashLayout/VerifierDashLayout'
import VerifierDashboard from './Pages/VerifierDashLayout/VerifierDashboard'
import VerificationHistory from './Pages/VerifierDashLayout/VerificationHistory'
import SavedVerifications from './Pages/VerifierDashLayout/SavedVerifications'
import VerificationReports from './Pages/VerifierDashLayout/VerificationReports'

function ComingSoon({ label }: { label: string }) {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'var(--bg-2)' }}>
      <div className="text-center">
        <p className="text-xs font-semibold tracking-widest mb-3" style={{ color: 'var(--blue)' }}>COMING SOON</p>
        <h1 className="font-extrabold text-4xl" style={{ color: 'var(--navy)' }}>{label}</h1>
        <p className="mt-3 text-base" style={{ color: 'var(--navy)', opacity: 0.5 }}>This section is under development.</p>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* ── Auth pages (no navbar/footer) ── */}
        <Route path="/app/login"    element={<LoginPage />} />
        <Route path="/app/register" element={<SignupPage />} />

        {/* ── Verifier dashboard ── */}
        <Route path="/app/verifier" element={<VerifierDashLayout />}>
          <Route index                  element={<VerifierDashboard />} />
          <Route path="verify"          element={<VerifierDashboard />} />
          <Route path="history"         element={<VerificationHistory />} />
          <Route path="saved"           element={<SavedVerifications />} />
          <Route path="reports"         element={<VerificationReports />} />
          <Route path="profile"         element={<ComingSoon label="Profile" />} />
        </Route>

        {/* ── Reserved dashboards ── */}
        <Route path="/app/issuer/*" element={<ComingSoon label="Issuer Dashboard" />} />
        <Route path="/app/holder/*" element={<ComingSoon label="Holder Dashboard" />} />
        <Route path="/admin/*"      element={<ComingSoon label="Admin Dashboard" />} />

        {/* ── Public marketing pages ── */}
        <Route element={<Layout />}>
          <Route path="/"              element={<Home />} />
          <Route path="/how-it-works"  element={<HowItWorks />} />
          <Route path="/for-issuers"   element={<Issuers />} />
          <Route path="/for-holders"   element={<Holders />} />
          <Route path="/for-verifiers" element={<Verifiers />} />
          <Route path="/security"      element={<Security />} />
          <Route path="/verify"        element={<Verify />} />
          <Route path="/about"         element={<About />} />
          <Route path="/contact"       element={<Contact />} />
          <Route path="*"              element={<ComingSoon label="Page Not Found" />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
