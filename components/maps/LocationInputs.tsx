import {useBookStore} from "@/store/useBookStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import React from "react";
import {Pressable, Text, View} from "react-native";

export default function LocationInputs({
  onOpenSearch,
}: {
  onOpenSearch: (type: "pickup" | "dropoff") => void;
}) {
  const pickUp = useBookStore((state) => state.pickUp);
  const dropOff = useBookStore((state) => state.dropOff);

  return (
    <View className="relative items-center justify-between gap-2 pl-8 ml-4 mr-3 border-l-2 border-gray-400 border-dashed">
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
            className="text-base font-medium text-gray-900"
            numberOfLines={1}
          >
            {pickUp
              ? pickUp?.name + ", " + pickUp?.address
              : "Choose pickup location"}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </Pressable>

      {/* Dropoff Field */}
      <Pressable
        disabled={!pickUp}
        onPress={() => onOpenSearch("dropoff")}
        className={`flex-row items-center px-4 py-2 border-2 border-gray-200 bg-white rounded-xl active:scale-[0.98] active:border-lightPrimary w-full ${!pickUp ? "opacity-50" : ""}`}
      >
        <View className="flex-1 ml-1">
          <Text className="text-xs text-gray-500 font-medium mb-0.5">
            DROP OFF
          </Text>
          <Text
            className="text-base font-medium text-gray-900"
            numberOfLines={1}
          >
            {dropOff
              ? dropOff?.name + ", " + dropOff?.address
              : "Choose drop off location"}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </Pressable>

      {/* Location Markers */}
      <View className="absolute top-0 pt-4 bg-white rounded-full -left-4">
        <View className="bg-blue-500 rounded-full p-1.5">
          <Ionicons name="location-sharp" size={16} color="white" />
        </View>
      </View>

      <View className="absolute bottom-0 pb-4 bg-white rounded-full -left-4">
        <View
          className={`bg-red-500 rounded-full p-1.5 ${!pickUp ? "opacity-50" : ""}`}
        >
          <Ionicons name="locate-sharp" size={16} color="white" />
        </View>
      </View>
    </View>
  );
}
