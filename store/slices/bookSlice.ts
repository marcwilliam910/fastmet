import type {
  LocationDetails,
  RouteData,
  Service,
  Vehicle,
} from "@/types/book";
import { fetchDrivingDistance } from "@/utils/calculatePrice";
import { defaultService } from "@/utils/constants";
import { StateCreator } from "zustand";

export type Type = "asap" | "pooling" | "schedule";

export type BookingType = {
  type: Type;
  value: string;
};

export interface BookSlice {
  pickUp: LocationDetails;
  dropOff: LocationDetails;
  bookingType: BookingType;
  selectedVehicle: Vehicle | null;
  routeData: RouteData;
  paymentMethod: "cash" | "online";
  note: string;
  itemType: string | null;
  photos: string[];
  fareRates: { baseFare: number; perKmRate: number; perMinRate: number };

  // not sure
  addedServices: Service[];
  toggleService: (service: Service) => void;

  setPickUp: (details: LocationDetails) => void;
  setPickUpAdditionalDetails: (details: string) => void;
  setDropOff: (details: LocationDetails) => void;
  setDropOffAdditionalDetails: (details: string) => void;
  setBookingType: (type: BookingType) => void;
  setSelectedVehicle: (vehicle: Vehicle) => void;

  setNote: (note: string) => void;
  setItemType: (itemType: string | null) => void;
  setPaymentMethod: (method: "cash" | "online") => void;

  setPhoto: (photo: string) => void;
  removePhoto: (photo: string) => void;

  fetchFareRates: () => Promise<void>;
  calculatePrice: () => Promise<void>;
  clearStates: () => void;
}

export const createBookSlice: StateCreator<BookSlice> = (set, get) => ({
  pickUp: null,
  dropOff: null,
  bookingType: { type: "asap", value: "ASAP" },
  selectedVehicle: null,
  routeData: {
    distance: 0,
    duration: 0,
    basePrice: 0,
    distanceFee: 0,
    serviceFee: 0,
    totalPrice: 0,
  },

  paymentMethod: "cash",
  note: "",
  itemType: null,
  photos: [],
  fareRates: { baseFare: 0, perKmRate: 0, perMinRate: 0 },

  // not sure
  addedServices: [...defaultService],

  toggleService: (service: Service) =>
    set((state) => {
      const exists = state.addedServices.some((s) => s.id === service.id);

      const updatedServices = exists
        ? state.addedServices.filter((s) => s.id !== service.id)
        : [...state.addedServices, service];

      const serviceFee = updatedServices.reduce((sum, s) => sum + s.price, 0);

      const { basePrice, distanceFee } = state.routeData;

      return {
        addedServices: updatedServices,
        routeData: {
          ...state.routeData,
          serviceFee,
          totalPrice: basePrice + distanceFee + serviceFee,
        },
      };
    }),

  setPickUp: (details: LocationDetails) => set({ pickUp: details }),
  setPickUpAdditionalDetails: (additionalDetails: string) =>
    set((state) => ({
      pickUp: state.pickUp ? { ...state.pickUp, additionalDetails } : null,
    })),
  setDropOff: (details: LocationDetails) => set({ dropOff: details }),
  setDropOffAdditionalDetails: (additionalDetails: string) =>
    set((state) => ({
      dropOff: state.dropOff ? { ...state.dropOff, additionalDetails } : null,
    })),
  setBookingType: (type) => set({ bookingType: type }),
  setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),

  setNote: (note) => set({ note }),
  setItemType: (itemType) => set({ itemType }),
  setPhoto: (photos) => set((state) => ({ photos: [...state.photos, photos] })),
  removePhoto: (photo) =>
    set((state) => ({ photos: state.photos.filter((p) => p !== photo) })),
  setPaymentMethod: (method: "cash" | "online") =>
    set({ paymentMethod: method }),

  // fetchFareRates: async (token: string) => {
  //   try {
  //     const res = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/api/fare`, {
  //       method: "GET",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `Bearer ${token}`,
  //       },
  //     });

  //     if (!res.ok) {
  //       throw new Error(`Failed to fetch fare rates: ${res.status}`);
  //     }

  //     const rates = await res.json();
  //     console.log("Fare rates:", JSON.stringify(rates, null, 2));

  //     set({ fareRates: rates });
  //   } catch (e) {
  //     console.error("Failed to fetch fare rates", e);
  //   }
  // },
  fetchFareRates: async () => {
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_BASE_URL}/api/fare`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!res.ok) {
        throw new Error(`Failed to fetch fare rates: ${res.status}`);
      }

      const rates = await res.json();
      console.log("Fare rates:", JSON.stringify(rates, null, 2));

      set({ fareRates: rates });
    } catch (e) {
      console.error("Failed to fetch fare rates", e);
    }
  },
  calculatePrice: async () => {
    const { pickUp, dropOff, addedServices, fareRates } = get();
    if (!pickUp || !dropOff) return;

    try {
      const { distanceKm, durationMin } = await fetchDrivingDistance(
        pickUp,
        dropOff
      );

      const basePrice = fareRates.baseFare;
      const distanceFee =
        distanceKm * fareRates.perKmRate + durationMin * fareRates.perMinRate;

      const serviceFee = addedServices.reduce((sum, s) => sum + s.price, 0);

      set({
        routeData: {
          distance: distanceKm,
          duration: durationMin,
          basePrice,
          distanceFee,
          serviceFee,
          totalPrice: basePrice + distanceFee + serviceFee,
        },
      });
    } catch (e) {
      console.error("Failed to calculate price", e);
    }
  },

  clearStates: () =>
    set({
      pickUp: null,
      dropOff: null,
      bookingType: { type: "asap", value: "ASAP" },
      selectedVehicle: null,
      routeData: {
        distance: 0,
        duration: 0,
        basePrice: 0,
        distanceFee: 0,
        serviceFee: 0,
        totalPrice: 0,
      },

      note: "",
      itemType: null,
      photos: [],

      paymentMethod: "cash",

      // not sure
      addedServices: [...defaultService],
    }),
});
