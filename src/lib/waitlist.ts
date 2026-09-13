import { z } from "zod";

import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

const emailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Enter a valid email address.");

export type WaitlistResult =
  | { ok: true; alreadyJoined?: boolean }
  | { ok: false; error: string };

export async function joinWaitlist(rawEmail: string): Promise<WaitlistResult> {
  const parsed = emailSchema.safeParse(rawEmail);

  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message ?? "Enter a valid email address." };
  }

  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error:
        "Waitlist storage isn’t configured yet. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    };
  }

  const email = parsed.data;
  const supabase = getSupabase();

  const { error } = await supabase.from("waitlist").insert({ email });

  if (!error) {
    return { ok: true };
  }

  // Unique violation — email already on the list
  if (error.code === "23505") {
    return { ok: true, alreadyJoined: true };
  }

  return {
    ok: false,
    error: error.message || "Something went wrong. Please try again.",
  };
}
