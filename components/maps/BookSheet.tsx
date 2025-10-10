import BottomSheet, {BottomSheetView} from "@gorhom/bottom-sheet";
import {Image} from "expo-image";
import React, {useMemo, useRef, useState} from "react";
import {Dimensions, Pressable, ScrollView, Text, View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const loadOptions = [
  "Regular 1000kg",
  "Extra load 2000kg",
  "Extra load 2500kg",
  "Heavy 3000kg",
];

const vehicles = [
  {
    id: 1,
    name: "Motorcycle",
    img: require("@/assets/vehicle/motor.png"),
  },
  {
    id: 2,
    name: "Car",
    img: require("@/assets/vehicle/car.png"),
  },
  {
    id: 3,
    name: "Open Truck",
    img: require("@/assets/vehicle/open_truck.png"),
  },
  {
    id: 4,
    name: "SUV",
    img: require("@/assets/vehicle/suv.png"),
  },
  {
    id: 5,
    name: "FastMet Truck",
    img: require("@/assets/vehicle/fastmet_truck.png"),
  },
];

const BookSheet = () => {
  const sheetRef = useRef<BottomSheet>(null);
  const [selectedLoad, setSelectedLoad] = useState(loadOptions[0]);
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0].id);
  const insets = useSafeAreaInsets();
  const {height: screenHeight} = Dimensions.get("window");

  // Convert 40% to actual pixels, then subtract inset.bottom
  const snapPoints = useMemo(() => {
    const first = 0.17 * screenHeight + insets.bottom;
    const secondInPx = 0.4 * screenHeight + insets.bottom;
    return [first, secondInPx];
  }, [insets.bottom, screenHeight]);

  return (
    <BottomSheet
      ref={sheetRef}
      index={1}
      snapPoints={snapPoints}
      enableDynamicSizing={false}
      handleIndicatorStyle={{backgroundColor: "#FFA840"}}
      enableContentPanningGesture={false} // 👈 This is the key
    >
      <BottomSheetView className="flex-1 px-3 justify-evenly">
        {/* Load options */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{gap: 16, paddingVertical: 8}}
        >
          {loadOptions.map((item, index) => (
            <Pressable
              key={index}
              onPress={() => setSelectedLoad(item)}
              className={`pb-1 ${
                selectedLoad === item
                  ? "border-b-2 border-[#FFA840]"
                  : "border-b border-transparent"
              }`}
            >
              <Text
                className={`${
                  selectedLoad === item
                    ? "text-[#FFA840] font-semibold"
                    : "text-gray-500"
                }`}
              >
                {item}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Vehicle selection */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{gap: 15, padding: 10}}
        >
          {vehicles.map((v) => (
            <Pressable
              key={v.id}
              className={`items-center gap-1 px-4 py-1 rounded-lg ${
                selectedVehicle === v.id ? "bg-[#fad19f]" : ""
              }`}
              onPress={() => setSelectedVehicle(v.id)}
            >
              <Image
                source={v.img}
                style={{height: 50, width: 50}}
                contentFit="contain"
              />
              <Text
                className={`text-xs text-gray-500 ${selectedVehicle === v.id ? "font-semibold" : ""}`}
              >
                {v.name}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Summary row */}
        <View className="flex-row justify-around py-2 mt-2 border rounded-md border-lightPrimary">
          <View className="items-center gap-1">
            <Text className="text-base font-bold">₱5,000</Text>
            <Text className="text-sm font-bold text-darkPrimary">Price:</Text>
          </View>
          <View className="items-center gap-1">
            <Text className="text-base font-bold">1,000 km</Text>
            <Text className="text-sm font-bold text-darkPrimary">
              Distance:
            </Text>
          </View>
          <View className="items-center gap-1">
            <Text className="text-base font-bold">18hr : 23min</Text>
            <Text className="text-sm font-bold text-darkPrimary">Time:</Text>
          </View>
        </View>
      </BottomSheetView>
    </BottomSheet>
  );
};

export default BookSheet;
