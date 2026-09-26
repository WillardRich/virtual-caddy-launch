import type {
  CaddyDecisionInput,
  CaddyRecommendation,
  CourseContext,
  CourseHazard,
  GreenDanger,
  Lie,
  ShotContext,
} from "@/lib/caddy/types";
import { getNextMockCourseContext } from "@/lib/caddy/mockCourseContext";

/**
 * Deterministic mock caddy decision engine.
 *
 * Consumes structured shot + course facts only — no hard-coded holes.
 * Later: replace this body with a calculation layer + AI explanation
 * while keeping the same input/output contract.
 */
export function getCaddyRecommendation(
  shot: ShotContext,
  course: CourseContext,
): CaddyRecommendation {
  return getRecommendation({ shot, course });
}

export function getRecommendation(input: CaddyDecisionInput): CaddyRecommendation {
  const { shot, course } = input;

  const club = pickClub(shot.distance, shot.lie);
  const target = formatLabel(course.green.safeArea);
  const miss = pickMissToAvoid(course, shot.lie);
  const reason = buildReason(course);

  return {
    club,
    target,
    miss,
    reason,
  };
}

/**
 * Prototype entry: golfer input only.
 * Course context is supplied by the system (mock rotation for now).
 */
export function getMockRecommendation(distance: number, lie: Lie): CaddyRecommendation {
  const shot: ShotContext = {
    distance,
    distanceUnit: "yards",
    lie,
    course: null,
    hole: null,
    pinPosition: null,
    wind: null,
    elevation: null,
  };

  const course = getNextMockCourseContext();
  return getCaddyRecommendation(shot, course);
}

function pickClub(distanceYards: number, lie: Lie): string {
  if (lie === "bunker") {
    if (distanceYards <= 40) return "Sand Wedge";
    if (distanceYards <= 90) return "Gap Wedge";
    return "Pitching Wedge";
  }

  if (lie === "around_the_green") {
    if (distanceYards <= 30) return "Lob Wedge";
    if (distanceYards <= 50) return "Sand Wedge";
    return "Pitching Wedge";
  }

  if (distanceYards >= 230) return "Hybrid";
  if (distanceYards >= 210) return "4 Hybrid";
  if (distanceYards >= 195) return "5 Iron";
  if (distanceYards >= 180) return "6 Iron";
  if (distanceYards >= 165) return "7 Iron";
  if (distanceYards >= 150) return "8 Iron";
  if (distanceYards >= 135) return "9 Iron";
  if (distanceYards >= 120) return "Pitching Wedge";
  if (distanceYards >= 100) return "Gap Wedge";
  if (distanceYards >= 80) return "Sand Wedge";
  return "Lob Wedge";
}

function formatLabel(raw: string): string {
  return raw
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("-");
}

function pickMissToAvoid(course: CourseContext, lie: Lie): string {
  const primaryDanger = course.green.dangerousAreas[0];
  if (primaryDanger) {
    return formatLabel(primaryDanger.side);
  }

  const primaryHazard = course.hazards[0];
  if (primaryHazard) {
    return formatLabel(sideFromLocation(primaryHazard.location));
  }

  // No course danger — soft default by lie
  if (lie === "bunker") return "Short";
  if (lie === "around_the_green") return "Long";
  return "Long";
}

function sideFromLocation(location: string): string {
  if (location.includes("left")) return "left";
  if (location.includes("right")) return "right";
  if (location.includes("short")) return "short";
  if (location.includes("long")) return "long";
  return location;
}

/**
 * Builds a short "why" from course facts — not from hard-coded hole knowledge.
 */
function buildReason(course: CourseContext): string {
  const pin = course.green.pinPosition;
  const safe = formatLabel(course.green.safeArea).toLowerCase();
  const dangers = course.green.dangerousAreas;
  const hazards = course.hazards;

  if (dangers.length === 0 && hazards.length === 0) {
    if (pin && pin !== "center") {
      return `The pin is ${humanPin(pin)} and there isn't major trouble around the green, so you can play toward it.`;
    }
    return "No major trouble around the green — play the center and make a confident swing.";
  }

  const dangerClause = formatDangerClause(dangers, hazards);

  if (pin && !isSameArea(pin, course.green.safeArea)) {
    return `The pin is ${humanPin(pin)}, but ${dangerClause}. There's more room for error toward the ${safe}, so don't chase the pin.`;
  }

  return `${capitalize(dangerClause)}. Favor the ${safe} and leave yourself a miss that stays safe.`;
}

function formatDangerClause(dangers: GreenDanger[], hazards: CourseHazard[]): string {
  if (dangers.length > 0) {
    const primary = dangers[0]!;
    return `the ${primary.side} side has a ${primary.description}`;
  }

  const hazard = hazards[0]!;
  return `there's a ${hazard.type} ${humanLocation(hazard.location)}`;
}

function humanPin(pin: string): string {
  return pin.replace(/-/g, " ");
}

function humanLocation(location: string): string {
  return location.replace(/-/g, " ");
}

function isSameArea(a: string, b: string): boolean {
  return a.replace(/-/g, "") === b.replace(/-/g, "");
}

function capitalize(text: string): string {
  if (!text) return text;
  return text.charAt(0).toUpperCase() + text.slice(1);
}
