import BookSheet from "@/components/maps/BookSheet";
import MapScreen from "@/components/maps/MapScreen";
import React from "react";
import {StatusBar, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

const Book = () => {
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: "white"}}
      edges={["right", "bottom", "left"]}
    >
      <View className="relative flex-1">
        <MapScreen />
      </View>

      <BookSheet />

      <StatusBar hidden />
    </SafeAreaView>
  );
};

export default Book;
