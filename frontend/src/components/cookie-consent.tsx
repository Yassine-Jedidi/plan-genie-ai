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
import { useTranslation } from "react-i18next";

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
  const { t } = useTranslation();

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
              <h2 className="text-lg font-semibold">
                {t("cookieConsent.title")}
              </h2>
            </div>
            <div className="px-6 pb-4">
              <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                {t("cookieConsent.description")}
              </p>
              <Link
                to={cookiePolicyUrl}
                onClick={onPolicyClick}
                className="text-xs inline-flex items-center text-primary hover:underline group font-medium transition-colors"
              >
                {t("cookieConsent.cookiePolicy")}
                <ChevronRight className="h-3 w-3 ml-1 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </div>
            <div className="p-4 flex flex-col sm:flex-row gap-3 border-t border-border/50 bg-muted/30">
              <Button
                onClick={onAcceptAll}
                size="sm"
                className="w-full sm:flex-1 h-9 rounded-lg text-sm transition-all hover:shadow-md"
              >
                {t("cookieConsent.accept")}
              </Button>
              <Button
                onClick={onLearnMore}
                size="sm"
                variant="outline"
                className="w-full sm:flex-1 h-9 rounded-lg text-sm transition-all hover:shadow-md"
              >
                {t("cookieConsent.learnMore")}
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
  const { t } = useTranslation();

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-card/95 backdrop-blur-lg z-[200] sm:max-w-[500px] p-0 gap-0 border-border/50 shadow-2xl">
        <DialogHeader className="p-6 pb-4 border-b border-border/50">
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            <CookieIcon className="h-5 w-5 text-primary" />
            {t("cookieConsent.policyTitle")}
          </DialogTitle>
          <DialogDescription className="text-muted-foreground">
            {t("cookieConsent.policyDescription")}
          </DialogDescription>
        </DialogHeader>
        <div className="px-6 py-6 space-y-4 max-h-[calc(100vh-200px)] overflow-y-auto">
          <div className="space-y-4">
            <div>
              <h3 className="text-lg font-semibold mb-2">
                {t("cookieConsent.whatAreCookies")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("cookieConsent.whatAreCookiesDescription")}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                {t("cookieConsent.whatCookiesDoWeUse")}
              </h3>
              <div className="p-3 border rounded-lg">
                <h4 className="font-medium text-primary">
                  {t("cookieConsent.authenticationCookies")}
                </h4>
                <p className="text-sm text-muted-foreground mt-1">
                  {t("cookieConsent.authenticationCookiesDescription")}
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                {t("cookieConsent.whyDoWeNeedThem")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("cookieConsent.whyDoWeNeedThemDescription")}
              </p>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-2">
                {t("cookieConsent.yourPrivacy")}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t("cookieConsent.yourPrivacyDescription")}
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
              {t("cookieConsent.close")}
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
