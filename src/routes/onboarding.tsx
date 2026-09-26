import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { z } from "zod";

import { useAuth } from "@/components/AuthProvider";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  CLUB_OPTIONS,
  getProfileStatus,
  saveOnboarding,
  type ClubName,
} from "@/lib/profile";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [{ title: "Build Your Caddy Profile | Your Virtual Caddy" }],
  }),
  component: OnboardingPage,
});

const TOTAL_STEPS = 4;

const handicapSchema = z.object({
  handicap: z
    .number({
      required_error: "Enter your handicap.",
      invalid_type_error: "Enter your handicap.",
    })
    .min(0, "Handicap must be 0 or higher.")
    .max(54, "Handicap must be 54 or lower."),
  averageScore: z
    .number({
      required_error: "Enter your average score.",
      invalid_type_error: "Enter your average score.",
    })
    .min(55, "Enter a realistic 18-hole score.")
    .max(150, "Enter a realistic 18-hole score."),
});

const driverSchema = z.object({
  driverCarry: z
    .number({
      required_error: "Enter your driver carry.",
      invalid_type_error: "Enter your driver carry.",
    })
    .min(50, "Enter a realistic carry in yards.")
    .max(400, "Enter a realistic carry in yards."),
});

const clubDistanceValueSchema = z
  .number()
  .min(1, "Club distances must be positive yardages.")
  .max(400, "Enter a realistic carry in yards.");

const recentScoreSchema = z
  .number()
  .min(50, "Enter a realistic 18-hole score.")
  .max(150, "Enter a realistic 18-hole score.");

const inputClassName =
  "h-12 rounded-[4px] border-border bg-card px-4 text-[0.95rem] shadow-none placeholder:text-muted-foreground/70 focus-visible:ring-primary";

function parseOptionalNumber(raw: string): number | undefined {
  const trimmed = raw.trim();
  if (!trimmed) return undefined;
  const value = Number(trimmed);
  return Number.isFinite(value) ? value : Number.NaN;
}

function OnboardingPage() {
  const { user, session, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [checking, setChecking] = useState(true);
  const [step, setStep] = useState(1);
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  const [handicap, setHandicap] = useState("");
  const [averageScore, setAverageScore] = useState("");
  const [driverCarry, setDriverCarry] = useState("");
  const [clubDistances, setClubDistances] = useState<Record<ClubName, string>>(
    () =>
      Object.fromEntries(CLUB_OPTIONS.map((club) => [club, ""])) as Record<
        ClubName,
        string
      >,
  );
  const [recentScores, setRecentScores] = useState<string[]>(["", "", "", ""]);

  useEffect(() => {
    if (authLoading) return;

    if (!session || !user) {
      void navigate({ to: "/login" });
      return;
    }

    let active = true;
    void (async () => {
      const status = await getProfileStatus(user.id);
      if (!active) return;

      if (status?.onboardingCompleted) {
        void navigate({ to: "/app" });
        return;
      }

      setChecking(false);
    })();

    return () => {
      active = false;
    };
  }, [authLoading, session, user, navigate]);

  function goNext() {
    setError(null);

    if (step === 1) {
      const parsed = handicapSchema.safeParse({
        handicap: parseOptionalNumber(handicap),
        averageScore: parseOptionalNumber(averageScore),
      });
      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message ?? "Please check your details.");
        return;
      }
      setStep(2);
      return;
    }

    if (step === 2) {
      const parsed = driverSchema.safeParse({
        driverCarry: parseOptionalNumber(driverCarry),
      });
      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message ?? "Please check your details.");
        return;
      }
      setStep(3);
      return;
    }

    if (step === 3) {
      for (const club of CLUB_OPTIONS) {
        const raw = clubDistances[club].trim();
        if (!raw) continue;
        const value = Number(raw);
        const parsed = clubDistanceValueSchema.safeParse(value);
        if (!parsed.success) {
          setError(`${club}: ${parsed.error.issues[0]?.message ?? "Invalid distance."}`);
          return;
        }
      }
      setStep(4);
    }
  }

  function goBack() {
    setError(null);
    setStep((current) => Math.max(1, current - 1));
  }

  async function handleFinish(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!user) return;

    setError(null);

    const basics = handicapSchema.safeParse({
      handicap: parseOptionalNumber(handicap),
      averageScore: parseOptionalNumber(averageScore),
    });
    if (!basics.success) {
      setError(basics.error.issues[0]?.message ?? "Please check your details.");
      setStep(1);
      return;
    }

    const driver = driverSchema.safeParse({
      driverCarry: parseOptionalNumber(driverCarry),
    });
    if (!driver.success) {
      setError(driver.error.issues[0]?.message ?? "Please check your details.");
      setStep(2);
      return;
    }

    const clubs: { club: ClubName; distance: number }[] = [];
    for (const club of CLUB_OPTIONS) {
      const raw = clubDistances[club].trim();
      if (!raw) continue;
      const value = Number(raw);
      const parsed = clubDistanceValueSchema.safeParse(value);
      if (!parsed.success) {
        setError(`${club}: ${parsed.error.issues[0]?.message ?? "Invalid distance."}`);
        setStep(3);
        return;
      }
      clubs.push({ club, distance: parsed.data });
    }

    const scores: number[] = [];
    for (const raw of recentScores) {
      const trimmed = raw.trim();
      if (!trimmed) continue;
      const value = Number(trimmed);
      const parsed = recentScoreSchema.safeParse(value);
      if (!parsed.success) {
        setError(parsed.error.issues[0]?.message ?? "Check your recent scores.");
        return;
      }
      scores.push(parsed.data);
    }

    setPending(true);
    const result = await saveOnboarding(user.id, {
      handicap: basics.data.handicap,
      averageScore: basics.data.averageScore,
      driverCarry: driver.data.driverCarry,
      clubDistances: clubs,
      recentScores: scores,
    });
    setPending(false);

    if (!result.ok) {
      setError(result.error);
      return;
    }

    void navigate({ to: "/app" });
  }

  if (authLoading || checking || !session) {
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
          to="/"
          className="flex items-center gap-2.5 text-foreground transition-opacity hover:opacity-80"
        >
          <span className="flex size-7 items-center justify-center rounded-full border border-border bg-card text-[0.55rem] font-semibold tracking-[0.14em] text-muted-foreground">
            YVC
          </span>
          <span className="text-[0.7rem] font-medium tracking-[0.04em]">Your Virtual Caddy</span>
        </Link>
        <p className="text-[0.7rem] font-medium text-muted-foreground">
          {step} / {TOTAL_STEPS}
        </p>
      </header>

      <div className="mx-auto mt-14 w-full max-w-md sm:mt-20">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Caddy profile
        </p>

        {step === 1 ? (
          <>
            <h1 className="mt-4 text-[1.85rem] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground">
              Your game basics.
            </h1>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
              Handicap and typical score help the caddy understand your level.
            </p>
            <form
              className="mt-8 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                goNext();
              }}
              noValidate
            >
              <div>
                <label
                  htmlFor="onboarding-handicap"
                  className="mb-2 block text-[0.8rem] font-medium text-foreground"
                >
                  Handicap <span className="text-muted-foreground">(required)</span>
                </label>
                <Input
                  id="onboarding-handicap"
                  type="number"
                  inputMode="decimal"
                  step="0.1"
                  min={0}
                  max={54}
                  placeholder="e.g. 8.4"
                  value={handicap}
                  onChange={(event) => setHandicap(event.target.value)}
                  disabled={pending}
                  className={inputClassName}
                />
              </div>
              <div>
                <label
                  htmlFor="onboarding-average-score"
                  className="mb-2 block text-[0.8rem] font-medium text-foreground"
                >
                  Average 18-hole score <span className="text-muted-foreground">(required)</span>
                </label>
                <Input
                  id="onboarding-average-score"
                  type="number"
                  inputMode="numeric"
                  min={55}
                  max={150}
                  placeholder="e.g. 82"
                  value={averageScore}
                  onChange={(event) => setAverageScore(event.target.value)}
                  disabled={pending}
                  className={inputClassName}
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
                className="h-12 w-full rounded-full px-6 text-[0.8rem] font-semibold"
              >
                Continue
              </Button>
            </form>
          </>
        ) : null}

        {step === 2 ? (
          <>
            <h1 className="mt-4 text-[1.85rem] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground">
              Driver carry.
            </h1>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
              Approximate carry distance off the tee — not total roll.
            </p>
            <form
              className="mt-8 space-y-4"
              onSubmit={(event) => {
                event.preventDefault();
                goNext();
              }}
              noValidate
            >
              <div>
                <label
                  htmlFor="onboarding-driver"
                  className="mb-2 block text-[0.8rem] font-medium text-foreground"
                >
                  Driver carry (yards) <span className="text-muted-foreground">(required)</span>
                </label>
                <Input
                  id="onboarding-driver"
                  type="number"
                  inputMode="numeric"
                  min={50}
                  max={400}
                  placeholder="e.g. 275"
                  value={driverCarry}
                  onChange={(event) => setDriverCarry(event.target.value)}
                  disabled={pending}
                  className={inputClassName}
                />
              </div>
              {error ? (
                <p className="text-[0.8rem] leading-snug text-muted-foreground" role="alert">
                  {error}
                </p>
              ) : null}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goBack}
                  className="h-12 flex-1 rounded-full px-6 text-[0.8rem] font-semibold"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="hero"
                  className="h-12 flex-1 rounded-full px-6 text-[0.8rem] font-semibold"
                >
                  Continue
                </Button>
              </div>
            </form>
          </>
        ) : null}

        {step === 3 ? (
          <>
            <h1 className="mt-4 text-[1.85rem] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground">
              Club distances.
            </h1>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
              Enter carry for the clubs you use. Leave the rest blank.
            </p>
            <form
              className="mt-8 space-y-3"
              onSubmit={(event) => {
                event.preventDefault();
                goNext();
              }}
              noValidate
            >
              <div className="max-h-[min(52vh,28rem)] space-y-3 overflow-y-auto pr-1">
                {CLUB_OPTIONS.map((club) => (
                  <div key={club} className="flex items-center gap-3">
                    <label
                      htmlFor={`club-${club}`}
                      className="w-[7.5rem] shrink-0 text-[0.85rem] font-medium text-foreground sm:w-36"
                    >
                      {club}
                    </label>
                    <Input
                      id={`club-${club}`}
                      type="number"
                      inputMode="numeric"
                      min={1}
                      max={400}
                      placeholder="Yards"
                      value={clubDistances[club]}
                      onChange={(event) =>
                        setClubDistances((current) => ({
                          ...current,
                          [club]: event.target.value,
                        }))
                      }
                      disabled={pending}
                      className={inputClassName}
                    />
                  </div>
                ))}
              </div>
              {error ? (
                <p className="text-[0.8rem] leading-snug text-muted-foreground" role="alert">
                  {error}
                </p>
              ) : null}
              <div className="flex gap-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goBack}
                  className="h-12 flex-1 rounded-full px-6 text-[0.8rem] font-semibold"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="hero"
                  className="h-12 flex-1 rounded-full px-6 text-[0.8rem] font-semibold"
                >
                  Continue
                </Button>
              </div>
            </form>
          </>
        ) : null}

        {step === 4 ? (
          <>
            <h1 className="mt-4 text-[1.85rem] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground">
              Recent scores.
            </h1>
            <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">
              A few recent 18-hole scores. Skip any you don’t remember.
            </p>
            <form className="mt-8 space-y-4" onSubmit={handleFinish} noValidate>
              {recentScores.map((value, index) => (
                <div key={index}>
                  <label htmlFor={`recent-score-${index}`} className="sr-only">
                    Recent score {index + 1}
                  </label>
                  <Input
                    id={`recent-score-${index}`}
                    type="number"
                    inputMode="numeric"
                    min={50}
                    max={150}
                    placeholder={`Score ${index + 1}`}
                    value={value}
                    onChange={(event) => {
                      const next = [...recentScores];
                      next[index] = event.target.value;
                      setRecentScores(next);
                    }}
                    disabled={pending}
                    className={inputClassName}
                  />
                </div>
              ))}
              <button
                type="button"
                disabled={pending || recentScores.length >= 8}
                onClick={() => setRecentScores((current) => [...current, ""])}
                className="text-[0.8rem] font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline disabled:opacity-50"
              >
                Add another score
              </button>
              {error ? (
                <p className="text-[0.8rem] leading-snug text-muted-foreground" role="alert">
                  {error}
                </p>
              ) : null}
              <div className="flex gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goBack}
                  disabled={pending}
                  className="h-12 flex-1 rounded-full px-6 text-[0.8rem] font-semibold"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  variant="hero"
                  disabled={pending}
                  className="h-12 flex-1 rounded-full px-6 text-[0.8rem] font-semibold"
                >
                  {pending ? "Saving…" : "Finish"}
                </Button>
              </div>
            </form>
          </>
        ) : null}
      </div>
    </main>
  );
}
