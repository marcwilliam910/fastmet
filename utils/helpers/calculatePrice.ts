import { LocationDetails } from "@/types/book";
import axios from "axios";
import { GOOGLE_MAPS_API_KEY } from "../constants";

const VEHICLE_SPEED_FACTORS = {
  motorcycle: 1.15, // 15% faster in traffic
  sedan: 1.0, // baseline
  mpv_suv: 0.95, // slightly slower
  light_van: 0.9,
  small_pickup: 0.9,
  l300: 0.85,
  closed_van: 0.85,
  wing_van: 0.8, // slowest
};

export async function fetchDrivingDistance(
  pickUp: LocationDetails,
  dropOff: LocationDetails,
  vehicleType: string,
) {
  if (!pickUp || !dropOff) return { distanceKm: 0, durationMin: 0 };

  const origin = `${pickUp.coords.lat},${pickUp.coords.lng}`;
  const destination = `${dropOff.coords.lat},${dropOff.coords.lng}`;

  // Motorcycles can't use most expressways/tolls in PH (unless 400cc+)
  const avoidTolls = vehicleType === "motorcycle" ? "&avoid=tolls" : "";

  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=driving${avoidTolls}&key=${GOOGLE_MAPS_API_KEY}`;

  const res = await axios.get(url);
  const leg = res.data.routes[0]?.legs[0];
  if (!leg) throw new Error("No route found");

  const baseDistanceKm = leg.distance.value / 1000; // meters → km
  const baseDurationMin = leg.duration.value / 60; // seconds → minutes

  // Adjust ETA based on vehicle type
  const speedFactor =
    VEHICLE_SPEED_FACTORS[vehicleType as keyof typeof VEHICLE_SPEED_FACTORS] ||
    1.0;
  const adjustedDurationMin = baseDurationMin / speedFactor;

  return {
    distanceKm: Math.round(baseDistanceKm * 10) / 10, // Round to 1 decimal
    durationMin: Math.round(adjustedDurationMin),
  };
}
