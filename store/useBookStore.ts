import type {
  LocationDetails,
  RouteData,
  Service,
  Vehicle,
} from "@/types/book";
import { calculateAccuratePrice } from "@/utils/calculatePrice";
import { defaultService } from "@/utils/constants";
import { create } from "zustand";

export type Type = "asap" | "pooling" | "schedule";

type BookingType = {
  type: Type;
  value: string;
};

interface BookState {
  pickUp: LocationDetails;
  dropOff: LocationDetails;
  bookingType: BookingType;
  selectedVehicle: Vehicle | null;
  routeData: RouteData;
  paymentMethod: "cash" | "online";

  // not sure
  addedServices: Service[];
  toggleService: (service: Service) => void;

  setPickUp: (details: LocationDetails) => void;
  setDropOff: (details: LocationDetails) => void;
  setBookingType: (type: BookingType) => void;
  setSelectedVehicle: (vehicle: Vehicle) => void;
  setPrice: (p: number) => void;
  calculatePrice: () => void;
  setPaymentMethod: (method: "cash" | "online") => void;
  clearStates: () => void;

  success: boolean;
  setSuccess: (success: boolean) => void;
}

export const useBookStore = create<BookState>((set, get) => ({
  pickUp: null,
  dropOff: null,
  bookingType: { type: "asap", value: "ASAP" },
  selectedVehicle: null,
  routeData: {
    distance: 0,
    duration: 0,
    price: 0,
  },
  paymentMethod: "cash",
  success: false,

  // not sure
  addedServices: [...defaultService],

  toggleService: (service: Service) =>
    set((state) => {
      const exists = state.addedServices.find((s) => s.id === service.id);

      let updatedServices;
      let updatedPrice = state.routeData.price;

      if (exists) {
        // Remove service and subtract its price
        updatedServices = state.addedServices.filter(
          (s) => s.id !== service.id
        );
        updatedPrice -= service.price;
      } else {
        // Add service and add its price
        updatedServices = [...state.addedServices, service];
        updatedPrice += service.price;
      }

      return {
        addedServices: updatedServices,
        routeData: { ...state.routeData, price: updatedPrice },
      };
    }),

  setPickUp: (details: LocationDetails) => set({ pickUp: details }),
  setDropOff: (details: LocationDetails) => set({ dropOff: details }),
  setBookingType: (type) => set({ bookingType: type }),
  setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),
  setPrice: (p) =>
    set((state) => ({
      routeData: { ...state.routeData, price: p },
    })),
  setPaymentMethod: (method: "cash" | "online") =>
    set({ paymentMethod: method }),

  calculatePrice: async () => {
    const { pickUp, dropOff, addedServices } = get();
    if (!pickUp || !dropOff) return;

    try {
      const { total, distanceKm, durationMin } = await calculateAccuratePrice(
        pickUp,
        dropOff
      );

      // compute total added services price
      const servicesTotal = addedServices.reduce((acc, s) => acc + s.price, 0);

      set({
        routeData: {
          distance: distanceKm,
          duration: durationMin,
          price: total + servicesTotal, // base + services
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
        price: 0,
      },
      paymentMethod: "cash",

      // not sure
      addedServices: [...defaultService],
    }),

  setSuccess: (success) => set({ success }),
}));
