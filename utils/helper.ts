import { Type } from "@/store/slices/bookSlice";
import { LocationDetails } from "@/types/book";

export const generateBookingRef = (bookingType: Type, vehicleType: string) => {
  const prefixMap = {
    asap: "RR",
    pooling: "PR",
    schedule: "SR",
  };

  const prefix = prefixMap[bookingType];
  const date = new Date().toISOString().slice(2, 10).replace(/-/g, ""); // YYMMDD
  const randomNum = Math.floor(Math.random() * 9000 + 1000); // 4-digit random number

  return `${prefix}-${date}-${vehicleType.toUpperCase()}-${randomNum}`;
};

export const formatLocation = (loc: LocationDetails) => {
  return (
    loc?.address.includes(loc.name)
      ? loc.address
      : loc?.name + ", " + loc?.address
  ).replace(", Philippines", "");
};

export const createConversationId = (
  clientId: string,
  driverId: string
): string => {
  return [clientId, driverId].sort().join("_");
};
