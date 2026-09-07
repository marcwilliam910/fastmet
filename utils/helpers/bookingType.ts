import {BookingType, Type} from "@/store/slices/bookSlice";
import {BookingTypeConfig} from "@/types/bookingType";

export const resolveModifier = (
  configs: BookingTypeConfig[],
  type: Type,
  value: string,
): number => {
  const config = configs.find((c) => c.key === type);
  if (!config) return 1.0;

  if (config.subOptions?.length > 0) {
    const sub = config.subOptions.find((s) => s.key === value);
    return sub?.priceModifier ?? 1.0;
  }

  return config.priceModifier ?? 1.0;
};

/** First auto-selectable active booking type (skips schedule — needs user date). */
export const deriveDefaultBookingType = (
  configs: BookingTypeConfig[],
): BookingType | null => {
  const first = configs
    .filter((c) => c.isActive && c.key !== "schedule")
    .sort((a, b) => a.order - b.order)[0];

  if (!first) return null;

  if (first.subOptions.length > 0) {
    const firstSub = first.subOptions
      .filter((s) => s.isActive)
      .sort((a, b) => a.order - b.order)[0];

    if (!firstSub) return null;

    return {
      type: first.key,
      value: firstSub.key,
      priceModifier: firstSub.priceModifier,
    };
  }

  return {
    type: first.key,
    value: first.key.toUpperCase(),
    priceModifier: first.priceModifier ?? 1.0,
  };
};
