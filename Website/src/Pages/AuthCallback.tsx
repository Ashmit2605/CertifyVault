import { useEffect, useRef } from "react";
import { useAuth } from "@clerk/clerk-react";
import { useLocation, useNavigate } from "react-router-dom";
import PageLoader from "../Components/layout/PageLoader";
import { dashboardForRole, getCurrentUser } from "../utils/authApi";

export default function AuthCallbackPage() {
  const { getToken, isLoaded, isSignedIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const handled = useRef(false);

  useEffect(() => {
    if (!isLoaded) return;
    if (!isSignedIn) {
      navigate("/app/login", { replace: true });
      return;
    }
    if (handled.current) return;

    handled.current = true;
    void (async () => {
      try {
        const token = await getToken();
        if (!token) throw new Error("Unable to establish a secure session.");
        const profile = await getCurrentUser(token);
        const state: unknown = location.state;
        const returnTo =
          typeof state === "object" &&
          state !== null &&
          "returnTo" in state &&
          typeof state.returnTo === "string" &&
          state.returnTo.startsWith("/") &&
          !state.returnTo.startsWith("//")
            ? state.returnTo
            : dashboardForRole(profile.role);
        navigate(returnTo, { replace: true });
      } catch (error) {
        if (error instanceof Error && error.message.includes("No active CertifyVault profile")) {
          navigate("/app/register", { replace: true });
          return;
        }
        navigate("/app/login", {
          replace: true,
          state: {
            authError:
              error instanceof Error
                ? error.message
                : "Unable to validate your account.",
          },
        });
      }
    })();
  }, [getToken, isLoaded, isSignedIn, location.state, navigate]);

  if (!isLoaded || !isSignedIn) return <PageLoader />;
  return <PageLoader />;
}
