import { useEffect, useId, useState, type FormEvent } from "react";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { joinWaitlist } from "@/lib/waitlist";

type WaitlistModalProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
};

export function WaitlistModal({ open, onOpenChange }: WaitlistModalProps) {
  const emailId = useId();
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!open) {
      const timer = window.setTimeout(() => {
        setEmail("");
        setError(null);
        setPending(false);
        setSuccess(false);
      }, 200);
      return () => window.clearTimeout(timer);
    }
  }, [open]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setPending(true);

    const result = await joinWaitlist(email);

    setPending(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    setSuccess(true);
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        hideCloseButton
        overlayClassName="bg-[oklch(0.12_0.02_145_/_55%)] backdrop-blur-[2px]"
        className="w-[calc(100%-2rem)] max-w-[26rem] gap-0 rounded-md border-border bg-background p-8 shadow-[0_24px_80px_-32px_oklch(0.18_0.02_145_/_45%)] sm:rounded-md sm:p-9"
      >
        {success ? (
          <div>
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              You&apos;re in
            </p>
            <DialogTitle className="mt-4 text-[1.85rem] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground">
              Thank you for your response.
            </DialogTitle>
            <DialogDescription className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
              We&apos;ll be in touch when Your Virtual Caddy is ready.
            </DialogDescription>
            <Button
              type="button"
              variant="hero"
              className="mt-8 h-12 w-full rounded-full px-6 text-[0.8rem] font-semibold"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
          </div>
        ) : (
          <div>
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Early access
            </p>
            <DialogTitle className="mt-4 text-[1.85rem] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground">
              Get early access.
            </DialogTitle>
            <DialogDescription className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
              Your Virtual Caddy is still in development. Leave your email and we&apos;ll let you know
              when there&apos;s something new to try.
            </DialogDescription>

            <form className="mt-8" onSubmit={handleSubmit} noValidate>
              <label htmlFor={emailId} className="sr-only">
                Email
              </label>
              <Input
                id={emailId}
                type="email"
                name="email"
                autoComplete="email"
                inputMode="email"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => {
                  setEmail(event.target.value);
                  if (error) setError(null);
                }}
                disabled={pending}
                aria-invalid={Boolean(error)}
                className="h-12 rounded-[4px] border-border bg-card px-4 text-[0.95rem] shadow-none placeholder:text-muted-foreground/70 focus-visible:ring-primary"
              />

              {error ? (
                <p className="mt-3 text-[0.8rem] leading-snug text-muted-foreground" role="alert">
                  {error}
                </p>
              ) : null}

              <Button
                type="submit"
                variant="hero"
                disabled={pending}
                className="mt-4 h-12 w-full rounded-full px-6 text-[0.8rem] font-semibold"
              >
                {pending ? "Submitting…" : "Keep me posted"}
                {!pending ? <ArrowRight className="size-3.5" aria-hidden="true" /> : null}
              </Button>
            </form>

            <p className="mt-4 text-[0.72rem] leading-relaxed text-muted-foreground">
              No spam. Just updates on the build.
            </p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
