import { BookingType } from "@/store/slices/bookSlice";
import { SelectedVehicle, Service } from "./vehicle";

export type LocationDetails = {
  name: string;
  address: string;
  coords: { lat: number; lng: number };
  additionalDetails?: string;
} | null;

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
  selectedVehicle: Omit<SelectedVehicle, "paidServices">;
  routeData: RouteData;
  paymentMethod: string; // "cash" | "online"
  addedServices: Service[];
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
  selectedVehicle: Partial<Omit<SelectedVehicle, "freeServices">> & {
    freeServices: Partial<Service>[];
  };
  routeData: RouteData;
  paymentMethod: "cash" | "gcash";
  addedServices: Partial<Service>[];
  photos: string[];
  note: string;
  itemType: string | null;
};
