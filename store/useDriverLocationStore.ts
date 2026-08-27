import AsyncStorage from "@react-native-async-storage/async-storage";
import {create} from "zustand";
import {createJSONStorage, persist} from "zustand/middleware";

export type DriverLocationCacheEntry = {
  lat: number;
  lng: number;
  timestamp: number; // ms epoch, Date.now()
};

interface DriverLocationStore {
  driverLocationByBooking: Record<string, DriverLocationCacheEntry>;
  setDriverLocationCache: (
    bookingId: string,
    entry: DriverLocationCacheEntry,
  ) => void;
  getDriverLocationCache: (
    bookingId: string,
  ) => DriverLocationCacheEntry | undefined;
  clearDriverLocationCache: (bookingId?: string) => void;
}

export const useDriverLocationStore = create<DriverLocationStore>()(
  persist(
    (set, get) => ({
      driverLocationByBooking: {},

      setDriverLocationCache: (bookingId, entry) => {
        set((state) => ({
          driverLocationByBooking: {
            ...state.driverLocationByBooking,
            [bookingId]: entry,
          },
        }));
      },

      getDriverLocationCache: (bookingId) =>
        get().driverLocationByBooking[bookingId],

      clearDriverLocationCache: (bookingId) => {
        if (!bookingId) {
          set({driverLocationByBooking: {}});
          return;
        }
        set((state) => {
          const next = {...state.driverLocationByBooking};
          delete next[bookingId];
          return {driverLocationByBooking: next};
        });
      },
    }),
    {
      name: "fastmet-driver-location-storage",
      storage: createJSONStorage(() => AsyncStorage),
    },
  ),
);
