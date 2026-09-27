import { useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { useAuth } from "@/components/AuthProvider";
import { getProfileStatus } from "@/lib/profile";

/**
 * Redirects to /login when signed out and /onboarding when incomplete.
 * Returns the user id once the user is signed in and onboarded.
 */
export function useOnboardedUser(): { userId: string | null; ready: boolean } {
  const { session, loading } = useAuth();
  const navigate = useNavigate();
  const [ready, setReady] = useState(false);
  const userId = session?.user?.id ?? null;

  useEffect(() => {
    if (loading) return;

    if (!userId) {
      void navigate({ to: "/login" });
      return;
    }

    let active = true;
    void (async () => {
      const status = await getProfileStatus(userId);
      if (!active) return;

      if (!status?.onboardingCompleted) {
        void navigate({ to: "/onboarding" });
        return;
      }

      setReady(true);
    })();

    return () => {
      active = false;
    };
  }, [loading, userId, navigate]);

  return { userId, ready: ready && !loading && Boolean(userId) };
}
