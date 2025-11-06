import BookSheet from "@/components/maps/BookSheet";
import MapScreen from "@/components/maps/MapScreen";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Params = {
  method: "passenger" | "pasabay";
};

const Book = () => {
  const { method } = useLocalSearchParams<Params>();

  useEffect(() => {
    if (!method) router.back();
  }, [method]);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white" }}
      edges={["right", "bottom", "left"]}
    >
      <View className="relative flex-1">
        <MapScreen />
      </View>

      <BookSheet />
    </SafeAreaView>
  );
};

export default Book;
