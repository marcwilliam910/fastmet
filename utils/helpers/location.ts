import { LocationDetails } from "@/types/book";

export const isSameLocation = (
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number,
): boolean => {
  // Compare coordinates with a small tolerance (about 10 meters)
  const tolerance = 0.0001; // approximately 10 meters
  return Math.abs(lat1 - lat2) < tolerance && Math.abs(lng1 - lng2) < tolerance;
};

export const formatLocation = (loc: LocationDetails) => {
  return (
    loc?.address.includes(loc.name)
      ? loc.address
      : loc?.name + ", " + loc?.address
  ).replace(", Philippines", "");
};
