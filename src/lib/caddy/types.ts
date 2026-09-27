/**
 * Standardized shot context + recommendation shapes for the Advice Tool.
 * Future inputs (GPS, APIs, weather) should populate ShotContext / CourseContext;
 * the UI consumes CaddyRecommendation regardless of how it was produced.
 */

export type DistanceUnit = "yards";

export type Lie = "fairway" | "rough" | "bunker" | "around_the_green";

export type ShotContext = {
  distance: number;
  distanceUnit: DistanceUnit;
  lie: Lie;
  course: string | null;
  hole: number | null;

  // Future fields — reserved for later slices
  pinPosition: null;
  wind: null;
  elevation: null;
};

export type GreenDanger = {
  side: string;
  description: string;
};

export type CourseHazard = {
  location: string;
  type: string;
};

export type CourseContext = {
  green: {
    width: number | null;
    depth: number | null;
    pinPosition: string | null;
    safeArea: string | null;
    dangerousAreas: GreenDanger[];
  };
  hazards: CourseHazard[];
  /** True when this context is placeholder / mock data. */
  isMock: boolean;
};

export type PlayerClubDistance = {
  club: string;
  distance: number;
};

export type PlayerContext = {
  handicap: number | null;
  clubDistances: PlayerClubDistance[];
};

export type CaddyRecommendation = {
  club: string;
  target: string;
  miss: string;
  reason: string;
};

export type CaddyDecisionInput = {
  shot: ShotContext;
  course: CourseContext;
  player: PlayerContext | null;
};
