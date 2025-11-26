import { User } from "@/types/user";
import { StateCreator } from "zustand";

export interface ProfileSlice {
  profile: User | null;
  setProfile: (profile: User | null) => void;
  clearProfile: () => void;
}

export const createProfileSlice: StateCreator<ProfileSlice> = (set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  clearProfile: () => set({ profile: null }),
});
