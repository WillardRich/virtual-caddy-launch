import assert from "node:assert/strict";
import { test, type TestContext } from "node:test";

import { listCourses } from "../src/lib/courses/index.ts";
import { changeHole, endRound, getActiveRound, startRound } from "../src/lib/round.ts";

const course = listCourses()[0]!;

function installStorage(t: TestContext) {
  let readBlocked = false;
  let writeBlocked = false;
  const rows = new Map<string, string>();
  const localStorage = {
    getItem(key: string) {
      if (readBlocked) throw new DOMException("Storage blocked", "SecurityError");
      return rows.get(key) ?? null;
    },
    setItem(key: string, value: string) {
      if (writeBlocked) throw new DOMException("Storage blocked", "QuotaExceededError");
      rows.set(key, value);
    },
    removeItem(key: string) {
      if (writeBlocked) throw new DOMException("Storage blocked", "SecurityError");
      rows.delete(key);
    },
  };
  Object.defineProperty(globalThis, "window", { value: { localStorage }, configurable: true });
  t.after(() => Reflect.deleteProperty(globalThis, "window"));
  return {
    rows,
    blockReads: () => {
      readBlocked = true;
    },
    blockWrites: () => {
      writeBlocked = true;
    },
    allowWrites: () => {
      writeBlocked = false;
    },
  };
}

test("round starts on hole 1, stays within holes 1–18, and ends", (t) => {
  installStorage(t);
  startRound("player", course.id);
  changeHole("player", -1);
  assert.equal(getActiveRound("player")?.currentHole, 1);
  for (let step = 0; step < 18; step++) changeHole("player", 1);
  assert.equal(getActiveRound("player")?.currentHole, 18);
  assert.equal(getActiveRound("other-player"), null);
  endRound("player");
  assert.equal(getActiveRound("player"), null);
});

test("corrupt saved rounds are ignored and can be replaced", (t) => {
  const { rows } = installStorage(t);
  const key = "yvc.activeRound.corrupt-player";
  for (const saved of ["{", "null", JSON.stringify({ courseId: course.id, currentHole: 2.5 })]) {
    rows.set(key, saved);
    assert.equal(getActiveRound("corrupt-player"), null);
  }
  startRound("corrupt-player", course.id);
  assert.equal(getActiveRound("corrupt-player")?.currentHole, 1);
});

test("a round remains playable when browser storage blocks reads and writes", (t) => {
  const storage = installStorage(t);
  storage.blockReads();
  storage.blockWrites();
  assert.equal(getActiveRound("blocked-player"), null);
  startRound("blocked-player", course.id);
  changeHole("blocked-player", 1);
  assert.equal(getActiveRound("blocked-player")?.currentHole, 2);
  endRound("blocked-player");
  assert.equal(getActiveRound("blocked-player"), null);
  storage.allowWrites();
  endRound("blocked-player");
});

test("a failed write keeps the newest round until a subsequent write succeeds", (t) => {
  const storage = installStorage(t);
  startRound("quota-player", course.id);
  storage.blockWrites();
  changeHole("quota-player", 1);
  assert.equal(getActiveRound("quota-player")?.currentHole, 2);
  storage.allowWrites();
  changeHole("quota-player", 1);
  assert.equal(getActiveRound("quota-player")?.currentHole, 3);
  assert.equal(JSON.parse(storage.rows.get("yvc.activeRound.quota-player")!).currentHole, 3);
});
