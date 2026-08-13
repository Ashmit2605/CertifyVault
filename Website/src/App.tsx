import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import IssuerDashLayout from "./Pages/IssuerDashLayout/IssuerDashLayout";
import Overview from "./Components/IssuerDashComponents/Dashboard/Overview";
import Certificates from "./Components/IssuerDashComponents/Certificates/Certificates";
import IssueCertificate from "./Components/IssuerDashComponents/Certificates/IssueCertificate/IssueCertificate.tsx";
import { TemplatesProvider } from "./Components/IssuerDashComponents/Certificates/Templates/Templates";
import Templates, { TemplateEditor } from "./Components/IssuerDashComponents/Certificates/Templates/Templates";
import Verification from "./Components/IssuerDashComponents/Verifications/verification";
import Revocations, { RevocationsProvider, RevokeCertificate } from "./Components/IssuerDashComponents/Verifications/revocations";
import FraudAlerts from "./Components/IssuerDashComponents/Verifications/fraud&alerts";
import Analytics from "./Components/IssuerDashComponents/Analytics/analytics";
import AuditLogs from "./Components/IssuerDashComponents/AuditLogs/auditlogs";
import Students, { StudentsProvider, StudentCertificateHistory } from "./Components/IssuerDashComponents/Students/students";
import SettingsSidebar from "./Components/IssuerDashComponents/Settings/settingssidebar";
import Profile from "./Components/IssuerDashComponents/Settings/profile";
import Institution from "./Components/IssuerDashComponents/Settings/institution";
import UsersPermissions from "./Components/IssuerDashComponents/Settings/userspermissions";
import Notifications from "./Components/IssuerDashComponents/Settings/notifications";
import Security from "./Components/IssuerDashComponents/Settings/security";
import Branding from "./Components/IssuerDashComponents/Settings/branding";




// wrap the issuer dashboard route element with the provider:



function LandingPage() {
  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white">
          CertifyVault
        </h1>

        <p className="mt-4 text-slate-400 text-lg">
          Blockchain Certificate Verification
        </p>

        <button className="mt-8 rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
          Verify Certificate
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public site */}
        <Route path="/" element={<LandingPage />} />

        {/* Issuer Dashboard — nested pages render inside <Outlet /> of IssuerDashLayout */}
        <Route path="/issuerdashboard" element={<TemplatesProvider><IssuerDashLayout /></TemplatesProvider>}>
          <Route index element={<Overview />} />
          <Route path="certificates" element={<Certificates />} />
          <Route path="issue" element={<IssueCertificate />} />
          <Route path="templates" element={<Templates />} />
          <Route path="templates/:templateId" element={<TemplateEditor />} />
          <Route path="/issuerdashboard/verification" element={<Verification />} />
          <Route path="/issuerdashboard/revocations"element={<RevocationsProvider><Revocations /></RevocationsProvider>}/>
          <Route path="/issuerdashboard/revocations/:certId"element={<RevocationsProvider><RevokeCertificate /></RevocationsProvider>}/>
          <Route path="/issuerdashboard/fraud-alerts" element={<FraudAlerts />} />
          <Route path="/issuerdashboard/analytics" element={<Analytics />} />
          <Route path="/issuerdashboard/audit-logs" element={<AuditLogs />} />
          <Route path="/issuerdashboard/students" element={<StudentsProvider><Students /></StudentsProvider>} />  
          <Route path="/issuerdashboard/students/:studentId"element={<StudentsProvider><StudentCertificateHistory /></StudentsProvider>}/>
          <Route path="/issuerdashboard/settings" element={<SettingsSidebar />}>
            <Route index element={<Navigate to="profile" replace />} />
            <Route path="profile" element={<Profile />} />
            <Route path="institution" element={<Institution />} />
            <Route path="users-permissions" element={<UsersPermissions />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="security" element={<Security />} />
            <Route path="branding" element={<Branding />} />
            <Route path="notifications" element={<Notifications />} />
          </Route>
          {/* more children later: students, issue, verification, etc. */}
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;