import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

type AuthFormShellProps = {
  eyebrow: string;
  title: string;
  description: string;
  children: ReactNode;
};

export function AuthFormShell({ eyebrow, title, description, children }: AuthFormShellProps) {
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
      </header>

      <div className="mx-auto mt-14 w-full max-w-md sm:mt-20">
        <p className="text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          {eyebrow}
        </p>
        <h1 className="mt-4 text-[1.85rem] font-semibold leading-[1.1] tracking-[-0.02em] text-foreground">
          {title}
        </h1>
        <p className="mt-4 text-[0.95rem] leading-relaxed text-muted-foreground">{description}</p>
        <div className="mt-8">{children}</div>
      </div>
    </main>
  );
}
