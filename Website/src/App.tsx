import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PageLoader from "./Components/layout/PageLoader";
import RequireAuth from "./Components/auth/RequireAuth";

const Layout = lazy(() => import("./Components/layout/Layout"));
const Home = lazy(() => import("./Pages/Home"));
const HowItWorks = lazy(() => import("./Pages/HowItWorks"));
const Issuers = lazy(() => import("./Pages/Issuers"));
const Holders = lazy(() => import("./Pages/Holders"));
const Verifiers = lazy(() => import("./Pages/Verifiers"));
const Security = lazy(() => import("./Pages/Security"));
const Verify = lazy(() => import("./Pages/Verify"));
const About = lazy(() => import("./Pages/About"));
const Contact = lazy(() => import("./Pages/Contact"));
const LoginPage = lazy(() => import("./Pages/Login"));
const SignupPage = lazy(() => import("./Pages/Signup"));
const ForgotPasswordPage = lazy(() => import("./Pages/ForgotPassword"));
const AuthCallbackPage = lazy(() => import("./Pages/AuthCallback"));
const FraudDetection = lazy(() => import("./Pages/FraudDetection"));
const PrivacyPolicyPage = lazy(() => import("./Pages/PrivacyPolicyPage"));
const BlockchainPage = lazy(() => import("./Pages/Blockchain"));
const Documentation = lazy(() => import("./Pages/Documentation"));
const Privacy = lazy(() => import("./Pages/Privacy"));

// Verifier dashboard
const VerifierDashLayout = lazy(() => import("./Pages/VerifierDashLayout/VerifierDashLayout"));
const VerifierDashboard = lazy(() => import("./Pages/VerifierDashLayout/VerifierDashboard"));
const VerificationHistory = lazy(() => import("./Pages/VerifierDashLayout/VerificationHistory"));
const SavedVerifications = lazy(() => import("./Pages/VerifierDashLayout/SavedVerifications"));
const VerificationReports = lazy(() => import("./Pages/VerifierDashLayout/VerificationReports"));
const VerifierProfile = lazy(() => import("./Pages/VerifierDashLayout/VerifierProfile"));

// Issuer dashboard
const IssuerDashLayout = lazy(() => import("./Pages/IssuerDashLayout/IssuerDashLayout"));
const Overview = lazy(() => import("./Components/IssuerDashComponents/Dashboard/Overview"));
const Certificates = lazy(() => import("./Components/IssuerDashComponents/Certificates/Certificates"));
const IssueCertificate = lazy(() => import("./Components/IssuerDashComponents/Certificates/IssueCertificate/IssueCertificate"));
const TemplatesProvider = lazy(async () => {
  const module = await import("./Components/IssuerDashComponents/Certificates/Templates/Templates");
  return { default: module.TemplatesProvider };
});
const Templates = lazy(() => import("./Components/IssuerDashComponents/Certificates/Templates/Templates"));
const TemplateEditor = lazy(async () => {
  const module = await import("./Components/IssuerDashComponents/Certificates/Templates/Templates");
  return { default: module.TemplateEditor };
});
const Verification = lazy(() => import("./Components/IssuerDashComponents/Verifications/verification"));
const RevocationsProvider = lazy(async () => {
  const module = await import("./Components/IssuerDashComponents/Verifications/revocations");
  return { default: module.RevocationsProvider };
});
const Revocations = lazy(() => import("./Components/IssuerDashComponents/Verifications/revocations"));
const RevokeCertificate = lazy(async () => {
  const module = await import("./Components/IssuerDashComponents/Verifications/revocations");
  return { default: module.RevokeCertificate };
});
const FraudAlerts = lazy(() => import("./Components/IssuerDashComponents/Verifications/fraud&alerts"));
const Analytics = lazy(() => import("./Components/IssuerDashComponents/Analytics/analytics"));
const AuditLogs = lazy(() => import("./Components/IssuerDashComponents/AuditLogs/auditlogs"));
const StudentsProvider = lazy(async () => {
  const module = await import("./Components/IssuerDashComponents/Students/students");
  return { default: module.StudentsProvider };
});
const Students = lazy(() => import("./Components/IssuerDashComponents/Students/students"));
const StudentCertificateHistory = lazy(async () => {
  const module = await import("./Components/IssuerDashComponents/Students/students");
  return { default: module.StudentCertificateHistory };
});
const SettingsSidebar = lazy(() => import("./Components/IssuerDashComponents/Settings/settingssidebar"));
const Profile = lazy(() => import("./Components/IssuerDashComponents/Settings/profile"));
const Institution = lazy(() => import("./Components/IssuerDashComponents/Settings/institution"));
const UsersPermissions = lazy(() => import("./Components/IssuerDashComponents/Settings/userspermissions"));
const Notifications = lazy(() => import("./Components/IssuerDashComponents/Settings/notifications"));
const IssuerSecurity = lazy(() => import("./Components/IssuerDashComponents/Settings/security"));
const Branding = lazy(() => import("./Components/IssuerDashComponents/Settings/branding"));

// Holder dashboard
const HolderDashboardLayout = lazy(async () => {
  const module = await import("./Pages/HolderDashLayout/HolderDashLayout");
  return { default: module.HolderDashboardLayout };
});
const HolderHome = lazy(() => import("./Components/HolderDashComponents/home"));
const MyCertificates = lazy(() => import("./Components/HolderDashComponents/Mycertificates"));
const HolderVerification = lazy(() => import("./Components/HolderDashComponents/Verification"));
const Share = lazy(() => import("./Components/HolderDashComponents/share"));
const Activity = lazy(() => import("./Components/HolderDashComponents/Activity"));
const HolderProfile = lazy(() => import("./Components/HolderDashComponents/Profile"));

// Administrator dashboard
const AdminDashLayout = lazy(() => import("./Pages/AdminDashLayout/AdminDashLayout"));
const AdminOverview = lazy(() => import("./Components/AdminDashComponents/Overview"));
const AdminInstitutions = lazy(() => import("./Components/AdminDashComponents/Institutions"));
const AdminUsers = lazy(() => import("./Components/AdminDashComponents/Users"));
const AdminIssuers = lazy(() => import("./Components/AdminDashComponents/Issuers"));
const AdminVerification = lazy(() => import("./Components/AdminDashComponents/Verification"));
const AdminFraud = lazy(() => import("./Components/AdminDashComponents/Fraud"));
const AdminBlockchain = lazy(() => import("./Components/AdminDashComponents/Blockchain"));
const AdminHealth = lazy(() => import("./Components/AdminDashComponents/Health"));
const AdminAudit = lazy(() => import("./Components/AdminDashComponents/Audit"));
const AdminSettings = lazy(() => import("./Components/AdminDashComponents/Settings"));


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
    <Suspense fallback={<PageLoader />}>
    <Routes>
      {/* ── Auth pages (no navbar/footer) ── */}
      <Route path="/app/login" element={<LoginPage />} />
      <Route path="/app/register" element={<SignupPage />} />
      <Route path="/app/forgot-password" element={<ForgotPasswordPage />} />
      <Route path="/app/auth-callback" element={<AuthCallbackPage />} />

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

      {/* ──────────────── DASHBOARDS ──────────────── */}

      {/* ── Verifier Dashboard ── */}
      <Route path="/verifierdashboard" element={<RequireAuth role="verifier"><VerifierDashLayout /></RequireAuth>}>
        <Route index element={<VerifierDashboard />} />
        <Route path="verify" element={<Verify />} />
        <Route path="history" element={<VerificationHistory />} />
        <Route path="saved" element={<SavedVerifications />} />
        <Route path="reports" element={<VerificationReports />} />
        <Route path="profile" element={<VerifierProfile />} />
      </Route>

      {/* ── Holder Dashboard ── */}
      <Route path="/holderdashboard" element={<RequireAuth role="holder"><HolderDashboardLayout /></RequireAuth>}>
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
          <RequireAuth role="issuer">
            <TemplatesProvider>
              <IssuerDashLayout />
            </TemplatesProvider>
          </RequireAuth>
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
          <Route index element={<Navigate to="profile" replace />} />
          <Route path="profile" element={<Profile />} />
          <Route path="institution" element={<Institution />} />
          <Route path="users-permissions" element={<UsersPermissions />} />
          <Route path="notifications" element={<Notifications />} />
          <Route path="security" element={<IssuerSecurity />} />
          <Route path="branding" element={<Branding />} />
        </Route>
      </Route>

      {/* ── Admin Dashboard ── */}
      <Route path="/admindashboard" element={<RequireAuth role="admin"><AdminDashLayout /></RequireAuth>}>
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
    </Suspense>
  );
}
