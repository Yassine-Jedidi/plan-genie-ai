import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import api from "@/components/api/api";

interface TokenData {
  access_token: string | null;
  refresh_token: string | null;
  expires_in: string | null;
  provider_token: string | null;
  provider_refresh_token: string | null;
}

export function AuthCallback() {
  const navigate = useNavigate();
  const { checkAuth } = useAuth();
  const [tokenData, setTokenData] = useState<TokenData | null>(null);
  const [error, setError] = useState<string | null>(null);

  // First effect to capture the hash data immediately
  useEffect(() => {
    const hash = window.location.hash;
    if (!hash) {
      setError("No hash fragment found");
      return;
    }

    const params = new URLSearchParams(hash.substring(1));
    const data = {
      access_token: params.get("access_token"),
      refresh_token: params.get("refresh_token"),
      expires_in: params.get("expires_in"),
      provider_token: params.get("provider_token"),
      provider_refresh_token: params.get("provider_refresh_token"),
    };

    if (!data.access_token) {
      setError("No access token found in URL");
      return;
    }

    setTokenData(data);
  }, []); // Run only once on mount

  // Second effect to handle the token exchange
  useEffect(() => {
    const exchangeTokens = async () => {
      if (!tokenData) return;

      try {
        console.log("Sending tokens to backend...");

        const response = await api.post(
          "/auth/callback/token-exchange",
          tokenData
        );

        console.log("Response data:", response.data);

        if (!response.data.success) {
          throw new Error("Failed to exchange tokens");
        }

        // Wait for a moment to ensure cookies are set
        await new Promise((resolve) => setTimeout(resolve, 1000));

        // Update auth state
        await checkAuth();

        // Navigate to home page
        navigate("/", { replace: true });
      } catch (err) {
        console.error("Auth callback error:", err);
        setError(err instanceof Error ? err.message : "Authentication failed");
      }
    };

    if (tokenData) {
      exchangeTokens();
    }
  }, [tokenData, navigate, checkAuth]);

  // Final effect to handle errors
  useEffect(() => {
    if (error) {
      navigate(`/sign-in?error=${encodeURIComponent(error)}`, {
        replace: true,
      });
    }
  }, [error, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-semibold mb-2">Completing sign in...</h2>
        <p className="text-gray-600">Please wait while we authenticate you.</p>
      </div>
    </div>
  );
}
