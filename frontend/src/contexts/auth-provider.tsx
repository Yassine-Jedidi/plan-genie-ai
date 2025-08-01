import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import api from "@/components/api/api";
import { User } from "../../types/user";
import { AuthContext } from "./auth-context";
import { jwtDecode } from "jwt-decode";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshTimer, setRefreshTimer] = useState<NodeJS.Timeout | null>(null);
  const location = useLocation();

  // Helper to schedule token refresh
  function scheduleTokenRefresh(token: string | null) {
    if (!token) return;
    let decoded: Record<string, unknown> & { exp: number };
    try {
      decoded = jwtDecode(token);
    } catch {
      return;
    }
    const exp = decoded.exp * 1000; // JWT exp is in seconds
    const now = Date.now();
    const buffer = 60 * 1000; // 1 minute before expiry
    const timeout = exp - now - buffer;
    if (timeout > 0) {
      if (refreshTimer) clearTimeout(refreshTimer);
      const timer = setTimeout(() => {
        refreshToken();
      }, timeout);
      setRefreshTimer(timer);
    }
  }

  // Function to refresh the token
  const refreshToken = async () => {
    try {
      const response = await api.post("/auth/refresh");
      setUser(response.data.user);
      scheduleTokenRefresh(response.data.accessToken);
    } catch {
      setUser(null);
      setLoading(false);
    }
  };

  const checkAuth = async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data.user);
      scheduleTokenRefresh(response.data.accessToken);
      console.log("user : ", response.data.user);
    } catch {
      setUser(null);
      if (refreshTimer) clearTimeout(refreshTimer);
    } finally {
      setLoading(false);
    }
  };

  // Refresh the user after updating the profile
  const refreshUser = async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data.user);
      scheduleTokenRefresh(response.data.accessToken);
      return response.data.user;
    } catch (error) {
      console.error("Error refreshing user:", error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      sessionStorage.setItem("intentionalSignOut", "true");
      if (refreshTimer) clearTimeout(refreshTimer);
      // Clear theme settings from localStorage
      localStorage.removeItem("vite-ui-theme");
      localStorage.removeItem("vite-ui-color-theme");
      // Clear prioritization result from localStorage
      localStorage.removeItem("plan-genie-ai-prioritization-result");
      await api.post("/auth/signout");
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  // Call checkAuth on initial load
  useEffect(() => {
    checkAuth();
  }, []);

  // Call checkAuth on every route change
  useEffect(() => {
    checkAuth();
    // eslint-disable-next-line
  }, [location.pathname]);

  // Call checkAuth on tab focus
  useEffect(() => {
    const onFocus = () => checkAuth();
    window.addEventListener("focus", onFocus);
    return () => window.removeEventListener("focus", onFocus);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, checkAuth, signOut, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
