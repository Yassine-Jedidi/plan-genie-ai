import * as React from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { CookieIcon, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { cn } from "@/lib/dateUtils";

// --------------------------------
// Types and Interfaces
// --------------------------------

interface CookieCategory {
  id: string;
  name: string;
  description: string;
  icon?: React.ReactNode;
  isEssential?: boolean;
}

interface CookiePreferences {
  [key: string]: boolean;
}

// --------------------------------
// Default Configurations
// --------------------------------

const DEFAULT_COOKIE_CATEGORIES: CookieCategory[] = [
  {
    id: "essential",
    name: "Essential Cookies",
    description:
      "Required for authentication and security. These cookies store your login session.",
    isEssential: true,
  },
];

const CONSENT_KEY = "cookie_consent_given";

// --------------------------------
// Sub-Components
// --------------------------------

interface CookieBannerProps {
  isVisible: boolean;
  onAcceptAll: () => void;
  onLearnMore: () => void;
  onPolicyClick: (e: React.MouseEvent) => void;
  cookiePolicyUrl: string;
  className?: string;
}

function CookieBanner({
  isVisible,
  onAcceptAll,
  onLearnMore,
  onPolicyClick,
  cookiePolicyUrl,
  className,
}: CookieBannerProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={cn(
            "fixed bottom-0 left-0 right-0 sm:left-4 sm:bottom-4 z-50 w-full sm:max-w-md",
            className
          )}
        >
          <div className="m-3 bg-card/95 backdrop-blur-lg border border-border/50 rounded-xl shadow-2xl">
            <div className="flex items-center gap-3 p-6 pb-4">
              <div className="bg-primary/10 p-2 rounded-lg">
                <CookieIcon className="h-5 w-5 text-primary" />
              </div>
              <h2 className="text-lg font-semibold">Cookie Preferences</h2>
            </div>
            <div className="px-6 pb-4">
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                We use cookies to keep you logged in and ensure secure access to
                your account.
              </p>
              <Link
                to={cookiePolicyUrl}
                onClick={onPolicyClick}
                className="text-xs inline-flex items-center text-primary hover:underline group font-medium transition-colors"
              >
                Cookie Policy
                <ChevronRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div className="p-4 flex flex-col sm:flex-row gap-3 border-t border-border/50 bg-muted/30">
              <Button
                onClick={onAcceptAll}
                size="sm"
                className="w-full sm:flex-1 h-9 rounded-lg text-sm transition-all hover:shadow-md"
              >
                Accept
              </Button>
              <Button
                onClick={onLearnMore}
                size="sm"
                variant="outline"
                className="w-full sm:flex-1 h-9 rounded-lg text-sm transition-all hover:shadow-md"
              >
                Learn More
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

interface CookiePolicyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function CookiePolicyDialog({ open, onOpenChange }: CookiePolicyDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card/95 backdrop-blur-lg z-[200] sm:max-w-[500px] p-0 gap-0 border-border/50 shadow-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-border/50">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <CookieIcon className="h-5 w-5 text-primary" />
            Cookie Policy
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            How we use cookies on our website.
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 py-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">What are cookies?</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Cookies are small text files stored on your device that help our
                website remember your login session.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                What cookies do we use?
              </h3>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-primary">
                  Authentication Cookies
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  We use JWT (JSON Web Token) cookies to keep you logged in.
                  These cookies are essential for the website to function
                  properly.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                Why do we need them?
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                Without these cookies, you would need to log in every time you
                visit our site. They ensure secure access to your account.
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">Your privacy</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                These cookies only store your authentication status. We don't
                track your browsing activity or collect personal information
                beyond what's needed for login.
              </p>
            </div>
          </div>
        </div>
        <DialogFooter className="p-6 border-t border-border/50 bg-muted/30">
          <div className="flex w-full justify-end">
            <Button
              onClick={() => onOpenChange(false)}
              className="min-w-[100px]"
            >
              Close
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

// --------------------------------
// Main Component
// --------------------------------

interface CookieConsentProps {
  className?: string;
  categories?: CookieCategory[];
  cookiePolicyUrl?: string;
  onAccept?: (preferences: boolean[]) => void;
}

function CookieConsent({
  className,
  categories = DEFAULT_COOKIE_CATEGORIES,
  cookiePolicyUrl = "/cookies",
  onAccept,
}: CookieConsentProps) {
  const [mounted, setMounted] = React.useState(false);
  const [showBanner, setShowBanner] = React.useState(false);
  const [showPolicyDialog, setShowPolicyDialog] = React.useState(false);

  // Check if consent was already given
  React.useEffect(() => {
    setMounted(true);

    try {
      const consentGiven = localStorage.getItem(CONSENT_KEY) === "true";

      if (consentGiven) {
        onAccept?.([]); // No specific preferences to pass
        return;
      }

      // No valid consent found, show banner
      setShowBanner(true);
    } catch (error) {
      console.error("Error reading cookie preferences:", error);
      setShowBanner(true);
    }
  }, [categories.length, onAccept]);

  const savePreferences = React.useCallback(() => {
    try {
      localStorage.setItem(CONSENT_KEY, "true");
    } catch (error) {
      console.error("Error saving cookie consent:", error);
    }

    setShowBanner(false);
    onAccept?.([]); // No specific preferences to pass
  }, [onAccept]);

  const handleAcceptAll = React.useCallback(() => {
    savePreferences();
  }, [savePreferences]);

  const handlePolicyClick = React.useCallback((e: React.MouseEvent) => {
    e.preventDefault();
    setShowPolicyDialog(true);
  }, []);

  if (!mounted) return null;

  return (
    <>
      <CookieBanner
        isVisible={showBanner}
        onAcceptAll={handleAcceptAll}
        onLearnMore={() => setShowPolicyDialog(true)}
        onPolicyClick={handlePolicyClick}
        cookiePolicyUrl={cookiePolicyUrl}
        className={className}
      />

      <CookiePolicyDialog
        open={showPolicyDialog}
        onOpenChange={setShowPolicyDialog}
      />
    </>
  );
}

// --------------------------------
// Exports
// --------------------------------

export { CookieConsent };
export type { CookieCategory, CookieConsentProps, CookiePreferences };
