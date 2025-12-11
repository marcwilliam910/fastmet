import { StateCreator } from "zustand";

export interface ChatSlice {
  unreadConversationsCount: number;
  setUnreadConversationsCount: (count: number) => void;
  isInMessageScreen: boolean;
  setIsInMessageScreen: (inMessageScreen: boolean) => void;
}

export const createChatSlice: StateCreator<ChatSlice> = (set) => ({
  isInMessageScreen: false,
  unreadConversationsCount: 0,
  setUnreadConversationsCount: (count: number) => {
    set({ unreadConversationsCount: count });
  },
  setIsInMessageScreen: (inMessageScreen: boolean) => {
    set({ isInMessageScreen: inMessageScreen });
  },
});
