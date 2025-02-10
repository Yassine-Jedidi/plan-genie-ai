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

function SignInPage() {
  return (
    <div className="grid w-full grow items-center px-4 py-24 justify-center">
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
          <div className="grid w-full gap-y-4">
            <Button>Sign in</Button>
            <Button variant="link" size="sm" asChild>
              <Link to="/sign-up">Don&apos;t have an account? Sign up</Link>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}

export { SignInPage };
