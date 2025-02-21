import { useState, useEffect } from "react";
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
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";
import api from "./components/api/api";
import { AxiosError } from "axios";
import { z } from "zod";

// Define Zod schema for validation
const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(/[A-Z]/, "Password must contain at least one uppercase letter")
    .regex(/[a-z]/, "Password must contain at least one lowercase letter")
    .regex(/[0-9]/, "Password must contain at least one number"),
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const [tokens, setTokens] = useState<{
    accessToken: string | null;
    refreshToken: string | null;
    type: string | null;
  }>({
    accessToken: null,
    refreshToken: null,
    type: null,
  });

  useEffect(() => {
    // Extract tokens from URL hash
    const hash = window.location.hash.substring(1); // Remove the # symbol
    const params = new URLSearchParams(hash);
    const accessToken = params.get("access_token");
    const refreshToken = params.get("refresh_token");
    const type = params.get("type");

    if (!accessToken || type !== "recovery") {
      toast.error("Invalid reset link");
      navigate("/sign-in");
      return;
    }

    setTokens({
      accessToken,
      refreshToken,
      type,
    });
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setValidationError(null);

    if (!tokens.accessToken) {
      toast.error("Invalid reset link");
      navigate("/sign-in");
      return;
    }

    // Validate password using Zod
    const result = resetPasswordSchema.safeParse({ password });
    if (!result.success) {
      setValidationError(result.error.errors[0].message);
      setLoading(false);
      return;
    }

    try {
      await api.post("/auth/update-password", {
        password,
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
      });

      navigate("/sign-in", {
        state: {
          message:
            "Password has been reset. Please sign in with your new password.",
        },
      });
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
            <CardTitle className="text-xl">Reset your password</CardTitle>
            <CardDescription className="text-sm">
              Please enter your new password below.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">New Password</Label>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </Button>
              </div>
              {validationError && (
                <p className="text-red-500 text-sm">{validationError}</p>
              )}
            </div>
          </CardContent>

          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" disabled={loading} className="w-full">
              {loading ? "Updating password..." : "Update password"}
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

export { ResetPasswordPage };
