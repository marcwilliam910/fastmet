import { create } from "zustand";
import { AuthSlice, createAuthSlice } from "./slices/authSlice";
import { BookSlice, createBookSlice } from "./slices/bookSlice";
import { createLoadingSlice, LoadingSlice } from "./slices/loadingStore";

export type AppStore = BookSlice & LoadingSlice & AuthSlice;

export const useAppStore = create<AppStore>()((...a) => ({
  ...createBookSlice(...a),
  ...createLoadingSlice(...a),
  ...createAuthSlice(...a),
}));

// export const useAppStore = create<AppStore>()(
//   persist(
//     (...a) => ({
//       ...createBookSlice(...a),
//       ...createLoadingSlice(...a),
//       ...createAuthSlice(...a),
//     }),
//     {
//       name: "fastmet-client-storage",
//       storage: createSecureStorage<{
//         phoneNumber: string;
//         token: string | null;
//         id: string | null;
//         isProfileComplete: boolean;
//         name: string;
//         email: string;
//         profilePictureUrl: string;
//       }>(),
//       // Only persist auth data (prevents persisting temporary data)
//       partialize: (state) => ({
//         phoneNumber: state.phoneNumber,
//         token: state.token,
//         id: state.id,
//         isProfileComplete: state.isProfileComplete,
//         name: state.name,
//         email: state.email,
//         profilePictureUrl: state.profilePictureUrl,
//       }),
//     }
//   )
// );
