import { BookingType } from "@/store/slices/bookSlice";
import { SelectedVehicle } from "./vehicle";

export type LocationDetails = {
  name: string;
  address: string;
  coords: { lat: number; lng: number };
  additionalDetails?: string;
} | null;

export type Service = {
  id: string;
  name: string;
  price: number;
  icon: string;
};

export type RouteData = {
  distance: number;
  duration: number;
  basePrice: number;
  distanceFee: number;
  serviceFee: number;
  totalPrice: number;
};

export type Booking = {
  _id: string;
  bookingRef: string;
  customerId: string;
  pickUp: LocationDetails;
  dropOff: LocationDetails;
  bookingType: {
    type: string; // "asap" | "schedule"
    value: string;
  };
  selectedVehicle: {
    id: string;
    name: string;
    capacity: string;
  };
  routeData: RouteData;
  paymentMethod: string; // "cash" | "online"
  addedServices: {
    id: string;
    name: string;
    price: number;
    icon: string;
  }[];
  note: string;
  itemType: string | null;
  photos: string[];
  createdAt: string;
  status: string;
  driverRating: number | null;
};

export type ActiveBooking = Booking & { driver: Driver };

export type CompletedBooking = ActiveBooking & {
  proofImageUrl: string;
  completedAt: string;
};

export type Driver = {
  id: string;
  name: string;
  rating: number;
  profilePictureUrl: string;
};

export type RequestBooking = {
  customerId: string;
  bookingRef: string;
  pickUp: LocationDetails;
  dropOff: LocationDetails;
  bookingType: BookingType;
  selectedVehicle: SelectedVehicle;
  routeData: RouteData;
  paymentMethod: "cash" | "gcash";
  addedServices: Service[];
  photos: string[];
  note: string;
  itemType: string | null;
};
