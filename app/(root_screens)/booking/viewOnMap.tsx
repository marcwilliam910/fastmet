import MapScreen from "@/components/maps/MapScreen";
import ViewOnMapSheet from "@/components/maps/ViewOnMapSheet";
import { useBooking } from "@/queries/bookingQueries";
import { useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Text, View } from "react-native";
import { Region } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ViewOnMap() {
  const [region, setRegion] = useState<Region | null>(null);
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();

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
        <MapScreen
          pickUp={booking.pickUp}
          dropOff={booking.dropOff}
          routeData={booking.routeData}
          region={region}
          setRegion={setRegion}
        />
      </View>

      <ViewOnMapSheet driver={booking.driver} />
    </SafeAreaView>
  );
}
