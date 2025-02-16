"use client";
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
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { Github } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useState } from "react";
import api from "./components/api/api";
import { useAuth } from "@/lib/auth";
import Turnstile from "react-turnstile";
import { AxiosError } from "axios";

function SignInPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { checkAuth } = useAuth();
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!turnstileToken) {
      setError("Please complete the Turnstile verification");
      setLoading(false);
      return;
    }

    try {
      await api.post("/auth/signin", { ...formData, turnstileToken });
      await checkAuth();
      window.location.href = "/";
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        setError(
          err.response.data?.message ||
            err.response.data?.error ||
            "An unknown error occurred."
        );
      } else if (err instanceof AxiosError && err.request) {
        setError("No response from the server. Please try again later.");
      } else if (err instanceof Error) {
        setError(err.message || "Something went wrong.");
      } else {
        setError("An unexpected error occurred.");
      }
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
        setError("Failed to initiate Google sign in");
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
            <CardTitle>Sign in to Plan Genie AI</CardTitle>
            <CardDescription>
              Welcome back! Please sign in to continue
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-y-4">
            <div className="grid grid-cols-2 gap-x-4">
              <Button size="sm" variant="outline" type="button">
                <Github />
                GitHub
              </Button>
              <Button
                size="sm"
                variant="outline"
                type="button"
                onClick={handleGoogleSignIn}
              >
                <FontAwesomeIcon icon={faGoogle} />
                Google
              </Button>
            </div>

            <p className="flex items-center gap-x-3 text-sm text-muted-foreground before:h-px before:flex-1 before:bg-border after:h-px after:flex-1 after:bg-border">
              or
            </p>

            <div className="space-y-2">
              <Label>Email address</Label>
              <Input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="space-y-2">
              <Label>Password</Label>
              <Input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>

            <div className="flex justify-center mt-4">
              <Turnstile
                sitekey="0x4AAAAAAA9BEEKWwme8C69l"
                onVerify={(token) => setTurnstileToken(token)}
                onError={() => {
                  setError("Turnstile verification failed");
                  setTurnstileToken(null);
                }}
                onExpire={() => setTurnstileToken(null)}
                language="en"
              />
            </div>

            {error && <p className="text-red-500 text-sm">{error}</p>}
          </CardContent>

          <CardFooter>
            <div className="grid w-full gap-y-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </Button>
              <Button variant="link" size="sm" asChild>
                <Link to="/sign-up">Don&apos;t have an account? Sign up</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

export { SignInPage };
