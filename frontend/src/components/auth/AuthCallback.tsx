import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import api from "@/components/api/api";
import { toast } from "sonner";
import { Progress } from "@/components/ui/progress";

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
  const [progress, setProgress] = useState(10);
  const successToastShown = useRef(false);
  const errorToastShown = useRef(false);

  // First effect to capture the hash data immediately
  useEffect(() => {
    setProgress(10);
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
    setProgress(30);
  }, []); // Run only once on mount

  // Progress animation effect
  useEffect(() => {
    if (!tokenData) return;

    const timer = setTimeout(() => {
      setProgress((prev) => Math.min(prev + 20, 90));
    }, 500);

    return () => clearTimeout(timer);
  }, [tokenData, progress]);

  // Second effect to handle the token exchange
  useEffect(() => {
    const exchangeTokens = async () => {
      if (!tokenData) return;

      try {
        console.log("Sending tokens to backend...");
        setProgress(50);

        const response = await api.post(
          "/auth/callback/token-exchange",
          tokenData
        );

        console.log("Response data:", response.data);
        setProgress(70);

        if (!response.data.success) {
          throw new Error("Failed to exchange tokens");
        }

        // Wait for a moment to ensure cookies are set
        await new Promise((resolve) => setTimeout(resolve, 1000));
        setProgress(90);

        // Update auth state
        await checkAuth();
        setProgress(100);

        // Show success toast only once
        if (!successToastShown.current) {
          toast.success("Successfully signed in with Google!");
          successToastShown.current = true;
        }

        // Navigate to home page
        navigate("/home", { replace: true });
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
    if (error && !errorToastShown.current) {
      toast.error("Failed to sign in with Google. Please try again.");
      errorToastShown.current = true;
      navigate(`/sign-in?error=${encodeURIComponent(error)}`, {
        replace: true,
      });
    }
  }, [error, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center w-full max-w-md px-4">
        <h2 className="text-xl font-semibold mb-4">Completing sign in</h2>
        <Progress value={progress} className="h-2 mb-4" />
        <p className="text-gray-600">
          {progress < 50
            ? "Verifying credentials..."
            : progress < 80
            ? "Authenticating your account..."
            : "Almost there..."}
        </p>
      </div>
    </div>
  );
}
