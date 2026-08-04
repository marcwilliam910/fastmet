import {useShake} from "@/hooks/useShakeAnimation";
import {useAppStore} from "@/store/useAppStore";
import {formatLocation} from "@/utils/helpers/location";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, {useEffect, useRef} from "react";
import {
  Alert,
  Platform,
  Pressable,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import Animated from "react-native-reanimated";

export default function LocationInputs({
  onOpenSearch,
}: {
  onOpenSearch: (type: "pickup" | "dropoff") => void;
}) {
  const pickUp = useAppStore((state) => state.pickUp);
  const dropOff = useAppStore((state) => state.dropOff);
  const swapLocations = useAppStore((state) => state.swapLocations);
  const {shake, animatedStyle} = useShake();

  // Use ref to track if we're waiting for animation, persists across renders
  const animationLockRef = useRef(false);
  const lastLocationRef = useRef({pickUp, dropOff});

  useEffect(() => {
    // Only lock if location actually changed
    const locationChanged =
      lastLocationRef.current.pickUp !== pickUp ||
      lastLocationRef.current.dropOff !== dropOff;

    if (locationChanged) {
      animationLockRef.current = true;
      lastLocationRef.current = {pickUp, dropOff};

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

  const handleSwap = () => {
    if (animationLockRef.current || !pickUp || !dropOff) return;

    const success = swapLocations();
    if (!success) {
      shake();
      const message =
        "Cannot swap: one location is outside the service area for its new role.";
      if (Platform.OS === "android") {
        ToastAndroid.showWithGravity(
          message,
          ToastAndroid.LONG,
          ToastAndroid.TOP,
        );
      } else {
        Alert.alert("Swap Not Allowed", message);
      }
    }
  };

  const isLocked = animationLockRef.current;
  const canSwap = !!pickUp && !!dropOff && !isLocked;

  return (
    <Animated.View style={animatedStyle}>
      <View className="relative gap-2 justify-between items-center pl-8 mr-3 ml-4 border-l-2 border-gray-400 border-dashed">
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
        <View className="absolute top-0 -left-4 pt-4 bg-white rounded-full">
          <View className="bg-blue-500 rounded-full p-1.5">
            <Ionicons name="location-sharp" size={16} color="white" />
          </View>
        </View>

        <View className="absolute bottom-0 -left-4 pb-4 bg-white rounded-full">
          <View
            className={`bg-red-500 rounded-full p-1.5 ${!pickUp ? "opacity-50" : ""}`}
          >
            <Ionicons name="flag-outline" size={16} color="white" />
          </View>
        </View>

        {/* Swap midway on the dashed line */}
        {/* Swap midway on the dashed line */}
        {pickUp && dropOff && (
          <Pressable
            onPress={handleSwap}
            disabled={!canSwap}
            hitSlop={10}
            className={`absolute z-10 items-center justify-center bg-white border-2 rounded-full w-9 h-9 border-lightPrimary right-0 top-1/2 ${
              canSwap ? "active:bg-orange-50" : "opacity-50"
            }`}
            style={{marginTop: -18}}
          >
            <Ionicons name="swap-vertical" size={18} color="#FFA840" />
          </Pressable>
        )}
      </View>
    </Animated.View>
  );
}
