import { useState } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight } from "lucide-react";

import courseImage from "@/assets/virtual-caddy-course.jpg";
import { HoleStrategyViz } from "@/components/HoleStrategyViz";
import { WaitlistModal } from "@/components/WaitlistModal";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Your Virtual Caddy | Smarter Golf Decisions" },
      {
        name: "description",
        content:
          "Your Virtual Caddy reads the course, conditions, and your game to guide every decision.",
      },
      { property: "og:title", content: "Your Virtual Caddy | Smarter Golf Decisions" },
      {
        property: "og:description",
        content: "Course intelligence built around the way you play.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

function Index() {
  const [waitlistOpen, setWaitlistOpen] = useState(false);

  function openWaitlist() {
    setWaitlistOpen(true);
  }

  return (
    <main className="overflow-hidden bg-background">
      <WaitlistModal open={waitlistOpen} onOpenChange={setWaitlistOpen} />

      <section className="relative min-h-svh bg-hero text-hero-foreground">
        <img
          src={courseImage}
          alt="Aerial view of a championship golf hole winding through a mountain forest"
          width={1920}
          height={1280}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[66%_center] sm:object-center"
        />
        <div className="hero-scrim absolute inset-0" aria-hidden="true" />

        <header className="relative z-20 flex h-[5.25rem] w-full items-center justify-between px-5 sm:h-[5.5rem] sm:px-[6vw]">
          <a href="#top" aria-label="Your Virtual Caddy home" className="group flex items-center gap-2.5">
            <span className="flex size-7 items-center justify-center rounded-full border border-hero-line/70 bg-hero-glass text-[0.55rem] font-semibold tracking-[0.14em] text-hero-muted backdrop-blur-md transition-colors group-hover:bg-hero-glass-strong group-hover:text-hero-foreground">
              YVC
            </span>
            <span className="hidden text-[0.7rem] font-medium tracking-[0.04em] text-hero-muted transition-colors group-hover:text-hero-foreground sm:inline">
              Your Virtual Caddy
            </span>
          </a>
          <button
            type="button"
            onClick={openWaitlist}
            className="text-[0.7rem] font-medium tracking-[0.04em] text-hero-faint transition-colors hover:text-hero-foreground"
          >
            Get Started
          </button>
        </header>

        <div
          id="top"
          className="relative z-10 flex min-h-[calc(100svh-5.25rem)] w-full flex-col justify-center px-5 sm:min-h-[calc(100svh-5.5rem)] sm:px-[6vw]"
        >
          <div className="hero-enter max-w-[40rem]">
            <h1 className="text-left text-[clamp(2.75rem,5.8vw,5.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] lg:whitespace-nowrap">
              Play. Don&apos;t Guess.
            </h1>
            <p className="mt-8 max-w-[26rem] text-[1.125rem] leading-relaxed text-hero-muted sm:mt-9 sm:max-w-[28rem] sm:text-[1.25rem]">
              Personalized course strategy for every shot.
            </p>
            <Button
              type="button"
              variant="hero"
              size="hero"
              className="mt-8 sm:mt-9"
              onClick={openWaitlist}
            >
              Get Started
              <ArrowDown className="size-4" aria-hidden="true" />
            </Button>
          </div>
        </div>

        {/* Ball on fairway → approach yardage → green.
            SVG viewBox matches the photo (1920×1280) so object-cover and overlay stay locked.
            Ball on brightest verified fairway grass; soft pad clarifies the lie in photo shadows. */}
        <div
          className="course-marker pointer-events-none absolute inset-0 z-10 hidden lg:block"
          aria-hidden="true"
        >
          <svg
            className="absolute inset-0 h-full w-full"
            viewBox="0 0 1920 1280"
            preserveAspectRatio="xMidYMid slice"
            fill="none"
          >
            <defs>
              <radialGradient id="fairway-lie" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="oklch(0.62 0.12 134 / 45%)" />
                <stop offset="55%" stopColor="oklch(0.55 0.1 134 / 18%)" />
                <stop offset="100%" stopColor="oklch(0.5 0.08 134 / 0%)" />
              </radialGradient>
            </defs>

            {/* Approach: fairway → center of putting green */}
            <path
              d="M 1421 691 C 1475 580, 1505 490, 1515 415"
              stroke="oklch(0.96 0.01 100 / 55%)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeDasharray="6 12"
            />

            {/* Green target — on the putting surface */}
            <circle
              cx="1515"
              cy="415"
              r="18"
              stroke="oklch(0.74 0.15 134 / 55%)"
              strokeWidth="1.75"
            />
            <circle cx="1515" cy="415" r="4.5" fill="oklch(0.74 0.15 134 / 85%)" />

            {/* Soft fairway lie — readable despite photo shadows */}
            <ellipse cx="1421" cy="691" rx="52" ry="28" fill="url(#fairway-lie)" />

            {/* Current ball — brightest fairway grass (≈74%, 54%) */}
            <circle
              cx="1421"
              cy="691"
              r="14"
              stroke="oklch(0.96 0.01 100 / 45%)"
              strokeWidth="1.75"
            />
            <circle cx="1421" cy="691" r="5.5" fill="oklch(0.96 0.01 100)" />

            {/* Yardage beside the ball */}
            <g transform="translate(1485 665)">
              <line
                x1="0"
                y1="6"
                x2="0"
                y2="44"
                stroke="oklch(0.98 0 0 / 35%)"
                strokeWidth="1.25"
              />
              <text
                x="12"
                y="18"
                fill="oklch(0.96 0.01 100 / 92%)"
                fontSize="15"
                fontWeight="600"
                letterSpacing="2.4"
              >
                154 YDS
              </text>
              <text
                x="12"
                y="40"
                fill="oklch(0.96 0.01 100 / 70%)"
                fontSize="13"
                fontWeight="500"
                letterSpacing="2.1"
              >
                PLAY 161
              </text>
            </g>
          </svg>
        </div>
      </section>

      <section
        id="concept"
        className="bg-background px-5 py-16 sm:px-[6vw] sm:py-20 lg:py-24"
      >
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)] lg:gap-12 xl:gap-14">
          <div className="max-w-lg">
            <p className="flex items-center gap-3 text-[0.68rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
              <span className="h-px w-7 bg-primary" aria-hidden="true" />
              Course intelligence
            </p>
            <h2 className="mt-5 max-w-[12ch] text-[clamp(2.15rem,3.4vw,3.65rem)] font-semibold leading-[1.08] tracking-[-0.025em] text-foreground">
              Know the shot.
              <br />
              Before you hit it.
            </h2>
            <p className="mt-5 max-w-md text-[1.05rem] leading-relaxed text-muted-foreground sm:mt-6 sm:text-[1.125rem]">
              Your Virtual Caddy considers the course, conditions, and your game to give you one clear recommendation.
            </p>
          </div>

          <HoleStrategyViz />
        </div>

        <div className="mt-10 border-t border-border/80 pt-7 sm:mt-12 sm:pt-8">
          <ul className="grid gap-8 sm:grid-cols-3 sm:gap-8 lg:gap-12">
            {[
              {
                number: "01",
                title: "Analyze the course",
                description:
                  "Hazards, elevation, wind, pin position, and available landing areas.",
              },
              {
                number: "02",
                title: "Factor in your game",
                description:
                  "Your real distances, tendencies, strengths, and misses.",
              },
              {
                number: "03",
                title: "Recommend the shot",
                description:
                  "The club, target, and strategy that give you the best play.",
                payoff: true,
              },
            ].map(({ number, title, description, payoff }) => (
              <li key={number} className="max-w-xs">
                <span
                  className={`text-[0.6rem] font-semibold tracking-[0.16em] ${
                    payoff ? "text-primary" : "text-muted-foreground"
                  }`}
                >
                  {number}
                </span>
                <p
                  className={`mt-2.5 text-[0.95rem] tracking-[-0.01em] text-foreground ${
                    payoff ? "font-semibold" : "font-medium"
                  }`}
                >
                  {title}
                </p>
                <p className="mt-2 max-w-[28ch] text-[0.875rem] leading-relaxed text-muted-foreground">
                  {description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section
        id="start"
        className="flex min-h-[55svh] flex-col justify-center bg-cta px-5 py-16 text-cta-foreground sm:min-h-[60svh] sm:px-[6vw] sm:py-20 lg:min-h-[62svh]"
      >
        <div className="w-full">
          <p className="text-[0.67rem] font-semibold uppercase tracking-[0.22em] text-cta-muted">
            Your next round
          </p>
          <div className="mt-5 flex flex-col items-start justify-between gap-7 border-b border-cta-line pb-10 sm:mt-6 sm:gap-8 sm:pb-12 md:flex-row md:items-center">
            <h2 className="max-w-[14ch] text-[clamp(2.5rem,5vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.025em]">
              Play with a plan.
            </h2>
            <Button
              type="button"
              variant="hero"
              onClick={openWaitlist}
              className="h-14 shrink-0 rounded-full px-7 text-[0.8rem] font-semibold sm:h-[3.5rem] sm:min-w-[11.5rem] sm:px-8"
            >
              Get Started
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </Button>
          </div>
          <footer className="flex flex-col gap-3 pt-5 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-cta-muted sm:flex-row sm:items-center sm:justify-between sm:pt-6">
            <span>© 2026 Your Virtual Caddy</span>
            <span>Better golf begins before the swing.</span>
          </footer>
        </div>
      </section>
    </main>
  );
}
