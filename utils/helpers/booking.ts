import { Type } from "@/store/slices/bookSlice";

interface BookingRefOptions {
  bookingType: Type;
  refCode: string;
  priority?: string; // Only for ASAP bookings
}

export const generateBookingRef = ({
  bookingType,
  refCode,
  priority = "regular",
}: BookingRefOptions): string => {
  // Compact prefix mapping
  const prefixMap: Record<Type, string> = {
    asap: priority === "priority" ? "AP" : "AR", // ASAP Priority / ASAP Regular
    pooling: "PL",
    schedule: "SC",
  };

  const prefix = prefixMap[bookingType];

  const now = new Date();

  // Compact date: YYMMDD
  const date = now.toISOString().slice(2, 10).replace(/-/g, "");

  // Hour: HH (for uniqueness)
  const hour = now.getHours().toString().padStart(2, "0");

  // 4-digit random number
  const randomNum = Math.floor(Math.random() * 9000 + 1000);

  // Format: AP-250116-14-MC-4521
  return `${prefix}-${date}-${hour}-${refCode}-${randomNum}`;
};

export const createConversationId = (id1: string, id2: string): string => {
  console.log([id1, id2].sort().join("_"));
  return [id1, id2].sort().join("_");
};
