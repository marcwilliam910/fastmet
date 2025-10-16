import {Ionicons} from "@expo/vector-icons";
import {router} from "expo-router";
import React from "react";
import {Pressable, Text, View} from "react-native";

const HeaderRoot = ({
  text,
  additonalMethod,
}: {
  text: string;
  additonalMethod?: () => void;
}) => {
  return (
    <View className="relative flex-row items-center justify-center px-6 py-2">
      <Pressable
        className="absolute left-5 top-1.5"
        onPress={() => {
          additonalMethod?.();
          router.back();
        }}
      >
        <Ionicons name="chevron-back" size={28} color="#FFA840" />
      </Pressable>
      <Text className="text-lg font-semibold text-gray-800">{text}</Text>
    </View>
  );
};

export default HeaderRoot;
