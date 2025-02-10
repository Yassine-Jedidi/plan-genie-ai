import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle"; // Dark Mode Toggle
import { MenuBar } from "./components/menu-bar";

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 w-full bg-background/80 backdrop-blur-lg border-b border-border z-50">
      <div className="container mx-auto flex justify-between items-center py-4 px-6">
        {/* Logo */}
        <a href="/" className="text-2xl font-bold text-primary">
          Plan Genie AI
        </a>

        {/* Navigation Links (Hidden on Small Screens) */}
        <div className="hidden md:flex gap-6 justify-center items-center">
          <a
            href="#features"
            className="text-muted-foreground hover:text-primary"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="text-muted-foreground hover:text-primary"
          >
            Pricing
          </a>
          <a
            href="#contact"
            className="text-muted-foreground hover:text-primary"
          >
            Contact
          </a>
        </div>

        {/* Right-side Controls */}
        <div className="flex gap-3 items-center">
          <ModeToggle /> {/* Dark Mode Switch Always Visible */}
          <div className="hidden md:flex gap-3">
            <Button variant="secondary">Sign In</Button>
            <Button variant="default">Sign Up</Button>
          </div>
          {/* Mobile Menu Button */}
          <MenuBar />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
