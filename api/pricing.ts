import api from "@/lib/axios";

export interface VariantPricingFactors {
  surgeMultiplier: number;
  gasAdjFactor: number;
}

export type SurgeFactorsResult = Record<string, VariantPricingFactors>;

export const fetchSurgeFactors = async (
  pickupCoords: { lat: number; lng: number },
  variantKeys: string[],
): Promise<SurgeFactorsResult> => {
  const res = await api.post("/pricing/surge-factors", {
    pickupCoords,
    variantKeys,
  });
  return res.data;
};
