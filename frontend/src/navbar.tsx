import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { MenuBar } from "./components/menu-bar";
import { Link } from "react-router-dom";
import { AvatarButton } from "./components/avatar-button";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

function Navbar() {
  const { user, loading } = useAuth();

  return (
    <nav className="sticky top-0 left-0 w-full bg-background/80 backdrop-blur-lg border-b border-border z-50">
      <div className="container mx-auto grid grid-cols-[1fr,auto,1fr] md:grid-cols-3 items-center py-4 px-6">
        {/* Left Column - Menu on mobile, Logo on desktop */}
        <div className="flex items-center md:justify-start">
          <div className="md:hidden">
            <MenuBar />
          </div>
          <a
            href="/"
            className="hidden md:block text-2xl font-bold text-primary"
          >
            Plan Genie AI
          </a>
        </div>

        {/* Center Column - Logo on mobile only */}
        <div className="flex items-center justify-center md:hidden">
          <a href="/" className="text-2xl font-bold text-primary">
            Plan Genie AI
          </a>
        </div>

        {/* Navigation Links - Desktop Only */}
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

        {/* Right Column - Controls */}
        <div className="flex gap-3 items-center justify-end">
          <ModeToggle />
          {loading ? (
            <div className="hidden md:flex gap-3">
              <Skeleton className="h-9 w-20" />
              <Skeleton className="h-9 w-20" />
            </div>
          ) : (
            <>
              {user ? (
                <AvatarButton />
              ) : (
                <div className="hidden md:flex gap-3">
                  <Link to="/sign-in">
                    <Button variant="secondary">Sign In</Button>
                  </Link>
                  <Link to="/sign-up">
                    <Button variant="default">Sign Up</Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
