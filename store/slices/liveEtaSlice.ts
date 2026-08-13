import {StateCreator} from "zustand";

export type LiveEtaCacheEntry = {
  etaRevision: string;
  distance: number;
  duration: number;
};

export interface LiveEtaSlice {
  liveEtaByBooking: Record<string, LiveEtaCacheEntry>;
  setLiveEtaCache: (bookingId: string, entry: LiveEtaCacheEntry) => void;
  getLiveEtaCache: (bookingId: string) => LiveEtaCacheEntry | undefined;
  clearLiveEtaCache: (bookingId?: string) => void;
}

export const createLiveEtaSlice: StateCreator<LiveEtaSlice> = (set, get) => ({
  liveEtaByBooking: {},

  setLiveEtaCache: (bookingId, entry) => {
    set((state) => ({
      liveEtaByBooking: {
        ...state.liveEtaByBooking,
        [bookingId]: entry,
      },
    }));
  },

  getLiveEtaCache: (bookingId) => get().liveEtaByBooking[bookingId],

  clearLiveEtaCache: (bookingId) => {
    if (!bookingId) {
      set({liveEtaByBooking: {}});
      return;
    }
    set((state) => {
      const next = {...state.liveEtaByBooking};
      delete next[bookingId];
      return {liveEtaByBooking: next};
    });
  },
});
