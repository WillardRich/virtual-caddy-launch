import type {
  CaddyDecisionInput,
  CaddyRecommendation,
  CourseContext,
  CourseHazard,
  GreenDanger,
  Lie,
  PlayerContext,
  ShotContext,
} from "@/lib/caddy/types";

/**
 * Deterministic mock caddy decision engine.
 *
 * Consumes structured shot, course, and player facts only — never course names
 * or hole numbers. Replace the body later with a calculation layer + AI
 * explanation while keeping the same input/output contract.
 */
export function getCaddyRecommendation(
  shot: ShotContext,
  course: CourseContext,
  player: PlayerContext | null = null,
): CaddyRecommendation {
  return getRecommendation({ shot, course, player });
}

const ROUGH_EXTRA_YARDS = 5;
const DEFAULT_MAX_APPROACH_YARDS = 230;
const NO_TROUBLE_LABEL = "No major trouble listed";

type ClubPick = { club: string; carry: number | null };

export function getRecommendation(input: CaddyDecisionInput): CaddyRecommendation {
  const { shot, course, player } = input;
  const clubs = usableClubs(player);

  if (isFullSwing(shot.lie) && shot.distance > maxApproach(clubs) + 10) {
    return layUp(shot, course, clubs);
  }

  const pick = pickClub(shot, clubs);
  const target = pickTarget(course);
  const miss = pickMiss(course);

  const reason = [clubNote(pick), lieNote(shot.lie), greenReason(course)]
    .filter(Boolean)
    .join(" ");

  return { club: pick.club, target, miss, reason };
}

function isFullSwing(lie: Lie): boolean {
  return lie === "fairway" || lie === "rough";
}

/** Player club distances, excluding Driver (not an approach club). */
function usableClubs(player: PlayerContext | null): ClubPick[] {
  return (player?.clubDistances ?? [])
    .filter((row) => row.club !== "Driver" && row.distance > 0)
    .map((row) => ({ club: row.club, carry: row.distance }))
    .sort((a, b) => (a.carry ?? 0) - (b.carry ?? 0));
}

function maxApproach(clubs: ClubPick[]): number {
  const longest = clubs[clubs.length - 1];
  return longest?.carry ?? DEFAULT_MAX_APPROACH_YARDS;
}

function pickClub(shot: ShotContext, clubs: ClubPick[]): ClubPick {
  const { distance, lie } = shot;

  if (lie === "bunker") {
    if (distance <= 40) return { club: "Sand Wedge", carry: null };
    if (distance <= 90) return { club: "Gap Wedge", carry: null };
    return { club: "Pitching Wedge", carry: null };
  }

  if (lie === "around_the_green") {
    if (distance <= 30) return { club: "Lob Wedge", carry: null };
    if (distance <= 50) return { club: "Sand Wedge", carry: null };
    return { club: "Pitching Wedge", carry: null };
  }

  const effective = distance + (lie === "rough" ? ROUGH_EXTRA_YARDS : 0);

  if (clubs.length > 0) {
    const fit = clubs.find((row) => (row.carry ?? 0) >= effective);
    return fit ?? clubs[clubs.length - 1]!;
  }

  return { club: defaultClubFor(effective), carry: null };
}

function defaultClubFor(yards: number): string {
  if (yards >= 210) return "3 Wood";
  if (yards >= 195) return "Hybrid";
  if (yards >= 180) return "5 Iron";
  if (yards >= 165) return "6 Iron";
  if (yards >= 155) return "7 Iron";
  if (yards >= 145) return "8 Iron";
  if (yards >= 135) return "9 Iron";
  if (yards >= 120) return "Pitching Wedge";
  if (yards >= 100) return "Gap Wedge";
  if (yards >= 80) return "Sand Wedge";
  return "Lob Wedge";
}

function layUp(shot: ShotContext, course: CourseContext, clubs: ClubPick[]): CaddyRecommendation {
  const longest = clubs[clubs.length - 1];
  const club = longest?.club ?? "Hybrid";
  const shortHazard = course.hazards.find((hazard) => hazard.location.includes("short"));

  const reason = shortHazard
    ? `You can't reach the green from here. Hit a club you trust and stay back from the ${hazard(shortHazard)} short of the green.`
    : "You can't reach the green from here. Hit a club you trust and set up a comfortable next shot.";

  return {
    club,
    target: "Down the middle",
    miss: shortHazard ? formatLabel(shortHazard.location) : NO_TROUBLE_LABEL,
    reason: shot.lie === "rough" ? `${reason} From the rough, just get it back in play.` : reason,
  };
}

function pickTarget(course: CourseContext): string {
  const { safeArea, pinPosition, dangerousAreas } = course.green;
  if (safeArea) return formatLabel(safeArea);
  if (pinPosition && dangerousAreas.length === 0 && course.hazards.length === 0) {
    return formatLabel(pinPosition);
  }
  return "Center";
}

function pickMiss(course: CourseContext): string {
  const danger = course.green.dangerousAreas[0];
  if (danger) return formatLabel(danger.side);
  const hazardAhead = course.hazards[0];
  if (hazardAhead) return formatLabel(hazardAhead.location);
  return NO_TROUBLE_LABEL;
}

function clubNote(pick: ClubPick): string {
  if (pick.carry == null) return "";
  return `Your ${pick.club} carries about ${pick.carry}.`;
}

function lieNote(lie: Lie): string {
  if (lie === "rough") return "From the rough, I added a little distance.";
  if (lie === "bunker") return "Get it out first.";
  return "";
}

/** Short "why" built from course facts; admits when information is missing. */
function greenReason(course: CourseContext): string {
  const { pinPosition, safeArea, dangerousAreas } = course.green;
  const hazards = course.hazards;
  const trouble = troubleClause(dangerousAreas, hazards);

  if (!pinPosition && !safeArea) {
    return trouble
      ? `I don't have the pin or green details here, and ${trouble}. Aim for the middle of the green to give yourself room.`
      : "I don't have the pin or green details for this hole, so aim for the middle of the green to give yourself room.";
  }

  if (!trouble) {
    if (pinPosition && pinPosition !== "center") {
      return `The pin is ${humanize(pinPosition)} and no major trouble is listed, so you can play toward it.`;
    }
    return "No major trouble is listed — play the center and make a confident swing.";
  }

  const safe = safeArea ? humanize(safeArea) : "center";

  if (pinPosition && safeArea && !sameArea(pinPosition, safeArea)) {
    return `The pin is ${humanize(pinPosition)}, but ${trouble}. There's more room toward the ${safe}, so don't chase the pin.`;
  }

  return `${capitalize(trouble)}. Favor the ${safe} and leave yourself a safe miss.`;
}

function troubleClause(dangers: GreenDanger[], hazards: CourseHazard[]): string {
  const danger = dangers[0];
  if (danger) return `there's ${danger.description} ${sidePhrase(danger.side)}`;
  const first = hazards[0];
  if (first) return `there's ${hazard(first)} ${sidePhrase(first.location)}`;
  return "";
}

function hazard(value: CourseHazard): string {
  if (value.type === "bunker") return "a bunker";
  return value.type;
}

function sidePhrase(side: string): string {
  if (side === "long") return "over the green";
  return `${side.replace(/-/g, " and ")} of the green`;
}

function formatLabel(raw: string): string {
  return raw
    .split(/[-_\s]+/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join("-");
}

function humanize(value: string): string {
  return value.replace(/-/g, " ");
}

function sameArea(a: string, b: string): boolean {
  return a.replace(/-/g, "") === b.replace(/-/g, "");
}

function capitalize(text: string): string {
  return text ? text.charAt(0).toUpperCase() + text.slice(1) : text;
}
