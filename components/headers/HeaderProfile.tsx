import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Platform, Pressable, Text, View } from "react-native";

const HeaderProfile = ({ title }: { title: string }) => {
  return (
    <View className="flex-row items-center justify-center">
      {/* Left: Hamburger Menu */}
      <Pressable
        className="absolute top-0 left-0"
        onPress={() => router.back()}
        hitSlop={{ top: 20, left: 20, bottom: 20, right: 20 }}
      >
        <Ionicons
          name="chevron-back"
          size={Platform.OS === "ios" ? 34 : 28}
          color="#FFA840"
        />
      </Pressable>

      {/* Center: Icon + Title */}
      <View className="w-full flex-row items-center justify-center gap-2">
        <Text className="text-lg font-bold text-white">{title}</Text>
      </View>
    </View>
  );
};

export default HeaderProfile;
