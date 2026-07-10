import { NewUser } from "@/types/user";
import { StateCreator } from "zustand";

export interface ProfileSlice {
  profile: NewUser | null;
  setProfile: (profile: NewUser | null) => void;
  clearProfile: () => void;
}

export const createProfileSlice: StateCreator<ProfileSlice> = (set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  clearProfile: () => set({ profile: null }),
});
