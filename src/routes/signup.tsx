import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";

import { AuthFormShell } from "@/components/AuthFormShell";
import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getSession, signUp } from "@/lib/auth";
import { getPostAuthPath } from "@/lib/profile";

const signupSchema = z
  .object({
    email: z.string().trim().email("Please enter a valid email address."),
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const Route = createFileRoute("/signup")({
  head: () => ({
    meta: [{ title: "Sign Up | Your Virtual Caddy" }],
  }),
  component: SignupPage,
});

function SignupPage() {
  const navigate = useNavigate();
  const { session, loading: authLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
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
    setInfo(null);

    const parsed = signupSchema.safeParse({ email, password, confirmPassword });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your details.");
      return;
    }

    setPending(true);
    const result = await signUp(parsed.data.email, parsed.data.password);
    if (!result.ok) {
      setPending(false);
      setError(result.error);
      return;
    }

    const nextSession = await getSession();
    if (nextSession?.user) {
      const path = await getPostAuthPath(nextSession.user.id);
      setPending(false);
      void navigate({ to: path });
      return;
    }

    setPending(false);
    setInfo("Account created. Check your email to confirm, then log in.");
  }

  return (
    <AuthFormShell
      eyebrow="Account"
      title="Create your account."
      description="Sign up to start using Your Virtual Caddy."
    >
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="signup-email" className="sr-only">
            Email
          </label>
          <Input
            id="signup-email"
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
          <label htmlFor="signup-password" className="sr-only">
            Password
          </label>
          <Input
            id="signup-password"
            type="password"
            autoComplete="new-password"
            placeholder="Password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={pending}
            className="h-12 rounded-[4px] border-border bg-card px-4 text-[0.95rem] shadow-none placeholder:text-muted-foreground/70 focus-visible:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="signup-confirm" className="sr-only">
            Confirm password
          </label>
          <Input
            id="signup-confirm"
            type="password"
            autoComplete="new-password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            disabled={pending}
            className="h-12 rounded-[4px] border-border bg-card px-4 text-[0.95rem] shadow-none placeholder:text-muted-foreground/70 focus-visible:ring-primary"
          />
        </div>

        {error ? (
          <p className="text-[0.8rem] leading-snug text-muted-foreground" role="alert">
            {error}
          </p>
        ) : null}
        {info ? (
          <p className="text-[0.8rem] leading-snug text-muted-foreground" role="status">
            {info}
          </p>
        ) : null}

        <Button
          type="submit"
          variant="hero"
          disabled={pending}
          className="h-12 w-full rounded-full px-6 text-[0.8rem] font-semibold"
        >
          {pending ? "Creating account…" : "Create Account"}
        </Button>
      </form>

      <p className="mt-6 text-[0.85rem] text-muted-foreground">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
          Log in
        </Link>
      </p>
    </AuthFormShell>
  );
}
