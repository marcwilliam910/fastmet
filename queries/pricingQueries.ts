import {fetchSurgeFactors} from "@/api/pricing";
import {useAuth} from "@/hooks/useAuth";
import {useAppStore} from "@/store/useAppStore";
import {useQuery} from "@tanstack/react-query";

export const useSurgeFactors = (
  pickUp: {coords: {lat: number; lng: number}} | null,
) => {
  // Build all variant keys from vehicles store
  const vehicles = useAppStore((state) => state.vehicles);
  const {isLoggedIn} = useAuth();
  const variantKeys = vehicles.flatMap((vt) =>
    vt.variants
      .filter((v) => v.isActive)
      .map((v) => `${vt.key}_${v.maxLoadKg}`),
  );

  const pickupCoords = pickUp?.coords ?? null;

  return useQuery({
    queryKey: ["surgeFactors", pickupCoords, variantKeys],
    queryFn: () => fetchSurgeFactors(pickupCoords!, variantKeys),
    enabled: !!pickupCoords && variantKeys.length > 0 && isLoggedIn,
    staleTime: 60 * 1000, // 60s cache
    retry: 1,
    // On error — return defaults so pricing still works
    placeholderData: Object.fromEntries(
      variantKeys.map((k) => [k, {surgeMultiplier: 1.0, gasAdjFactor: 1.0}]),
    ),
  });
};
