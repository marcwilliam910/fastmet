import {Service} from "@/types/book";
import {defaultService, METHODS} from "@/utils/constants";
import {create} from "zustand";

interface BookState {
  addedServices: Service[];
  selectedTime: string | null;
  selectedMethod: keyof typeof METHODS | null;
  isTollVisited: boolean; //might be removed

  setSelectedTime: (time: string | null) => void;
  setSelectedMethod: (method: "regular" | "bidding" | "pooling" | null) => void;
  setIsTollVisited: (isTollVisited: boolean) => void;
  toggleService: (service: Service) => void;
}

export const useBookStore = create<BookState>((set) => ({
  addedServices: [...defaultService],
  selectedTime: null,
  selectedMethod: null,
  isTollVisited: false,

  setSelectedTime: (time) => set({selectedTime: time}),
  setSelectedMethod: (method) => set({selectedMethod: method}),
  setIsTollVisited: (isTollVisited) => set({isTollVisited}),

  toggleService: (service: Service) =>
    set((state) => ({
      addedServices: state.addedServices.find((s) => s.id === service.id)
        ? state.addedServices.filter((s) => s.id !== service.id)
        : [...state.addedServices, service],
    })),
}));
