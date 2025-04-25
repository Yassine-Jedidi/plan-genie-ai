import { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import api from "@/components/api/api";
import { toast } from "sonner";

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
  const [statusMessage, setStatusMessage] = useState("Initializing...");
  const [retries, setRetries] = useState(0);
  const successToastShown = useRef(false);
  const errorToastShown = useRef(false);
  const progressRef = useRef(0);
  const progressIntervalRef = useRef<number | null>(null);
  const maxRetries = 3;

  // Function to smoothly increment progress
  const startProgressIncrement = (
    startValue: number,
    endValue: number,
    duration: number,
    newStatus?: string
  ) => {
    // Clear any existing interval
    if (progressIntervalRef.current !== null) {
      window.clearInterval(progressIntervalRef.current);
    }

    // Update status message if provided
    if (newStatus) {
      setStatusMessage(newStatus);
    }

    // Set starting value immediately
    setProgressSafe(startValue);

    // Calculate increment steps
    const steps = Math.max(1, Math.floor(duration / 100)); // Update roughly every 100ms
    const increment = (endValue - startValue) / steps;
    let currentStep = 0;

    // Start interval
    progressIntervalRef.current = window.setInterval(() => {
      currentStep++;
      const newProgress = startValue + increment * currentStep;

      if (currentStep >= steps || newProgress >= endValue) {
        setProgressSafe(endValue);
        window.clearInterval(progressIntervalRef.current!);
        progressIntervalRef.current = null;
      } else {
        setProgressSafe(newProgress);
      }
    }, 100);
  };

  const setProgressSafe = (value: number) => {
    // Prevent decreasing progress and ensure it's within bounds
    const safeValue = Math.min(100, Math.max(0, value));
    if (safeValue >= progressRef.current) {
      progressRef.current = safeValue;
      setProgress(safeValue);
    }
  };

  // Clean up interval on unmount
  useEffect(() => {
    return () => {
      if (progressIntervalRef.current !== null) {
        window.clearInterval(progressIntervalRef.current);
      }
    };
  }, []);

  // Start with initial progress as soon as component mounts
  useEffect(() => {
    // Start immediately visible (1%) to ensure user sees activity
    setProgress(1);

    // Then begin the first animation
    setTimeout(() => {
      startProgressIncrement(1, 10, 600, "Initializing authentication...");
    }, 100);
  }, []);

  // First stage: Parse hash tokens
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
    startProgressIncrement(10, 30, 800, "Verifying credentials...");
  }, []);

  // Second stage: Exchange tokens with backend
  useEffect(() => {
    const exchangeTokens = async () => {
      if (!tokenData) return;

      try {
        // Progress during API call preparation
        startProgressIncrement(30, 45, 600, "Preparing token exchange...");

        // Short delay to show the preparation step
        await new Promise((resolve) => setTimeout(resolve, 400));

        // Progress during actual API call
        startProgressIncrement(
          45,
          60,
          1000,
          "Exchanging tokens with server..."
        );

        const response = await api.post(
          "/auth/callback/token-exchange",
          tokenData
        );

        if (!response.data.success) {
          throw new Error("Failed to exchange tokens");
        }

        // Progress after successful API call
        startProgressIncrement(60, 75, 600, "Establishing secure session...");

        // Allow cookies to be set with a longer delay
        await new Promise((resolve) => setTimeout(resolve, 800));

        // Progress during auth check
        startProgressIncrement(75, 90, 800, "Validating your account...");

        try {
          // Try checking auth with retry mechanism
          await checkAuth();
        } catch (authError) {
          console.error("Auth check failed, retrying...", authError);

          if (retries < maxRetries) {
            // Increment retry counter
            setRetries((prev) => prev + 1);

            // Wait a bit longer before retry
            await new Promise((resolve) => setTimeout(resolve, 1000));

            // Try one more time
            await checkAuth();
          } else {
            throw new Error(
              "Failed to verify authentication after multiple attempts"
            );
          }
        }

        if (!successToastShown.current) {
          toast.success("Successfully signed in with Google!");
          successToastShown.current = true;
        }

        // Final progress before navigation
        startProgressIncrement(90, 100, 500, "Redirecting to dashboard...");

        // Give time for the progress to complete
        setTimeout(() => {
          navigate("/home", { replace: true });
        }, 800);
      } catch (err) {
        console.error("Auth callback error:", err);

        // If we've already tried multiple times, show the error
        if (retries >= maxRetries) {
          setError(
            err instanceof Error ? err.message : "Authentication failed"
          );
        } else {
          // Otherwise try again with an incremental delay
          setRetries((prev) => prev + 1);
          const retryDelay = 1000 * (retries + 1); // Incremental backoff

          setStatusMessage(
            `Retrying... (Attempt ${retries + 1}/${maxRetries + 1})`
          );

          // Retry the entire exchange process
          setTimeout(() => {
            // Reset progress to start fresh
            startProgressIncrement(30, 45, 600, "Preparing token exchange...");
            exchangeTokens();
          }, retryDelay);
        }
      }
    };

    if (tokenData) {
      exchangeTokens();
    }
  }, [tokenData, checkAuth, navigate, retries, maxRetries]);

  // Final stage: Handle errors
  useEffect(() => {
    if (error && !errorToastShown.current) {
      setStatusMessage("Authentication failed");
      toast.error("Failed to sign in with Google. Please try again.");
      errorToastShown.current = true;

      // Short delay before navigating away
      setTimeout(() => {
        navigate(`/sign-in?error=${encodeURIComponent(error)}`, {
          replace: true,
        });
      }, 1000);
    }
  }, [error, navigate]);

  // Handle successful silent auth
  useEffect(() => {
    // If auth was checked successfully but we got an error during the flow
    // This can happen when cookies were set but we didn't detect it
    const checkSilentAuth = async () => {
      try {
        // If we get an auth error but cookies are actually set correctly,
        // this will still succeed and we can redirect the user
        if (error && !successToastShown.current) {
          const response = await api.get("/auth/me");
          if (response.data?.user) {
            // User is actually authenticated
            toast.success("Successfully signed in with Google!");
            successToastShown.current = true;
            navigate("/home", { replace: true });
          }
        }
      } catch {
        // Silently fail - we're just checking if auth actually succeeded
      }
    };

    // Only run this check if we've shown an error but not success
    if (error && errorToastShown.current && !successToastShown.current) {
      // Delay this check to allow cookies to be processed
      const timeout = setTimeout(checkSilentAuth, 1500);
      return () => clearTimeout(timeout);
    }
  }, [error, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <div className="text-center w-full max-w-md px-4">
        <h2 className="text-xl font-semibold mb-4">Completing Sign In</h2>
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4 dark:bg-gray-700">
          <div
            className="bg-primary h-2.5 rounded-full transition-all duration-300 ease-in-out"
            style={{ width: `${Math.max(1, progress)}%` }}
          />
        </div>
        <p className="text-gray-600 animate-fade-in transition-opacity">
          {statusMessage}
        </p>
        {retries > 0 && (
          <p className="text-amber-600 text-sm mt-2">
            Retrying connection... ({retries}/{maxRetries + 1})
          </p>
        )}
      </div>
    </div>
  );
}
