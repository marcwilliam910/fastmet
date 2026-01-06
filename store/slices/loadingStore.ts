import { StateCreator } from "zustand";

export interface LoadingSlice {
  isLoading: boolean;
  setLoading: (isLoading: boolean) => void;
}

export const createLoadingSlice: StateCreator<LoadingSlice> = (set) => ({
  isLoading: false,
  setLoading: (isLoading: boolean) => set({ isLoading }),
});
