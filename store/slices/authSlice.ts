import {UserAddress} from "@/types/user";
import {StateCreator} from "zustand";

export type ApprovalStatus = "pending" | "approved" | "rejected";

export interface AuthSlice {
  phoneNumber: string;
  id: string | null;
  registrationStep: number;
  approvalStatus: ApprovalStatus;
  name: string;
  token: string | null;
  refreshToken: string | null;
  gender: "male" | "female" | "prefer_not" | null;
  address: UserAddress | null;
  profilePictureUrl: string;
  preRegistered: boolean;

  setAuthData: (
    data: Partial<Omit<AuthSlice, "setAuthData" | "logout">>,
  ) => void;
  logout: () => void;
}

export const createAuthSlice: StateCreator<AuthSlice> = (set) => ({
  phoneNumber: "",
  id: null,
  registrationStep: 1,
  approvalStatus: "pending",
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
      registrationStep: 1,
      approvalStatus: "pending",
      profilePictureUrl: "",
      preRegistered: false,
    }),
});
