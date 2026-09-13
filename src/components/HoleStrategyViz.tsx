/**
 * Approach-shot product demo: ball in the fairway,
 * ~154 yards to a green target with a 7-iron recommendation.
 */
export function HoleStrategyViz() {
  return (
    <figure
      className="concept-viz relative aspect-[16/11] w-full overflow-hidden rounded-[2px] bg-[oklch(0.18_0.03_145)] sm:aspect-[16/10]"
      aria-label="Recommended approach: 154 yards with a 7 iron to the green"
    >
      <svg
        className="absolute inset-0 h-full w-full"
        viewBox="0 0 840 560"
        role="img"
        aria-hidden="true"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="hole-ground" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="oklch(0.22 0.035 145)" />
            <stop offset="55%" stopColor="oklch(0.19 0.032 150)" />
            <stop offset="100%" stopColor="oklch(0.16 0.028 145)" />
          </linearGradient>
          <linearGradient id="fairway-fill" x1="20%" y1="100%" x2="55%" y2="0%">
            <stop offset="0%" stopColor="oklch(0.41 0.07 140)" />
            <stop offset="100%" stopColor="oklch(0.47 0.08 135)" />
          </linearGradient>
          <radialGradient id="landing-glow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="oklch(0.72 0.15 134 / 40%)" />
            <stop offset="65%" stopColor="oklch(0.66 0.14 134 / 14%)" />
            <stop offset="100%" stopColor="oklch(0.66 0.14 134 / 0%)" />
          </radialGradient>
        </defs>

        <rect width="840" height="560" fill="url(#hole-ground)" />

        {/* Tree canopy — clear of the approach corridor */}
        <g fill="oklch(0.14 0.03 145)" opacity="0.9">
          <ellipse cx="90" cy="150" rx="54" ry="68" />
          <ellipse cx="140" cy="240" rx="42" ry="54" />
          <ellipse cx="75" cy="330" rx="48" ry="58" />
          <ellipse cx="125" cy="420" rx="38" ry="46" />
          <ellipse cx="770" cy="120" rx="50" ry="62" />
          <ellipse cx="795" cy="230" rx="44" ry="54" />
          <ellipse cx="750" cy="340" rx="52" ry="64" />
          <ellipse cx="790" cy="440" rx="40" ry="48" />
        </g>

        <g fill="oklch(0.24 0.04 145)" opacity="0.5">
          <ellipse cx="220" cy="95" rx="64" ry="30" />
          <ellipse cx="600" cy="500" rx="86" ry="34" />
          <ellipse cx="250" cy="510" rx="72" ry="28" />
        </g>

        {/* Fairway: tee context at bottom → approach position → green */}
        <path
          d="M345 530
             C 320 470, 310 410, 325 350
             C 340 290, 365 240, 395 190
             C 420 150, 455 115, 490 90
             C 515 72, 555 68, 575 88
             C 598 110, 590 145, 565 175
             C 530 225, 485 270, 460 325
             C 435 380, 430 440, 450 500
             C 458 525, 410 545, 370 538
             C 355 535, 348 532, 345 530 Z"
          fill="url(#fairway-fill)"
          opacity="0.92"
        />

        <path
          d="M355 525
             C 335 455, 330 390, 345 335
             C 365 265, 400 210, 435 165
             C 470 120, 515 90, 555 86"
          fill="none"
          stroke="oklch(0.58 0.08 135 / 32%)"
          strokeWidth="1.2"
        />

        {/* Tee box — context only, not the shot origin */}
        <rect
          x="360"
          y="508"
          width="30"
          height="18"
          rx="2"
          fill="oklch(0.34 0.055 140)"
          stroke="oklch(0.7 0.02 100 / 22%)"
          strokeWidth="1"
        />

        {/* Greenside bunker — left of green, outside the line */}
        <ellipse
          cx="395"
          cy="118"
          rx="36"
          ry="16"
          fill="oklch(0.78 0.04 95)"
          opacity="0.78"
          transform="rotate(-18 395 118)"
        />
        <ellipse
          cx="395"
          cy="118"
          rx="36"
          ry="16"
          fill="none"
          stroke="oklch(0.62 0.04 95 / 40%)"
          strokeWidth="1"
          transform="rotate(-18 395 118)"
        />

        {/* Putting green */}
        <ellipse cx="520" cy="105" rx="62" ry="38" fill="oklch(0.5 0.1 140)" />
        <ellipse
          cx="520"
          cy="105"
          rx="62"
          ry="38"
          fill="none"
          stroke="oklch(0.62 0.09 135 / 40%)"
          strokeWidth="1"
        />

        {/* Flag */}
        <line
          x1="528"
          y1="105"
          x2="528"
          y2="62"
          stroke="oklch(0.92 0.01 100 / 80%)"
          strokeWidth="1.25"
          strokeLinecap="round"
        />
        <path d="M528 64 L556 72 L528 80 Z" fill="oklch(0.66 0.14 134)" />

        {/* Target / landing area — on the green */}
        <circle cx="512" cy="112" r="42" fill="url(#landing-glow)" />
        <circle
          cx="512"
          cy="112"
          r="24"
          fill="oklch(0.66 0.14 134 / 12%)"
          stroke="oklch(0.72 0.15 134 / 72%)"
          strokeWidth="1.5"
        />
        <circle cx="512" cy="112" r="4" fill="oklch(0.74 0.16 134)" />
        <circle
          cx="512"
          cy="112"
          r="4"
          fill="none"
          stroke="oklch(0.95 0.02 100 / 55%)"
          strokeWidth="1"
        />

        {/* Approach trajectory: fairway ball → green */}
        <path
          className="concept-shot-path"
          d="M405 355 C 420 280, 460 180, 512 112"
          fill="none"
          stroke="oklch(0.96 0.01 100 / 72%)"
          strokeWidth="1.6"
          strokeLinecap="round"
          strokeDasharray="2.5 7"
        />

        {/* Current ball position in the fairway */}
        <circle cx="405" cy="355" r="5" fill="oklch(0.96 0.01 100)" />
        <circle
          cx="405"
          cy="355"
          r="11"
          fill="none"
          stroke="oklch(0.96 0.01 100 / 35%)"
          strokeWidth="1"
        />
      </svg>

      <div className="pointer-events-none absolute inset-0">
        <p className="absolute left-4 top-4 text-[0.58rem] font-semibold uppercase tracking-[0.2em] text-white/70 sm:left-5 sm:top-5">
          Recommended play
        </p>

        {/* Club/distance beside the green target */}
        <div className="absolute left-[66%] top-[14%] sm:left-[68%] sm:top-[15%]">
          <div className="border-l border-white/30 pl-3">
            <p className="text-[0.72rem] font-semibold tracking-[0.04em] text-white/95 sm:text-[0.8rem]">
              154 yds
            </p>
            <p className="mt-1 text-[0.58rem] font-semibold uppercase tracking-[0.16em] text-[oklch(0.78_0.14_134)]">
              7 Iron
            </p>
          </div>
        </div>
      </div>

      <figcaption className="sr-only">
        Ball in the fairway, 154 yards from the green. Recommended play: 7 iron to the target on the
        green.
      </figcaption>
    </figure>
  );
}
