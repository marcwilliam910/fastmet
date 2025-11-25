import BookSheet from "@/components/maps/BookSheet";
import MapScreen from "@/components/maps/MapScreen";
import { useBookStore } from "@/store/useBookStore";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React, { useState } from "react";
import { Pressable, View } from "react-native";
import { Region } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

const Book = () => {
  const pickUp = useBookStore((state) => state.pickUp);
  const dropOff = useBookStore((state) => state.dropOff);
  const routeData = useBookStore((state) => state.routeData);
  const [region, setRegion] = useState<Region | null>(null);
  const navigation = useNavigation();

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white" }}
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

        {/* Floating burger */}
        <Pressable
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
          className="absolute p-2 bg-white rounded-full shadow-lg top-6 left-4 active:scale-105 active:opacity-80"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 2, height: 2 },
            shadowOpacity: 0.25,
            shadowRadius: 3.84,
            elevation: 5,
          }}
        >
          <Ionicons name="menu" size={28} color="#FFA840" />
        </Pressable>
      </View>

      <BookSheet />
    </SafeAreaView>
  );
};

export default Book;
