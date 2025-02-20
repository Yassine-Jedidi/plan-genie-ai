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

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    if (!turnstileToken) {
      toast.error("Please complete the Turnstile verification");
      setLoading(false);
      return;
    }

    try {
      // We'll implement the actual API call later
      toast.success(
        "Password reset link have been sent to your email address if an account exists."
      );
      setEmail(""); // Clear the email field after successful submission
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        const errorMessage =
          err.response.data?.error || "An unknown error occurred.";
        toast.error(errorMessage);
      } else {
        toast.error("An unexpected error occurred.");
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
            <CardTitle className="text-xl">Forgot your password?</CardTitle>
            <CardDescription className="text-sm">
              Enter your email below to receive password reset link. Check your
              spam folder if needed.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="flex justify-center mt-4">
              <Turnstile
                sitekey="0x4AAAAAAA9BEEKWwme8C69l"
                onVerify={(token) => setTurnstileToken(token)}
                onError={() => {
                  toast.error("Turnstile verification failed");
                  setTurnstileToken(null);
                }}
                onExpire={() => setTurnstileToken(null)}
                language="en"
              />
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Sending reset link..." : "Send reset link"}
            </Button>
            <div className="text-center">
              <Button variant="link" size="sm" asChild>
                <Link to="/sign-in">← Back to sign in</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

export { ForgotPasswordPage };
