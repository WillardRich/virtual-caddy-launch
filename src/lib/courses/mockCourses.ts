import type { Course, CourseHole } from "@/lib/courses/types";

/**
 * Fictional sample courses for the MVP. Not real golf courses.
 * Replace with a course-data provider later; keep the Course / CourseHole shape.
 */

type HoleSpec = {
  pin?: string;
  safe?: string;
  size?: [width: number, depth: number];
  danger?: [side: string, description: string][];
  hazards?: [location: string, type: string][];
};

function hole(number: number, par: number, yardage: number, spec: HoleSpec = {}): CourseHole {
  return {
    number,
    par,
    yardage,
    green: {
      width: spec.size?.[0] ?? null,
      depth: spec.size?.[1] ?? null,
      pinPosition: spec.pin ?? null,
      safeArea: spec.safe ?? null,
      dangerousAreas: (spec.danger ?? []).map(([side, description]) => ({ side, description })),
    },
    hazards: (spec.hazards ?? []).map(([location, type]) => ({ location, type })),
  };
}

export const MOCK_COURSES: Course[] = [
  {
    id: "mountain-view",
    name: "Mountain View Golf Course",
    holes: [
      hole(1, 4, 372, { pin: "center", safe: "center", size: [30, 28] }),
      hole(2, 4, 401, { pin: "back-right", safe: "center-right", size: [32, 27], danger: [["left", "a steep drop-off"]], hazards: [["short-right", "bunker"]] }),
      hole(3, 3, 164, { pin: "front-left", safe: "center", danger: [["short", "a deep bunker"]], hazards: [["short", "bunker"]] }),
      hole(4, 5, 528, { pin: "back-left", safe: "center", hazards: [["right", "trees"]] }),
      hole(5, 4, 385, { pin: "center", safe: "center-left", danger: [["right", "water"]], hazards: [["right", "water"]] }),
      hole(6, 4, 356, {}),
      hole(7, 3, 142, { pin: "back-right", safe: "center", size: [24, 22], danger: [["long", "a steep bank"]] }),
      hole(8, 4, 418, { pin: "front-right", safe: "center-left", hazards: [["short-right", "bunker"], ["long", "trees"]] }),
      hole(9, 5, 512, { pin: "center", safe: "center", size: [34, 30] }),
      hole(10, 4, 394, { pin: "back-left", safe: "center-right", danger: [["left", "out of bounds"]], hazards: [["left", "out of bounds"]] }),
      hole(11, 3, 178, { safe: "center", hazards: [["short-left", "bunker"]] }),
      hole(12, 4, 367, { pin: "center", safe: "center", size: [28, 26] }),
      hole(13, 5, 545, { pin: "front-left", safe: "center-right", danger: [["short", "water"]], hazards: [["short", "water"]] }),
      hole(14, 4, 409, { pin: "back-right", safe: "center" }),
      hole(15, 4, 348, {}),
      hole(16, 3, 155, { pin: "front-right", safe: "center-left", danger: [["right", "water"]], hazards: [["right", "water"]] }),
      hole(17, 4, 422, { pin: "center", safe: "center", hazards: [["short-left", "bunker"], ["short-right", "bunker"]] }),
      hole(18, 5, 534, { pin: "back-left", safe: "center-right", danger: [["left", "a deep bunker"]], hazards: [["left", "bunker"]] }),
    ],
  },
  {
    id: "cedar-ridge",
    name: "Cedar Ridge Links",
    holes: [
      hole(1, 4, 358, { pin: "front-left", safe: "center" }),
      hole(2, 5, 502, { pin: "center", safe: "center", size: [33, 29] }),
      hole(3, 4, 389, { pin: "back-right", safe: "center-left", danger: [["right", "a steep drop-off"]] }),
      hole(4, 3, 171, { pin: "center", safe: "center", hazards: [["short-left", "bunker"]] }),
      hole(5, 4, 412, {}),
      hole(6, 4, 376, { pin: "back-left", safe: "center-right", danger: [["long", "out of bounds"]], hazards: [["long", "out of bounds"]] }),
      hole(7, 5, 521, { pin: "front-right", safe: "center", hazards: [["short", "bunker"]] }),
      hole(8, 3, 149, { pin: "back-right", safe: "center-left", size: [22, 30], danger: [["right", "water"]], hazards: [["right", "water"]] }),
      hole(9, 4, 404, { pin: "center", safe: "center" }),
      hole(10, 4, 381, { pin: "front-left", safe: "center-right", danger: [["left", "a deep bunker"]], hazards: [["left", "bunker"]] }),
      hole(11, 3, 186, {}),
      hole(12, 4, 365, { pin: "back-right", safe: "center", hazards: [["right", "trees"]] }),
      hole(13, 5, 539, { pin: "center", safe: "center", size: [35, 31] }),
      hole(14, 4, 397, { pin: "front-right", safe: "center-left", danger: [["short", "water"]], hazards: [["short", "water"]] }),
      hole(15, 4, 352, { pin: "back-left", safe: "center" }),
      hole(16, 3, 138, { pin: "center", safe: "center", danger: [["long", "a steep bank"]] }),
      hole(17, 4, 428, { safe: "center", hazards: [["short-right", "bunker"]] }),
      hole(18, 5, 517, { pin: "back-right", safe: "center-left", danger: [["right", "out of bounds"]], hazards: [["right", "out of bounds"]] }),
    ],
  },
  {
    id: "lakeside",
    name: "Lakeside Municipal",
    holes: [
      hole(1, 4, 344, { pin: "center", safe: "center" }),
      hole(2, 4, 378, { pin: "back-left", safe: "center-right", danger: [["left", "water"]], hazards: [["left", "water"]] }),
      hole(3, 3, 152, { pin: "front-right", safe: "center", hazards: [["short-right", "bunker"]] }),
      hole(4, 5, 497, {}),
      hole(5, 4, 391, { pin: "back-right", safe: "center", danger: [["long", "water"]], hazards: [["long", "water"]] }),
      hole(6, 4, 362, { pin: "front-left", safe: "center-right", size: [26, 24] }),
      hole(7, 3, 168, { pin: "center", safe: "center", danger: [["short", "water"]], hazards: [["short", "water"]] }),
      hole(8, 4, 407, { pin: "back-left", safe: "center-right", hazards: [["left", "trees"]] }),
      hole(9, 5, 526, { pin: "center", safe: "center", size: [34, 28] }),
      hole(10, 4, 369, { safe: "center" }),
      hole(11, 3, 181, { pin: "back-right", safe: "center-left", danger: [["right", "a deep bunker"]], hazards: [["right", "bunker"]] }),
      hole(12, 4, 386, { pin: "front-right", safe: "center" }),
      hole(13, 5, 541, { pin: "back-left", safe: "center", hazards: [["short-left", "bunker"]] }),
      hole(14, 4, 355, { pin: "center", safe: "center-right", danger: [["left", "water"]], hazards: [["left", "water"]] }),
      hole(15, 4, 414, {}),
      hole(16, 3, 144, { pin: "front-left", safe: "center-right", size: [23, 21], danger: [["short", "a deep bunker"]], hazards: [["short", "bunker"]] }),
      hole(17, 4, 398, { pin: "back-right", safe: "center", hazards: [["long", "out of bounds"]] }),
      hole(18, 5, 530, { pin: "center", safe: "center", danger: [["left", "water"]], hazards: [["left", "water"]] }),
    ],
  },
];
