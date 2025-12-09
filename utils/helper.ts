import { Type } from "@/store/slices/bookSlice";

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
