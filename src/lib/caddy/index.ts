export type {
  CourseContext,
  CourseHazard,
  CaddyRecommendation,
  GreenDanger,
  Lie,
  ShotContext,
} from "@/lib/caddy/types";
export {
  getMockCourseContext,
  getMockCourseSituation,
  getNextMockCourseContext,
  MOCK_COURSE_SITUATIONS,
  resetMockCourseSituationCursor,
} from "@/lib/caddy/mockCourseContext";
export {
  getCaddyRecommendation,
  getMockRecommendation,
  getRecommendation,
} from "@/lib/caddy/getRecommendation";
