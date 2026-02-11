import { queryClient } from "@/lib/queryClient";
import { useAppStore } from "@/store/useAppStore";
import { ConversationResponse } from "@/types/chat";
import { InfiniteData } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { Socket } from "socket.io-client";

export const receiveMessage = (socket: Socket) => {
  const receiveMessageHandler = (data: {
    unreadConversationsCount: number;
    message: string;
    sender: string;
    conversationId: string;
    profilePictureUrl: string;
  }) => {
    console.log("📩 New message badge received:", data);
    useAppStore
      .getState()
      .setUnreadConversationsCount(data.unreadConversationsCount);

    const { isInMessageScreen, activeConversationId } = useAppStore.getState();
    const isViewingThisConversation =
      isInMessageScreen && activeConversationId === data.conversationId;

    // Skip optimistic update if the client is actively reading this conversation
    if (!isViewingThisConversation) {
      type ConversationsPage = {
        conversations: ConversationResponse[];
        nextPage: number | null;
      };

      const conversationsQueries = queryClient.getQueriesData<
        InfiniteData<ConversationsPage>
      >({ queryKey: ["conversations"] });

      const hasCache = conversationsQueries.some(([, d]) => !!d?.pages?.length);

      if (hasCache) {
        queryClient.setQueriesData<InfiniteData<ConversationsPage>>(
          { queryKey: ["conversations"] },
          (old) => {
            if (!old?.pages?.length) return old;

            // Find the conversation across all pages
            const found = old.pages
              .flatMap((p) => p.conversations)
              .find((c) => c._id === data.conversationId);

            if (!found) {
              // Conversation not in cache (brand-new) -- fall back to refetch
              queryClient.invalidateQueries({ queryKey: ["conversations"] });
              return old;
            }

            // Remove the conversation from whichever page it sits in
            const pagesWithout = old.pages.map((page) => ({
              ...page,
              conversations: page.conversations.filter(
                (c) => c._id !== data.conversationId,
              ),
            }));

            // Build updated conversation with the 4 changed fields
            const updated: ConversationResponse = {
              ...found,
              lastMessage: data.message,
              lastMessageAt: new Date().toISOString(),
              lastMessageBy: "driver",
              unreadCount: {
                ...found.unreadCount,
                client: found.unreadCount.client + 1,
              },
            };

            // Prepend to page 0 so most-recent conversation is on top
            return {
              ...old,
              pages: pagesWithout.map((page, idx) =>
                idx === 0
                  ? {
                      ...page,
                      conversations: [updated, ...page.conversations],
                    }
                  : page,
              ),
            };
          },
        );
      } else {
        queryClient.invalidateQueries({ queryKey: ["conversations"] });
      }

      Toast.show({
        type: "newMessage",
        text1: `New Message from ${data.sender}`,
        text2: data.message,
        position: "top",
        visibilityTime: 5000,
        props: {
          conversationId: data.conversationId,
          profilePictureUrl: data.profilePictureUrl,
        },
      });
    }
  };

  const unreadConversationsUpdatedHandler = (data: {
    unreadConversationsCount: number;
  }) => {
    console.log("🔔 Unread conversations updated:", data);
    useAppStore
      .getState()
      .setUnreadConversationsCount(data.unreadConversationsCount);
  };

  socket.on("new_message_badge", receiveMessageHandler);
  socket.on("unread_conversations_updated", unreadConversationsUpdatedHandler);

  return () => {
    socket.off("new_message_badge", receiveMessageHandler);
    socket.off(
      "unread_conversations_updated",
      unreadConversationsUpdatedHandler,
    );
  };
};
