import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { Eye, EyeOff } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState, useEffect, useRef } from "react";
import api from "./components/api/api";
import { useAuth } from "@/hooks/use-auth";
import Turnstile from "react-turnstile";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { useTranslation } from "react-i18next";

// Add window.turnstile type definition
declare global {
  interface Window {
    turnstile?: {
      reset: (widgetId: string) => void;
    };
  }
}

function SignInPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const messageShown = useRef(false);
  const [widgetId, setWidgetId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { checkAuth } = useAuth();
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const { t } = useTranslation();

  // Check for success message from signup
  useEffect(() => {
    const state = location.state as { message?: string } | null;
    if (state?.message && !messageShown.current) {
      toast.success(state.message);
      messageShown.current = true;
      // Clear the message from location state
      window.history.replaceState({}, document.title);
    }
  }, [location]);

  const resetTurnstile = () => {
    if (window.turnstile && widgetId) {
      window.turnstile.reset(widgetId);
      setTurnstileToken(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!turnstileToken) {
      toast.error(t("signIn.completeTurnstile"));
      setLoading(false);
      return;
    }

    try {
      await api.post("/auth/signin", { ...formData, turnstileToken });
      await checkAuth();
      toast.success(t("signIn.success"));
      navigate("/home");
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        toast.error(
          err.response.data?.message ||
            err.response.data?.error ||
            t("signIn.errorUnknown")
        );
      } else if (err instanceof AxiosError && err.request) {
        toast.error(t("signIn.errorNoResponse"));
      } else if (err instanceof Error) {
        toast.error(t("signIn.errorGeneral"));
      } else {
        toast.error(t("signIn.errorUnexpected"));
      }
      // Reset Turnstile after a failed login attempt
      resetTurnstile();
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      const response = await api.get("/auth/google");
      // Redirect to Google OAuth URL
      window.location.href = response.data.url;
    } catch (err) {
      if (err instanceof Error) {
        toast.error("Failed to initiate Google sign in");
      }
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="grid w-full grow items-center px-4 py-16 justify-center">
      <form onSubmit={handleSubmit}>
        <Card className="w-full sm:w-96">
          <CardHeader>
            <CardTitle>{t("signIn.title")}</CardTitle>
            <CardDescription>{t("signIn.description")}</CardDescription>
          </CardHeader>
          <CardContent className="grid gap-y-4">
            <div className="w-full">
              <Button
                size="sm"
                variant="outline"
                type="button"
                className="w-full flex items-center justify-center gap-2"
                onClick={handleGoogleSignIn}
              >
                <FontAwesomeIcon icon={faGoogle} />
                {t("signIn.google")}
              </Button>
            </div>

            <p className="flex items-center gap-x-3 text-sm text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
              {t("signIn.or")}
            </p>

            <div className="space-y-2">
              <Label>{t("signIn.emailLabel")}</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>{t("signIn.passwordLabel")}</Label>
              <div className="relative">
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  required
                />
                <Button
                  type="button"
                  variant="link"
                  size="sm"
                  className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-lg text-muted-foreground/80 outline-offset-2 transition-colors hover:text-foreground focus:z-10 focus-visible:outline focus-visible:outline-2 focus-visible:outline-ring/70 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
              <div className="flex">
                <Button variant="link" size="sm" className="px-0" asChild>
                  <Link to="/forgot-password">
                    {t("signIn.forgotPassword")}
                  </Link>
                </Button>
              </div>
            </div>

            <div className="flex justify-center">
              <Turnstile
                sitekey="0x4AAAAAAA9BEEKWwme8C69l"
                onVerify={(token) => setTurnstileToken(token)}
                onError={() => {
                  toast.error(t("signIn.turnstileFailed"));
                  setTurnstileToken(null);
                }}
                onExpire={() => setTurnstileToken(null)}
                onLoad={(widgetId) => setWidgetId(widgetId)}
                refreshExpired="auto"
                language="en"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </CardContent>

          <CardFooter>
            <div className="grid w-full gap-y-4">
              <Button type="submit" disabled={loading}>
                {loading ? t("signIn.signingIn") : t("signIn.signIn")}
              </Button>
              <Button variant="link" size="sm" asChild>
                <Link to="/sign-up">{t("signIn.noAccount")}</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

export { SignInPage };
