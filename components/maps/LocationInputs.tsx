import { useAppStore } from "@/store/useAppStore";
import { formatLocation } from "@/utils/helper";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useRef } from "react";
import { Pressable, Text, View } from "react-native";

export default function LocationInputs({
  onOpenSearch,
}: {
  onOpenSearch: (type: "pickup" | "dropoff") => void;
}) {
  const pickUp = useAppStore((state) => state.pickUp);
  const dropOff = useAppStore((state) => state.dropOff);

  // Use ref to track if we're waiting for animation, persists across renders
  const animationLockRef = useRef(false);
  const lastLocationRef = useRef({ pickUp, dropOff });

  useEffect(() => {
    // Only lock if location actually changed
    const locationChanged =
      lastLocationRef.current.pickUp !== pickUp ||
      lastLocationRef.current.dropOff !== dropOff;

    if (locationChanged) {
      animationLockRef.current = true;
      lastLocationRef.current = { pickUp, dropOff };

      // Use requestAnimationFrame for more reliable timing
      let frameCount = 0;
      const maxFrames = 90; // ~1.5s at 60fps

      const animate = () => {
        frameCount++;
        if (frameCount < maxFrames) {
          requestAnimationFrame(animate);
        } else {
          animationLockRef.current = false;
        }
      };

      requestAnimationFrame(animate);
    }
  }, [pickUp, dropOff]);

  const handleOpenSearch = (type: "pickup" | "dropoff") => {
    // Double check lock status at press time
    if (animationLockRef.current) {
      return;
    }
    onOpenSearch(type);
  };

  const isLocked = animationLockRef.current;

  return (
    <View className="relative items-center justify-between gap-2 pl-8 ml-4 mr-3 border-l-2 border-gray-400 border-dashed">
      {/* Pickup Field */}
      <Pressable
        onPress={() => handleOpenSearch("pickup")}
        disabled={isLocked}
        className={`flex-row items-center px-4 py-2 border-2 border-gray-200 bg-white rounded-xl active:scale-[0.98]  w-full ${isLocked ? "opacity-70" : "active:border-lightPrimary"}`}
      >
        <View className="flex-1 ml-1">
          <Text className="text-xs text-gray-500 font-medium mb-0.5">
            PICKUP
          </Text>
          <Text
            className="text-base font-medium text-gray-900"
            numberOfLines={1}
          >
            {pickUp ? formatLocation(pickUp) : "Choose pickup location"}
          </Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </Pressable>

      {/* Dropoff Field */}
      <Pressable
        disabled={!pickUp || isLocked}
        onPress={() => handleOpenSearch("dropoff")}
        className={`flex-row items-center px-4 py-2 border-2 border-gray-200 bg-white rounded-xl active:scale-[0.98]  w-full ${!pickUp || isLocked ? "opacity-50" : "active:border-lightPrimary"}`}
      >
        <View className="flex-1 ml-1">
          <Text className="text-xs text-gray-500 font-medium mb-0.5">
            DROP OFF
          </Text>
          <Text
            className="text-base font-medium text-gray-900"
            numberOfLines={1}
          >
            {dropOff ? formatLocation(dropOff) : "Choose drop-off location"}
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
