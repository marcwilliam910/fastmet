import {fetchAuthMeta} from "@/api/auth";
import {useAuth} from "@/hooks/useAuth";
import {useAppStore} from "@/store/useAppStore";
import {useEffect} from "react";

/** Sync persisted auth meta (approvalStatus, registrationStep) from the server on launch. */
export function useSyncAuthMeta() {
  const {isLoggedIn, hasHydrated} = useAuth();

  useEffect(() => {
    if (!hasHydrated || !isLoggedIn) return;

    let cancelled = false;

    void (async () => {
      try {
        const meta = await fetchAuthMeta();
        if (cancelled) return;

        useAppStore.getState().setAuthData({
          registrationStep: meta.registrationStep,
          approvalStatus: meta.approvalStatus,
        });
      } catch {
        // Keep persisted values until a later successful sync / login.
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hasHydrated, isLoggedIn]);
}
