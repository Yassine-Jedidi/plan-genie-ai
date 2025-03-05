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

function SignInPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const messageShown = useRef(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { checkAuth } = useAuth();
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    if (!turnstileToken) {
      toast.error("Please complete the Turnstile verification");
      setLoading(false);
      return;
    }

    try {
      await api.post("/auth/signin", { ...formData, turnstileToken });
      await checkAuth();
      toast.success("Signed in successfully!");
      navigate("/home");
    } catch (err) {
      if (err instanceof AxiosError && err.response) {
        const errorMessage =
          err.response.data?.message ||
          err.response.data?.error ||
          "An unknown error occurred.";
        toast.error(errorMessage);
      } else if (err instanceof AxiosError && err.request) {
        toast.error("No response from the server. Please try again later.");
      } else if (err instanceof Error) {
        toast.error(err.message || "Something went wrong.");
      } else {
        toast.error("An unexpected error occurred.");
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
            <CardTitle>Sign in to Plan Genie AI</CardTitle>
            <CardDescription>
              Welcome back! Please sign in to continue
            </CardDescription>
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
                  <Link to="/forgot-password">Forgot your password?</Link>
                </Button>
              </div>
            </div>

            <div className="flex justify-center">
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
