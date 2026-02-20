import { IVehicleType } from "@/types/vehicle";
import { StateCreator } from "zustand";

export interface VehicleSlice {
  vehicles: IVehicleType[];
  vehicleLoading: boolean;
  vehicleError: string | null;

  fetchVehicles: () => Promise<void>;
}

export const createVehicleSlice: StateCreator<VehicleSlice> = (set) => ({
  vehicles: [],
  vehicleLoading: false,
  vehicleError: null,

  fetchVehicles: async () => {
    set({ vehicleLoading: true, vehicleError: null });
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/vehicles`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );

      if (!res.ok) {
        throw new Error(`Failed to fetch vehicles: ${res.status}`);
      }

      const vehicle = await res.json();

      set({ vehicles: vehicle });
    } catch (err: any) {
      console.error("Failed to fetch vehicles:", err);
      set({
        vehicleError: err.message || "Failed to fetch vehicles",
      });
    } finally {
      set({ vehicleLoading: false });
    }
  },
});
