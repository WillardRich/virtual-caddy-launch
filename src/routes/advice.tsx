import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useOnboardedUser } from "@/hooks/use-onboarded-user";
import {
  getCaddyRecommendation,
  type CaddyRecommendation,
  type Lie,
  type PlayerContext,
  type ShotContext,
} from "@/lib/caddy";
import { getCourse, getHole, toCourseContext } from "@/lib/courses";
import { getPlayerContext } from "@/lib/profile";
import { useActiveRound } from "@/lib/round";

export const Route = createFileRoute("/advice")({
  head: () => ({
    meta: [{ title: "Advice | Your Virtual Caddy" }],
  }),
  component: AdvicePage,
});

type Step = "distance" | "lie" | "recommendation";

const LIE_OPTIONS: { value: Lie; label: string }[] = [
  { value: "fairway", label: "Fairway" },
  { value: "rough", label: "Rough" },
  { value: "bunker", label: "Bunker" },
  { value: "around_the_green", label: "Around the green" },
];

const inputClassName =
  "h-14 rounded-[4px] border-border bg-card px-4 text-center text-[1.35rem] font-semibold tabular-nums shadow-none placeholder:text-muted-foreground/70 focus-visible:ring-primary";

function AdvicePage() {
  const { userId, ready } = useOnboardedUser();
  const round = useActiveRound(userId);
  const navigate = useNavigate();

  const [player, setPlayer] = useState<PlayerContext | null>(null);
  const [step, setStep] = useState<Step>("distance");
  const [distanceRaw, setDistanceRaw] = useState("");
  const [distance, setDistance] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recommendation, setRecommendation] = useState<CaddyRecommendation | null>(null);

  useEffect(() => {
    if (!ready || !userId) return;
    let active = true;
    void getPlayerContext(userId).then((context) => {
      if (active) setPlayer(context);
    });
    return () => {
      active = false;
    };
  }, [ready, userId]);

  const course = round ? getCourse(round.courseId) : null;
  const hole = round ? getHole(round.courseId, round.currentHole) : null;

  function resetFlow() {
    setStep("distance");
    setDistanceRaw("");
    setDistance(null);
    setError(null);
    setRecommendation(null);
  }

  function handleDistanceContinue(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    const value = Number(distanceRaw.trim());
    if (!distanceRaw.trim() || !Number.isFinite(value) || value < 1 || value > 700) {
      setError("Enter a distance between 1 and 700 yards.");
      return;
    }

    setDistance(Math.round(value));
    setStep("lie");
  }

  function handleLieSelect(lie: Lie) {
    if (distance == null || !course || !hole) return;

    const shot: ShotContext = {
      distance,
      distanceUnit: "yards",
      lie,
      course: course.id,
      hole: hole.number,
      pinPosition: null,
      wind: null,
      elevation: null,
    };

    setRecommendation(getCaddyRecommendation(shot, toCourseContext(hole), player));
    setStep("recommendation");
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
      <header className="mx-auto flex w-full max-w-md items-center justify-between gap-4">
        <Link
          to="/app"
          className="text-[0.8rem] font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Home
        </Link>
        {course && hole ? (
          <span className="truncate text-right text-[0.75rem] font-medium text-muted-foreground">
            {course.name} · Hole {hole.number}
          </span>
        ) : null}
      </header>

      <div className="mx-auto mt-14 w-full max-w-md sm:mt-20">
        {!course || !hole ? (
          <>
            <h1 className="text-[1.85rem] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground">
              Start a round first.
            </h1>
            <p className="mt-3 text-[0.95rem] text-muted-foreground">
              Pick your course so the caddy knows the hole.
            </p>
            <Button
              type="button"
              variant="hero"
              onClick={() => void navigate({ to: "/start-round" })}
              className="mt-10 h-14 w-full rounded-full px-6 text-[0.85rem] font-semibold"
            >
              Start Round
            </Button>
          </>
        ) : null}

        {course && hole && step === "distance" ? (
          <>
            <p className="text-[0.85rem] font-medium text-muted-foreground">
              Par {hole.par} · {hole.yardage} yards
            </p>
            <h1 className="mt-2 text-[1.85rem] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground">
              How far?
            </h1>
            <form className="mt-10 space-y-6" onSubmit={handleDistanceContinue} noValidate>
              <div className="flex items-center gap-3">
                <Input
                  id="advice-distance"
                  type="number"
                  inputMode="numeric"
                  min={1}
                  max={700}
                  placeholder="154"
                  value={distanceRaw}
                  onChange={(event) => setDistanceRaw(event.target.value)}
                  className={inputClassName}
                  aria-label="Distance in yards"
                />
                <span className="shrink-0 text-[0.95rem] font-medium text-muted-foreground">
                  yards
                </span>
              </div>
              {error ? (
                <p className="text-[0.8rem] leading-snug text-muted-foreground" role="alert">
                  {error}
                </p>
              ) : null}
              <Button
                type="submit"
                variant="hero"
                className="h-14 w-full rounded-full px-6 text-[0.85rem] font-semibold"
              >
                Continue
              </Button>
            </form>
          </>
        ) : null}

        {course && hole && step === "lie" ? (
          <>
            <h1 className="text-[1.85rem] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground">
              Where are you?
            </h1>
            <p className="mt-3 text-[0.9rem] text-muted-foreground">{distance} yards</p>
            <div className="mt-10 grid gap-3">
              {LIE_OPTIONS.map((option) => (
                <Button
                  key={option.value}
                  type="button"
                  variant="outline"
                  onClick={() => handleLieSelect(option.value)}
                  className="h-14 w-full rounded-[4px] border-border bg-card px-6 text-[0.95rem] font-semibold text-foreground shadow-none hover:bg-accent"
                >
                  {option.label}
                </Button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => {
                setError(null);
                setStep("distance");
              }}
              className="mt-8 text-[0.8rem] font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
            >
              Back
            </button>
          </>
        ) : null}

        {course && hole && step === "recommendation" && recommendation ? (
          <>
            <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              Play this
            </p>
            <h1 className="mt-4 text-[2.5rem] font-semibold uppercase leading-[1.05] tracking-[-0.03em] text-foreground sm:text-[2.75rem]">
              {recommendation.club}
            </h1>

            <dl className="mt-10 space-y-5">
              <div>
                <dt className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Aim
                </dt>
                <dd className="mt-1.5 text-[1.25rem] font-semibold text-foreground">
                  {recommendation.target}
                </dd>
              </div>
              <div>
                <dt className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                  Avoid
                </dt>
                <dd className="mt-1.5 text-[1.25rem] font-semibold text-foreground">
                  {recommendation.miss}
                </dd>
              </div>
            </dl>

            <div className="mt-10">
              <p className="text-[0.75rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                Why?
              </p>
              <p className="mt-2 text-[0.95rem] leading-relaxed text-muted-foreground">
                {recommendation.reason}
              </p>
            </div>

            <div className="mt-12 space-y-3">
              <Button
                type="button"
                variant="hero"
                onClick={resetFlow}
                className="h-14 w-full rounded-full px-6 text-[0.85rem] font-semibold"
              >
                New Advice
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => void navigate({ to: "/app" })}
                className="h-12 w-full rounded-full px-6 text-[0.8rem] font-semibold"
              >
                Return Home
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </main>
  );
}
