import {Ionicons} from "@expo/vector-icons";
import BottomSheet, {BottomSheetView} from "@gorhom/bottom-sheet";
import {Image} from "expo-image";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import {SafeAreaView, useSafeAreaInsets} from "react-native-safe-area-context";

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
    description:
      "Ideal for quick solo trips or small deliveries. Seats 1–2 people and carries light cargo up to 20 kg.",
  },
  {
    id: 2,
    name: "Sedan",
    img: require("@/assets/vehicle/car.png"),
    description:
      "Comfortable for city or short-distance travel. Seats up to 4 passengers with moderate luggage space in the trunk.",
  },
  {
    id: 3,
    name: "Small Pickup",
    img: require("@/assets/vehicle/open_truck.png"),
    description:
      "Suitable for light hauling or small business use. Can transport goods up to 500 kg with limited passenger seating.",
  },
  {
    id: 4,
    name: "MPV-SUV",
    img: require("@/assets/vehicle/suv.png"),
    description:
      "Spacious and versatile for family or group travel. Seats 5–7 passengers with extra cargo room for luggage or equipment.",
  },
  {
    id: 5,
    name: "FastMet Truck",
    img: require("@/assets/vehicle/fastmet_truck.png"),
    description:
      "Heavy-duty truck for large-scale transport. Handles up to 3 tons of cargo, ideal for logistics and industrial hauling.",
  },
];

const BookSheet = ({isExpanded}: {isExpanded: boolean}) => {
  const sheetRef = useRef<BottomSheet>(null);
  const [selectedLoad, setSelectedLoad] = useState(loadOptions[0]);
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0].id);
  const insets = useSafeAreaInsets();
  const {height: screenHeight} = Dimensions.get("window");
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedInfo, setSelectedInfo] = useState(vehicles[0]);

  // Convert 40% to actual pixels, then subtract inset.bottom
  const snapPoints = useMemo(() => {
    const first = 0.17 * screenHeight + insets.bottom;
    const second = 0.4 * screenHeight + insets.bottom;
    return [first, second];
  }, [insets.bottom, screenHeight]);

  useEffect(() => {
    if (isExpanded) sheetRef.current?.snapToIndex(1);
    else sheetRef.current?.snapToIndex(0);
  }, [isExpanded]);

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
            <View key={v.id} className="relative items-center gap-1">
              <Pressable
                className={`items-center gap-1 px-4 py-1 rounded-lg ${
                  selectedVehicle === v.id ? "border border-[#fad19f]" : ""
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
              <Pressable
                className="absolute -top-2 -right-2"
                onPress={() => {
                  setSelectedInfo(v);
                  setModalVisible(true);
                }}
              >
                <Ionicons name="information-circle" size={22} color="#FFA840" />
              </Pressable>
            </View>
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
      <InfoModal
        visible={modalVisible}
        setModalVisible={setModalVisible}
        selectedInfo={selectedInfo}
      />
    </BottomSheet>
  );
};

export default BookSheet;

export const InfoModal = ({
  visible,
  setModalVisible,
  selectedInfo,
}: {
  visible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedInfo: (typeof vehicles)[0];
}) => {
  return (
    <Modal
      visible={visible}
      onRequestClose={() => setModalVisible(false)}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <SafeAreaView className="flex-1 p-4 bg-white">
        <View className="absolute flex-row top-6 right-6">
          <Pressable onPress={() => setModalVisible(false)}>
            <Ionicons name="close" size={30} color="#FFA840" />
          </Pressable>
        </View>

        <View className="items-center gap-3 mt-4">
          <Image
            source={selectedInfo.img}
            style={{width: 150, height: 150}}
            contentFit="contain"
          />
          <Text className="mt-4 text-xl font-semibold">
            {selectedInfo.name}
          </Text>
          <Text className="px-4 mt-2 text-center text-gray-600">
            {selectedInfo.description}
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
};
