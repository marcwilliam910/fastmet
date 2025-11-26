import { create } from "zustand";
import { BookSlice, createBookSlice } from "./slices/bookSlice";
import { createProfileSlice, ProfileSlice } from "./slices/profileSlice";

export type AppStore = BookSlice & ProfileSlice;

export const useAppStore = create<AppStore>()((...a) => ({
  ...createBookSlice(...a),
  ...createProfileSlice(...a),
}));
