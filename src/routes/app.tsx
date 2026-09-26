import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { getProfileStatus } from "@/lib/profile";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [{ title: "Home | Your Virtual Caddy" }],
  }),
  component: AppHomePage,
});

function AppHomePage() {
  const { session, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (loading) return;

    if (!session?.user) {
      void navigate({ to: "/login" });
      return;
    }

    let active = true;
    void (async () => {
      const status = await getProfileStatus(session.user.id);
      if (!active) return;

      if (!status?.onboardingCompleted) {
        void navigate({ to: "/onboarding" });
        return;
      }

      setReady(true);
    })();

    return () => {
      active = false;
    };
  }, [loading, session, navigate]);

  async function handleSignOut() {
    setPending(true);
    await signOut();
    setPending(false);
    void navigate({ to: "/login" });
  }

  if (loading || !session || !ready) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background px-5">
        <p className="text-[0.85rem] text-muted-foreground">Loading…</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-svh flex-col bg-background px-5 py-10 sm:px-[6vw] sm:py-14">
      <header className="mx-auto flex w-full max-w-md items-center justify-between">
        <Link to="/" className="flex items-center gap-2.5 text-foreground">
          <span className="flex size-7 items-center justify-center rounded-full border border-border bg-card text-[0.55rem] font-semibold tracking-[0.14em] text-muted-foreground">
            YVC
          </span>
          <span className="text-[0.7rem] font-medium tracking-[0.04em]">Your Virtual Caddy</span>
        </Link>
        <Button
          type="button"
          variant="ghost"
          disabled={pending}
          onClick={handleSignOut}
          className="h-9 px-3 text-[0.75rem] font-medium text-muted-foreground hover:text-foreground"
        >
          {pending ? "Logging out…" : "Log out"}
        </Button>
      </header>

      <div className="mx-auto mt-20 flex w-full max-w-md flex-1 flex-col sm:mt-28">
        <h1 className="text-[1.85rem] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground">
          Ready when you are.
        </h1>

        <div className="mt-10">
          <Button
            type="button"
            variant="hero"
            onClick={() => void navigate({ to: "/advice" })}
            className="h-14 w-full rounded-full px-6 text-[0.85rem] font-semibold"
          >
            Start Advice
          </Button>
        </div>
      </div>
    </main>
  );
}
