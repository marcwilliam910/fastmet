import {Service} from "@/types/book";

export const defaultService: Service[] = [
  {
    id: "1",
    name: "Standard service free",
    price: null,
    icon: "🛠️",
  },
  {
    id: "2",
    name: "Toll and Parking Fee",
    price: null,
    icon: "🛣️",
  },
];

export const serviceAddons: Service[] = [
  {id: "3", name: "Small Truck", price: "Php 100", icon: "🚚"},
  {id: "4", name: "Safety Shoes", price: "Php 100", icon: "👞"},
  {
    id: "5",
    name: "1 Extra Helper",
    price: "Php 100",
    icon: "🧑",
  },
  {id: "6", name: "Reflector Vest", price: null, icon: "🦺"},
  {id: "7", name: "Extra Space", price: null, icon: "📦"},
  {id: "8", name: "Fire Extinguisher", price: null, icon: "🧯"},
  {id: "9", name: "Document Print", price: null, icon: "📄"},
  {id: "10", name: "FastMet ID", price: null, icon: "🪪"},
];

export const METHODS = {
  regular: "Regular Request",
  bidding: "Bidding Request",
  pooling: "Pooling Request",
};
