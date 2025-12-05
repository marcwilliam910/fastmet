import { StateCreator } from "zustand";

export interface AuthSlice {
  phoneNumber: string;
  id: string | null;
  isProfileComplete: boolean;
  name: string;
  token: string | null;
  email: string;
  profilePictureUrl: string;

  // Actions
  setAuthData: (
    data: Partial<Omit<AuthSlice, "setAuthData" | "clearAuthData" | "logout">>
  ) => void;
  clearAuthData: () => void;
  logout: () => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  phoneNumber: "",
  id: null,
  isProfileComplete: false,
  name: "",
  token: null,
  email: "",
  profilePictureUrl: "",

  setAuthData: (data) =>
    set((state) => ({
      ...state,
      ...data,
    })),

  clearAuthData: () =>
    set({
      phoneNumber: "",
      id: undefined,
      name: "",
      token: undefined,
      email: "",
    }),

  logout: () =>
    set({
      phoneNumber: "",
      id: null,
      name: "",
      token: null,
      email: "",
    }),
});
