import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/api";
import { useAuth } from "@/hooks/use-auth";

export function AuthCallback() {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the hash fragment and parse it
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);

        const tokens = {
          access_token: params.get("access_token"),
          refresh_token: params.get("refresh_token"),
        };

        if (!tokens.access_token) {
          throw new Error("No access token provided");
        }

        // Exchange tokens with backend
        await api.post("/auth/callback/token-exchange", tokens);
        await checkAuth(); // Update auth context

        // Redirect to home page
        navigate("/", { replace: true });
      } catch (error) {
        console.error("Auth callback error:", error);
        navigate("/sign-in", {
          replace: true,
          state: { error: "Authentication failed. Please try again." },
        });
      }
    };

    handleCallback();
  }, [navigate, checkAuth]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <p>Processing authentication...</p>
    </div>
  );
}
