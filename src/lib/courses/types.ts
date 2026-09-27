import type { CourseHazard, GreenDanger } from "@/lib/caddy/types";

export type CourseHole = {
  number: number;
  par: number;
  yardage: number;
  green: {
    width: number | null;
    depth: number | null;
    pinPosition: string | null;
    safeArea: string | null;
    dangerousAreas: GreenDanger[];
  };
  hazards: CourseHazard[];
};

export type Course = {
  id: string;
  name: string;
  holes: CourseHole[];
};
