import { isPointInPolygon } from "geolib";
import { Platform } from "react-native";

export const STATIC_IMAGES = {
  pickup: require("@/assets/images/pickup.png"),
  dropoff: require("@/assets/images/dropoff.png"),
  driver: require("@/assets/images/driverIcon.png"),
  gcash: require("@/assets/images/gcash_logo.png"),
  cashPayment: require("@/assets/images/cash_payment.png"),
  userPlaceholder: require("@/assets/images/user.png"),
  fastmetLogo: require("@/assets/fastmet/logo.png"),
  announcement: require("@/assets/images/announcement.png"),
  phone: require("@/assets/images/phone.png"),
  map_bg: require("@/assets/images/map_bg.png"),
};

export const GOOGLE_MAPS_API_KEY =
  Platform.OS === "ios"
    ? process.env.EXPO_PUBLIC_IOS_MAP_KEY
    : process.env.EXPO_PUBLIC_ANDROID_MAP_KEY;

export const METRO_MANILA_POLYGON = [
  // Starting from Northwest (Valenzuela)
  [14.775, 120.93], // Valenzuela NW (buffer)
  [14.775, 120.95], // Valenzuela N
  [14.755, 120.975], // Caloocan West
  [14.75, 121.025], // Caloocan North (buffer)
  [14.775, 121.05], // QC North
  [14.78, 121.08], // QC Northeast
  [14.765, 121.11], // Marikina North (buffer)
  [14.73, 121.13], // Marikina NE
  [14.695, 121.15], // Marikina East (buffer)
  [14.655, 121.165], // Pasig East (buffer)
  [14.61, 121.17], // Pasig SE
  [14.57, 121.175], // Taguig East (buffer)
  [14.53, 121.175], // Taguig SE (buffer)
  [14.48, 121.125], // Muntinlupa East
  [14.44, 121.085], // Muntinlupa South (buffer)
  [14.435, 121.02], // Muntinlupa SW
  [14.44, 120.975], // Las Piñas South (buffer)
  [14.44, 120.945], // Las Piñas West (buffer)
  [14.475, 120.94], // Las Piñas NW
  [14.505, 120.96], // Parañaque West
  [14.54, 120.96], // Pasay West (buffer)
  [14.565, 120.965], // Manila Bay area
  [14.585, 120.965], // Manila West (Tondo area - buffer)
  [14.605, 120.96], // Manila NW (Divisoria area - extra buffer)
  [14.62, 120.955], // Navotas South
  [14.64, 120.95], // Navotas (buffer)
  [14.68, 120.935], // Malabon (buffer)
  [14.715, 120.93], // Valenzuela South
  [14.775, 120.93], // Back to start
];

// Islands and regions that require ferry/boat access from Metro Manila
// These should be EXCLUDED from drop-off locations

// VISAYAS REGION

const MINDORO_POLYGON = [
  { latitude: 13.65, longitude: 120.75 }, // North
  { latitude: 13.65, longitude: 121.55 }, // Northeast
  { latitude: 12.15, longitude: 121.55 }, // Southeast
  { latitude: 12.15, longitude: 120.75 }, // Southwest
];
const MARINDUQUE_POLYGON = [
  { latitude: 13.6, longitude: 121.8 }, // North
  { latitude: 13.6, longitude: 122.1 }, // Northeast
  { latitude: 13.2, longitude: 122.1 }, // Southeast
  { latitude: 13.2, longitude: 121.8 }, // Southwest
];
const ROMBLON_POLYGON = [
  { latitude: 12.9, longitude: 121.9 }, // North
  { latitude: 12.9, longitude: 122.5 }, // Northeast
  { latitude: 12.1, longitude: 122.5 }, // Southeast
  { latitude: 12.1, longitude: 121.9 }, // Southwest
];
const MASBATE_POLYGON = [
  { latitude: 12.65, longitude: 123.2 }, // Northwest
  { latitude: 12.65, longitude: 124.0 }, // Northeast
  { latitude: 11.7, longitude: 124.0 }, // Southeast
  { latitude: 11.7, longitude: 123.2 }, // Southwest
];
const PANAY_POLYGON = [
  // Includes Aklan, Antique, Capiz, Iloilo
  { latitude: 12.1, longitude: 121.8 }, // Northwest
  { latitude: 12.1, longitude: 123.2 }, // Northeast
  { latitude: 10.4, longitude: 123.2 }, // Southeast
  { latitude: 10.4, longitude: 121.8 }, // Southwest
];
const NEGROS_POLYGON = [
  { latitude: 11.0, longitude: 122.5 }, // Northwest
  { latitude: 11.0, longitude: 123.5 }, // Northeast
  { latitude: 9.0, longitude: 123.5 }, // Southeast
  { latitude: 9.0, longitude: 122.5 }, // Southwest
];
const CEBU_POLYGON = [
  { latitude: 11.5, longitude: 123.5 }, // Northwest
  { latitude: 11.5, longitude: 124.2 }, // Northeast
  { latitude: 9.4, longitude: 124.2 }, // Southeast
  { latitude: 9.4, longitude: 123.5 }, // Southwest
];
const BOHOL_POLYGON = [
  { latitude: 10.3, longitude: 123.7 }, // Northwest
  { latitude: 10.3, longitude: 124.7 }, // Northeast
  { latitude: 9.4, longitude: 124.7 }, // Southeast
  { latitude: 9.4, longitude: 123.7 }, // Southwest
];
const LEYTE_POLYGON = [
  // Includes Leyte and Southern Leyte
  { latitude: 11.7, longitude: 124.5 }, // Northwest
  { latitude: 11.7, longitude: 125.3 }, // Northeast
  { latitude: 9.9, longitude: 125.3 }, // Southeast
  { latitude: 9.9, longitude: 124.5 }, // Southwest
];
const SAMAR_POLYGON = [
  // Includes Samar, Eastern Samar, Northern Samar
  { latitude: 12.7, longitude: 124.4 }, // Northwest
  { latitude: 12.7, longitude: 126.0 }, // Northeast
  { latitude: 10.9, longitude: 126.0 }, // Southeast
  { latitude: 10.9, longitude: 124.4 }, // Southwest
];
const BILIRAN_POLYGON = [
  { latitude: 11.65, longitude: 124.4 }, // Northwest
  { latitude: 11.65, longitude: 124.6 }, // Northeast
  { latitude: 11.45, longitude: 124.6 }, // Southeast
  { latitude: 11.45, longitude: 124.4 }, // Southwest
];
const SIQUIJOR_POLYGON = [
  { latitude: 9.3, longitude: 123.45 }, // Northwest
  { latitude: 9.3, longitude: 123.65 }, // Northeast
  { latitude: 9.1, longitude: 123.65 }, // Southeast
  { latitude: 9.1, longitude: 123.45 }, // Southwest
];

// MINDANAO REGION

const MINDANAO_POLYGON = [
  { latitude: 9.9, longitude: 123.0 }, // Northwest (Zamboanga)
  { latitude: 9.9, longitude: 126.7 }, // Northeast (Surigao/Davao Oriental)
  { latitude: 5.4, longitude: 126.7 }, // Southeast (Davao region)
  { latitude: 5.4, longitude: 123.0 }, // Southwest (South Cotabato)
];

const DINAGAT_ISLANDS_POLYGON = [
  { latitude: 10.3, longitude: 125.5 }, // Northwest
  { latitude: 10.3, longitude: 125.8 }, // Northeast
  { latitude: 9.9, longitude: 125.8 }, // Southeast
  { latitude: 9.9, longitude: 125.5 }, // Southwest
];

const SIARGAO_POLYGON = [
  { latitude: 10.0, longitude: 125.9 }, // Northwest
  { latitude: 10.0, longitude: 126.2 }, // Northeast
  { latitude: 9.6, longitude: 126.2 }, // Southeast
  { latitude: 9.6, longitude: 125.9 }, // Southwest
];

const CAMIGUIN_POLYGON = [
  { latitude: 9.25, longitude: 124.6 }, // Northwest
  { latitude: 9.25, longitude: 124.9 }, // Northeast
  { latitude: 9.05, longitude: 124.9 }, // Southeast
  { latitude: 9.05, longitude: 124.6 }, // Southwest
];

const BASILAN_POLYGON = [
  { latitude: 6.75, longitude: 121.7 }, // Northwest
  { latitude: 6.75, longitude: 122.2 }, // Northeast
  { latitude: 6.3, longitude: 122.2 }, // Southeast
  { latitude: 6.3, longitude: 121.7 }, // Southwest
];

// PALAWAN REGION

const PALAWAN_POLYGON = [
  { latitude: 12.0, longitude: 117.0 }, // Northwest (expanded)
  { latitude: 12.0, longitude: 120.5 }, // Northeast
  { latitude: 7.5, longitude: 120.5 }, // Southeast
  { latitude: 7.5, longitude: 117.0 }, // Southwest (expanded to cover western Palawan)
];

const CORON_CALAMIAN_POLYGON = [
  { latitude: 12.4, longitude: 119.8 }, // Northwest
  { latitude: 12.4, longitude: 120.4 }, // Northeast
  { latitude: 11.7, longitude: 120.4 }, // Southeast
  { latitude: 11.7, longitude: 119.8 }, // Southwest
];

const CUYO_ISLANDS_POLYGON = [
  { latitude: 11.0, longitude: 120.8 }, // Northwest
  { latitude: 11.0, longitude: 121.2 }, // Northeast
  { latitude: 10.6, longitude: 121.2 }, // Southeast
  { latitude: 10.6, longitude: 120.8 }, // Southwest
];

// SOUTHERN LUZON ISLANDS (Isolated)

const CATANDUANES_POLYGON = [
  { latitude: 14.2, longitude: 124.1 }, // Northwest
  { latitude: 14.2, longitude: 124.5 }, // Northeast
  { latitude: 13.3, longitude: 124.5 }, // Southeast
  { latitude: 13.3, longitude: 124.1 }, // Southwest
];

const MASBATE_TICAO_POLYGON = [
  { latitude: 12.6, longitude: 123.5 }, // Northwest
  { latitude: 12.6, longitude: 123.8 }, // Northeast
  { latitude: 12.3, longitude: 123.8 }, // Southeast
  { latitude: 12.3, longitude: 123.5 }, // Southwest
];

const BURIAS_POLYGON = [
  { latitude: 12.4, longitude: 123.1 }, // Northwest
  { latitude: 12.4, longitude: 123.4 }, // Northeast
  { latitude: 12.15, longitude: 123.4 }, // Southeast
  { latitude: 12.15, longitude: 123.1 }, // Southwest
];

// SULU ARCHIPELAGO

const SULU_ARCHIPELAGO_POLYGON = [
  { latitude: 6.5, longitude: 120.5 }, // Northwest
  { latitude: 6.5, longitude: 121.5 }, // Northeast
  { latitude: 4.8, longitude: 121.5 }, // Southeast
  { latitude: 4.8, longitude: 120.5 }, // Southwest
];

const TAWI_TAWI_POLYGON = [
  { latitude: 5.3, longitude: 119.7 }, // Northwest
  { latitude: 5.3, longitude: 120.4 }, // Northeast
  { latitude: 4.9, longitude: 120.4 }, // Southeast
  { latitude: 4.9, longitude: 119.7 }, // Southwest
];

// BATANES GROUP (Far North)

const BATANES_POLYGON = [
  { latitude: 21.2, longitude: 121.8 }, // Northwest
  { latitude: 21.2, longitude: 122.2 }, // Northeast
  { latitude: 20.2, longitude: 122.2 }, // Southeast
  { latitude: 20.2, longitude: 121.8 }, // Southwest
];

const BABUYAN_ISLANDS_POLYGON = [
  { latitude: 19.7, longitude: 121.7 }, // Northwest
  { latitude: 19.7, longitude: 122.3 }, // Northeast
  { latitude: 18.9, longitude: 122.3 }, // Southeast
  { latitude: 18.9, longitude: 121.7 }, // Southwest
];

// AGGREGATE: All ferry-required areas
const ALL_FERRY_REQUIRED_POLYGONS = [
  MINDORO_POLYGON,
  MARINDUQUE_POLYGON,
  ROMBLON_POLYGON,
  MASBATE_POLYGON,
  PANAY_POLYGON,
  NEGROS_POLYGON,
  CEBU_POLYGON,
  BOHOL_POLYGON,
  LEYTE_POLYGON,
  SAMAR_POLYGON,
  BILIRAN_POLYGON,
  SIQUIJOR_POLYGON,
  MINDANAO_POLYGON,
  DINAGAT_ISLANDS_POLYGON,
  SIARGAO_POLYGON,
  CAMIGUIN_POLYGON,
  BASILAN_POLYGON,
  PALAWAN_POLYGON,
  CORON_CALAMIAN_POLYGON,
  CUYO_ISLANDS_POLYGON,
  CATANDUANES_POLYGON,
  MASBATE_TICAO_POLYGON,
  BURIAS_POLYGON,
  SULU_ARCHIPELAGO_POLYGON,
  TAWI_TAWI_POLYGON,
  BATANES_POLYGON,
  BABUYAN_ISLANDS_POLYGON,
];

// Utility function to check if point requires ferry
export function requiresFerryFromMetroManila(
  lat: number,
  lng: number
): boolean {
  // Fast path: Central/Northern Luzon mainland (where most bookings are)
  // This handles 80%+ of cases instantly
  if (lat >= 14.0 && lat <= 18.0 && lng >= 120.5 && lng <= 121.8) {
    return false;
  }

  // Check island polygons
  const point = { latitude: lat, longitude: lng };
  return ALL_FERRY_REQUIRED_POLYGONS.some((polygon) =>
    isPointInPolygon(point, polygon)
  );
}
