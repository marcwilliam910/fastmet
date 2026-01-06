import { LocationDetails } from "@/types/book";
import axios from "axios";
import { GOOGLE_MAPS_API_KEY } from "./constants";

export async function fetchDrivingDistance(
  pickUp: LocationDetails,
  dropOff: LocationDetails
) {
  if (!pickUp || !dropOff) return { distanceKm: 0, durationMin: 0 };
  const origin = `${pickUp.coords.lat},${pickUp.coords.lng}`;
  const destination = `${dropOff.coords.lat},${dropOff.coords.lng}`;

  const url = `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${destination}&mode=driving&key=${GOOGLE_MAPS_API_KEY}`;

  const res = await axios.get(url);
  const leg = res.data.routes[0]?.legs[0];
  if (!leg) throw new Error("No route found");

  const distanceKm = leg.distance.value / 1000; // meters → km
  const durationMin = leg.duration.value / 60; // seconds → minutes

  return { distanceKm, durationMin };
}
