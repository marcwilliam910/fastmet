import type {LocationDetails, RouteData} from "@/types/book";
import {BookingTypeConfig} from "@/types/bookingType";
import {SelectedVehicle, Service} from "@/types/vehicle";
import {
  addressMentionsAllowedPickupCity,
  isDropOffAllowed,
  isWithinAllowedPickupBounds,
} from "@/utils/constants";
import {StateCreator} from "zustand";
import {BookingTypeSlice} from "./bookingTypeSlice";
import {LoadingSlice} from "./loadingStore";

export type Type = "asap" | "pooling" | "schedule";

export type BookingType = {
  type: Type;
  value: string;
  priceModifier: number; // resolved from DB config at selection time
};

// Decoupled so it's reusable in both setBookingType and clearStates
const resolveModifier = (
  configs: BookingTypeConfig[],
  type: Type,
  value: string,
): number => {
  const config = configs.find((c) => c.key === type);
  if (!config) return 1.0;

  if (config.subOptions?.length > 0) {
    // ASAP-like: modifier lives on the sub-option (REGULAR, PRIORITY)
    const sub = config.subOptions.find((s) => s.key === value);
    return sub?.priceModifier ?? 1.0;
  }

  // Flat types (pooling, schedule): modifier lives on the parent
  return config.priceModifier ?? 1.0;
};

export interface BookSlice {
  pickUp: LocationDetails;
  dropOff: LocationDetails;
  bookingType: BookingType;
  selectedVehicle: SelectedVehicle | null;
  routeData: RouteData;
  paymentMethod: "cash" | "gcash";
  paidBy: "sender" | "receiver";
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
  setPickUpContactName: (contactName: string) => void;
  setPickUpContactPhone: (contactPhone: string) => void;

  setDropOff: (details: LocationDetails) => void;
  setDropOffAdditionalDetails: (details: string) => void;
  setDropOffContactName: (contactName: string) => void;
  setDropOffContactPhone: (contactPhone: string) => void;
  /** Swaps pickup/dropoff only if both pass service-area checks. Returns false if blocked. */
  swapLocations: () => boolean;
  setBookingType: (payload: {type: Type; value: string}) => void;
  setSelectedVehicle: (vehicle: SelectedVehicle) => void;
  setRouteData: (data: RouteData) => void;
  setNote: (note: string) => void;
  setItemType: (itemType: string | null) => void;
  setPaymentMethod: (method: "cash" | "gcash") => void;
  setPaidBy: (paidBy: "sender" | "receiver") => void;

  setPhoto: (photo: string) => void;
  removePhoto: (photo: string) => void;

  // calculatePrice: () => Promise<number>;

  clearStates: () => void;
}

export const createBookSlice: StateCreator<
  BookSlice & BookingTypeSlice & LoadingSlice, // gives get() visibility into bookingTypes
  [],
  [],
  BookSlice
> = (set, get) => ({
  pickUp: null,
  dropOff: null,
  bookingType: {type: "asap", value: "REGULAR", priceModifier: 1.0},
  selectedVehicle: null,
  routeData: {
    distance: 0,
    duration: 0,
    basePrice: 0,
    distanceFee: 0,
    serviceFee: 0,
    totalPrice: 0,
    surgeMultiplier: 1.0,
    gasAdjFactor: 1.0,
  },
  paymentMethod: "cash",
  paidBy: "sender",
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
      const {basePrice, distanceFee} = state.routeData;

      return {
        addedServices: updatedServices,
        routeData: {
          ...state.routeData,
          serviceFee,
          totalPrice: Math.round(basePrice + distanceFee + serviceFee),
        },
      };
    }),

  updateServiceQuantity: (serviceKey, originalPrice, quantity) =>
    set((state) => {
      const updatedServices = state.addedServices.map((service) =>
        service.key === serviceKey
          ? {...service, quantity, price: originalPrice * quantity}
          : service,
      );
      const serviceFee = updatedServices.reduce((sum, s) => sum + s.price, 0);
      const {basePrice, distanceFee} = state.routeData;

      return {
        addedServices: updatedServices,
        routeData: {
          ...state.routeData,
          serviceFee,
          totalPrice: Math.round(basePrice + distanceFee + serviceFee),
        },
      };
    }),

  setPickUp: (details) => set({pickUp: details}),
  setPickUpAdditionalDetails: (additionalDetails) =>
    set((state) => ({
      pickUp: state.pickUp
        ? {...state.pickUp, additionalDetails: additionalDetails.trim()}
        : null,
    })),

  setPickUpContactName: (contactName) =>
    set((state) => ({
      pickUp: state.pickUp
        ? {...state.pickUp, contactName: contactName.trim()}
        : null,
    })),
  setPickUpContactPhone: (contactPhone) =>
    set((state) => ({
      pickUp: state.pickUp
        ? {...state.pickUp, contactPhone: contactPhone.trim()}
        : null,
    })),
  setDropOff: (details) => set({dropOff: details}),
  setDropOffAdditionalDetails: (additionalDetails) =>
    set((state) => ({
      dropOff: state.dropOff
        ? {...state.dropOff, additionalDetails: additionalDetails.trim()}
        : null,
    })),

  setDropOffContactName: (contactName) =>
    set((state) => ({
      dropOff: state.dropOff
        ? {...state.dropOff, contactName: contactName.trim()}
        : null,
    })),
  setDropOffContactPhone: (contactPhone) =>
    set((state) => ({
      dropOff: state.dropOff
        ? {...state.dropOff, contactPhone: contactPhone.trim()}
        : null,
    })),

  swapLocations: () => {
    const {pickUp, dropOff} = get();
    if (!pickUp || !dropOff) return false;

    // Current dropOff becomes the new pickup — must pass pickup gates
    const newPickupInBounds = isWithinAllowedPickupBounds(
      dropOff.coords.lat,
      dropOff.coords.lng,
    );
    const newPickupCityOk =
      addressMentionsAllowedPickupCity(dropOff.address) ||
      addressMentionsAllowedPickupCity(dropOff.name);
    // Current pickUp becomes the new dropoff — must pass dropoff gates
    const newDropoffOk = isDropOffAllowed(pickUp.coords.lat, pickUp.coords.lng);

    if (!newPickupInBounds || !newPickupCityOk || !newDropoffOk) {
      return false;
    }

    set({pickUp: dropOff, dropOff: pickUp});
    return true;
  },

  setBookingType: ({type, value}) => {
    const priceModifier = resolveModifier(get().bookingTypes, type, value);
    set({bookingType: {type, value, priceModifier}});
  },

  setSelectedVehicle: (vehicle) => set({selectedVehicle: vehicle}),
  setRouteData: (data) => set({routeData: data}),
  setNote: (note) => set({note}),
  setItemType: (itemType) => set({itemType}),
  setPhoto: (photo) => set((state) => ({photos: [...state.photos, photo]})),
  removePhoto: (photo) =>
    set((state) => ({photos: state.photos.filter((p) => p !== photo)})),
  setPaymentMethod: (method) => set({paymentMethod: method}),
  setPaidBy: (paidBy) => set({paidBy}),

  clearStates: () =>
    set((state) => ({
      pickUp: null,
      dropOff: null,
      // Re-resolve so default reflects configs even if they loaded after app boot
      bookingType: {
        type: "asap",
        value: "REGULAR",
        priceModifier: resolveModifier(state.bookingTypes, "asap", "REGULAR"),
      },
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
      paidBy: "sender",
      addedServices: [],
    })),
});
