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

function SignUpPage() {
  return (
    <div className="grid w-full grow items-center px-4 py-24 justify-center">
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
            <Input type="email" required />
          </div>

          <div className="space-y-2">
            <Label>Password</Label>
            <Input type="password" required />
          </div>
        </CardContent>

        <CardFooter>
          <div className="w-full flex flex-col gap-6">
            {/* Sign Up Button */}
            <Button className="w-full">Sign up</Button>

            {/* Text Link for Sign In */}
            <div className="text-center">
              <span className="text-sm text-muted-foreground">
                Already have an account?{" "}
              </span>
              <Link to="/sign-in" className="text-primary font-semibold">
                Sign in
              </Link>
            </div>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export { SignUpPage };
