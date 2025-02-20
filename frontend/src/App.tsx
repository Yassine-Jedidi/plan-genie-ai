import Hero from "./components/hero";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "./navbar";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { SignUpPage } from "./signup";
import { SignInPage } from "./signin";
import { AuthCallback } from "./components/auth/AuthCallback";
import { ForgotPasswordPage } from "./forgot-password";
import { AuthProvider } from "./lib/auth";
import { Toaster } from "@/components/ui/sonner";

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
          <Navbar />
          <Routes>
            <Route path="/" element={<Hero />} />
            <Route path="/sign-in" element={<SignInPage />} />
            <Route path="/sign-up" element={<SignUpPage />} />
            <Route path="/auth/callback" element={<AuthCallback />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          </Routes>
          <Toaster />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
