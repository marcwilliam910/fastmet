import {Ionicons} from "@expo/vector-icons";
import {Image} from "expo-image";
import React from "react";
import {Pressable, Text, View} from "react-native";

export default function CaptureCard({
  label,
  uri,
  onCapture,
  onClear,
}: {
  label: string;
  uri: string | null;
  onCapture: () => void;
  onClear: () => void;
}) {
  return (
    <View className="gap-2">
      <Text className="text-sm font-medium text-gray-700">
        {label} <Text className="text-red-500">*</Text>
      </Text>
      <Pressable
        onPress={onCapture}
        className="items-center justify-center h-48 border-2 border-dashed rounded-xl border-lightPrimary bg-gray-50 active:bg-gray-100"
      >
        {uri ? (
          <View className="w-full h-full overflow-hidden rounded-xl">
            <Image
              source={{uri}}
              style={{width: "100%", height: "100%"}}
              contentFit="cover"
            />
            <Pressable
              className="absolute p-2 bg-white rounded-full top-2 right-2"
              onPress={onClear}
            >
              <Ionicons name="close-outline" size={20} color="red" />
            </Pressable>
          </View>
        ) : (
          <View className="items-center gap-2">
            <Ionicons name="camera" size={32} color="#FFA840" />
            <Text className="text-sm text-gray-500">Tap to take photo</Text>
          </View>
        )}
      </Pressable>
    </View>
  );
}
