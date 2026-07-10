import { useAppStore } from "@/store/useAppStore";

export const useAuth = () => {
  const id = useAppStore((state) => state.id);
  const token = useAppStore((state) => state.token);
  const phoneNumber = useAppStore((state) => state.phoneNumber);
  const hasHydrated = useAppStore.persist.hasHydrated();

  const isLoggedIn = !!id && !!token && !!phoneNumber;

  return {
    isLoggedIn,
    hasHydrated,
    id,
    token,
  };
};
