import type { LocationDetails, RouteData } from "@/types/book";
import { SelectedVehicle, Service } from "@/types/vehicle";
import { fetchDrivingDistance } from "@/utils/calculatePrice";
import { StateCreator } from "zustand";

export type Type = "asap" | "pooling" | "schedule";

export type BookingType = {
  type: Type;
  value: string;
};

export interface BookSlice {
  pickUp: LocationDetails;
  dropOff: LocationDetails;
  bookingType: BookingType;
  selectedVehicle: SelectedVehicle | null;
  routeData: RouteData;
  paymentMethod: "cash" | "gcash";
  note: string;
  itemType: string | null;
  photos: string[];

  addedServices: Service[];
  toggleService: (service: Service) => void;
  updateServiceQuantity: (
    serviceKey: string,
    originalPrice: number,
    quantity: number,
  ) => void;

  setPickUp: (details: LocationDetails) => void;
  setPickUpAdditionalDetails: (details: string) => void;
  setDropOff: (details: LocationDetails) => void;
  setDropOffAdditionalDetails: (details: string) => void;
  setBookingType: (type: BookingType) => void;
  setSelectedVehicle: (vehicle: SelectedVehicle) => void;

  setNote: (note: string) => void;
  setItemType: (itemType: string | null) => void;
  setPaymentMethod: (method: "cash" | "gcash") => void;

  setPhoto: (photo: string) => void;
  removePhoto: (photo: string) => void;

  calculatePrice: () => Promise<number>; // Now returns Promise since it's async

  clearStates: () => void;
}

export const createBookSlice: StateCreator<BookSlice> = (set, get) => ({
  pickUp: null,
  dropOff: null,
  bookingType: { type: "asap", value: "REGULAR" },
  selectedVehicle: null,
  routeData: {
    distance: 0,
    duration: 0,
    basePrice: 0,
    distanceFee: 0,
    serviceFee: 0,
    totalPrice: 0,
  },

  paymentMethod: "cash",
  note: "",
  itemType: null,
  photos: [],
  addedServices: [],

  toggleService: (service: Service) =>
    set((state) => {
      const exists = state.addedServices.some((s) => s.key === service.key);

      const updatedServices = exists
        ? state.addedServices.filter((s) => s.key !== service.key)
        : [...state.addedServices, service];

      const serviceFee = updatedServices.reduce((sum, s) => sum + s.price, 0);

      const { basePrice, distanceFee } = state.routeData;

      return {
        addedServices: updatedServices,
        routeData: {
          ...state.routeData,
          serviceFee,
          totalPrice: basePrice + distanceFee + serviceFee,
        },
      };
    }),
  updateServiceQuantity: (
    serviceKey: string,
    originalPrice: number,
    quantity: number,
  ) =>
    set((state) => {
      const updatedServices = state.addedServices.map((service) =>
        service.key === serviceKey
          ? { ...service, quantity, price: originalPrice * quantity }
          : service,
      );

      const serviceFee = updatedServices.reduce((sum, s) => sum + s.price, 0);
      const { basePrice, distanceFee } = state.routeData;

      return {
        addedServices: updatedServices,
        routeData: {
          ...state.routeData,
          serviceFee,
          totalPrice: basePrice + distanceFee + serviceFee,
        },
      };
    }),

  setPickUp: (details: LocationDetails) => set({ pickUp: details }),
  setPickUpAdditionalDetails: (additionalDetails: string) =>
    set((state) => ({
      pickUp: state.pickUp
        ? { ...state.pickUp, additionalDetails: additionalDetails.trim() }
        : null,
    })),
  setDropOff: (details: LocationDetails) => set({ dropOff: details }),
  setDropOffAdditionalDetails: (additionalDetails: string) =>
    set((state) => ({
      dropOff: state.dropOff ? { ...state.dropOff, additionalDetails } : null,
    })),
  setBookingType: (type) => set({ bookingType: type }),
  setSelectedVehicle: (vehicle) => set({ selectedVehicle: vehicle }),

  setNote: (note) => set({ note }),
  setItemType: (itemType) => set({ itemType }),
  setPhoto: (photos) => set((state) => ({ photos: [...state.photos, photos] })),
  removePhoto: (photo) =>
    set((state) => ({ photos: state.photos.filter((p) => p !== photo) })),
  setPaymentMethod: (method: "cash" | "gcash") =>
    set({ paymentMethod: method }),

  calculatePrice: async () => {
    const { selectedVehicle, addedServices, pickUp, dropOff } = get();

    if (!pickUp || !dropOff || !selectedVehicle || !selectedVehicle.variant) {
      set({
        routeData: {
          distance: 0,
          duration: 0,
          basePrice: 0,
          distanceFee: 0,
          serviceFee: 0,
          totalPrice: 0,
        },
      });
      return 0;
    }

    try {
      const { distanceKm, durationMin } = await fetchDrivingDistance(
        pickUp,
        dropOff,
        selectedVehicle.key,
      );

      const variant = selectedVehicle.variant;
      const basePrice = variant.baseFare;

      // Find the appropriate pricing tier based on distance
      const tier = variant.pricingTiers.find(
        (t) =>
          distanceKm >= t.minKm &&
          (t.maxKm === undefined || distanceKm <= t.maxKm),
      );

      const distanceFee = tier ? distanceKm * tier.pricePerKm : 0;
      const serviceFee = addedServices.reduce((sum, s) => sum + s.price, 0);
      const totalPrice = basePrice + distanceFee + serviceFee;

      set({
        routeData: {
          distance: distanceKm,
          duration: durationMin,
          basePrice: Math.round(basePrice * 100) / 100,
          distanceFee: Math.round(distanceFee * 100) / 100,
          serviceFee: Math.round(serviceFee * 100) / 100,
          totalPrice: Math.round(totalPrice * 100) / 100,
        },
      });

      return totalPrice;
    } catch (error) {
      console.error("Error calculating price:", error);
      set({
        routeData: {
          distance: 0,
          duration: 0,
          basePrice: 0,
          distanceFee: 0,
          serviceFee: 0,
          totalPrice: 0,
        },
      });
      return 0;
    }
  },
  clearStates: () =>
    set({
      pickUp: null,
      dropOff: null,
      bookingType: { type: "asap", value: "REGULAR" },
      selectedVehicle: null,
      routeData: {
        distance: 0,
        duration: 0,
        basePrice: 0,
        distanceFee: 0,
        serviceFee: 0,
        totalPrice: 0,
      },

      note: "",
      itemType: null,
      photos: [],
      paymentMethod: "cash",
      addedServices: [],
    }),
});
