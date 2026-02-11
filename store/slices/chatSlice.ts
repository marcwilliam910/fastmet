import { StateCreator } from "zustand";

export interface ChatSlice {
  unreadConversationsCount: number;
  setUnreadConversationsCount: (count: number) => void;
  isInMessageScreen: boolean;
  setIsInMessageScreen: (inMessageScreen: boolean) => void;
  activeConversationId: string | null;
  setActiveConversationId: (id: string | null) => void;
}

export const createChatSlice: StateCreator<ChatSlice> = (set) => ({
  isInMessageScreen: false,
  unreadConversationsCount: 0,
  activeConversationId: null,
  setUnreadConversationsCount: (count: number) => {
    set({ unreadConversationsCount: count });
  },
  setIsInMessageScreen: (inMessageScreen: boolean) => {
    set({ isInMessageScreen: inMessageScreen });
  },
  setActiveConversationId: (id: string | null) => {
    set({ activeConversationId: id });
  },
});
