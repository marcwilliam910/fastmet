import {User} from "@/types/user";
import {create} from "zustand";

interface ProfileState {
  profile: User | null;
  setProfile: (profile: User | null) => void;
  loading: boolean;
  setLoading: (loading: boolean) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>()((set) => ({
  profile: null,
  setProfile: (profile) => set({profile}),
  loading: false,
  setLoading: (loading) => set({loading}),
  clearProfile: () => set({profile: null}),
}));
