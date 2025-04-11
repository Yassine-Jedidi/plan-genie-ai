import { Navigate, Outlet } from "react-router-dom";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export const ProtectedRoute = () => {
  const { user, loading } = useAuth();

  useEffect(() => {
    const intentionalSignOut =
      sessionStorage.getItem("intentionalSignOut") === "true";

    if (!loading && !user && !intentionalSignOut) {
      toast.error("You must be logged in to access this page", {
        description: "Please sign in to continue.",
        duration: 5000,
      });
    }

    if (intentionalSignOut) {
      sessionStorage.removeItem("intentionalSignOut");
    }
  }, [loading, user]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Spinner size="lg" />
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/" replace />;
  }

  // If authenticated, render the child routes
  return <Outlet />;
};
