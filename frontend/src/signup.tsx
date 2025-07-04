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
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { useState, useRef } from "react";
import api from "./components/api/api";
import { z } from "zod";
import Turnstile from "react-turnstile";
import { AxiosError } from "axios";
import { toast } from "sonner";
import { Password } from "./components/password";
import { VerifyPassword } from "./components/verify-password";
import { useTranslation } from "react-i18next";

// Define Zod schema for validation
const signUpSchema = z.object({
  email: z.string().email("Invalid email format"),
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

function SignUpPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const passwordInputRef = useRef<HTMLInputElement>(null);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    verifyPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState<{
    email?: string;
    password?: string;
  }>({});
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [widgetId, setWidgetId] = useState<string | null>(null);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setValidationErrors({ ...validationErrors, [e.target.name]: undefined }); // Clear validation errors
  };

  const resetTurnstile = () => {
    if (window.turnstile && widgetId) {
      window.turnstile.reset(widgetId);
      setTurnstileToken(null);
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setValidationErrors({});

    if (!turnstileToken) {
      toast.error(t("signUp.completeTurnstile"));
      setLoading(false);
      return;
    }

    if (formData.password !== formData.verifyPassword) {
      toast.error(t("signUp.passwordsNoMatch"));
      setLoading(false);
      return;
    }

    // Validate form data using Zod
    const result = signUpSchema.safeParse({
      email: formData.email,
      password: formData.password,
    });

    if (!result.success) {
      const formattedErrors: { email?: string; password?: string } = {};
      result.error.errors.forEach((err) => {
        formattedErrors[err.path[0] as keyof typeof formattedErrors] = t(
          `signUp.validation.${
            err.message.includes("uppercase")
              ? "uppercase"
              : err.message.includes("lowercase")
              ? "lowercase"
              : err.message.includes("number")
              ? "number"
              : "minLength"
          }`
        );
      });

      setValidationErrors(formattedErrors);
      setLoading(false);
      return;
    }

    // Proceed with API request if validation is successful
    try {
      await api.post("/auth/signup", {
        ...formData,
        turnstileToken,
      });
      navigate("/sign-in", {
        state: {
          message: t("signUp.success"),
        },
      });
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        toast.error(
          err.response.data?.message ||
            err.response.data?.error ||
            t("signUp.errorUnknown")
        );
      } else if (err instanceof AxiosError && err.request) {
        toast.error(t("signUp.errorNoResponse"));
      } else if (err instanceof Error) {
        toast.error(t("signUp.errorGeneral"));
      } else {
        toast.error(t("signUp.errorUnexpected"));
      }
      // Reset Turnstile after a failed sign up attempt
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
        toast.error(t("signUp.googleFailed"));
      }
    }
  };

  return (
    <div className="grid w-full grow items-center px-4 py-16 justify-center">
      <form onSubmit={handleSubmit}>
        <Card className="w-full sm:w-96">
          <CardHeader>
            <CardTitle>{t("signUp.title")}</CardTitle>
            <CardDescription>{t("signUp.description")}</CardDescription>
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
                {t("signUp.google")}
              </Button>
            </div>

            <p className="flex items-center gap-x-3 text-sm text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
              {t("signUp.or")}
            </p>

            <div className="space-y-2">
              <Label>{t("signUp.emailLabel")}</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
              {validationErrors.email && (
                <p className="text-red-500 text-sm">{validationErrors.email}</p>
              )}
            </div>

            <Password
              ref={passwordInputRef}
              onChange={(value: string) => {
                setFormData((prev) => ({ ...prev, password: value }));
              }}
            />

            <VerifyPassword
              password={formData.password}
              onVerifiedPasswordChange={(value) =>
                setFormData((prev) => ({ ...prev, verifyPassword: value }))
              }
            />

            <div className="flex justify-center mt-4">
              <Turnstile
                sitekey="0x4AAAAAAA9BEEKWwme8C69l"
                onVerify={(token) => setTurnstileToken(token)}
                onError={() => {
                  toast.error("Turnstile verification failed");
                  setTurnstileToken(null);
                }}
                onExpire={() => setTurnstileToken(null)}
                onLoad={(widgetId) => setWidgetId(widgetId)}
                refreshExpired="auto"
                language="en"
              />
            </div>
          </CardContent>

          <CardFooter>
            <div className="grid w-full gap-y-4">
              <Button type="submit" disabled={loading}>
                {loading ? t("signUp.signingUp") : t("signUp.signUp")}
              </Button>
              <Button variant="link" size="sm" asChild>
                <Link to="/sign-in">{t("signUp.alreadyHaveAccount")}</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

export { SignUpPage };
