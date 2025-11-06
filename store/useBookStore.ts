import type { LocationDetails } from "@/types/book";
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

  setPickUp: (details: LocationDetails) => void;
  setDropOff: (details: LocationDetails) => void;
  setBookingType: (type: BookingType | null) => void;
}

export const useBookStore = create<BookState>((set) => ({
  pickUp: null,
  dropOff: null,
  bookingType: { type: "asap", value: "ASAP" },

  setPickUp: (details: LocationDetails) => set({ pickUp: details }),
  setDropOff: (details: LocationDetails) => set({ dropOff: details }),
  setBookingType: (type) => set({ bookingType: type }),
}));
