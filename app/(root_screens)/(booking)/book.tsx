import BookSheet from "@/components/maps/BookSheet";
import LocationInputs from "@/components/maps/LocationInputs";
import MapScreen from "@/components/maps/MapScreen";
import SheetButton from "@/components/maps/SheetButton";
import React, {useState} from "react";
import {View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

const Book = () => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: "white"}}
      edges={["right", "bottom", "left"]}
    >
      <View className="relative flex-1">
        {/* header inputs */}
        <LocationInputs isExpanded={isExpanded} setIsExpanded={setIsExpanded} />

        <MapScreen />
      </View>

      <BookSheet isExpanded={isExpanded} />

      <SheetButton />
    </SafeAreaView>
  );
};

export default Book;
