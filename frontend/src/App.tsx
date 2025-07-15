import Hero from "./components/hero/hero";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "./navbar";
import {
  Route,
  BrowserRouter as Router,
  Routes,
  useLocation,
} from "react-router-dom";
import { SignUpPage } from "./signup";
import { SignInPage } from "./signin";
import { AuthCallback } from "./components/auth/AuthCallback";
import { ForgotPasswordPage } from "./forgot-password";
import { ResetPasswordPage } from "./reset-password";
import { AuthProvider } from "./contexts/auth-provider";
import { Toaster } from "@/components/ui/sonner";
import HomePage from "./components/home/home";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import TasksPage from "./components/tasks/tasks";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import SettingsPage from "./settings";
import { EventsCalendar } from "./components/events/events-calendar";
import BilanPage from "./components/daily/bilan";
import { NotificationPopover } from "./components/notifications/notification-popover";
import Analytics from "./components/analytics/analytics";
import DashboardPage from "./components/dashboard/dashboard";
import NotFoundPage from "./page-not-found";

function AppContent() {
  const location = useLocation();
  const showNavbar =
    location.pathname === "/" ||
    location.pathname === "/sign-in" ||
    location.pathname === "/sign-up" ||
    location.pathname === "/forgot-password" ||
    location.pathname === "/reset-password";

  return (
    <ThemeProvider
      defaultTheme="system"
      storageKey="vite-ui-theme"
      defaultColorTheme="default"
      colorStorageKey="vite-ui-color-theme"
    >
      {showNavbar && <Navbar />}

      <Routes>
        {/* Public routes */}
        <Route path="/" element={<Hero />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />

        {/* Protected routes */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/home"
            element={
              <SidebarProvider>
                <div className="relative w-full flex-1 flex">
                  <AppSidebar />
                  <HomePage />
                  <div className="absolute top-4 right-4">
                    <NotificationPopover />
                  </div>
                </div>
              </SidebarProvider>
            }
          />
          <Route
            path="/tasks"
            element={
              <SidebarProvider>
                <div className="relative w-full flex-1 flex">
                  <AppSidebar />
                  <TasksPage />
                  <div className="absolute top-4 right-4">
                    <NotificationPopover />
                  </div>
                </div>
              </SidebarProvider>
            }
          />
          <Route
            path="/settings"
            element={
              <SidebarProvider>
                <div className="relative w-full flex-1 flex">
                  <AppSidebar />
                  <SettingsPage />
                  <div className="absolute top-4 right-4">
                    <NotificationPopover />
                  </div>
                </div>
              </SidebarProvider>
            }
          />
          <Route
            path="/events"
            element={
              <SidebarProvider>
                <div className="relative w-full flex-1 flex">
                  <AppSidebar />
                  <EventsCalendar />
                  <div className="absolute top-4 right-4">
                    <NotificationPopover />
                  </div>
                </div>
              </SidebarProvider>
            }
          />
          <Route
            path="/daily"
            element={
              <SidebarProvider>
                <div className="relative w-full flex-1 flex">
                  <AppSidebar />
                  <BilanPage />
                  <div className="absolute top-4 right-4">
                    <NotificationPopover />
                  </div>
                </div>
              </SidebarProvider>
            }
          />
          <Route
            path="/analytics"
            element={
              <SidebarProvider>
                <div className="relative w-full flex-1 flex">
                  <AppSidebar />
                  <Analytics />
                  <div className="absolute top-4 right-4">
                    <NotificationPopover />
                  </div>
                </div>
              </SidebarProvider>
            }
          />
          <Route
            path="/dashboard"
            element={
              <SidebarProvider>
                <div className="relative w-full flex-1 flex">
                  <AppSidebar />
                  <DashboardPage />
                  <div className="absolute top-4 right-4">
                    <NotificationPopover />
                  </div>
                </div>
              </SidebarProvider>
            }
          />
        </Route>
        {/* Catch-all route for 404 page */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <Toaster />
    </ThemeProvider>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </Router>
  );
}

export default App;
