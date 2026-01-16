import { queryClient } from "@/lib/queryClient";
import { useAppStore } from "@/store/useAppStore";
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

    const conversationsCache = queryClient.getQueryData(["conversations"]);

    if (conversationsCache) {
      // Conversations have been fetched before, so refresh them
      queryClient.invalidateQueries({
        queryKey: ["conversations"],
      });
    }

    const isInMessageScreen = useAppStore.getState().isInMessageScreen;

    if (!isInMessageScreen) {
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

  const unreadConversationsCountHandler = (data: {
    unreadConversationsCount: number;
  }) => {
    useAppStore
      .getState()
      .setUnreadConversationsCount(data.unreadConversationsCount);
  };

  socket.on("new_message_badge", receiveMessageHandler);
  socket.on("unread_conversations_updated", unreadConversationsUpdatedHandler);
  socket.on("unread_conversations_count", unreadConversationsCountHandler);

  return () => {
    socket.off("new_message_badge", receiveMessageHandler);
    socket.off(
      "unread_conversations_updated",
      unreadConversationsUpdatedHandler
    );
    socket.off("unread_conversations_count", unreadConversationsCountHandler);
  };
};
