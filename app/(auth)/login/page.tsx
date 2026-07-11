"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";

export default function LoginPage() {
  const searchParams = useSearchParams();
  const redirectTo = searchParams.get("redirectTo") || "/dashboard";
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const supabase = createClient();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setIsLoading(true);

    // 1. Try sign in first
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    // 2. If user doesn't exist, auto-signup
    if (signInError) {
      const isInvalidCredentials =
        signInError.message.includes("Invalid login credentials") ||
        signInError.message.includes("Invalid credentials") ||
        signInError.status === 400;

      if (isInvalidCredentials) {
        // Extract name from email prefix
        const name = email.split("@")[0] || "User";

        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { name },
          },
        });

        if (signUpError) {
          toast.error(signUpError.message);
          setIsLoading(false);
          return;
        }

        // Explicitly sign in to guarantee the session cookie is created
        const { error: secondSignInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (secondSignInError) {
          toast.error(secondSignInError.message);
          setIsLoading(false);
          return;
        }

        toast.success("No account found. We've automatically created one for you!");
      } else {
        toast.error(signInError.message);
        setIsLoading(false);
        return;
      }
    } else {
      toast.success("Welcome back!");
    }

    window.location.href = redirectTo;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Login</CardTitle>
        <CardDescription>
          Enter your credentials to access your account
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit} id="login-form">
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={isLoading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full" type="submit" disabled={isLoading}>
            {isLoading ? "Signing in..." : "Sign In"}
          </Button>
          <p className="text-center text-sm text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}