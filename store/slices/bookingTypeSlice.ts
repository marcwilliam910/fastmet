import {BookingTypeConfig} from "@/types/bookingType";
import {deriveDefaultBookingType} from "@/utils/helpers/bookingType";
import {StateCreator} from "zustand";
import {BookSlice} from "./bookSlice";

export interface BookingTypeSlice {
  bookingTypes: BookingTypeConfig[];
  bookingTypesLoading: boolean;
  bookingTypesError: string | null;

  fetchBookingTypes: () => Promise<void>;
}

export const createBookingTypeSlice: StateCreator<
  BookSlice & BookingTypeSlice,
  [],
  [],
  BookingTypeSlice
> = (set, get) => ({
  bookingTypes: [],
  bookingTypesLoading: false,
  bookingTypesError: null,

  fetchBookingTypes: async () => {
    set({bookingTypesLoading: true, bookingTypesError: null});
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/booking-types`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      if (!res.ok) {
        throw new Error(`Failed to fetch booking types: ${res.status}`);
      }

      const bookingTypes = await res.json();
      const defaultBookingType =
        get().bookingType === null
          ? deriveDefaultBookingType(bookingTypes)
          : null;
      console.log("defaultBookingType", defaultBookingType);
      set({
        bookingTypes,
        ...(defaultBookingType ? {bookingType: defaultBookingType} : {}),
      });
    } catch (err: any) {
      console.error("Failed to fetch booking types:", err);
      set({
        bookingTypesError: err.message || "Failed to fetch booking types",
      });
    } finally {
      set({bookingTypesLoading: false});
    }
  },
});
