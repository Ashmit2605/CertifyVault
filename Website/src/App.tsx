import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { HolderDashboardLayout } from "./Pages/HolderDashLayout/HolderDashLayout";

// Import Holder Dashboard Components
import Home from "./Components/HolderDashComponents/home";
import MyCertificates from "./Components/HolderDashComponents/Mycertificates";
import Verification from "./Components/HolderDashComponents/Verification";
import Share from "./Components/HolderDashComponents/share";
import Activity from "./Components/HolderDashComponents/Activity";
import Profile from "./Components/HolderDashComponents/Profile";

// 404 Not Found Page
function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 text-center">
      <h1 className="text-4xl font-bold text-gray-900">404</h1>
      <p className="text-xl text-gray-600">Page not found</p>
      <p className="text-sm text-gray-500">
        The page you're looking for doesn't exist.
      </p>
      <a href="/holderdashboard" className="mt-4 rounded-lg bg-blue-600 px-6 py-2 text-white hover:bg-blue-700">
        Go to Dashboard
      </a>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to the holder dashboard */}
        <Route path="/" element={<Navigate to="/holderdashboard" replace />} />

        {/* Holder Dashboard Layout with nested routes */}
        <Route path="/holderdashboard" element={<HolderDashboardLayout />}>
          <Route index element={<Home />} />
          <Route path="certificates" element={<MyCertificates />} />
          <Route path="verification" element={<Verification />} />
          <Route path="share" element={<Share />} />
          <Route path="activity" element={<Activity />} />
          <Route path="profile" element={<Profile />} />
        </Route>

        {/* Catch all - 404 page */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}