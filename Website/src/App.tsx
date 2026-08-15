import { Routes, Route } from "react-router-dom";
import Layout from "./Components/layout/Layout";
import Home from "./Pages/Home";
import HowItWorks from "./Pages/HowItWorks";
import Issuers from "./Pages/Issuers";
import Holders from "./Pages/Holders";
import Verifiers from "./Pages/Verifiers";
import Security from "./Pages/Security";
import Verify from "./Pages/Verify";
import About from "./Pages/About";
import Contact from "./Pages/Contact";
import LoginPage from "./Pages/Login";
import SignupPage from "./Pages/Signup";
import ForgotPasswordPage from "./Pages/ForgotPassword";
import FraudDetection from "./Pages/FraudDetection";
import PrivacyPolicyPage from "./Pages/PrivacyPolicyPage";
import BlockchainPage from "./Pages/Blockchain";
import Documentation from "./Pages/Documentation";
import Privacy from "./Pages/Privacy";

// Verifier dashboard
import VerifierDashLayout from "./Pages/VerifierDashLayout/VerifierDashLayout";
import VerifierDashboard from "./Pages/VerifierDashLayout/VerifierDashboard";
import VerificationHistory from "./Pages/VerifierDashLayout/VerificationHistory";
import SavedVerifications from "./Pages/VerifierDashLayout/SavedVerifications";
import VerificationReports from "./Pages/VerifierDashLayout/VerificationReports";


// ==================== ISSUER DASHBOARD ====================
import IssuerDashLayout from "./Pages/IssuerDashLayout/IssuerDashLayout";

import Overview from "./Components/IssuerDashComponents/Dashboard/Overview";
import Certificates from "./Components/IssuerDashComponents/Certificates/Certificates";
import IssueCertificate from "./Components/IssuerDashComponents/Certificates/IssueCertificate/IssueCertificate";
import {
  TemplatesProvider,
  default as Templates,
  TemplateEditor,
} from "./Components/IssuerDashComponents/Certificates/Templates/Templates";

import Verification from "./Components/IssuerDashComponents/Verifications/verification";
import {
  default as Revocations,
  RevocationsProvider,
  RevokeCertificate,
} from "./Components/IssuerDashComponents/Verifications/revocations";

import FraudAlerts from "./Components/IssuerDashComponents/Verifications/fraud&alerts";
import Analytics from "./Components/IssuerDashComponents/Analytics/analytics";
import AuditLogs from "./Components/IssuerDashComponents/AuditLogs/auditlogs";

import {
  default as Students,
  StudentsProvider,
  StudentCertificateHistory,
} from "./Components/IssuerDashComponents/Students/students";

import SettingsSidebar from "./Components/IssuerDashComponents/Settings/settingssidebar";
import Profile from "./Components/IssuerDashComponents/Settings/profile";
import Institution from "./Components/IssuerDashComponents/Settings/institution";
import UsersPermissions from "./Components/IssuerDashComponents/Settings/userspermissions";
import Notifications from "./Components/IssuerDashComponents/Settings/notifications";
import IssuerSecurity from "./Components/IssuerDashComponents/Settings/security";
import Branding from "./Components/IssuerDashComponents/Settings/branding";

// ==================== HOLDER DASHBOARD ====================
import { HolderDashboardLayout } from "./Pages/HolderDashLayout/HolderDashLayout";

import HolderHome from "./Components/HolderDashComponents/home";
import MyCertificates from "./Components/HolderDashComponents/Mycertificates";
import HolderVerification from "./Components/HolderDashComponents/Verification";
import Share from "./Components/HolderDashComponents/share";
import Activity from "./Components/HolderDashComponents/Activity";
import HolderProfile from "./Components/HolderDashComponents/Profile";

// ==================== ADMIN DASHBOARD ====================
import AdminDashLayout from "./Pages/AdminDashLayout/AdminDashLayout";

// TODO: Create these admin component files in ./Components/AdminDashComponents/
import AdminOverview from "./Components/AdminDashComponents/Overview";
import AdminInstitutions from "./Components/AdminDashComponents/Institutions";
import AdminUsers from "./Components/AdminDashComponents/Users";
import AdminIssuers from "./Components/AdminDashComponents/Issuers";
import AdminVerification from "./Components/AdminDashComponents/Verification";
import AdminFraud from "./Components/AdminDashComponents/Fraud";
import AdminBlockchain from "./Components/AdminDashComponents/Blockchain";
import AdminHealth from "./Components/AdminDashComponents/Health";
import AdminAudit from "./Components/AdminDashComponents/Audit";
import AdminSettings from "./Components/AdminDashComponents/Settings";


function ComingSoon({ label }: { label: string }) {
  return (
    <div
      className="min-h-screen flex items-center justify-center"
      style={{ background: "var(--bg-2)" }}
    >
      <div className="text-center">
        <p
          className="text-xs font-semibold tracking-widest mb-3"
          style={{ color: "var(--blue)" }}
        >
          COMING SOON
        </p>
        <h1
          className="font-extrabold text-4xl"
          style={{ color: "var(--navy)" }}
        >
          {label}
        </h1>
        <p
          className="mt-3 text-base"
          style={{ color: "var(--navy)", opacity: 0.5 }}
        >
          This section is under development.
        </p>
      </div>
    </div>
  );
}


export default function App() {
  return (
    <Routes>
      {/* ── Auth pages (no navbar/footer) ── */}
      <Route path="/app/login" element={<LoginPage />} />
      <Route path="/app/register" element={<SignupPage />} />
      <Route path="/app/forgot-password" element={<ForgotPasswordPage />} />

        {/* ── Public marketing pages ── */}
        <Route element={<Layout />}>
          <Route path="/" element={<Home />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/for-issuers" element={<Issuers />} />
          <Route path="/for-holders" element={<Holders />} />
          <Route path="/for-verifiers" element={<Verifiers />} />
          <Route path="/security" element={<Security />} />
          <Route path="/verify" element={<Verify />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/fraud-detection" element={<FraudDetection />} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
          <Route path="/blockchain" element={<BlockchainPage />} />
          <Route path="/docs" element={<Documentation />} />
          <Route path="/product-privacy" element={<Privacy />} />
        </Route>

        {/* ──────────────── DASHBOARDS (WITH /app PREFIX) ──────────────── */}

        {/* ── Verifier Dashboard ── */}
        <Route path="/verifierdashboard" element={<VerifierDashLayout />}>
          <Route index element={<VerifierDashboard />} />
          <Route path="verify" element={<Verify />} />
          <Route path="history" element={<VerificationHistory />} />
          <Route path="saved" element={<SavedVerifications />} />
          <Route path="reports" element={<VerificationReports />} />
          <Route path="profile" element={<ComingSoon label="Profile" />} />
        </Route>

        {/* ── Holder Dashboard ── */}
        <Route path="/holderdashboard" element={<HolderDashboardLayout />}>
          <Route index element={<HolderHome />} />
          <Route path="certificates" element={<MyCertificates />} />
          <Route path="verification" element={<HolderVerification />} />
          <Route path="share" element={<Share />} />
          <Route path="activity" element={<Activity />} />
          <Route path="profile" element={<HolderProfile />} />
        </Route>

        {/* ── Issuer Dashboard ── */}
        <Route
          path="/issuerdashboard"
          element={
            <TemplatesProvider>
              <IssuerDashLayout />
            </TemplatesProvider>
          }
        >
          <Route index element={<Overview />} />

          {/* Certificates */}
          <Route path="certificates" element={<Certificates />} />
          <Route path="issue" element={<IssueCertificate />} />
          <Route path="templates" element={<Templates />} />
          <Route path="templates/:templateId" element={<TemplateEditor />} />

          {/* Verification */}
          <Route path="verification" element={<Verification />} />

          {/* Revocations */}
          <Route
            path="revocations"
            element={
              <RevocationsProvider>
                <Revocations />
              </RevocationsProvider>
            }
          />

          <Route
            path="revocations/:certId"
            element={
              <RevocationsProvider>
                <RevokeCertificate />
              </RevocationsProvider>
            }
          />

          {/* Fraud Alerts */}
          <Route path="fraud-alerts" element={<FraudAlerts />} />

          {/* Analytics */}
          <Route path="analytics" element={<Analytics />} />

          {/* Audit Logs */}
          <Route path="audit-logs" element={<AuditLogs />} />

          {/* Students */}
          <Route
            path="students"
            element={
              <StudentsProvider>
                <Students />
              </StudentsProvider>
            }
          />

          <Route
            path="students/:studentId"
            element={
              <StudentsProvider>
                <StudentCertificateHistory />
              </StudentsProvider>
            }
          />

          {/* Settings */}
          <Route path="settings" element={<SettingsSidebar />}>
            <Route path="profile" element={<Profile />} />
            <Route path="institution" element={<Institution />} />
            <Route path="users-permissions" element={<UsersPermissions />} />
            <Route path="notifications" element={<Notifications />} />
            <Route path="security" element={<IssuerSecurity />} />
            <Route path="branding" element={<Branding />} />
          </Route>
        </Route>

        {/* ── Admin Dashboard ── */}
        <Route path="/dashboard/admin" element={<AdminDashLayout />}>
          <Route index element={<AdminOverview />} />
          <Route path="institutions" element={<AdminInstitutions />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="issuers" element={<AdminIssuers />} />
          <Route path="verification" element={<AdminVerification />} />
          <Route path="fraud" element={<AdminFraud />} />
          <Route path="blockchain" element={<AdminBlockchain />} />
          <Route path="health" element={<AdminHealth />} />
          <Route path="audit" element={<AdminAudit />} />
          <Route path="settings" element={<AdminSettings />} />
        </Route>

        {/* ── 404 Fallback (Must be last) ── */}
        <Route path="*" element={<ComingSoon label="Page Not Found" />} />
      </Routes>
    
  );
}
