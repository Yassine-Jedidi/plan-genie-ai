import { useEffect, useState, useRef } from "react";
import api from "@/components/api/api";
import { User } from "../../types/user";
import { AuthContext } from "@/contexts/auth-context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const refreshTimerRef = useRef<NodeJS.Timeout | null>(null);
  const lastActivityRef = useRef<number>(Date.now());
  const isRefreshingRef = useRef<boolean>(false);

  const checkAuth = async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data.user);
      console.log("user : ", response.data.user);

      // Start automatic refresh timer after successful auth check
      startAutoRefresh();

      return response.data.user;
    } catch {
      setUser(null);
      stopAutoRefresh();
    } finally {
      setLoading(false);
    }
  };

  const refreshUser = async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data.user);
      return response.data.user;
    } catch (error) {
      console.error("Error refreshing user:", error);
      throw error;
    }
  };

  // Function to refresh token
  const refreshToken = async () => {
    // Prevent multiple simultaneous refresh attempts
    if (isRefreshingRef.current) {
      console.log("Token refresh already in progress, skipping...");
      return;
    }

    isRefreshingRef.current = true;

    try {
      console.log("Auto-refreshing token...");
      const response = await api.post("/auth/refresh");
      console.log(
        "Token refreshed successfully",
        response.data.refreshed ? "(new tokens)" : "(still valid)"
      );
      lastActivityRef.current = Date.now();

      // Update user data if it was refreshed
      if (response.data.refreshed && response.data.user) {
        setUser(response.data.user);
      }
    } catch (error) {
      console.error("Auto-refresh failed:", error);
      // If refresh fails, try to check auth status
      try {
        await checkAuth();
      } catch {
        // If auth check also fails, user is signed out
        setUser(null);
        stopAutoRefresh();
      }
    } finally {
      isRefreshingRef.current = false;
    }
  };

  // Function to start automatic token refresh
  const startAutoRefresh = () => {
    // Clear any existing timer
    stopAutoRefresh();

    // Set up timer to refresh token every 50 minutes (before the 1-hour expiry)
    refreshTimerRef.current = setInterval(async () => {
      // Only refresh if page is visible or user has been active recently
      const isPageVisible = !document.hidden;
      const timeSinceLastActivity = Date.now() - lastActivityRef.current;
      const isRecentlyActive = timeSinceLastActivity < 2 * 60 * 60 * 1000; // 2 hours

      if (isPageVisible || isRecentlyActive) {
        await refreshToken();
      } else {
        console.log("Skipping token refresh - page hidden and user inactive");
      }
    }, 50 * 60 * 1000); // 50 minutes
  };

  // Function to stop automatic token refresh
  const stopAutoRefresh = () => {
    if (refreshTimerRef.current) {
      clearInterval(refreshTimerRef.current);
      refreshTimerRef.current = null;
    }
  };

  // Function to update last activity
  const updateActivity = () => {
    lastActivityRef.current = Date.now();
  };

  const signOut = async () => {
    try {
      sessionStorage.setItem("intentionalSignOut", "true");

      // Clear theme settings from localStorage
      localStorage.removeItem("vite-ui-theme");
      localStorage.removeItem("vite-ui-color-theme");

      await api.post("/auth/signout");
      setUser(null);
      stopAutoRefresh();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Start auth check on mount
  useEffect(() => {
    checkAuth();
  }, []);

  // Set up activity listeners
  useEffect(() => {
    const handleActivity = () => {
      updateActivity();
    };

    const handleVisibilityChange = () => {
      if (!document.hidden && user) {
        // Page became visible, check if we need to refresh
        const timeSinceLastActivity = Date.now() - lastActivityRef.current;
        if (timeSinceLastActivity > 60 * 60 * 1000) {
          // More than 1 hour
          console.log(
            "Page became visible after long inactivity, refreshing token..."
          );
          refreshToken();
        }
      }
    };

    // Listen for user activity
    const events = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
    ];
    events.forEach((event) => {
      document.addEventListener(event, handleActivity, true);
    });

    // Listen for page visibility changes
    document.addEventListener("visibilitychange", handleVisibilityChange);

    // Set up periodic activity check (every 30 minutes)
    const activityCheckInterval = setInterval(() => {
      const timeSinceLastActivity = Date.now() - lastActivityRef.current;
      if (timeSinceLastActivity > 4 * 60 * 60 * 1000) {
        // 4 hours of inactivity
        console.log("User inactive for 4+ hours, stopping auto-refresh");
        stopAutoRefresh();
      }
    }, 30 * 60 * 1000);

    // Cleanup
    return () => {
      events.forEach((event) => {
        document.removeEventListener(event, handleActivity, true);
      });
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      clearInterval(activityCheckInterval);
      stopAutoRefresh();
    };
  }, [user]);

  return (
    <AuthContext.Provider
      value={{ user, loading, checkAuth, signOut, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
