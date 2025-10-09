import BookSheet from "@/components/maps/BookSheet";
import LocationInputs from "@/components/maps/LocationInputs";
import MapScreen from "@/components/maps/MapScreen";
import {router} from "expo-router";
import React from "react";
import {Pressable, Text, View} from "react-native";
import {SafeAreaView, useSafeAreaInsets} from "react-native-safe-area-context";

const Book = () => {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: "white"}}
      edges={["right", "bottom", "left"]}
    >
      <View className="relative flex-1">
        {/* header inputs */}
        <LocationInputs />

        <MapScreen />
      </View>

      <BookSheet />
      {/* bottom buttons */}
      <View
        className="flex-row justify-between gap-10 px-4 py-2 bg-white"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          // bottom: insets.bottom + 10, // respect safe area
          bottom: 0,
          paddingBottom: insets.bottom + 10,
        }}
      >
        <Pressable
          className="flex-1 py-4 rounded-md bg-ctaSecondary active:bg-gray-200"
          onPress={() => router.back()}
        >
          <Text className="font-bold text-center">Cancel</Text>
        </Pressable>
        <Pressable className="flex-1 py-4 rounded-md bg-lightPrimary active:bg-darkPrimary">
          <Text className="font-bold text-center text-white">Next</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Book;
