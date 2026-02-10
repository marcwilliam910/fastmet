import { ConversationResponse } from "@/types/chat";
import { STATIC_IMAGES } from "@/utils/constants";
import { formatLastMessageTime } from "@/utils/date";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

const ConversationCard = ({ item }: { item: ConversationResponse }) => {
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
            {item.driver.firstName} {item.driver.lastName}
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
          ) : item.unreadCount.driver === 0 &&
            item.lastMessageBy === "client" ? (
            <Text className="text-xs font-bold text-white">seen</Text>
          ) : null}
        </View>
      </View>
    </Pressable>
  );
};


export default ConversationCard;