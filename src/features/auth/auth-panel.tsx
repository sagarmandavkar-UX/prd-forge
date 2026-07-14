"use client";

import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/navigation";

import { Logo } from "@/components/layout/logo";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  signInWithEmail,
  signUpWithEmail,
  resetPassword
} from "@/lib/auth/auth-service";
import { analytics } from "@/lib/analytics/events";
import { useDemoStore } from "@/providers/demo-store-provider";

export function AuthPanel({ mode }: { mode: "login" | "signup" | "forgot" }) {
  const router = useRouter();
  const { enterDemoMode } = useDemoStore();
  const [email, setEmail] = useState("alex.kim@demo.local");
  const [password, setPassword] = useState("demo-password");
  const [fullName, setFullName] = useState("Alex Kim");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setMessage("");
    const result =
      mode === "login"
        ? await signInWithEmail(email, password)
        : mode === "signup"
          ? await signUpWithEmail(email, password, fullName)
          : await resetPassword(email);
    setLoading(false);
    setMessage(result.message);
    if (result.ok && mode !== "forgot") {
      router.push("/dashboard");
    }
  }

  function demo() {
    enterDemoMode();
    analytics.track("demo_entered");
    router.push("/dashboard");
  }

  return (
    <main
      id="main-content"
      className="grid min-h-screen bg-background lg:grid-cols-[0.9fr_1.1fr]"
    >
      <section className="flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">
          <Logo />
          <h1 className="mt-10 text-3xl font-semibold">
            {mode === "login"
              ? "Welcome back"
              : mode === "signup"
                ? "Create your workspace"
                : "Reset your password"}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {mode === "forgot"
              ? "Enter your email and PRD Forge will send reset instructions after Supabase is configured."
              : "Use email authentication in production or demo mode locally."}
          </p>
          <form className="mt-8 space-y-4" onSubmit={submit}>
            {mode === "signup" ? (
              <label className="block text-sm font-medium">
                Full name
                <Input
                  className="mt-2"
                  value={fullName}
                  onChange={(event) => setFullName(event.target.value)}
                  required
                />
              </label>
            ) : null}
            <label className="block text-sm font-medium">
              Email
              <Input
                className="mt-2"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            {mode !== "forgot" ? (
              <label className="block text-sm font-medium">
                Password
                <Input
                  className="mt-2"
                  type="password"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  required
                />
              </label>
            ) : null}
            {message ? (
              <div
                role="status"
                className="rounded-md border bg-card p-3 text-sm text-muted-foreground"
              >
                {message}
              </div>
            ) : null}
            <Button className="w-full" type="submit" disabled={loading}>
              {loading
                ? "Working..."
                : mode === "login"
                  ? "Log in"
                  : mode === "signup"
                    ? "Create account"
                    : "Send reset email"}
            </Button>
            <Button
              className="w-full"
              type="button"
              variant="outline"
              onClick={demo}
            >
              Enter demo mode
            </Button>
          </form>
          <div className="mt-6 flex flex-wrap gap-4 text-sm text-muted-foreground">
            {mode !== "login" ? <Link href="/login">Log in</Link> : null}
            {mode !== "signup" ? <Link href="/signup">Sign up</Link> : null}
            {mode !== "forgot" ? (
              <Link href="/forgot-password">Forgot password?</Link>
            ) : null}
          </div>
        </div>
      </section>
      <section className="hidden border-l bg-card p-10 lg:flex lg:flex-col lg:justify-center">
        <div className="max-w-lg">
          <p className="text-sm font-medium text-primary">PRD Forge</p>
          <h2 className="mt-3 text-3xl font-semibold tracking-tight">
            Demo-ready locally. Production-ready when Supabase is connected.
          </h2>
          <p className="mt-4 text-sm leading-6 text-muted-foreground">
            Authentication, RLS-ready schema, AI provider abstraction, and
            export route handlers are prepared without exposing secrets to the
            browser.
          </p>
        </div>
      </section>
    </main>
  );
}
