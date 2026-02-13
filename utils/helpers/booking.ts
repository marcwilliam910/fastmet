import { Type } from "@/store/slices/bookSlice";

interface BookingRefOptions {
  bookingType: Type;
  vehicleType: string;
  priority?: string; // Only for ASAP bookings
}

// Unique 2-letter codes for each vehicle type
const VEHICLE_CODES: Record<string, string> = {
  motorcycle: "MC",
  sedan: "SD",
  mpv_suv: "MV",
  light_van: "LV",
  small_pickup: "SP",
  l300: "L3",
  closed_van: "CV",
  wing_van: "WV",
};

export const generateBookingRef = ({
  bookingType,
  vehicleType,
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

  // Get vehicle code from mapping
  const normalizedVehicle = vehicleType.toLowerCase().trim();
  const vehicleCode = VEHICLE_CODES[normalizedVehicle] || "XX";

  // 4-digit random number
  const randomNum = Math.floor(Math.random() * 9000 + 1000);

  // Format: AP-250116-14-MC-4521
  return `${prefix}-${date}-${hour}-${vehicleCode}-${randomNum}`;
};

export const createConversationId = (id1: string, id2: string): string => {
  return [id1, id2].sort().join("_");
};
