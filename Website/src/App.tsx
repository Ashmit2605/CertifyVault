import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
import Security from "./Components/IssuerDashComponents/Settings/security";
import Branding from "./Components/IssuerDashComponents/Settings/branding";

// ==================== HOLDER DASHBOARD ====================
import { HolderDashboardLayout } from "./Pages/HolderDashLayout/HolderDashLayout";

import Home from "./Components/HolderDashComponents/home";
import MyCertificates from "./Components/HolderDashComponents/Mycertificates";
import HolderVerification from "./Components/HolderDashComponents/Verification";
import Share from "./Components/HolderDashComponents/share";
import Activity from "./Components/HolderDashComponents/Activity";
import HolderProfile from "./Components/HolderDashComponents/Profile";

// ==================== 404 PAGE ====================
function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-bold text-gray-900">404</h1>

      <p className="text-xl text-gray-600">
        Page not found
      </p>

      <p className="text-sm text-gray-500">
        The page you're looking for doesn't exist.
      </p>

      <a
        href="/holderdashboard"
        className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700"
      >
        Go to Dashboard
      </a>
    </div>
  );
}

// ==================== APP ====================
function App() {
  return (
    <BrowserRouter>
      <Routes>

        {/* ==================== PUBLIC SITE ==================== */}
        <Route
          path="/"
          element={<Navigate to="/holderdashboard" replace />}
        />

        {/* ==================== HOLDER DASHBOARD ==================== */}
        <Route
          path="/holderdashboard"
          element={<HolderDashboardLayout />}
        >
          <Route index element={<Home />} />
          <Route path="certificates" element={<MyCertificates />} />
          <Route path="verification" element={<HolderVerification />} />
          <Route path="share" element={<Share />} />
          <Route path="activity" element={<Activity />} />
          <Route path="profile" element={<HolderProfile />} />
        </Route>

        {/* ==================== ISSUER DASHBOARD ==================== */}
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
          <Route
            path="templates/:templateId"
            element={<TemplateEditor />}
          />

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
          <Route
            path="fraud-alerts"
            element={<FraudAlerts />}
          />

          {/* Analytics */}
          <Route
            path="analytics"
            element={<Analytics />}
          />

          {/* Audit Logs */}
          <Route
            path="audit-logs"
            element={<AuditLogs />}
          />

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
          <Route
            path="settings"
            element={<SettingsSidebar />}
          >
            <Route
              index
              element={<Navigate to="profile" replace />}
            />

            <Route
              path="profile"
              element={<Profile />}
            />

            <Route
              path="institution"
              element={<Institution />}
            />

            <Route
              path="users-permissions"
              element={<UsersPermissions />}
            />

            <Route
              path="notifications"
              element={<Notifications />}
            />

            <Route
              path="security"
              element={<Security />}
            />

            <Route
              path="branding"
              element={<Branding />}
            />
          </Route>
        </Route>

        {/* ==================== 404 ==================== */}
        <Route path="*" element={<NotFound />} />

      </Routes>
    </BrowserRouter>
  );
}

export default App;