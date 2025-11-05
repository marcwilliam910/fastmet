import { useBookStore } from "@/store/useBookStore";
import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useEffect, useRef } from "react";
import { Animated, Easing, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LocationInputs({
  isExpanded,
  setIsExpanded,
  onOpenSearch,
}: {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
  onOpenSearch: (type: "pickup" | "dropoff") => void;
}) {
  const inset = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => setIsExpanded((prev) => !prev);
  const pickUp = useBookStore((state) => state.pickUp);
  const dropOff = useBookStore((state) => state.dropOff);

  useEffect(() => {
    Animated.timing(slideAnim, {
      toValue: isExpanded ? 0 : -150,
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
  }, [isExpanded, slideAnim]);

  return (
    <View
      className="absolute left-0 right-0 z-10"
      style={{ marginTop: inset.top }}
    >
      <Animated.View
        style={{
          transform: [{ translateY: slideAnim }],
          opacity: slideAnim.interpolate({
            inputRange: [-150, 0],
            outputRange: [0, 1],
          }),
        }}
        className="gap-2 px-4"
      >
        <Pressable
          onPress={() => onOpenSearch("pickup")}
          className="flex-row items-center px-2 py-3 bg-white rounded-md"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 15,
          }}
        >
          <Ionicons name="location-sharp" size={24} color="green" />
          <Text
            className="flex-1 text-base text-gray-700 ml-2"
            numberOfLines={1}
          >
            {pickUp?.address || "Pickup location"}
          </Text>
        </Pressable>

        {/* Dropoff Field */}
        <Pressable
          onPress={() => onOpenSearch("dropoff")}
          className="flex-row items-center px-2 py-3 bg-white rounded-md"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 15,
          }}
        >
          <Ionicons name="location-sharp" size={24} color="red" />
          <Text
            className="flex-1 text-base text-gray-700 ml-2"
            numberOfLines={1}
          >
            {dropOff?.address || "Drop point location"}
          </Text>
        </Pressable>

        {/* Expand Button */}
        <Pressable
          className="items-center self-end justify-center bg-white rounded-full size-9 active:bg-gray-100"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 15,
          }}
          onPress={toggleExpand}
        >
          <Ionicons name={"chevron-up"} size={22} color="#FFA840" />
        </Pressable>
      </Animated.View>

      {/* Toggle Button when collapsed */}
      {!isExpanded && (
        <View className="absolute top-0 left-0 right-0 z-20">
          <Pressable
            className="items-center self-center justify-center bg-white rounded-full size-10 active:bg-gray-100"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 15,
            }}
            onPress={toggleExpand}
          >
            <Ionicons name="chevron-down" size={24} color="#FFA840" />
          </Pressable>
        </View>
      )}
    </View>
  );
}
