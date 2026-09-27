import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import { useOnboardedUser } from "@/hooks/use-onboarded-user";
import { cn } from "@/lib/utils";
import { listCourses } from "@/lib/courses";
import { startRound } from "@/lib/round";

export const Route = createFileRoute("/start-round")({
  head: () => ({
    meta: [{ title: "Start Round | Your Virtual Caddy" }],
  }),
  component: StartRoundPage,
});

function StartRoundPage() {
  const { userId, ready } = useOnboardedUser();
  const navigate = useNavigate();
  const [courseId, setCourseId] = useState<string | null>(null);
  const courses = listCourses();

  function handleStart() {
    if (!userId || !courseId) return;
    startRound(userId, courseId);
    void navigate({ to: "/app" });
  }

  if (!ready) {
    return (
      <main className="flex min-h-svh items-center justify-center bg-background px-5">
        <p className="text-[0.85rem] text-muted-foreground">Loading…</p>
      </main>
    );
  }

  return (
    <main className="flex min-h-svh flex-col bg-background px-5 py-10 sm:px-[6vw] sm:py-14">
      <header className="mx-auto flex w-full max-w-md items-center justify-between">
        <Link
          to="/app"
          className="text-[0.8rem] font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Home
        </Link>
        <span className="text-[0.7rem] font-medium tracking-[0.04em] text-muted-foreground">
          New round
        </span>
      </header>

      <div className="mx-auto mt-14 w-full max-w-md sm:mt-20">
        <h1 className="text-[1.85rem] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground">
          Where are you playing?
        </h1>
        <p className="mt-3 text-[0.85rem] text-muted-foreground">Sample courses for now.</p>

        <div className="mt-10 grid gap-3" role="radiogroup" aria-label="Course">
          {courses.map((course) => {
            const selected = course.id === courseId;
            const par = course.holes.reduce((total, hole) => total + hole.par, 0);
            return (
              <button
                key={course.id}
                type="button"
                role="radio"
                aria-checked={selected}
                onClick={() => setCourseId(course.id)}
                className={cn(
                  "flex min-h-16 w-full flex-col items-start justify-center rounded-[4px] border bg-card px-5 py-3 text-left transition-colors",
                  selected
                    ? "border-primary ring-1 ring-primary"
                    : "border-border hover:bg-accent",
                )}
              >
                <span className="text-[0.95rem] font-semibold text-foreground">{course.name}</span>
                <span className="mt-0.5 text-[0.8rem] text-muted-foreground">
                  18 holes · Par {par}
                </span>
              </button>
            );
          })}
        </div>

        <Button
          type="button"
          variant="hero"
          disabled={!courseId}
          onClick={handleStart}
          className="mt-8 h-14 w-full rounded-full px-6 text-[0.85rem] font-semibold"
        >
          Start Round
        </Button>
      </div>
    </main>
  );
}
