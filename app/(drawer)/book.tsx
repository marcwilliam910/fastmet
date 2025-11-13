import BookSheet from "@/components/maps/BookSheet";
import MapScreen from "@/components/maps/MapScreen";
import {useBookStore} from "@/store/useBookStore";
import React, {useState} from "react";
import {StatusBar, View} from "react-native";
import {Region} from "react-native-maps";
import {SafeAreaView} from "react-native-safe-area-context";

const Book = () => {
  const pickUp = useBookStore((state) => state.pickUp);
  const dropOff = useBookStore((state) => state.dropOff);
  const routeData = useBookStore((state) => state.routeData);
  const [region, setRegion] = useState<Region | null>(null);

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: "white"}}
      edges={["right", "bottom", "left"]}
    >
      <View className="relative flex-1">
        <MapScreen
          pickUp={pickUp}
          dropOff={dropOff}
          routeData={routeData}
          region={region}
          setRegion={setRegion}
        />
      </View>

      <BookSheet />

      <StatusBar hidden />
    </SafeAreaView>
  );
};

export default Book;
