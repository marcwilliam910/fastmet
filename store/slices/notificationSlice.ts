import { StateCreator } from "zustand";

export interface NotificationSlice {
  unreadNotificationCount: number;
  setUnreadNotificationCount: (count: number) => void;
}

export const createNotificationSlice: StateCreator<NotificationSlice> = (
  set,
) => ({
  unreadNotificationCount: 0,

  setUnreadNotificationCount: (count: number) => {
    set({ unreadNotificationCount: count });
  },
});
