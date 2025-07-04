import { useState } from "react";
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
import { Link } from "react-router-dom";
import { toast } from "sonner";
import Turnstile from "react-turnstile";
import { AxiosError } from "axios";
import api from "./components/api/api";
import { useTranslation } from "react-i18next";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const { t } = useTranslation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!turnstileToken) {
      toast.error(t("forgotPassword.completeTurnstile"));
      setLoading(false);
      return;
    }

    try {
      const response = await api.post("/auth/reset-password", {
        email,
        turnstileToken,
      });

      toast.success(response.data.message);
      setEmail(""); // Clear the email field after successful submission
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        const errorMessage =
          err.response.data?.error || t("forgotPassword.unknownError");
        toast.error(errorMessage);
      } else {
        toast.error(t("forgotPassword.unexpectedError"));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid w-full grow items-center px-4 py-16 justify-center">
      <form onSubmit={handleSubmit}>
        <Card className="w-full sm:w-96">
          <CardHeader className="space-y-3">
            <CardTitle className="text-xl">
              {t("forgotPassword.title")}
            </CardTitle>
            <CardDescription className="text-sm">
              {t("forgotPassword.description")}
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{t("forgotPassword.emailLabel")}</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
                placeholder={t("forgotPassword.emailPlaceholder")}
              />
            </div>

            <div className="flex justify-center mt-4">
              <Turnstile
                sitekey="0x4AAAAAAA9BEEKWwme8C69l"
                onVerify={(token) => setTurnstileToken(token)}
                onError={() => {
                  toast.error(t("forgotPassword.turnstileFailed"));
                  setTurnstileToken(null);
                }}
                onExpire={() => setTurnstileToken(null)}
                language="en"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? t("forgotPassword.sending") : t("forgotPassword.send")}
            </Button>
            <div className="text-center">
              <Button variant="link" size="sm" asChild>
                <Link to="/sign-in">← {t("forgotPassword.backToSignIn")}</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

export { ForgotPasswordPage };
