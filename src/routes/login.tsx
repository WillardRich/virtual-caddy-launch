import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";

import { AuthFormShell } from "@/components/AuthFormShell";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { signIn, getSession } from "@/lib/auth";
import { getPostAuthPath } from "@/lib/profile";

const loginSchema = z.object({
  email: z.string().trim().email("Please enter a valid email address."),
  password: z.string().min(1, "Please enter your password."),
});

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [{ title: "Log In | Your Virtual Caddy" }],
  }),
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  useEffect(() => {
    if (authLoading || !session?.user) return;
    let active = true;
    void (async () => {
      const path = await getPostAuthPath(session.user.id);
      if (active) void navigate({ to: path });
    })();
    return () => {
      active = false;
    };
  }, [authLoading, session, navigate]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your details.");
      return;
    }

    setPending(true);
    const result = await signIn(parsed.data.email, parsed.data.password);
    if (!result.ok) {
      setPending(false);
      setError(result.error);
      return;
    }

    const nextSession = await getSession();
    const path = nextSession?.user
      ? await getPostAuthPath(nextSession.user.id)
      : "/app";
    setPending(false);
    void navigate({ to: path });
  }

  return (
    <AuthFormShell
      eyebrow="Account"
      title="Log in."
      description="Welcome back. Continue to Your Virtual Caddy."
    >
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="login-email" className="sr-only">
            Email
          </label>
          <Input
            id="login-email"
            type="email"
            autoComplete="email"
            placeholder="Email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            disabled={pending}
            className="h-12 rounded-[4px] border-border bg-card px-4 text-[0.95rem] shadow-none placeholder:text-muted-foreground/70 focus-visible:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="login-password" className="sr-only">
            Password
          </label>
          <Input
            id="login-password"
            type="password"
            autoComplete="current-password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={pending}
            className="h-12 rounded-[4px] border-border bg-card px-4 text-[0.95rem] shadow-none placeholder:text-muted-foreground/70 focus-visible:ring-primary"
          />
        </div>

        <div className="flex justify-end">
          <Link
            to="/forgot-password"
            className="text-[0.8rem] font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
          >
            Forgot password?
          </Link>
        </div>

        {error ? (
          <p className="text-[0.8rem] leading-snug text-muted-foreground" role="alert">
            {error}
          </p>
        ) : null}

        <Button
          type="submit"
          variant="hero"
          disabled={pending}
          className="h-12 w-full rounded-full px-6 text-[0.8rem] font-semibold"
        >
          {pending ? "Logging in…" : "Log In"}
        </Button>
      </form>

      <p className="mt-6 text-[0.85rem] text-muted-foreground">
        Don&apos;t have an account?{" "}
        <Link to="/signup" className="font-medium text-foreground underline-offset-4 hover:underline">
          Sign up
        </Link>
      </p>
    </AuthFormShell>
  );
}
