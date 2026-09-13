import { z } from "zod";

/**
 * Frontend-only waitlist for the prototype.
 * Swap the body of `joinWaitlist` for a real Supabase/API insert later.
 */

const emailSchema = z.string().trim().email();

export type WaitlistResult =
  | { ok: true }
  | { ok: false; error: string };

const INVALID_EMAIL_MESSAGE = "Please enter a valid email address.";

export async function joinWaitlist(rawEmail: string): Promise<WaitlistResult> {
  const parsed = emailSchema.safeParse(rawEmail);

  if (!parsed.success) {
    return { ok: false, error: INVALID_EMAIL_MESSAGE };
  }

  // Prototype: no network, storage, or persistence.
  return { ok: true };
}
