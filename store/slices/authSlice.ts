import { UserAddress } from "@/types/user";
import { StateCreator } from "zustand";

export interface AuthSlice {
  phoneNumber: string;
  id: string | null;
  isProfileComplete: boolean;
  name: string;
  token: string | null;
  refreshToken: string | null;
  gender: string | null;
  address: UserAddress | null;
  profilePictureUrl: string;
  preRegistered: boolean;

  // Actions
  setAuthData: (
    data: Partial<Omit<AuthSlice, "setAuthData" | "clearAuthData" | "logout">>,
  ) => void;
  logout: () => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  phoneNumber: "",
  id: null,
  isProfileComplete: false,
  name: "",
  token: null,
  refreshToken: null,
  gender: null,
  address: null,
  profilePictureUrl: "",
  preRegistered: false,

  setAuthData: (data) =>
    set((state) => ({
      ...state,
      ...data,
    })),

  logout: () =>
    set({
      phoneNumber: "",
      id: null,
      name: "",
      token: null,
      refreshToken: null,
      address: null,
      gender: null,
      isProfileComplete: false,
      profilePictureUrl: "",
      preRegistered: false,
    }),
});
