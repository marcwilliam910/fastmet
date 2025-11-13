import BookSheet from "@/components/maps/BookSheet";
import MapScreen from "@/components/maps/MapScreen";
import {useBookStore} from "@/store/useBookStore";
import {useFocusEffect} from "expo-router";
import React, {useCallback, useState} from "react";
import {StatusBar, View} from "react-native";
import {Region} from "react-native-maps";
import {SafeAreaView} from "react-native-safe-area-context";

const Book = () => {
  const pickUp = useBookStore((state) => state.pickUp);
  const dropOff = useBookStore((state) => state.dropOff);
  const routeData = useBookStore((state) => state.routeData);
  const [region, setRegion] = useState<Region | null>(null);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setHidden(true);
      return () => StatusBar.setHidden(false);
    }, [])
  );

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
    </SafeAreaView>
  );
};

export default Book;
