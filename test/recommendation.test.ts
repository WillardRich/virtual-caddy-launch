import assert from "node:assert/strict";
import { test } from "node:test";

import { getCaddyRecommendation } from "../src/lib/caddy/getRecommendation.ts";
import type { CourseContext, PlayerContext, ShotContext } from "../src/lib/caddy/types.ts";

const course: CourseContext = {
  green: {
    width: null,
    depth: null,
    pinPosition: "right",
    safeArea: "left",
    dangerousAreas: [{ side: "right", description: "a bunker" }],
  },
  hazards: [],
  isMock: true,
};
const shot: ShotContext = {
  distance: 148,
  distanceUnit: "yards",
  lie: "fairway",
  course: null,
  hole: null,
  pinPosition: null,
  wind: null,
  elevation: null,
};
const player: PlayerContext = {
  handicap: null,
  clubDistances: [
    { club: "7 Iron", distance: 165 },
    { club: "8 Iron", distance: 150 },
    { club: "Driver", distance: 260 },
  ],
};

test("approach uses the golfer's carry distances and favors the safe side", () => {
  const advice = getCaddyRecommendation(shot, course, player);
  assert.equal(advice.club, "8 Iron");
  assert.equal(advice.target, "Left");
  assert.equal(advice.miss, "Right");
});

test("the same yardage from rough can require a longer club", () => {
  const advice = getCaddyRecommendation({ ...shot, lie: "rough" }, course, player);
  assert.equal(advice.club, "7 Iron");
});

test("a short bunker shot recommends a sand wedge", () => {
  const advice = getCaddyRecommendation({ ...shot, distance: 35, lie: "bunker" }, course);
  assert.equal(advice.club, "Sand Wedge");
});

test("an out-of-range approach lays up and stays short of the hazard", () => {
  const withWater = { ...course, hazards: [{ type: "water", location: "short" }] };
  const advice = getCaddyRecommendation({ ...shot, distance: 190 }, withWater, player);
  assert.equal(advice.club, "7 Iron");
  assert.equal(advice.target, "Down the middle");
  assert.equal(advice.miss, "Short");
  assert.match(advice.reason, /water/);
});
