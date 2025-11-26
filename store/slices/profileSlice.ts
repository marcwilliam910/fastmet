import { User } from "@/types/user";
import { StateCreator } from "zustand";

export interface ProfileSlice {
  profile: User | null;
  setProfile: (profile: User | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  clearProfile: () => void;
}

export const createProfileSlice: StateCreator<ProfileSlice> = (set) => ({
  profile: null,
  setProfile: (profile) => set({ profile }),
  loading: false,
  setLoading: (loading) => set({ loading }),
  clearProfile: () => set({ profile: null }),
});
