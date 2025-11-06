import type { LocationDetails, Service } from "@/types/book";
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
  bookingType: BookingType | null;

  // not sure
  addedServices: Service[];
  toggleService: (service: Service) => void;

  setPickUp: (details: LocationDetails) => void;
  setDropOff: (details: LocationDetails) => void;
  setBookingType: (type: BookingType | null) => void;
}

export const useBookStore = create<BookState>((set) => ({
  pickUp: null,
  dropOff: null,
  bookingType: { type: "asap", value: "ASAP" },

  // not sure
  addedServices: [...defaultService],

  toggleService: (service: Service) =>
    set((state) => ({
      addedServices: state.addedServices.find((s) => s.id === service.id)
        ? state.addedServices.filter((s) => s.id !== service.id)
        : [...state.addedServices, service],
    })),

  setPickUp: (details: LocationDetails) => set({ pickUp: details }),
  setDropOff: (details: LocationDetails) => set({ dropOff: details }),
  setBookingType: (type) => set({ bookingType: type }),
}));
