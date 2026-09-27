import type { CourseContext } from "@/lib/caddy/types";
import { MOCK_COURSES } from "@/lib/courses/mockCourses";
import type { Course, CourseHole } from "@/lib/courses/types";

export type { Course, CourseHole } from "@/lib/courses/types";

export const FIRST_HOLE = 1;
export const LAST_HOLE = 18;

export function listCourses(): Course[] {
  return MOCK_COURSES;
}

export function getCourse(courseId: string): Course | null {
  return MOCK_COURSES.find((course) => course.id === courseId) ?? null;
}

export function getHole(courseId: string, holeNumber: number): CourseHole | null {
  return getCourse(courseId)?.holes.find((hole) => hole.number === holeNumber) ?? null;
}

/** Course data → the course context the caddy consumes. */
export function toCourseContext(hole: CourseHole): CourseContext {
  return {
    green: { ...hole.green },
    hazards: hole.hazards,
    isMock: true,
  };
}
