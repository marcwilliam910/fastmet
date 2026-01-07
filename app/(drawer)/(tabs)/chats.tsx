import NotLoggedIn from "@/components/notLoggedIn";
import { useAuth } from "@/hooks/useAuth";
import { useConversations } from "@/queries/conversation";
import { ConversationResponse } from "@/types/chat";
import { STATIC_IMAGES } from "@/utils/constants";
import { formatLastMessageTime } from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import {
  ActivityIndicator,
  Button,
  FlatList,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

const Chats = () => {
  const { isLoggedIn } = useAuth();

  const {
    data,
    isPending,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useConversations(10);

  if (!isLoggedIn) {
    return <NotLoggedIn />;
  }

  if (isPending)
    return (
      <View className="flex-1 items-center bg-white justify-center">
        <ActivityIndicator size="large" color="#FFA840" />
      </View>
    );
  if (error)
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <Text className="text-lg font-semibold text-gray-500">
          {error.message}
        </Text>
        <Button title="Retry" onPress={() => refetch()} />
      </View>
    );

  const conversations = data?.pages.flatMap((page) => page.conversations) ?? [];

  return (
    <View className="flex-1 gap-6 py-6 bg-white">
      {conversations.length === 0 ? (
        <View className="flex-1 items-center justify-center">
          {/* show no message screen */}
          <Text className="text-center text-lg text-gray-400">
            You have no messages
          </Text>
        </View>
      ) : (
        <>
          <View
            className="flex-row items-center bg-ctaSecondary mx-4 px-4 rounded-full"
            style={{
              height: Platform.OS === "ios" ? 54 : 46,
            }}
          >
            <TextInput
              placeholder="Search..."
              placeholderTextColor="#9FABB4"
              className="flex-1 text-base leading-[18px]"
            />
            <Ionicons
              name="search"
              size={Platform.OS === "ios" ? 24 : 20}
              color="#9FABB4"
            />
          </View>

          <View>
            <FlatList
              data={conversations}
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => <MessageCard item={item} />}
              keyExtractor={(item) => item._id}
              contentContainerStyle={{ gap: 3, paddingBottom: 60 }}
              // pull to refresh
              refreshing={isPending}
              onRefresh={refetch}
              // infinite scroll
              onEndReached={() => {
                if (hasNextPage && !isFetchingNextPage) {
                  fetchNextPage();
                }
              }}
              onEndReachedThreshold={0.3}
              // Loading indicator at bottom
              ListFooterComponent={() => {
                if (isFetchingNextPage) {
                  return (
                    <View className="py-4">
                      <ActivityIndicator size="small" color="#FFA840" />
                    </View>
                  );
                }
                return null;
              }}
            />
          </View>
        </>
      )}
    </View>
  );
};

export default Chats;

const MessageCard = ({ item }: { item: ConversationResponse }) => {
  return (
    <Pressable
      className="flex-row items-center gap-4 px-4 py-2 active:bg-ctaSecondary"
      onPress={() =>
        router.push({
          pathname: "/message",
          params: { conversationId: item._id },
        })
      }
    >
      <Image
        source={
          item.driver.profilePictureUrl
            ? { uri: item.driver.profilePictureUrl }
            : STATIC_IMAGES.userPlaceholder
        }
        style={{ width: 50, height: 50, borderRadius: 999 }}
        contentFit="cover"
      />
      <View className="flex-1 gap-1">
        <View className="flex-row items-center justify-between">
          <Text
            className={`font-bold max-w-[60%] ${item.unreadCount.client > 0 ? "font-bold" : ""}`}
            numberOfLines={1}
          >
            {item.driver.name}
          </Text>
          <Text
            className={`text-xs text-gray-400 ${item.unreadCount.client > 0 ? "font-bold" : ""}`}
          >
            {formatLastMessageTime(item.lastMessageAt)}
          </Text>
        </View>
        <View className="flex-row items-center justify-between pl-0.5">
          <Text
            className={`text-sm max-w-[80%] ${item.unreadCount.client > 0 ? "font-extrabold text-black" : "text-gray-600 font-medium"}`}
            numberOfLines={1}
          >
            {item.lastMessageBy === "client" ? "You: " : ""}
            {item.lastMessage}
          </Text>
          {item.unreadCount.client > 0 ? (
            <View className="bg-red-500 size-5 items-center justify-center rounded-full">
              <Text className="text-xs font-bold text-white">
                {item.unreadCount.client}
              </Text>
            </View>
          ) : item.unreadCount.driver === 0 ? (
            <Text className="text-xs font-bold text-white">seen</Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
};
