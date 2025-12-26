import { BookingType } from "@/store/slices/bookSlice";

export type Vehicle = {
  id: string;
  name: string;
  img: string;
  desc: string;
  price?: number; //placeholder
  capacity: string;
};

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
  pickUp: {
    name: string;
    address: string;
    coords: {
      lat: number;
      lng: number;
    };
  };
  dropOff: {
    name: string;
    address: string;
    coords: {
      lat: number;
      lng: number;
    };
  };
  bookingType: {
    type: string; // "asap" | "schedule"
    value: string;
  };
  selectedVehicle: {
    id: string;
    name: string;
    capacity: string;
  };
  routeData: {
    distance: number;
    duration: number;
    price: number;
  };
  paymentMethod: string; // "cash" | "online"
  addedServices: {
    id: string;
    name: string;
    price: number;
    icon: string;
  }[];
  note: string;
  images: string[];
  createdAt: string;
  status: string;
};

export type ActiveBooking = Booking & { driver: Driver };

export type Driver = {
  id: string;
  name: string;
  rating: number;
};

export type RequestBooking = {
  customerId: string;
  bookingRef: string;
  pickUp: LocationDetails;
  dropOff: LocationDetails;
  bookingType: BookingType;
  selectedVehicle: {
    id: string | undefined;
    name: string | undefined;
    capacity: string | undefined;
  };
  routeData: RouteData;
  paymentMethod: "cash" | "online";
  addedServices: Service[];
  photos: string[];
  note: string;
  itemType: string | null;
};
