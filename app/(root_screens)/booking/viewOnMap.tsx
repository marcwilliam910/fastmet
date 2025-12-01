import LiveTrackingMapScreen from "@/components/maps/LiveTrackingMapScreen";
import { useBooking } from "@/queries/bookingQueries";
import { Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { Region } from "react-native-maps";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function ViewOnMap() {
  const [region, setRegion] = useState<Region | null>(null);
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();
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
              onPress={() => router.back()}
              className="absolute left-0 -top-1"
            >
              <Ionicons name="chevron-back-outline" size={28} color="#FFA840" />
            </Pressable>
            <Text className="text-lg font-semibold">On the way</Text>
          </View>

          <View>
            <Text className="mb-1 text-sm font-semibold text-gray-500">
              Driver
            </Text>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center justify-center gap-2">
                <Ionicons name="person-circle" size={54} color="#F7931E" />
                <View>
                  <Text className="text-lg font-semibold text-gray-800">
                    {booking.driver.name}
                  </Text>
                  <View className="flex-row">
                    {[...Array(Math.floor(booking.driver.rating))].map(
                      (_, i) => (
                        <Ionicons
                          key={i}
                          name="star"
                          size={20}
                          color="#FFD700"
                        />
                      )
                    )}
                    {[...Array(5 - Math.floor(booking.driver.rating))].map(
                      (_, i) => (
                        <Ionicons
                          key={i}
                          name="star-outline"
                          size={20}
                          color="#FFD700"
                        />
                      )
                    )}
                  </View>
                </View>
              </View>

              <View className="flex-row gap-6 mr-2">
                <Pressable className="items-center active:scale-110">
                  <Ionicons name="call" size={28} color="#F7931E" />
                  <Text className="text-gray-600">Call</Text>
                </Pressable>
                <Pressable className="items-center active:scale-110">
                  <Ionicons
                    name="chatbubble-ellipses"
                    size={28}
                    color="#F7931E"
                  />
                  <Text className="text-gray-600">Chat</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
}
