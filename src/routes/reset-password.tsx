import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState, type FormEvent } from "react";
import { z } from "zod";

import { AuthFormShell } from "@/components/AuthFormShell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { updatePassword } from "@/lib/auth";

const passwordSchema = z
  .object({
    password: z.string().min(6, "Password must be at least 6 characters."),
    confirmPassword: z.string().min(1, "Please confirm your password."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [{ title: "Set New Password | Your Virtual Caddy" }],
  }),
  component: ResetPasswordPage,
});

function ResetPasswordPage() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const parsed = passwordSchema.safeParse({ password, confirmPassword });
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your details.");
      return;
    }

    setPending(true);
    const result = await updatePassword(parsed.data.password);
    setPending(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    void navigate({ to: "/app" });
  }

  return (
    <AuthFormShell
      eyebrow="Account"
      title="Choose a new password."
      description="Enter a new password for your Your Virtual Caddy account."
    >
      <form className="space-y-4" onSubmit={handleSubmit} noValidate>
        <div>
          <label htmlFor="reset-password" className="sr-only">
            New password
          </label>
          <Input
            id="reset-password"
            type="password"
            autoComplete="new-password"
            placeholder="New password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            disabled={pending}
            className="h-12 rounded-[4px] border-border bg-card px-4 text-[0.95rem] shadow-none placeholder:text-muted-foreground/70 focus-visible:ring-primary"
          />
        </div>
        <div>
          <label htmlFor="reset-confirm" className="sr-only">
            Confirm new password
          </label>
          <Input
            id="reset-confirm"
            type="password"
            autoComplete="new-password"
            placeholder="Confirm new password"
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

        <Button
          type="submit"
          variant="hero"
          disabled={pending}
          className="h-12 w-full rounded-full px-6 text-[0.8rem] font-semibold"
        >
          {pending ? "Saving…" : "Update password"}
        </Button>
      </form>

      <p className="mt-6 text-[0.85rem] text-muted-foreground">
        <Link to="/login" className="font-medium text-foreground underline-offset-4 hover:underline">
          Back to log in
        </Link>
      </p>
    </AuthFormShell>
  );
}
