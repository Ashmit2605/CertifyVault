import { useEffect, useState } from "react";
import { useAuth, useClerk } from "@clerk/clerk-react";
import { Navigate, useLocation } from "react-router-dom";
import PageLoader from "../layout/PageLoader";
import {
  dashboardForRole,
  getCurrentUser,
  type UserProfile,
} from "../../utils/authApi";

type Props = {
  role: UserProfile["role"];
  children: React.ReactNode;
};

export default function RequireAuth({ role, children }: Props) {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const { signOut } = useClerk();
  const location = useLocation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) return;

    let active = true;
    void (async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("Unable to establish a secure session.");
        const currentUser = await getCurrentUser(token);
        if (!currentUser.isActive) {
          throw new Error("This CertifyVault account is inactive.");
        }
        if (active) setProfile(currentUser);
      } catch (loadError) {
        if (active) {
          setError(
            loadError instanceof Error
              ? loadError.message
              : "Unable to validate your account.",
          );
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [getToken, isLoaded, isSignedIn]);

  if (!isLoaded) return <PageLoader />;
  if (!isSignedIn) {
    return (
      <Navigate
        to="/app/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }
  if (error) {
    const profileMissing = error.includes("No active CertifyVault profile");
    const accountInactive = error.includes("contact an administrator for activation");
    return (
      <div
        className="min-h-screen flex items-center justify-center px-6"
        style={{ background: "var(--bg-2)" }}
      >
        <div className="max-w-md rounded-2xl bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold" style={{ color: "var(--navy)" }}>
            {profileMissing
              ? "Finish setting up your account"
              : accountInactive
                ? "Account activation required"
                : "Unable to verify your account"}
          </h1>
          <p className="mt-3 text-sm" style={{ color: "var(--navy)", opacity: 0.65 }}>
            {profileMissing
              ? "Your Clerk login is valid, but no CertifyVault profile is linked to it yet. Sign out and complete registration."
              : accountInactive
                ? "Your account is inactive. Please contact an administrator for activation."
              : error}
          </p>
          <button
            type="button"
            onClick={() => void signOut({ redirectUrl: "/app/login" })}
            className="mt-6 rounded-xl px-5 py-3 text-sm font-semibold text-white"
            style={{ background: "var(--blue)" }}
          >
            Sign out
          </button>
        </div>
      </div>
    );
  }
  if (!profile) return <PageLoader />;
  if (profile.role !== role) {
    return <Navigate to={dashboardForRole(profile.role)} replace />;
  }

  return children;
}
