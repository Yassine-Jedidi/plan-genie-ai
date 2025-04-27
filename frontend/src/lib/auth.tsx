import { useEffect, useState } from "react";
import api from "@/components/api/api";
import { User } from "../../types/user";
import { AuthContext } from "@/contexts/auth-context";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const checkAuth = async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data.user);
      console.log("user : ", response.data.user);
    } catch {
      setUser(null);
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

  const signOut = async () => {
    try {
      sessionStorage.setItem("intentionalSignOut", "true");

      // Clear theme settings from localStorage
      localStorage.removeItem("vite-ui-theme");
      localStorage.removeItem("vite-ui-color-theme");

      await api.post("/auth/signout");
      setUser(null);
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, loading, checkAuth, signOut, refreshUser }}
    >
      {children}
    </AuthContext.Provider>
  );
}
