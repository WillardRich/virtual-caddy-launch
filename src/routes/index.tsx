import { createFileRoute } from "@tanstack/react-router";
import { ArrowDown, ArrowUpRight } from "lucide-react";

import courseImage from "@/assets/virtual-caddy-course.jpg";
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
  return (
    <main className="overflow-hidden bg-background">
      <section className="relative min-h-[94svh] bg-hero text-hero-foreground">
        <img
          src={courseImage}
          alt="Aerial view of a championship golf hole winding through a mountain forest"
          width={1920}
          height={1280}
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-[66%_center] sm:object-center"
        />
        <div className="hero-scrim absolute inset-0" aria-hidden="true" />

        <header className="relative z-20 mx-auto flex w-full max-w-[1480px] items-center justify-between px-5 py-5 sm:px-10 sm:py-8 lg:px-16">
          <a href="#top" aria-label="Your Virtual Caddy home" className="group flex items-center gap-3">
            <span className="flex size-9 items-center justify-center rounded-full border border-hero-line bg-hero-glass text-[0.64rem] font-bold tracking-[0.12em] backdrop-blur-md transition-colors group-hover:bg-hero-glass-strong">
              YVC
            </span>
            <span className="hidden text-[0.76rem] font-semibold tracking-[0.03em] sm:inline">
              Your Virtual Caddy
            </span>
          </a>
          <a
            href="#start"
            className="inline-flex h-10 items-center gap-2 rounded-full border border-hero-line bg-hero-glass px-4 text-[0.72rem] font-semibold backdrop-blur-md transition-colors hover:bg-hero-glass-strong"
          >
            Get Started
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        </header>

        <div id="top" className="relative z-10 mx-auto flex min-h-[calc(94svh-96px)] w-full max-w-[1480px] flex-col justify-end px-5 pb-10 sm:px-10 sm:pb-12 lg:px-16 lg:pb-16">
          <div className="hero-enter max-w-4xl">
            <p className="mb-5 text-[0.67rem] font-semibold uppercase tracking-[0.24em] text-hero-muted sm:mb-7">
              Intelligence for the course
            </p>
            <h1 className="max-w-[12ch] text-[clamp(3.5rem,9vw,8.5rem)] font-semibold leading-[0.88] tracking-normal">
              Your Virtual Caddy
            </h1>
            <div className="mt-7 flex max-w-2xl flex-col items-start gap-7 sm:mt-9 sm:flex-row sm:items-end sm:justify-between">
              <p className="max-w-md text-base leading-relaxed text-hero-muted sm:text-lg">
                An intelligent caddy that reads the course and your game, so every shot starts with a better decision.
              </p>
              <Button asChild variant="hero" size="hero">
                <a href="#concept">
                  Get Started
                  <ArrowDown className="size-4" aria-hidden="true" />
                </a>
              </Button>
            </div>
          </div>

          <div className="mt-12 flex items-end justify-between border-t border-hero-line pt-5 text-[0.63rem] font-semibold uppercase tracking-[0.18em] text-hero-faint sm:mt-16">
            <span>Play the shot, not the guess</span>
            <span className="hidden sm:block">Course intelligence / 01</span>
          </div>
        </div>

        <div className="course-marker absolute right-[15%] top-[34%] z-10 hidden lg:block" aria-hidden="true">
          <span className="block size-2 rounded-full bg-signal shadow-signal" />
          <span className="mt-3 block border-l border-hero-line pl-3 text-[0.58rem] font-semibold uppercase tracking-[0.18em] text-hero-muted">
            154 yds<br />Play 161
          </span>
        </div>
      </section>

      <section id="concept" className="bg-background px-5 py-24 sm:px-10 sm:py-32 lg:px-16 lg:py-44">
        <div className="mx-auto grid max-w-[1320px] gap-16 lg:grid-cols-[0.72fr_1.28fr] lg:gap-24">
          <div>
            <p className="flex items-center gap-3 text-[0.68rem] font-bold uppercase tracking-[0.2em] text-muted-foreground">
              <span className="h-px w-8 bg-primary" aria-hidden="true" />
              The advantage
            </p>
          </div>
          <div>
            <h2 className="max-w-[20ch] text-[clamp(2.15rem,4.5vw,4.8rem)] font-semibold leading-[1.04] tracking-normal text-foreground">
              Clarity between you and the flag.
            </h2>
            <p className="mt-8 max-w-2xl text-base leading-8 text-muted-foreground sm:text-lg">
              Your Virtual Caddy brings distance, conditions, course strategy, and your own tendencies into one clear recommendation—right when it matters.
            </p>

            <div className="mt-14 grid gap-8 border-t border-border pt-8 sm:grid-cols-3 sm:gap-6">
              {[
                ["01", "Reads the hole"],
                ["02", "Knows your game"],
                ["03", "Commits the shot"],
              ].map(([number, label]) => (
                <div key={number} className="flex items-baseline gap-4 sm:block">
                  <span className="text-[0.62rem] font-bold tracking-[0.18em] text-primary">{number}</span>
                  <p className="mt-3 text-sm font-semibold text-foreground">{label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section id="start" className="bg-cta px-5 py-24 text-cta-foreground sm:px-10 sm:py-32 lg:px-16 lg:py-40">
        <div className="mx-auto max-w-[1320px]">
          <p className="text-[0.67rem] font-semibold uppercase tracking-[0.22em] text-cta-muted">Your next round</p>
          <div className="mt-6 flex flex-col items-start justify-between gap-10 border-b border-cta-line pb-16 md:flex-row md:items-end">
            <h2 className="max-w-[12ch] text-[clamp(2.75rem,6vw,6.5rem)] font-semibold leading-[0.96] tracking-normal">
              Make every decision count.
            </h2>
            <Button asChild variant="hero" size="hero">
              <a href="#concept">
                Get Started
                <ArrowUpRight className="size-4" aria-hidden="true" />
              </a>
            </Button>
          </div>
          <footer className="flex flex-col gap-3 pt-6 text-[0.62rem] font-medium uppercase tracking-[0.16em] text-cta-muted sm:flex-row sm:items-center sm:justify-between">
            <span>© 2026 Your Virtual Caddy</span>
            <span>Better golf begins before the swing.</span>
          </footer>
        </div>
      </section>
    </main>
  );
}
