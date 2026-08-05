import {isPointInPolygon} from "geolib";
import {Platform} from "react-native";

export const STATIC_IMAGES = {
  pickup: require("@/assets/images/pickup.png"),
  dropoff: require("@/assets/images/dropoff.png"),
  driver: require("@/assets/images/driverIcon.png"),
  gcash: require("@/assets/images/gcash_logo.png"),
  cashPayment: require("@/assets/images/cash_payment.png"),
  fastmetLogo: require("@/assets/fastmet/logo.png"),
  announcement: require("@/assets/images/announcement.png"),
  phone: require("@/assets/images/phone.png"),
  map_bg: require("@/assets/images/map_bg.png"),
};

export const SUPPORT_EMAIL =
  process.env.EXPO_PUBLIC_SUPPORT_EMAIL ?? "No Email";

export const GOOGLE_MAPS_API_KEY =
  Platform.OS === "ios"
    ? process.env.EXPO_PUBLIC_IOS_MAP_KEY
    : process.env.EXPO_PUBLIC_ANDROID_MAP_KEY;

// export const METRO_MANILA_POLYGON = [
//   // Starting from Northwest (Valenzuela)
//   [14.775, 120.93], // Valenzuela NW (buffer)
//   [14.775, 120.95], // Valenzuela N
//   [14.755, 120.975], // Caloocan West
//   [14.75, 121.025], // Caloocan North (buffer)
//   [14.775, 121.05], // QC North
//   [14.78, 121.08], // QC Northeast
//   [14.765, 121.11], // Marikina North (buffer)
//   [14.73, 121.13], // Marikina NE
//   [14.695, 121.15], // Marikina East (buffer)
//   [14.655, 121.165], // Pasig East (buffer)
//   [14.61, 121.17], // Pasig SE
//   [14.57, 121.175], // Taguig East (buffer)
//   [14.53, 121.175], // Taguig SE (buffer)
//   [14.48, 121.125], // Muntinlupa East
//   [14.44, 121.085], // Muntinlupa South (buffer)
//   [14.435, 121.02], // Muntinlupa SW
//   [14.44, 120.975], // Las Piñas South (buffer)
//   [14.44, 120.945], // Las Piñas West (buffer)
//   [14.475, 120.94], // Las Piñas NW
//   [14.505, 120.96], // Parañaque West
//   [14.54, 120.96], // Pasay West (buffer)
//   [14.565, 120.965], // Manila Bay area
//   [14.585, 120.965], // Manila West (Tondo area - buffer)
//   [14.605, 120.96], // Manila NW (Divisoria area - extra buffer)
//   [14.62, 120.955], // Navotas South
//   [14.64, 120.95], // Navotas (buffer)
//   [14.68, 120.935], // Malabon (buffer)
//   [14.715, 120.93], // Valenzuela South
//   [14.775, 120.93], // Back to start
// ];

/**
 * Rough bbox covering all allowed pickup cities (+ buffer).
 * Used only as a cheap early reject — not authoritative.
 */
export const ALLOWED_PICKUP_BOUNDS = {
  minLat: 13.98,
  maxLat: 15.12,
  minLng: 120.63,
  maxLng: 121.32,
};

export const PICKUP_SERVICE_AREAS: Record<string, string[]> = {
  "Metro Manila": [
    "Caloocan",
    "Las Piñas",
    "Makati",
    "Malabon",
    "Mandaluyong",
    "Manila",
    "Marikina",
    "Muntinlupa",
    "Navotas",
    "Parañaque",
    "Pasay",
    "Pasig",
    "Pateros",
    "Quezon City",
    "San Juan",
    "Taguig",
    "Valenzuela",
  ],
  "Bulacan": [
    "Balagtas",
    "Bocaue",
    "Guiguinto",
    "Malolos",
    "Marilao",
    "Meycauayan",
    "Plaridel",
    "San Jose del Monte",
    "Santa Maria",
  ],
  "Rizal": [
    "Antipolo",
    "Cainta",
    "Rodriguez (Montalban)",
    "San Mateo",
    "Taytay",
  ],
  "Cavite": ["Bacoor", "Dasmariñas", "General Trias", "Imus", "Kawit"],
  "Laguna": ["Cabuyao", "Calamba", "Santa Rosa"],
};

/** Normalize city names for accent / spacing / "City of …" variants. */
function normalizeCityName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s*\([^)]*\)/g, "") // remove "(Montalban)"
    .replace(/^city of\s+/i, "")
    .replace(/\s+city$/i, "")
    .replace(/\bsta\.?\s+/gi, "santa ")
    .replace(/\bsto\.?\s+/gi, "santo ")
    .replace(/\s+/g, " ")
    .trim()
    .toLowerCase();
}

/** Google / common aliases → canonical allowlist name (normalized key). */
const PICKUP_CITY_ALIASES: Record<string, string> = {
  [normalizeCityName("Montalban")]: "Rodriguez",
  [normalizeCityName("Gen. Trias")]: "General Trias",
  [normalizeCityName("General Trias City")]: "General Trias",
  [normalizeCityName("City of San Jose del Monte")]: "San Jose del Monte",
  [normalizeCityName("CSJDM")]: "San Jose del Monte",
  [normalizeCityName("Sta. Maria")]: "Santa Maria",
  [normalizeCityName("Sta Maria")]: "Santa Maria",
  [normalizeCityName("Santa Rosa City")]: "Santa Rosa",
  [normalizeCityName("Calamba City")]: "Calamba",
  [normalizeCityName("Cabuyao City")]: "Cabuyao",
  [normalizeCityName("Malolos City")]: "Malolos",
  [normalizeCityName("Meycauayan City")]: "Meycauayan",
  [normalizeCityName("Antipolo City")]: "Antipolo",
  [normalizeCityName("Bacoor City")]: "Bacoor",
  [normalizeCityName("Imus City")]: "Imus",
  [normalizeCityName("Dasmariñas City")]: "Dasmariñas",
  [normalizeCityName("Dasmarinas")]: "Dasmariñas",
  [normalizeCityName("Paranaque")]: "Parañaque",
  [normalizeCityName("Las Pinas")]: "Las Piñas",
};

export const ALLOWED_PICKUP_CITIES = new Set(
  Object.values(PICKUP_SERVICE_AREAS).flat(),
);

const NORMALIZED_ALLOWED_PICKUP = new Map(
  [...ALLOWED_PICKUP_CITIES].map((city) => [normalizeCityName(city), city]),
);

export function isWithinAllowedPickupBounds(lat: number, lng: number): boolean {
  return (
    lat >= ALLOWED_PICKUP_BOUNDS.minLat &&
    lat <= ALLOWED_PICKUP_BOUNDS.maxLat &&
    lng >= ALLOWED_PICKUP_BOUNDS.minLng &&
    lng <= ALLOWED_PICKUP_BOUNDS.maxLng
  );
}

export function isAllowedPickupCity(city: string | null | undefined): boolean {
  if (!city) return false;
  const key = normalizeCityName(city);
  if (NORMALIZED_ALLOWED_PICKUP.has(key)) return true;
  if (PICKUP_CITY_ALIASES[key]) return true;
  return false;
}

/** True if a formatted address string mentions any allowed pickup city. */
export function addressMentionsAllowedPickupCity(
  address: string | null | undefined,
): boolean {
  if (!address) return false;
  const normalizedAddress = normalizeCityName(address);
  for (const [key] of NORMALIZED_ALLOWED_PICKUP) {
    if (normalizedAddress.includes(key)) return true;
  }
  for (const aliasKey of Object.keys(PICKUP_CITY_ALIASES)) {
    if (normalizedAddress.includes(aliasKey)) return true;
  }
  return false;
}

/**
 * Coarse outline of contiguous Mainland Luzon (road-reachable from NCR).
 * Excludes Mindoro / Visayas / Mindanao / Palawan / Polillo / Catanduanes /
 * Batanes / Babuyan by geometry — unknown islands default to blocked.
 * Clockwise from NW (Ilocos Norte).
 */
export const MAINLAND_LUZON_POLYGON = [
  // NW coast — Pagudpud / Ilocos Norte
  {latitude: 18.55, longitude: 120.55},
  // Northern mainland tip (south of Babuyan)
  {latitude: 18.6, longitude: 121.1},
  {latitude: 18.55, longitude: 122.15},
  // NE coast down through Cagayan / Isabela
  {latitude: 17.8, longitude: 122.3},
  {latitude: 16.8, longitude: 122.4},
  // Aurora — hug coast west of Polillo (~121.9+)
  {latitude: 16.0, longitude: 121.8},
  {latitude: 15.2, longitude: 121.65},
  {latitude: 14.8, longitude: 121.6},
  // Laguna / Quezon mainland (west of Polillo)
  {latitude: 14.2, longitude: 121.55},
  // Lucena area — stay north of Marinduque
  {latitude: 13.9, longitude: 121.6},
  // Bondoc Peninsula
  {latitude: 13.7, longitude: 122.3},
  {latitude: 13.3, longitude: 122.7},
  {latitude: 13.15, longitude: 122.9},
  // Wider Bicol mainland lobe (Naga / Legazpi; west of Catanduanes)
  {latitude: 13.4, longitude: 123.05},
  {latitude: 13.7, longitude: 123.0},
  {latitude: 13.85, longitude: 123.25},
  {latitude: 13.95, longitude: 123.55},
  {latitude: 13.85, longitude: 123.9},
  {latitude: 13.4, longitude: 124.05},
  // Sorsogon tip (Matnog)
  {latitude: 12.55, longitude: 124.15},
  {latitude: 12.45, longitude: 123.85},
  // West along south Bicol (north of Masbate)
  {latitude: 12.7, longitude: 123.15},
  {latitude: 13.1, longitude: 122.85},
  // Across Quezon/Batangas north of Mindoro channel
  {latitude: 13.35, longitude: 122.4},
  {latitude: 13.55, longitude: 121.5},
  {latitude: 13.7, longitude: 120.9},
  // Batangas / Cavite west coast (Fortune Island via exclusion)
  {latitude: 14.05, longitude: 120.55},
  {latitude: 14.35, longitude: 120.48},
  // Bataan / Zambales west coast
  {latitude: 14.7, longitude: 120.35},
  {latitude: 15.5, longitude: 119.9},
  {latitude: 16.5, longitude: 120.2},
  {latitude: 17.5, longitude: 120.4},
  {latitude: 18.2, longitude: 120.5},
  {latitude: 18.55, longitude: 120.55},
];

/**
 * Islands that sit inside MAINLAND_LUZON_POLYGON but still need a ferry.
 */
const LUZON_BAY_ISLAND_EXCLUSIONS = [
  // Corregidor — Manila Bay
  [
    {latitude: 14.4, longitude: 120.54},
    {latitude: 14.4, longitude: 120.62},
    {latitude: 14.35, longitude: 120.62},
    {latitude: 14.35, longitude: 120.54},
  ],
  // Talim Island — Laguna de Bay
  [
    {latitude: 14.4, longitude: 121.2},
    {latitude: 14.4, longitude: 121.28},
    {latitude: 14.32, longitude: 121.28},
    {latitude: 14.32, longitude: 121.2},
  ],
  // Fortune Island — Batangas coast
  [
    {latitude: 14.08, longitude: 120.46},
    {latitude: 14.08, longitude: 120.54},
    {latitude: 14.0, longitude: 120.54},
    {latitude: 14.0, longitude: 120.46},
  ],
  // Marinduque — NE quarter leaks inside Bondoc/Lucena polygon diagonal
  [
    {latitude: 13.6, longitude: 121.77},
    {latitude: 13.6, longitude: 122.1},
    {latitude: 13.27, longitude: 122.1},
    {latitude: 13.27, longitude: 121.77},
  ],
];

/**
 * Drop-off must be on contiguous Mainland Luzon (road-reachable, no ferry).
 */
export function isDropOffAllowed(lat: number, lng: number): boolean {
  const point = {latitude: lat, longitude: lng};
  if (!isPointInPolygon(point, MAINLAND_LUZON_POLYGON)) return false;
  return !LUZON_BAY_ISLAND_EXCLUSIONS.some((poly) =>
    isPointInPolygon(point, poly),
  );
}
