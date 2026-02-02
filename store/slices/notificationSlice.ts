import {Notification} from "@/types/notification";
import {StateCreator} from "zustand";

export interface NotificationSlice {
  unreadNotificationCount: number;
  notifications: Notification[];
  setUnreadNotificationCount: (count: number) => void;
  decrementUnreadNotificationCount: () => void;
  resetUnreadNotificationCount: () => void;
  setNotifications: (notifications: Notification[]) => void;
  getNotificationById: (id: string) => Notification | undefined;
}

export const createNotificationSlice: StateCreator<NotificationSlice> = (
  set,
  get,
) => ({
  unreadNotificationCount: 0,
  notifications: [],

  setUnreadNotificationCount: (count: number) => {
    set({unreadNotificationCount: count});
  },

  decrementUnreadNotificationCount: () => {
    set((state) => ({
      unreadNotificationCount: Math.max(0, state.unreadNotificationCount - 1),
    }));
  },

  resetUnreadNotificationCount: () => {
    set({unreadNotificationCount: 0});
  },

  setNotifications: (notifications: Notification[]) => {
    set({notifications});
  },

  getNotificationById: (id: string) => {
    return get().notifications.find((n) => n._id === id);
  },
});
