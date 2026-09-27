import type { PlayerContext } from "@/lib/caddy/types";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

export const CLUB_OPTIONS = [
  "Driver",
  "3 Wood",
  "5 Wood",
  "3 Iron",
  "4 Iron",
  "5 Iron",
  "6 Iron",
  "7 Iron",
  "8 Iron",
  "9 Iron",
  "Pitching Wedge",
  "Gap Wedge",
  "Sand Wedge",
  "Lob Wedge",
] as const;

export type ClubName = (typeof CLUB_OPTIONS)[number];

export type ClubDistanceInput = {
  club: ClubName;
  distance: number;
};

export type OnboardingPayload = {
  handicap: number;
  averageScore: number;
  driverCarry: number;
  clubDistances: ClubDistanceInput[];
  recentScores: number[];
};

export type ProfileResult = { ok: true } | { ok: false; error: string };

export type ProfileStatus = {
  exists: boolean;
  onboardingCompleted: boolean;
};

function mapDbError(message: string | undefined): string {
  if (!message) return "Something went wrong. Please try again.";
  return message;
}

/** Ensure a profiles row exists for the current user (covers users created before the trigger). */
export async function ensureProfile(userId: string): Promise<ProfileResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Authentication isn’t configured." };
  }

  const { error } = await getSupabase().from("profiles").upsert(
    { id: userId },
    { onConflict: "id", ignoreDuplicates: true },
  );

  if (error) {
    return { ok: false, error: mapDbError(error.message) };
  }

  return { ok: true };
}

export async function getProfileStatus(userId: string): Promise<ProfileStatus | null> {
  if (!isSupabaseConfigured()) return null;

  await ensureProfile(userId);

  const { data, error } = await getSupabase()
    .from("profiles")
    .select("onboarding_completed")
    .eq("id", userId)
    .maybeSingle();

  if (error || !data) {
    return { exists: false, onboardingCompleted: false };
  }

  return {
    exists: true,
    onboardingCompleted: Boolean(data.onboarding_completed),
  };
}

/** Handicap + saved club distances for the caddy. Returns null if unavailable. */
export async function getPlayerContext(userId: string): Promise<PlayerContext | null> {
  if (!isSupabaseConfigured()) return null;
  const supabase = getSupabase();

  const [profile, clubs] = await Promise.all([
    supabase.from("profiles").select("handicap").eq("id", userId).maybeSingle(),
    supabase.from("club_distances").select("club, distance").eq("user_id", userId),
  ]);

  if (profile.error || clubs.error) return null;

  return {
    handicap: profile.data?.handicap == null ? null : Number(profile.data.handicap),
    clubDistances: (clubs.data ?? []).map((row) => ({
      club: String(row.club),
      distance: Number(row.distance),
    })),
  };
}

/** Where to send an authenticated user after login/signup. */
export async function getPostAuthPath(userId: string): Promise<"/onboarding" | "/app"> {
  const status = await getProfileStatus(userId);
  if (!status?.onboardingCompleted) return "/onboarding";
  return "/app";
}

export async function saveOnboarding(
  userId: string,
  payload: OnboardingPayload,
): Promise<ProfileResult> {
  if (!isSupabaseConfigured()) {
    return { ok: false, error: "Authentication isn’t configured." };
  }

  const supabase = getSupabase();

  const ensured = await ensureProfile(userId);
  if (!ensured.ok) return ensured;

  const { error: profileError } = await supabase
    .from("profiles")
    .update({
      handicap: payload.handicap,
      average_score: payload.averageScore,
      driver_carry: payload.driverCarry,
      onboarding_completed: true,
    })
    .eq("id", userId);

  if (profileError) {
    return { ok: false, error: mapDbError(profileError.message) };
  }

  const { error: deleteClubsError } = await supabase
    .from("club_distances")
    .delete()
    .eq("user_id", userId);

  if (deleteClubsError) {
    return { ok: false, error: mapDbError(deleteClubsError.message) };
  }

  if (payload.clubDistances.length > 0) {
    const { error: insertClubsError } = await supabase.from("club_distances").insert(
      payload.clubDistances.map((row) => ({
        user_id: userId,
        club: row.club,
        distance: row.distance,
      })),
    );

    if (insertClubsError) {
      return { ok: false, error: mapDbError(insertClubsError.message) };
    }
  }

  const { error: deleteScoresError } = await supabase
    .from("recent_scores")
    .delete()
    .eq("user_id", userId);

  if (deleteScoresError) {
    return { ok: false, error: mapDbError(deleteScoresError.message) };
  }

  if (payload.recentScores.length > 0) {
    const { error: insertScoresError } = await supabase.from("recent_scores").insert(
      payload.recentScores.map((score) => ({
        user_id: userId,
        score,
        played_at: new Date().toISOString(),
      })),
    );

    if (insertScoresError) {
      return { ok: false, error: mapDbError(insertScoresError.message) };
    }
  }

  return { ok: true };
}
