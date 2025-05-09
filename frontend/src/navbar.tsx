import { Button } from "@/components/ui/button";
import { ModeToggle } from "@/components/mode-toggle";
import { Link } from "react-router-dom";
import { AvatarButton } from "./components/avatar-button";
import { useAuth } from "@/hooks/use-auth";
import { Skeleton } from "@/components/ui/skeleton";
import { useEffect, useState } from "react";
import { motion, useScroll } from "framer-motion";
import { cn } from "@/lib/utils";
import { Menu, X } from "lucide-react";

function Navbar() {
  const { user, loading } = useAuth();
  const [menuState, setMenuState] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { scrollYProgress } = useScroll();

  useEffect(() => {
    const unsubscribe = scrollYProgress.on("change", (latest) => {
      setScrolled(latest > 0.05);
    });
    return () => unsubscribe();
  }, [scrollYProgress]);

  return (
    <header className="pb-20">
      <nav
        data-state={menuState && "active"}
        className="group fixed z-50 w-full pt-4"
      >
        <div
          className={cn(
            "container mx-auto rounded-3xl px-6 transition-all duration-300 border border-primary/15 sm:max-w-xl md:max-w-2xl lg:max-w-3xl 2xl:max-w-7xl",
            scrolled && "bg-primary/5 backdrop-blur-2xl border-none"
          )}
        >
          <motion.div
            className={cn(
              "relative flex flex-wrap items-center justify-between gap-6 py-3 duration-200 lg:gap-0 lg:py-6",
              scrolled && "lg:py-4"
            )}
          >
            {/* Logo and Mobile Menu Toggle */}
            <div className="flex w-full items-center justify-between gap-12 lg:w-auto">
              <Link
                to="/"
                className="flex items-center space-x-2 text-2xl font-bold"
              >
                Plan Genie AI
              </Link>

              <button
                onClick={() => setMenuState(!menuState)}
                aria-label={menuState ? "Close Menu" : "Open Menu"}
                className="relative z-20 -m-2.5 -mr-4 block cursor-pointer p-2.5 lg:hidden"
              >
                <Menu className="group-data-[state=active]:rotate-180 group-data-[state=active]:scale-0 group-data-[state=active]:opacity-0 m-auto size-6 duration-200" />
                <X className="group-data-[state=active]:rotate-0 group-data-[state=active]:scale-100 group-data-[state=active]:opacity-100 absolute inset-0 m-auto size-6 -rotate-180 scale-0 opacity-0 duration-200" />
              </button>
            </div>

            {/* Mobile Menu and Desktop Controls */}
            <div className="bg-background group-data-[state=active]:block lg:group-data-[state=active]:flex mb-6 hidden w-full flex-wrap items-center justify-end space-y-8 rounded-3xl border p-6 shadow-2xl shadow-zinc-300/20 md:flex-nowrap lg:m-0 lg:flex lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:shadow-none dark:lg:bg-transparent">
              {/* Controls (Mode Toggle, Auth) */}
              <div className="flex items-center gap-3">
                <ModeToggle />
                {loading ? (
                  <div className="flex gap-3">
                    <Skeleton className="h-9 w-20" />
                    <Skeleton className="h-9 w-20" />
                  </div>
                ) : (
                  <>
                    {user ? (
                      <AvatarButton />
                    ) : (
                      <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-3 sm:space-y-0 md:w-fit">
                        <Link to="/sign-in">
                          <Button
                            size="sm"
                            className="bg-secondary text-primary hover:bg-secondary/80"
                          >
                            <span>Sign In</span>
                          </Button>
                        </Link>
                        <Link to="/sign-up">
                          <Button size="sm">
                            <span>Sign Up</span>
                          </Button>
                        </Link>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
