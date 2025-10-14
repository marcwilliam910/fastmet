import {Service} from "@/types/book";
import {defaultService} from "@/utils/constants";
import {create} from "zustand";

interface BookState {
  addedServices: Service[];
  selectedTime: string | null;
  setSelectedTime: (time: string | null) => void;
  toggleService: (service: Service) => void;
}

export const useBookStore = create<BookState>((set) => ({
  addedServices: [...defaultService],
  selectedTime: null,

  setSelectedTime: (time) => set({selectedTime: time}),
  toggleService: (service: Service) =>
    set((state) => ({
      addedServices: state.addedServices.find((s) => s.id === service.id)
        ? state.addedServices.filter((s) => s.id !== service.id)
        : [...state.addedServices, service],
    })),
}));
