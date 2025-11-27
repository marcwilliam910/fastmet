import { Driver } from "@/types/book";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet from "@gorhom/bottom-sheet";
import { router } from "expo-router";
import React, { useMemo, useRef } from "react";
import { Dimensions, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ViewOnMapSheet({ driver }: { driver: Driver }) {
  const sheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = Dimensions.get("window");

  // take consideration the inset bottom
  const snapPoints = useMemo(() => {
    const first = 0.2 * screenHeight + insets.bottom;

    return [first];
  }, [insets.bottom, screenHeight]);

  return (
    <BottomSheet
      ref={sheetRef}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      handleIndicatorStyle={{ backgroundColor: "#FFA840" }}
      enableContentPanningGesture={false} // 👈 This is the key
      containerStyle={{ zIndex: 20 }}
    >
      <View className="flex-row items-center justify-center px-4 ">
        <Pressable
          onPress={() => router.back()}
          className="absolute left-4 -top-1"
        >
          <Ionicons name="chevron-back-outline" size={28} color="#FFA840" />
        </Pressable>
        <Text className="text-lg font-semibold">On the way</Text>
      </View>

      <View className="px-4 py-3">
        <Text className="mb-1 text-sm font-semibold text-gray-500">Driver</Text>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center justify-center gap-2">
            <Ionicons name="person-circle" size={54} color="#F7931E" />
            <View>
              <Text className="text-lg font-semibold text-gray-800">
                {driver.name}
              </Text>
              <View className="flex-row">
                {[...Array(Math.floor(driver.rating))].map((_, i) => (
                  <Ionicons key={i} name="star" size={20} color="#FFD700" />
                ))}
                {[...Array(5 - Math.floor(driver.rating))].map((_, i) => (
                  <Ionicons
                    key={i}
                    name="star-outline"
                    size={20}
                    color="#FFD700"
                  />
                ))}
              </View>
            </View>
          </View>

          <View className="flex-row gap-6 mr-2">
            <Pressable className="items-center active:scale-110">
              <Ionicons name="call" size={28} color="#F7931E" />
              <Text className="text-gray-600">Call</Text>
            </Pressable>
            <Pressable className="items-center active:scale-110">
              <Ionicons name="chatbubble-ellipses" size={28} color="#F7931E" />
              <Text className="text-gray-600">Chat</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </BottomSheet>
  );
}
