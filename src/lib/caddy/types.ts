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

  // Future fields — reserved for later slices
  course: null;
  hole: null;
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
    width: number;
    depth: number;
    pinPosition: string | null;
    safeArea: string;
    dangerousAreas: GreenDanger[];
  };
  hazards: CourseHazard[];
  /** True when this context is placeholder / mock data. */
  isMock: boolean;
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
};
