import type { CourseContext } from "@/lib/caddy/types";

/**
 * Named mock course situations for the prototype.
 * These stand in for future course-data / GPS / pin feeds.
 * Not shown as a course picker in the UI.
 */
export const MOCK_COURSE_SITUATIONS = {
  /** Pin back-right; left is deadly → favor center-right. */
  A: {
    green: {
      width: 32,
      depth: 27,
      pinPosition: "back-right",
      safeArea: "center-right",
      dangerousAreas: [
        {
          side: "left",
          description: "steep drop-off",
        },
      ],
    },
    hazards: [
      {
        location: "short-right",
        type: "bunker",
      },
    ],
    isMock: true,
  },

  /** Pin back-left; short is trouble → favor center, avoid short. */
  B: {
    green: {
      width: 28,
      depth: 30,
      pinPosition: "back-left",
      safeArea: "center",
      dangerousAreas: [
        {
          side: "short",
          description: "deep bunker short of the green",
        },
      ],
    },
    hazards: [
      {
        location: "short",
        type: "bunker",
      },
    ],
    isMock: true,
  },

  /** Pin center; no major trouble → play the pin area. */
  C: {
    green: {
      width: 30,
      depth: 26,
      pinPosition: "center",
      safeArea: "center",
      dangerousAreas: [],
    },
    hazards: [],
    isMock: true,
  },
} as const satisfies Record<string, CourseContext>;

export type MockSituationId = keyof typeof MOCK_COURSE_SITUATIONS;

const SITUATION_ORDER: MockSituationId[] = ["A", "B", "C"];

let situationCursor = 0;

/** Default / current mock situation (Situation A). */
export function getMockCourseContext(): CourseContext {
  return MOCK_COURSE_SITUATIONS.A;
}

export function getMockCourseSituation(id: MockSituationId): CourseContext {
  return MOCK_COURSE_SITUATIONS[id];
}

/**
 * Rotate mock situations so repeated advice runs demonstrate
 * that course context changes the recommendation.
 * Not a user-facing course selector.
 */
export function getNextMockCourseContext(): CourseContext {
  const id = SITUATION_ORDER[situationCursor % SITUATION_ORDER.length]!;
  situationCursor += 1;
  return MOCK_COURSE_SITUATIONS[id];
}

/** Reset rotation (useful for tests). */
export function resetMockCourseSituationCursor(): void {
  situationCursor = 0;
}
