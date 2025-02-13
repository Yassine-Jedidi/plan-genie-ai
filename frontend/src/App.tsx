import Hero from "./components/hero";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "./navbar";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { SignUpPage } from "./signup";
import { SignInPage } from "./signin";
import { AuthCallback } from "./components/auth/AuthCallback";
import { AuthProvider } from "./lib/auth";

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
          </Routes>
        </ThemeProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
