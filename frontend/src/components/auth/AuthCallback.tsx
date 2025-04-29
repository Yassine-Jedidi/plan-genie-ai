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
  const [statusMessage, setStatusMessage] = useState("Initializing...");
  const [retries, setRetries] = useState(0);
  const [isStuck, setIsStuck] = useState(false);
  // processingStage is used for debugging and monitoring auth flow progress
  const [processingStage, setProcessingStage] = useState(0);
  const successToastShown = useRef(false);
  const errorToastShown = useRef(false);
  const progressRef = useRef(0);
  const progressIntervalRef = useRef<number | null>(null);
  const maxRetries = 3;
  const navigationReadyRef = useRef(false);
  const stuckTimerRef = useRef<number | null>(null);

  // Reset the stuck timer whenever progress changes
  useEffect(() => {
    // Clear any existing stuck timer
    if (stuckTimerRef.current) {
      window.clearTimeout(stuckTimerRef.current);
    }

    // If we're already at 100% or have an error, don't set a new timer
    if (progress >= 100 || error || isStuck) {
      return;
    }

    // Set a new stuck timer - if progress doesn't change in 10 seconds, consider it stuck
    stuckTimerRef.current = window.setTimeout(() => {
      if (progress > 0 && progress < 100) {
        console.log(
          "Progress appears to be stuck at",
          progress,
          "in stage",
          processingStage
        );
        setIsStuck(true);
      }
    }, 10000);

    return () => {
      if (stuckTimerRef.current) {
        window.clearTimeout(stuckTimerRef.current);
      }
    };
  }, [progress, error, isStuck, processingStage]);

  // Function to smoothly increment progress
  const startProgressIncrement = (
    startValue: number,
    endValue: number,
    duration: number,
    newStatus?: string,
    onComplete?: () => void
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

        // Execute callback when progress is complete
        if (onComplete && typeof onComplete === "function") {
          onComplete();
        }
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

    // Then begin the first animation - FASTER
    setTimeout(() => {
      startProgressIncrement(1, 10, 300, "Initializing authentication...");
    }, 50);
  }, []);

  // Define the exchangeTokens function before it's referenced
  const exchangeTokens = async () => {
    if (!tokenData) return;

    // Track the current stage of processing
    setProcessingStage(1);

    try {
      // Progress during API call preparation - FASTER
      startProgressIncrement(30, 45, 300, "Preparing token exchange...");

      // Short delay to show the preparation step - FASTER
      await new Promise((resolve) => setTimeout(resolve, 200));

      // Progress during actual API call - FASTER
      setProcessingStage(2);
      startProgressIncrement(45, 60, 500, "Exchanging tokens with server...");

      const response = await api.post(
        "/auth/callback/token-exchange",
        tokenData
      );

      if (!response.data.success) {
        throw new Error("Failed to exchange tokens");
      }

      // Progress after successful API call - FASTER
      setProcessingStage(3);
      startProgressIncrement(60, 75, 300, "Establishing secure session...");

      // Allow cookies to be set with a shorter delay - FASTER
      await new Promise((resolve) => setTimeout(resolve, 400));

      // Progress during auth check - FASTER
      setProcessingStage(4);
      startProgressIncrement(75, 90, 400, "Validating your account...");

      try {
        // Try checking auth with retry mechanism
        await checkAuth();
      } catch (authError) {
        console.error("Auth check failed, retrying...", authError);

        if (retries < maxRetries) {
          // Increment retry counter
          setRetries((prev) => prev + 1);

          // Wait a bit before retry - FASTER
          await new Promise((resolve) => setTimeout(resolve, 500));

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

      // Final progress before navigation - FASTER
      setProcessingStage(5);
      startProgressIncrement(
        90,
        100,
        500,
        "Redirecting to home page...",
        () => {
          // Set navigationReadyRef to true to indicate progress is complete
          navigationReadyRef.current = true;
          // Navigate only after progress bar is fully complete
          navigate("/home", { replace: true });
        }
      );
    } catch (err) {
      console.error("Auth callback error:", err);

      // If we've already tried multiple times, show the error
      if (retries >= maxRetries) {
        setError(err instanceof Error ? err.message : "Authentication failed");
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
          startProgressIncrement(30, 45, 300, "Preparing token exchange...");
          exchangeTokens();
        }, retryDelay);
      }
    }
  };

  // Function to manually proceed to home
  const handleManualProceed = () => {
    // Force progress to 100% with a quick animation
    startProgressIncrement(
      progress,
      100,
      300,
      "Proceeding to home page...",
      () => {
        // Navigate after quick progress completion
        navigate("/home", { replace: true });
      }
    );

    // Clear any intervals
    if (progressIntervalRef.current !== null) {
      window.clearInterval(progressIntervalRef.current);
      progressIntervalRef.current = null;
    }

    // Try to refresh auth one more time
    checkAuth()
      .then(() => {
        toast.success("Successfully signed in!");
      })
      .catch(() => {
        // Silent fail - we're proceeding anyway
      });
  };

  // Function to restart the auth process
  const handleRetry = () => {
    setIsStuck(false);
    setError(null);
    // Reset progress to an earlier stage
    setProgressSafe(30);
    setProcessingStage(1);
    setStatusMessage("Retrying authentication...");

    // Retry the authentication flow
    startProgressIncrement(30, 45, 300, "Preparing token exchange...");

    // If we have token data, retry the exchange
    if (tokenData) {
      setTimeout(() => {
        exchangeTokens();
      }, 1000);
    } else {
      // If no token data, redirect to sign-in
      navigate("/sign-in", { replace: true });
    }
  };

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
    startProgressIncrement(10, 30, 400, "Verifying credentials..."); // Faster duration
  }, []);

  // Second stage: Exchange tokens with backend
  useEffect(() => {
    if (tokenData) {
      exchangeTokens();
    }
  }, [tokenData]);

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

            // Make sure we're at 100% before navigating
            setProgressSafe(100);
            setStatusMessage("Redirecting to home page...");

            // Brief pause to show 100% completion
            setTimeout(() => {
              navigate("/home", { replace: true });
            }, 300);
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
        <div className="w-full mb-4">
          <Progress value={progress} />
        </div>
        <p className="text-gray-600 animate-fade-in transition-opacity">
          {statusMessage}
        </p>
        {retries > 0 && !isStuck && (
          <p className="text-amber-600 text-sm mt-2">
            Retrying connection... ({retries}/{maxRetries + 1})
          </p>
        )}

        {isStuck && (
          <div className="mt-6 flex flex-col gap-3">
            <p className="text-amber-600">
              It looks like the sign-in process might be stuck.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleRetry}
                className="px-4 py-2 bg-amber-100 hover:bg-amber-200 text-amber-800 rounded-md text-sm font-medium transition-colors"
              >
                Retry
              </button>
              <button
                onClick={handleManualProceed}
                className="px-4 py-2 bg-primary/90 hover:bg-primary text-white rounded-md text-sm font-medium transition-colors"
              >
                Proceed to Home Page
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
