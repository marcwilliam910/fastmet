import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Platform, View } from "react-native";

export default function StarDisplay({ rating }: { rating: number }) {
  return (
    <View className="flex-row items-center gap-1">
      {/* Star display */}
      <View className="flex-row">
        {[...Array(5)].map((_, index) => {
          const starNumber = index + 1;

          if (rating >= starNumber) {
            // Full star
            return (
              <Ionicons
                key={index}
                name="star"
                size={Platform.OS === "ios" ? 20 : 18}
                color="#FFD700"
              />
            );
          } else if (rating >= starNumber - 0.5) {
            // Half star
            return (
              <Ionicons
                key={index}
                name="star-half"
                size={Platform.OS === "ios" ? 20 : 18}
                color="#FFD700"
              />
            );
          } else {
            // Empty star
            return (
              <Ionicons
                key={index}
                name="star-outline"
                size={Platform.OS === "ios" ? 20 : 18}
                color="#FFD700"
              />
            );
          }
        })}
      </View>

      {/* Rating number and count
  <Text className="text-gray-600 text-sm ml-1">
    {driver.rating.average.toFixed(1)} ({driver.rating.count})
  </Text> */}
    </View>
  );
}
