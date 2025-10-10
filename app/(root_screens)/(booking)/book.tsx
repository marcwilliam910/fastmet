import BookSheet from "@/components/maps/BookSheet";
import LocationInputs from "@/components/maps/LocationInputs";
import MapScreen from "@/components/maps/MapScreen";
import SheetButton from "@/components/maps/SheetButton";
import React from "react";
import {View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

const Book = () => {
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

      <SheetButton />
    </SafeAreaView>
  );
};

export default Book;
