import type { LocationDetails } from "@/types/book";
import { create } from "zustand";

interface BookState {
  pickUp: LocationDetails;
  dropOff: LocationDetails;

  setPickUp: (details: LocationDetails) => void;
  setDropOff: (details: LocationDetails) => void;
}

export const useBookStore = create<BookState>((set) => ({
  pickUp: null,
  dropOff: null,

  setPickUp: (details: LocationDetails) => set({ pickUp: details }),
  setDropOff: (details: LocationDetails) => set({ dropOff: details }),
}));
