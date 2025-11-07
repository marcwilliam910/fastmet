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
};

export const GOOGLE_MAPS_API_KEY =
  Platform.OS === "ios"
    ? process.env.EXPO_PUBLIC_IOS_MAP_KEY
    : process.env.EXPO_PUBLIC_ANDROID_MAP_KEY;
