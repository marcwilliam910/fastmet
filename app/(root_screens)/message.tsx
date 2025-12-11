import { queryClient } from "@/lib/queryClient";
import { useConversationById } from "@/queries/conversation";
import { useSocket } from "@/sockets/context/SocketProvider";
import { useAppStore } from "@/store/useAppStore";
import { openGallery } from "@/utils/imagePicker";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import * as ImagePicker from "expo-image-picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { Bubble, GiftedChat, IMessage } from "react-native-gifted-chat";
import { SafeAreaView } from "react-native-safe-area-context";

interface MessagesLoadedData {
  messages: any[];
  skip: number;
  hasMore: boolean;
}

const Message = () => {
  const params = useLocalSearchParams();
  const conversationId = params.conversationId as string;
  const { data: conversation, isPending } = useConversationById(conversationId);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  const [messages, setMessages] = useState<IMessage[]>([]);
  const [text, setText] = useState("");
  const socket = useSocket();

  const [loadEarlier, setLoadEarlier] = useState(false);
  const [isLoadingEarlier, setIsLoadingEarlier] = useState(false);
  const [skip, setSkip] = useState(0);

  // Format message for GiftedChat
  const formatMessage = useCallback(
    (msg: any): IMessage => {
      const isMyMessage = msg.senderId === useAppStore.getState().id;

      return {
        _id: msg._id,
        text: msg.text || "",
        image: msg.image,
        createdAt: new Date(msg.createdAt),
        user: isMyMessage
          ? {
              _id: useAppStore.getState().id || "unknown",
              name: useAppStore.getState().name || "Me",
              avatar: useAppStore.getState().profilePictureUrl || "",
            }
          : {
              _id: conversation?.driver._id || "unknown",
              name: conversation?.driver.name || "Driver",
              avatar: conversation?.driver.profilePictureUrl || "",
            },
      };
    },
    [conversation]
  );

  // Set flag when entering message screen
  useEffect(() => {
    useAppStore.getState().setIsInMessageScreen(true);

    return () => {
      // Clear flag when leaving message screen
      useAppStore.getState().setIsInMessageScreen(false);
    };
  }, []);

  const handleLoadEarlier = () => {
    if (!conversationId || isLoadingEarlier) return;

    setIsLoadingEarlier(true);

    socket.emit("get_messages", {
      conversationId,
      limit: 20,
      skip,
    });
  };

  // Socket listeners
  useEffect(() => {
    if (!conversationId || !conversation) return;

    const driverId = conversation.driver._id;

    console.log("Opening chat, joining room...");

    // Join conversation room
    socket.emit("join_room", { clientId: useAppStore.getState().id, driverId });

    // Handle room joined
    const handleRoomJoined = (data: {
      conversationId: string;
      success: boolean;
    }) => {
      console.log("Room joined:", data.conversationId);

      // Request message history
      socket.emit("get_messages", { conversationId: data.conversationId });
    };

    // Handle message history loaded
    const handleMessagesLoaded = (data: MessagesLoadedData): void => {
      const formatted = data.messages.map(formatMessage);

      // If skip > 0, prepend older messages
      if (data.skip > 0) {
        setMessages((prev) => [...prev, ...formatted]);
      } else {
        // Initial load
        setMessages(formatted);
      }

      setSkip((prev) => prev + data.messages.length);
      setLoadEarlier(data.hasMore);
      setIsLoadingEarlier(false);
    };

    // Handle incoming messages
    const handleReceiveMessage = (msg: any) => {
      console.log("New message received:", msg);
      const formattedMessage = formatMessage(msg);
      setMessages((prev) => GiftedChat.append(prev, [formattedMessage]));
    };

    // Handle errors
    const handleMessageError = (error: any) => {
      console.error("Message error:", error);
      // You can show a toast/alert here
    };

    // Register listeners
    socket.on("room_joined", handleRoomJoined);
    socket.on("messages_loaded", handleMessagesLoaded);
    socket.on("receive_message", handleReceiveMessage);
    socket.on("message_error", handleMessageError);

    // Cleanup
    return () => {
      console.log("Cleaning up chat listeners");
      socket.off("room_joined", handleRoomJoined);
      socket.off("messages_loaded", handleMessagesLoaded);
      socket.off("receive_message", handleReceiveMessage);
      socket.off("message_error", handleMessageError);
    };
  }, [conversationId, conversation, socket, formatMessage]);

  // Send message via socket
  const onSend = useCallback(
    (newMessages: IMessage[] = []) => {
      if (!conversation || !conversationId) {
        console.error("Missing required data for sending message");
        return;
      }

      newMessages.forEach((message) => {
        console.log("Sending message senderID", message.user._id);
        console.log("Sending message receiverID", conversation.driver._id);

        // Emit to socket
        socket.emit("send_message", {
          conversationId,
          senderId: useAppStore.getState().id,
          name: useAppStore.getState().name,
          receiverId: conversation.driver._id,
          text: message.text || "",
          image: message.image,
        });

        // Optimistically add to UI (will be confirmed by receive_message event)
        // But we don't add here since backend will broadcast it back
      });
    },
    [conversation, conversationId, socket]
  );

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Pick image from gallery
  const pickImage = async () => {
    const result = await openGallery();
    if (result && !result.canceled && result.assets[0]) {
      const newMessage: IMessage = {
        _id: Math.random().toString(),
        text: "",
        createdAt: new Date(),
        user: {
          _id: useAppStore.getState().id!, // ✅ Instead of _id: 1
          name: "Me",
        },
        image: result.assets[0].uri,
      };
      onSend([newMessage]);
    }
  };

  const takePhoto = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();

    if (status !== "granted") {
      alert("Sorry, we need camera permissions!");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const newMessage: IMessage = {
        _id: Math.random().toString(),
        text: "",
        createdAt: new Date(),
        user: {
          _id: useAppStore.getState().id!,
          name: "Me",
        },
        image: result.assets[0].uri,
      };
      onSend([newMessage]);
    }
  };

  const renderInputToolbar = () => {
    return (
      <View className="px-2 py-3 border-t border-gray-700 bg-secondary">
        <View className="flex-row items-end gap-3">
          <View className="flex-row items-center gap-3 h-11">
            {/* Camera */}
            <Pressable onPress={takePhoto}>
              <Ionicons
                name="camera"
                size={Platform.OS === "ios" ? 32 : 28}
                color="#FFA840"
              />
            </Pressable>
            {/* Gallery */}
            <Pressable onPress={pickImage}>
              <Ionicons
                name="image"
                size={Platform.OS === "ios" ? 32 : 28}
                color="#FFA840"
              />
            </Pressable>
          </View>
          {/* Text input */}
          <View className="flex-1 px-2 bg-white rounded-2xl">
            <TextInput
              placeholder="Type a message..."
              placeholderTextColor="#9FABB4"
              value={text}
              onChangeText={setText}
              multiline
              className="text-base py-3"
              style={{
                maxHeight: 120,
                textAlignVertical: "top", // recommended for chat inputs
              }}
            />
          </View>

          <View className="flex-row items-center gap-3 h-11">
            {/* Emoji */}
            <Pressable>
              <Ionicons
                name="happy"
                size={Platform.OS === "ios" ? 32 : 28}
                color="#FFA840"
              />
            </Pressable>
            {/* Send */}
            <Pressable
              hitSlop={20}
              onPress={() => {
                if (!text.trim()) return;
                onSend([
                  {
                    _id: Date.now(),
                    text,
                    createdAt: new Date(),
                    user: { _id: useAppStore.getState().id! }, // ✅ Use your actual ID
                  },
                ]);
                setText("");
              }}
            >
              <Ionicons
                name="send"
                size={Platform.OS === "ios" ? 32 : 24}
                color="#FFA840"
              />
            </Pressable>
          </View>
        </View>
      </View>
    );
  };

  if (isPending) {
    return (
      <View className="flex-1 items-center justify-center bg-secondary">
        <ActivityIndicator size="large" color="#FFA840" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-secondary">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={
          Platform.OS === "ios"
            ? "padding"
            : keyboardVisible
              ? "height"
              : undefined
        }
        keyboardVerticalOffset={0} // Adjust this offset for iOS
      >
        {/* Custom Header */}
        <View className="flex-row items-center justify-between px-4 py-3 bg-secondary">
          <View className="flex-row items-center flex-1 gap-2">
            <Pressable
              onPress={() => {
                socket.emit("leave_room", { conversationId });
                queryClient.invalidateQueries({
                  queryKey: ["conversations"],
                });
                router.back();
              }}
              className="p-2"
            >
              <Ionicons
                name="chevron-back"
                size={Platform.OS === "ios" ? 30 : 24}
                color="#FFA840"
              />
            </Pressable>

            <Image
              source={require("@/assets/images/user.png")}
              style={{ width: 40, height: 40, borderRadius: 999 }}
              contentFit="contain"
            />

            <View className="flex-1">
              <Text className="text-base font-bold text-white">
                {conversation?.driver.name}
              </Text>
              <Text className="text-xs ml-0.5 text-gray-300">Driver</Text>
            </View>
          </View>

          <Pressable hitSlop={20}>
            <Ionicons
              name="call"
              size={Platform.OS === "ios" ? 28 : 24}
              color="#FFA840"
            />
          </Pressable>
        </View>

        {/* Gifted Chat */}
        <GiftedChat
          messages={messages}
          onSend={(messages) => onSend(messages)}
          user={{
            _id: useAppStore.getState().id!,
            name: useAppStore.getState().name || "Me",
          }}
          loadEarlier={loadEarlier}
          onLoadEarlier={handleLoadEarlier}
          isLoadingEarlier={isLoadingEarlier}
          renderBubble={renderBubble}
          renderInputToolbar={renderInputToolbar} // custom toolbar
          renderSend={() => null} // disable GiftedChat's default send
          keyboardShouldPersistTaps="handled"
          isKeyboardInternallyHandled={false}
          renderChatEmpty={renderChatEmpty} // Add this
          listViewProps={
            {
              contentContainerStyle: {
                paddingTop: 10,
              },
            } as any
          }
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default Message;

// Custom Bubble
const renderBubble = (props: any) => {
  return (
    <Bubble
      {...props}
      wrapperStyle={{
        right: {
          backgroundColor: "#FFA840",
        },
        left: {
          backgroundColor: "#E5E5E5",
        },
      }}
      textStyle={{
        right: {
          color: "white",
          fontSize: 15,
        },
        left: {
          color: "#1F2937",
          fontSize: 15,
        },
      }}
    />
  );
};

const renderChatEmpty = () => {
  return (
    <View
      className="pb-20 items-center px-6"
      style={{ transform: [{ scaleY: -1 }, { scaleX: -1 }] }}
    >
      <Ionicons name="chatbubbles-outline" size={100} color="#9CA3AF" />
      <Text className="text-gray-300 text-xl font-semibold mt-4">
        No conversation yet
      </Text>
      <Text className="text-gray-400 text-base text-center mt-2">
        Start a conversation with the driver
      </Text>
    </View>
  );
};
