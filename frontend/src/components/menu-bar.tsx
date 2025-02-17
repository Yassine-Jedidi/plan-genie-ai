import { Button } from "@/components/ui/button";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";

function MenuBar() {
  const [open, setOpen] = useState<boolean>(false);
  const { user, loading } = useAuth();

  return (
    <div className="relative md:hidden">
      {" "}
      {/* Only visible on small screens */}
      <Button
        className="group"
        variant="outline"
        size="icon"
        onClick={() => setOpen((prevState) => !prevState)}
        aria-expanded={open}
        aria-label={open ? "Close menu" : "Open menu"}
      >
        {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </Button>
      {open && (
        <div className="absolute right-0 mt-2 w-48 bg-background border border-border shadow-lg rounded-lg py-2 z-50">
          <a
            href="#features"
            className="block px-4 py-2 text-foreground hover:bg-accent"
          >
            Features
          </a>
          <a
            href="#pricing"
            className="block px-4 py-2 text-foreground hover:bg-accent"
          >
            Pricing
          </a>
          <a
            href="#contact"
            className="block px-4 py-2 text-foreground hover:bg-accent"
          >
            Contact
          </a>
          {!user && (
            <>
              <div className="my-2 border-t border-border" />
              {loading ? (
                <div className="px-4 py-2 space-y-2">
                  <Skeleton className="h-9 w-full" />
                  <Skeleton className="h-9 w-full" />
                </div>
              ) : (
                <div className="px-4 py-2 space-y-2">
                  <Link to="/sign-in" className="block">
                    <Button variant="secondary" className="w-full">
                      Sign In
                    </Button>
                  </Link>
                  <Link to="/sign-up" className="block">
                    <Button variant="default" className="w-full">
                      Sign Up
                    </Button>
                  </Link>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </div>
  );
}

export { MenuBar };
