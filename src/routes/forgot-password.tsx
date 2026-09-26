import { createFileRoute, Link } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";

import { AuthFormShell } from "@/components/AuthFormShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { requestPasswordReset } from "@/lib/auth";

const emailSchema = z.string().trim().email("Please enter a valid email address.");

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [{ title: "Forgot Password | Your Virtual Caddy" }],
  }),
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [sent, setSent] = useState(false);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please enter a valid email address.");
      return;
    }

    setPending(true);
    const result = await requestPasswordReset(parsed.data);
    setPending(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setSent(true);
  }

  return (
    <AuthFormShell
      eyebrow="Account"
      title="Reset your password."
      description="Enter your email and we’ll send a link to choose a new password."
    >
      {sent ? (
        <div>
          <p className="text-[0.95rem] leading-relaxed text-muted-foreground">
            If an account exists for that email, a reset link is on its way. Check your inbox.
          </p>
          <Button asChild variant="hero" className="mt-8 h-12 w-full rounded-full px-6 text-[0.8rem] font-semibold">
            <Link to="/login">Back to log in</Link>
          </Button>
        </div>
      ) : (
        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div>
            <label htmlFor="forgot-email" className="sr-only">
              Email
            </label>
            <Input
              id="forgot-email"
              type="email"
              autoComplete="email"
              placeholder="Email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              disabled={pending}
              className="h-12 rounded-[4px] border-border bg-card px-4 text-[0.95rem] shadow-none placeholder:text-muted-foreground/70 focus-visible:ring-primary"
            />
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
            {pending ? "Sending…" : "Send reset link"}
          </Button>
        </form>
      )}

      {!sent ? (
        <p className="mt-6 text-[0.85rem] text-muted-foreground">
          Remembered it?{" "}
          <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
            Log in
          </Link>
        </p>
      ) : null}
    </AuthFormShell>
  );
}
