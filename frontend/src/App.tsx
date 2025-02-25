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

function AppContent() {
  const location = useLocation();
  const showNavbar = location.pathname !== "/home";

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      {showNavbar && <Navbar />}
      <Routes>
        <Route path="/" element={<Hero />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/home" element={<HomePage />} />
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
