import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { ModeToggle } from "@/components/mode-toggle"; // Dark Mode Toggle

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
        <div className="hidden md:flex gap-3 items-center">
          <ModeToggle /> {/* Dark Mode Switch */}
          <Button variant={"secondary"}>Sign In</Button>
          <Button variant="default">Sign Up</Button>
        </div>

        {/* Mobile Menu Button */}
        <button className="md:hidden">
          <Menu className="w-6 h-6" />
        </button>
      </div>
    </nav>
  );
}

export default Navbar;
