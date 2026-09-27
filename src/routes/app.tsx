import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { useOnboardedUser } from "@/hooks/use-onboarded-user";
import { FIRST_HOLE, getCourse, getHole, LAST_HOLE } from "@/lib/courses";
import { changeHole, endRound, useActiveRound } from "@/lib/round";

export const Route = createFileRoute("/app")({
  head: () => ({
    meta: [{ title: "Home | Your Virtual Caddy" }],
  }),
  component: AppHomePage,
});

function AppHomePage() {
  const { signOut } = useAuth();
  const { userId, ready } = useOnboardedUser();
  const round = useActiveRound(userId);
  const navigate = useNavigate();
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    setPending(true);
    await signOut();
    setPending(false);
    void navigate({ to: "/login" });
  }

  if (!ready || !userId) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background px-5">
        <p className="text-[0.85rem] text-muted-foreground">Loading…</p>
      </main>
    );
  }

  const course = round ? getCourse(round.courseId) : null;
  const hole = round ? getHole(round.courseId, round.currentHole) : null;

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
        {round && course && hole ? (
          <>
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              {course.name}
            </p>
            <h1 className="mt-4 text-[2.25rem] font-semibold leading-[1.05] tracking-[-0.03em] text-foreground">
              Hole {hole.number}
            </h1>
            <p className="mt-2 text-[1rem] font-medium text-muted-foreground">
              Par {hole.par} · {hole.yardage} yards
            </p>

            <Button
              type="button"
              variant="hero"
              onClick={() => void navigate({ to: "/advice" })}
              className="mt-10 h-14 w-full rounded-full px-6 text-[0.85rem] font-semibold"
            >
              Start Advice
            </Button>

            <div className="mt-3 grid grid-cols-2 gap-3">
              <Button
                type="button"
                variant="outline"
                disabled={round.currentHole <= FIRST_HOLE}
                onClick={() => changeHole(userId, -1)}
                className="h-14 rounded-full px-4 text-[0.8rem] font-semibold"
              >
                Previous Hole
              </Button>
              <Button
                type="button"
                variant="outline"
                disabled={round.currentHole >= LAST_HOLE}
                onClick={() => changeHole(userId, 1)}
                className="h-14 rounded-full px-4 text-[0.8rem] font-semibold"
              >
                Next Hole
              </Button>
            </div>

            <Button
              type="button"
              variant="ghost"
              onClick={() => endRound(userId)}
              className="mt-8 h-12 w-full rounded-full text-[0.8rem] font-medium text-muted-foreground hover:text-foreground"
            >
              End Round
            </Button>
          </>
        ) : (
          <>
            <h1 className="text-[1.85rem] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground">
              Ready when you are.
            </h1>

            <Button
              type="button"
              variant="hero"
              onClick={() => void navigate({ to: "/start-round" })}
              className="mt-10 h-14 w-full rounded-full px-6 text-[0.85rem] font-semibold"
            >
              Start Round
            </Button>
          </>
        )}
      </div>
    </main>
  );
}
