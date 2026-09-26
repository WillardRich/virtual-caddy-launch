import type { Session, User } from "@supabase/supabase-js";

import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

export type AuthResult = { ok: true } | { ok: false; error: string };

function mapAuthError(message: string | undefined): string {
  if (!message) return "Something went wrong. Please try again.";
  if (/invalid login credentials/i.test(message)) {
    return "Incorrect email or password.";
  }
  if (/user already registered/i.test(message)) {
    return "An account with this email already exists.";
  }
  if (/email not confirmed/i.test(message)) {
    return "Please confirm your email before logging in.";
  }
  if (/password/i.test(message) && /weak|least|characters/i.test(message)) {
    return "Password must be at least 6 characters.";
  }
  return message;
}

export async function getSession(): Promise<Session | null> {
  if (!isSupabaseConfigured()) return null;
  const { data, error } = await getSupabase().auth.getSession();
  if (error) return null;
  return data.session;
}

export async function getUser(): Promise<User | null> {
  const session = await getSession();
  return session?.user ?? null;
}

export async function signUp(email: string, password: string): Promise<AuthResult> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error: "Authentication isn’t configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    };
  }

  const { data, error } = await getSupabase().auth.signUp({
    email: email.trim(),
    password,
  });

  if (error) {
    return { ok: false, error: mapAuthError(error.message) };
  }

  // Email confirmation may be required — still treat as success if user was created.
  if (!data.user) {
    return { ok: false, error: "Unable to create account. Please try again." };
  }

  return { ok: true };
}

export async function signIn(email: string, password: string): Promise<AuthResult> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error: "Authentication isn’t configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    };
  }

  const { error } = await getSupabase().auth.signInWithPassword({
    email: email.trim(),
    password,
  });

  if (error) {
    return { ok: false, error: mapAuthError(error.message) };
  }

  return { ok: true };
}

export async function signOut(): Promise<AuthResult> {
  if (!isSupabaseConfigured()) {
    return { ok: true };
  }

  const { error } = await getSupabase().auth.signOut();
  if (error) {
    return { ok: false, error: mapAuthError(error.message) };
  }

  return { ok: true };
}

export async function requestPasswordReset(email: string): Promise<AuthResult> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error: "Authentication isn’t configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    };
  }

  const redirectTo = `${window.location.origin}/reset-password`;
  const { error } = await getSupabase().auth.resetPasswordForEmail(email.trim(), {
    redirectTo,
  });

  if (error) {
    return { ok: false, error: mapAuthError(error.message) };
  }

  return { ok: true };
}

export async function updatePassword(password: string): Promise<AuthResult> {
  if (!isSupabaseConfigured()) {
    return {
      ok: false,
      error: "Authentication isn’t configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY.",
    };
  }

  const { error } = await getSupabase().auth.updateUser({ password });

  if (error) {
    return { ok: false, error: mapAuthError(error.message) };
  }

  return { ok: true };
}
