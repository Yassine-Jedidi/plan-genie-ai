import Hero from "./components/hero";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "./navbar";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { SignUpPage } from "./signup";

function App() {
  return (
    <Router>
      <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
        <Navbar />
        <Routes>
          {" "}
          {/* Define routes */}
          <Route path="/" element={<Hero />} /> {/* Main Hero Page */}
          <Route path="/sign-up" element={<SignUpPage />} />{" "}
          {/* Sign-Up Page */}
        </Routes>
      </ThemeProvider>
    </Router>
  );
}

export default App;
