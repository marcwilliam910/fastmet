import { UserAddress } from "@/types/user";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { createSecureStorage } from "./secureStorage";
import { AuthSlice, createAuthSlice } from "./slices/authSlice";
import {
  BookingTypeSlice,
  createBookingTypeSlice,
} from "./slices/bookingTypeSlice";
import { BookSlice, createBookSlice } from "./slices/bookSlice";
import { ChatSlice, createChatSlice } from "./slices/chatSlice";
import { createLoadingSlice, LoadingSlice } from "./slices/loadingStore";
import {
  createNotificationSlice,
  NotificationSlice,
} from "./slices/notificationSlice";
import { createVehicleSlice, VehicleSlice } from "./slices/vehicleSlice";

export type AppStore = BookSlice &
  LoadingSlice &
  AuthSlice &
  ChatSlice &
  VehicleSlice &
  NotificationSlice &
  BookingTypeSlice;

export const useAppStore = create<AppStore>()(
  persist(
    (...a) => ({
      ...createBookSlice(...a),
      ...createLoadingSlice(...a),
      ...createAuthSlice(...a),
      ...createChatSlice(...a),
      ...createVehicleSlice(...a),
      ...createNotificationSlice(...a),
      ...createBookingTypeSlice(...a),
    }),
    {
      name: "fastmet-client-storage",
      storage: createSecureStorage<{
        phoneNumber: string;
        token: string | null;
        refreshToken: string | null;
        id: string | null;
        isProfileComplete: boolean;
        name: string;
        profilePictureUrl: string;
        gender: "male" | "female" | "prefer_not" | null;
        address: UserAddress;
        preRegistered: boolean;
      }>(),
      // Only persist auth data (prevents persisting temporary data)
      partialize: (state) => ({
        phoneNumber: state.phoneNumber,
        token: state.token,
        refreshToken: state.refreshToken,
        id: state.id,
        isProfileComplete: state.isProfileComplete,
        name: state.name,
        profilePictureUrl: state.profilePictureUrl,
        gender: state.gender,
        address: state.address,
        preRegistered: state.preRegistered,
      }),
    },
  ),
);
