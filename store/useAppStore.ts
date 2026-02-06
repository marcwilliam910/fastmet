import {UserAddress} from "@/types/user";
import {create} from "zustand";
import {persist} from "zustand/middleware";
import {createSecureStorage} from "./secureStorage";
import {AuthSlice, createAuthSlice} from "./slices/authSlice";
import {BookSlice, createBookSlice} from "./slices/bookSlice";
import {ChatSlice, createChatSlice} from "./slices/chatSlice";
import {createLoadingSlice, LoadingSlice} from "./slices/loadingStore";
import {
  createNotificationSlice,
  NotificationSlice,
} from "./slices/notificationSlice";
import {createVehicleSlice, VehicleSlice} from "./slices/vehicleSlice";

export type AppStore = BookSlice &
  LoadingSlice &
  AuthSlice &
  ChatSlice &
  VehicleSlice &
  NotificationSlice;

export const useAppStore = create<AppStore>()(
  persist(
    (...a) => ({
      ...createBookSlice(...a),
      ...createLoadingSlice(...a),
      ...createAuthSlice(...a),
      ...createChatSlice(...a),
      ...createVehicleSlice(...a),
      ...createNotificationSlice(...a),
    }),
    {
      name: "fastmet-client-storage",
      storage: createSecureStorage<{
        phoneNumber: string;
        token: string | null;
        id: string | null;
        isProfileComplete: boolean;
        name: string;
        profilePictureUrl: string;
        gender: string | null;
        address: UserAddress;
      }>(),
      // Only persist auth data (prevents persisting temporary data)
      partialize: (state) => ({
        phoneNumber: state.phoneNumber,
        token: state.token,
        id: state.id,
        isProfileComplete: state.isProfileComplete,
        name: state.name,
        profilePictureUrl: state.profilePictureUrl,
        gender: state.gender,
        address: state.address,
      }),
    },
  ),
);
