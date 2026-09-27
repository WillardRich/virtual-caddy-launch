import { useSyncExternalStore } from "react";

import { FIRST_HOLE, getCourse, LAST_HOLE } from "@/lib/courses";

export type ActiveRound = {
  courseId: string;
  currentHole: number;
  startedAt: string;
};

const STORAGE_PREFIX = "yvc.activeRound.";
const listeners = new Set<() => void>();

let cachedKey: string | null = null;
let cachedRaw: string | null = null;
let cachedRound: ActiveRound | null = null;

function storageKey(userId: string): string {
  return `${STORAGE_PREFIX}${userId}`;
}

function parseRound(raw: string | null): ActiveRound | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<ActiveRound>;
    if (
      typeof value.courseId !== "string" ||
      !getCourse(value.courseId) ||
      typeof value.currentHole !== "number" ||
      value.currentHole < FIRST_HOLE ||
      value.currentHole > LAST_HOLE
    ) {
      return null;
    }
    return {
      courseId: value.courseId,
      currentHole: value.currentHole,
      startedAt: typeof value.startedAt === "string" ? value.startedAt : new Date().toISOString(),
    };
  } catch {
    return null;
  }
}

export function getActiveRound(userId: string): ActiveRound | null {
  if (typeof window === "undefined") return null;
  const key = storageKey(userId);
  const raw = window.localStorage.getItem(key);
  if (key === cachedKey && raw === cachedRaw) return cachedRound;
  cachedKey = key;
  cachedRaw = raw;
  cachedRound = parseRound(raw);
  return cachedRound;
}

function writeRound(userId: string, round: ActiveRound | null) {
  if (typeof window === "undefined") return;
  const key = storageKey(userId);
  if (round) {
    window.localStorage.setItem(key, JSON.stringify(round));
  } else {
    window.localStorage.removeItem(key);
  }
  listeners.forEach((listener) => listener());
}

export function startRound(userId: string, courseId: string): void {
  if (!getCourse(courseId)) return;
  writeRound(userId, {
    courseId,
    currentHole: FIRST_HOLE,
    startedAt: new Date().toISOString(),
  });
}

export function changeHole(userId: string, delta: 1 | -1): void {
  const round = getActiveRound(userId);
  if (!round) return;
  const next = Math.min(LAST_HOLE, Math.max(FIRST_HOLE, round.currentHole + delta));
  if (next === round.currentHole) return;
  writeRound(userId, { ...round, currentHole: next });
}

export function endRound(userId: string): void {
  writeRound(userId, null);
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  window.addEventListener("storage", listener);
  return () => {
    listeners.delete(listener);
    window.removeEventListener("storage", listener);
  };
}

export function useActiveRound(userId: string | null): ActiveRound | null {
  return useSyncExternalStore(
    subscribe,
    () => (userId ? getActiveRound(userId) : null),
    () => null,
  );
}
