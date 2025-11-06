import { useBookStore } from "@/store/useBookStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import { Pressable, Text, View } from "react-native";

export default function LocationInputs({
  onOpenSearch,
}: {
  onOpenSearch: (type: "pickup" | "dropoff") => void;
}) {
  const pickUp = useBookStore((state) => state.pickUp);
  const dropOff = useBookStore((state) => state.dropOff);

  return (
    <View className="justify-between items-center pl-8 ml-4 mr-3 gap-4 border-l-2 border-dashed border-gray-400 relative">
      {/* Pickup Field */}
      <Pressable
        onPress={() => onOpenSearch("pickup")}
        className="flex-row items-center px-4 py-2 border-2 border-gray-200 bg-white rounded-xl  active:scale-[0.98] active:border-lightPrimary w-full"
      >
        <View className="flex-1 ml-1">
          <Text className="text-xs text-gray-500 font-medium mb-0.5">
            PICKUP
          </Text>
          <Text
            className="text-base text-gray-900 font-medium"
            numberOfLines={1}
          >
            {pickUp?.address || "Choose pickup location"}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </Pressable>

      {/* Dropoff Field */}
      <Pressable
        onPress={() => onOpenSearch("dropoff")}
        className="flex-row items-center px-4 py-2 border-2 border-gray-200 bg-white rounded-xl active:scale-[0.98] active:border-lightPrimary w-full"
      >
        <View className="flex-1 ml-1">
          <Text className="text-xs text-gray-500 font-medium mb-0.5">
            DROP OFF
          </Text>
          <Text
            className="text-base text-gray-900 font-medium"
            numberOfLines={1}
          >
            {dropOff?.address || "Choose drop off location"}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </Pressable>

      {/* Location Markers */}
      <View className="absolute -left-4 top-0 bg-white pt-4 rounded-full">
        <View className="bg-blue-500 rounded-full p-1.5">
          <Ionicons name="location-sharp" size={16} color="white" />
        </View>
      </View>

      <View className="absolute -left-4 bottom-0 bg-white pb-4 rounded-full">
        <View className="bg-red-500 rounded-full p-1.5">
          <Ionicons name="locate-sharp" size={16} color="white" />
        </View>
      </View>
    </View>
  );
}
