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
  const [progress, setProgress] = useState(0);
  const successToastShown = useRef(false);
  const errorToastShown = useRef(false);
  const progressRef = useRef(0);

  const setProgressSafe = (value: number) => {
    // Prevent decreasing progress
    if (value > progressRef.current) {
      progressRef.current = value;
      setProgress(value);
    }
  };

  // First stage: Parse hash tokens
  useEffect(() => {
    setProgressSafe(10);
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
    setProgressSafe(30);
  }, []);

  // Second stage: Exchange tokens with backend
  useEffect(() => {
    const exchangeTokens = async () => {
      if (!tokenData) return;

      try {
        setProgressSafe(50);

        const response = await api.post(
          "/auth/callback/token-exchange",
          tokenData
        );

        if (!response.data.success) {
          throw new Error("Failed to exchange tokens");
        }

        setProgressSafe(70);

        // Allow cookies to be set
        await new Promise((resolve) => setTimeout(resolve, 500));

        // Check auth and update state
        await checkAuth();
        setProgressSafe(90);

        if (!successToastShown.current) {
          toast.success("Successfully signed in with Google!");
          successToastShown.current = true;
        }

        setProgressSafe(100);

        setTimeout(() => {
          navigate("/home", { replace: true });
        }, 300);
      } catch (err) {
        console.error("Auth callback error:", err);
        setError(err instanceof Error ? err.message : "Authentication failed");
      }
    };

    if (tokenData) {
      exchangeTokens();
    }
  }, [tokenData, checkAuth, navigate]);

  // Final stage: Handle errors
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
          {progress < 30
            ? "Initializing..."
            : progress < 50
            ? "Verifying credentials..."
            : progress < 70
            ? "Exchanging tokens..."
            : progress < 90
            ? "Checking account..."
            : "Almost there..."}
        </p>
      </div>
    </div>
  );
}
