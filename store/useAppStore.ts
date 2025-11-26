import { create } from "zustand";
import { BookSlice, createBookSlice } from "./slices/bookSlice";
import { createLoadingSlice, LoadingSlice } from "./slices/loadingStore";
import { createProfileSlice, ProfileSlice } from "./slices/profileSlice";

export type AppStore = BookSlice & ProfileSlice & LoadingSlice;

export const useAppStore = create<AppStore>()((...a) => ({
  ...createBookSlice(...a),
  ...createProfileSlice(...a),
  ...createLoadingSlice(...a),
}));
