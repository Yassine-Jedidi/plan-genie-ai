import Hero from "./components/hero";
import { ThemeProvider } from "@/components/theme-provider";
import Navbar from "./navbar";

function App() {
  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <Navbar />
      <Hero />
    </ThemeProvider>
  );
}

export default App;
