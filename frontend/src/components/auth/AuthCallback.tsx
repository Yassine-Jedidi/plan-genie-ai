import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export function AuthCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleCallback = async () => {
      try {
        // Get the hash fragment from the URL
        const hash = window.location.hash.substring(1);
        const params = new URLSearchParams(hash);

        // Extract tokens and other data
        const access_token = params.get("access_token");
        const refresh_token = params.get("refresh_token");
        const expires_in = params.get("expires_in");
        const provider_token = params.get("provider_token");
        const provider_refresh_token = params.get("provider_refresh_token");

        if (!access_token) {
          throw new Error("No access token found in URL");
        }

        // Send tokens to backend
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/auth/callback/token-exchange`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              access_token,
              refresh_token,
              expires_in,
              provider_token,
              provider_refresh_token,
            }),
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to exchange tokens");
        }

        // Redirect to home page or dashboard
        navigate("/");
      } catch (error) {
        console.error("Auth callback error:", error);
        // Redirect to sign-in page with error
        navigate("/sign-in?error=Authentication failed");
      }
    };

    handleCallback();
  }, [navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Completing sign in...</h2>
        <p className="text-gray-600">Please wait while we authenticate you.</p>
      </div>
    </div>
  );
}
