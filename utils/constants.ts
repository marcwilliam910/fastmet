import { Service, Vehicle } from "@/types/book";
import { Platform } from "react-native";

export const defaultService: Service[] = [
  {
    id: "1",
    name: "Standard service free",
    price: 0,
    icon: "🛠️",
  },
  {
    id: "2",
    name: "Toll and Parking Fee",
    price: 0,
    icon: "🛣️",
  },
];

export const serviceAddons: Service[] = [
  { id: "3", name: "Small Truck", price: 100, icon: "🚚" },
  { id: "4", name: "Safety Shoes", price: 100, icon: "👞" },
  {
    id: "5",
    name: "1 Extra Helper",
    price: 100,
    icon: "🧑",
  },
  { id: "6", name: "Reflector Vest", price: 50, icon: "🦺" },
  { id: "7", name: "Extra Space", price: 60, icon: "📦" },
  { id: "8", name: "Fire Extinguisher", price: 30, icon: "🧯" },
  { id: "9", name: "Document Print", price: 100, icon: "📄" },
  { id: "10", name: "FastMet ID", price: 200, icon: "🪪" },
];

export const vehicles: Vehicle[] = [
  {
    id: "1",
    name: "Motorcycle",
    img: require("@/assets/vehicle/motor.png"),
    desc: "Ideal for fast solo rides or small deliveries. Carries 1 passenger.",
    capacity: "20kg",
  },
  {
    id: "2",
    name: "Sedan",
    img: require("@/assets/vehicle/car.png"),
    desc: "Perfect for city trips and comfortable rides. Fits up to 4 passengers.",
    capacity: "100kg",
  },
  {
    id: "3",
    name: "MPV/SUV",
    img: require("@/assets/vehicle/suv.png"),
    desc: "Spacious and powerful for long trips or groups. Fits up to 6 passengers.",
    capacity: "300kg",
  },
  {
    id: "4",
    name: "Truck",
    img: require("@/assets/vehicle/truck.png"),
    desc: "Spacious and powerful for long trips or groups. Fits up to 6 passengers.",
    capacity: "300kg",
  },
  {
    id: "5",
    name: "FastMet Truck",
    img: require("@/assets/vehicle/fastmet_truck.png"),
    desc: "Spacious and powerful for long trips or groups. Fits up to 6 passengers.",
    capacity: "300kg",
  },
];

export const STATIC_IMAGES = {
  pickup: require("@/assets/images/pickup.png"),
  dropoff: require("@/assets/images/dropoff.png"),
  driver: require("@/assets/images/driverIcon.png"),
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
