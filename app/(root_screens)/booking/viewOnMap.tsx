import LiveTrackingMapScreen from "@/components/maps/LiveTrackingMapScreen";
import StarDisplay from "@/components/StarDisplay";
import { useBooking } from "@/queries/bookingQueries";
import { useAppStore } from "@/store/useAppStore";
import { createConversationId } from "@/utils/helpers/booking";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import { Region } from "react-native-maps";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function ViewOnMap() {
  const [region, setRegion] = useState<Region | null>(null);
  const { bookingId, shouldGoBack } = useLocalSearchParams<{
    bookingId: string;
    shouldGoBack: string;
  }>();
  const insets = useSafeAreaInsets();

  const { data: booking, isPending, error } = useBooking(bookingId);

  if (isPending)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#FFA840" />
      </View>
    );
  if (error)
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-semibold text-gray-500">
          {error.message}
        </Text>
      </View>
    );

  const handleBack = () => {
    router.back();
    if (!shouldGoBack || shouldGoBack !== "true") {
      router.push("/(drawer)/(tabs)/request?tab=active");
    }
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white" }}
      edges={["right", "bottom", "left"]}
    >
      <View className="relative flex-1">
        <LiveTrackingMapScreen
          pickUp={booking.pickUp}
          dropOff={booking.dropOff}
          routeData={booking.routeData}
          region={region}
          setRegion={setRegion}
          bookingId={bookingId}
          driver={booking.driver}
        />
      </View>

      <View className="absolute bottom-0 left-0 right-0">
        <View
          className="px-5 py-6 justify-center gap-3 w-full
        bg-white rounded-t-3xl"
          style={{ paddingBottom: insets.bottom + 15 }}
        >
          <View className="flex-row items-center justify-center px-4">
            <Pressable
              onPress={handleBack} // TODO: infinite routing
              className="absolute left-0 -top-1"
              hitSlop={20}
            >
              <Ionicons
                name="chevron-back-outline"
                size={Platform.OS === "ios" ? 30 : 28}
                color="#FFA840"
              />
            </Pressable>
            <Text className="text-lg font-semibold">On the way</Text>
          </View>

          <View>
            <Text className="mb-1 text-sm font-semibold text-gray-500">
              Driver
            </Text>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center justify-center gap-2">
                {booking.driver.profilePictureUrl ? (
                  <Pressable className="w-[44px] h-[44px] rounded-full overflow-hidden">
                    <Image
                      source={{ uri: booking.driver.profilePictureUrl }}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                    />
                  </Pressable>
                ) : (
                  <Ionicons name="person-circle" size={48} color="#F7931E" />
                )}
                <View>
                  <Text className="text-lg font-semibold text-gray-800">
                    {booking.driver.name}
                  </Text>
                  <View className="flex-row items-center gap-2 ">
                    <StarDisplay rating={booking.driver.rating} />
                    <Text className="text-sm font-semibold text-gray-600">
                      ({booking.driver.rating})
                    </Text>
                  </View>
                </View>
              </View>

              <View className="flex-row gap-6 mr-2">
                <Pressable
                  className="items-center active:scale-110"
                  hitSlop={20}
                  onPress={() =>
                    router.push({
                      pathname: "/message",
                      params: {
                        conversationId: createConversationId(
                          useAppStore.getState().id!,
                          booking.driver.id,
                        ),
                      },
                    })
                  }
                >
                  <Ionicons
                    name="chatbubble-ellipses"
                    size={28}
                    color="#F7931E"
                  />
                  <Text className="text-gray-600">Chat</Text>
                </Pressable>
                <Pressable
                  className="items-center active:scale-110"
                  hitSlop={20}
                >
                  <Ionicons name="call" size={28} color="#F7931E" />
                  <Text className="text-gray-600">Call</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
