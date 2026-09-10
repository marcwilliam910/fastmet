import {
  BOOKING_SETTINGS_FALLBACK,
  BookingSettingsSnapshot,
  fetchBookingSettings,
} from "@/api/bookingSettings";
import {useQuery} from "@tanstack/react-query";

export function useBookingSettings(): BookingSettingsSnapshot {
  const {data} = useQuery({
    queryKey: ["bookingSettings"],
    queryFn: fetchBookingSettings,
    staleTime: Infinity,
    gcTime: Infinity,
  });

  return data ?? BOOKING_SETTINGS_FALLBACK;
}

/** Mount once under QueryClientProvider to prefetch on app open. */
export function BookingSettingsBootstrap() {
  useBookingSettings();
  return null;
}
