import {Ionicons} from "@expo/vector-icons";
import {router} from "expo-router";
import React from "react";
import {Pressable, Text, View} from "react-native";

const HeaderProfile = ({title}: {title: string}) => {
  return (
    <View className="flex-row items-center justify-between w-full">
      {/* Left: Hamburger Menu */}
      <Pressable onPress={() => router.back()}>
        <Ionicons name="chevron-back" size={28} color="#FFA840" />
      </Pressable>

      {/* Center: Icon + Title */}
      <View className="absolute left-0 right-0 flex-row items-center justify-center gap-2">
        <Text className="text-lg font-bold text-white">{title}</Text>
      </View>

      {/* Right: Empty spacer to balance layout */}
      <View className="w-7" />
    </View>
  );
};

export default HeaderProfile;
