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
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGoogle } from "@fortawesome/free-brands-svg-icons";
import { Github } from "lucide-react";
import { useState } from "react";
import api from "./components/api/api";

function SignUpPage() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  // Handle input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await api.post("/auth/signup", formData);

      setSuccess("Account created successfully! Please check your email.");
    } catch (err: any) {
      // Extract exact error message from API response
      if (err.response) {
        // API returned a response
        setError(
          err.response.data?.message ||
            err.response.data?.error ||
            "An unknown error occurred."
        );
      } else if (err.request) {
        // No response was received from the server
        setError("No response from the server. Please try again later.");
      } else {
        // Other unexpected error
        setError(err.message || "Something went wrong.");
      }
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="grid w-full grow items-center px-4 py-24 justify-center">
      <form onSubmit={handleSubmit}>
        <Card className="w-full sm:w-96">
          <CardHeader>
            <CardTitle>Create your account</CardTitle>
            <CardDescription>
              Welcome! Please fill in the details to get started.
            </CardDescription>
          </CardHeader>
          <CardContent className="grid gap-y-4">
            <div className="grid grid-cols-2 gap-x-4">
              <Button size="sm" variant="outline" type="button">
                <Github />
                GitHub
              </Button>
              <Button size="sm" variant="outline" type="button">
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
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {success && <p className="text-green-500 text-sm">{success}</p>}
          </CardContent>

          <CardFooter>
            <div className="grid w-full gap-y-4">
              <Button type="submit" disabled={loading}>
                {loading ? "Signing up..." : "Sign up"}
              </Button>
              <Button variant="link" size="sm" asChild>
                <Link to="/sign-in">Already have an account? Sign in</Link>
              </Button>
            </div>
          </CardFooter>
        </Card>
      </form>
    </div>
  );
}

export { SignUpPage };
