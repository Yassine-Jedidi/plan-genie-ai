import Hero from "./components/hero";
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
import { AuthProvider } from "./lib/auth";
import { Toaster } from "@/components/ui/sonner";
import HomePage from "./home";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";
import TasksPage from "./tasks";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import SettingsPage from "./settings";
import { EventsCalendar } from "./events-calendar";
import BilanPage from "./bilan";
import { NotificationPopover } from "./components/notification-popover";
import Analytics from "./analytics";

function AppContent() {
  const location = useLocation();
  const showNavbar =
    location.pathname !== "/home" &&
    location.pathname !== "/tasks" &&
    location.pathname !== "/auth/callback" &&
    location.pathname !== "/settings" &&
    location.pathname !== "/tasks-kanban" &&
    location.pathname !== "/events" &&
    location.pathname !== "/daily" &&
    location.pathname !== "/analytics";
  const showSidebar =
    location.pathname === "/home" ||
    location.pathname === "/tasks" ||
    location.pathname === "/tasks-kanban" ||
    location.pathname === "/settings" ||
    location.pathname === "/events" ||
    location.pathname === "/daily" ||
    location.pathname === "/analytics";

  return (
    <ThemeProvider
      defaultTheme="system"
      storageKey="vite-ui-theme"
      defaultColorTheme="default"
      colorStorageKey="vite-ui-color-theme"
    >
      {showNavbar && <Navbar />}

      {showSidebar ? (
        <SidebarProvider>
          <Routes>
            <Route element={<ProtectedRoute />}>
              <Route
                path="/home"
                element={
                  <div className="relative w-full flex-1 flex">
                    <AppSidebar />
                    <HomePage />
                    <div className="absolute top-4 right-4">
                      <NotificationPopover />
                    </div>
                  </div>
                }
              />
              <Route
                path="/tasks"
                element={
                  <div className="relative w-full flex-1 flex">
                    <AppSidebar />
                    <TasksPage />
                    <div className="absolute top-4 right-4">
                      <NotificationPopover />
                    </div>
                  </div>
                }
              />
              <Route
                path="/settings"
                element={
                  <div className="relative w-full flex-1 flex">
                    <AppSidebar />
                    <SettingsPage />
                    <div className="absolute top-4 right-4">
                      <NotificationPopover />
                    </div>
                  </div>
                }
              />
              <Route
                path="/events"
                element={
                  <div className="relative w-full flex-1 flex">
                    <AppSidebar />
                    <EventsCalendar />
                    <div className="absolute top-4 right-4">
                      <NotificationPopover />
                    </div>
                  </div>
                }
              />
              <Route
                path="/daily"
                element={
                  <div className="relative w-full flex-1 flex">
                    <AppSidebar />
                    <BilanPage />
                    <div className="absolute top-4 right-4">
                      <NotificationPopover />
                    </div>
                  </div>
                }
              />
              <Route
                path="/analytics"
                element={
                  <div className="relative w-full flex-1 flex">
                    <AppSidebar />
                    <Analytics />
                    <div className="absolute top-4 right-4">
                      <NotificationPopover />
                    </div>
                  </div>
                }
              />
            </Route>
          </Routes>
        </SidebarProvider>
      ) : (
        <Routes>
          <Route path="/" element={<Hero />} />

          {/* Public routes - redirect if already authenticated */}
          <Route path="/sign-in" element={<SignInPage />} />
          <Route path="/sign-up" element={<SignUpPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />

          <Route path="/auth/callback" element={<AuthCallback />} />
        </Routes>
      )}

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
