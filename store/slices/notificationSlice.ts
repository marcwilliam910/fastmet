import { StateCreator } from "zustand";

export interface NotificationSlice {
  unreadNotificationCount: number;
  setUnreadNotificationCount: (count: number) => void;
  unreadAnnouncementCount: number;
  setUnreadAnnouncementCount: (count: number) => void;
}

export const createNotificationSlice: StateCreator<NotificationSlice> = (
  set,
) => ({
  unreadNotificationCount: 0,
  unreadAnnouncementCount: 0,

  setUnreadNotificationCount: (count: number) => {
    set({ unreadNotificationCount: count });
  },
  setUnreadAnnouncementCount: (count: number) => {
    set({ unreadAnnouncementCount: count });
  },
});
