import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Dimensions,
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const vehicles = [
  {
    id: "1",
    name: "Motorcycle",
    img: require("@/assets/vehicle/motor.png"),
    desc: "Ideal for fast solo rides or small deliveries. Carries 1 passenger.",
    price: 100,
  },
  {
    id: "2",
    name: "Sedan",
    img: require("@/assets/vehicle/car.png"),
    desc: "Perfect for city trips and comfortable rides. Fits up to 4 passengers.",
    price: 200,
  },
  {
    id: "3",
    name: "MPV/SUV",
    img: require("@/assets/vehicle/suv.png"),
    desc: "Spacious and powerful for long trips or groups. Fits up to 6 passengers.",
    price: 300,
  },
];

const BookSheet = ({ isExpanded }: { isExpanded: boolean }) => {
  const sheetRef = useRef<BottomSheet>(null);
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0].id);
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = Dimensions.get("window");
  const [paymentMethod, setPaymentMethod] = useState("");

  const [modalVisible, setModalVisible] = useState(false);

  // Convert 40% to actual pixels, then subtract inset.bottom
  const snapPoints = useMemo(() => {
    const first = 0.17 * screenHeight + insets.bottom;
    const second = 0.5 * screenHeight + insets.bottom;
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
      handleIndicatorStyle={{ backgroundColor: "#FFA840" }}
      enableContentPanningGesture={false} // 👈 This is the key
    >
      <View className="flex-row justify-between pb-5 px-3">
        <Pressable onPress={() => router.back()}>
          <Ionicons name="chevron-back" color="#FFA840" size={26} />
        </Pressable>
        <Text className="text-lg font-bold">Passenger Ride</Text>
        <Pressable onPress={() => setModalVisible(true)}>
          <Ionicons name="information-circle" color="#FFA840" size={24} />
        </Pressable>
      </View>
      <BottomSheetScrollView className="flex-1 px-3">
        {/* Vehicle selection */}
        <View className="px-5 flex-row justify-between">
          {vehicles.map((v) => (
            <View key={v.id} className="relative items-center gap-1">
              <Pressable
                className={`items-center gap-3 px-4 py-2 rounded-lg ${
                  selectedVehicle === v.id ? "border-2 border-lightPrimary" : ""
                }`}
                onPress={() => setSelectedVehicle(v.id)}
              >
                <Text
                  className={`text-xs text-gray-500 ${selectedVehicle === v.id ? "font-semibold" : ""}`}
                >
                  {v.name}
                </Text>
                <Image
                  source={v.img}
                  style={{ height: 40, width: 54 }}
                  contentFit="contain"
                />
                <Text className="text-xs text-gray-500">Php {v.price}</Text>
              </Pressable>
            </View>
          ))}
        </View>
        <View style={{ paddingBottom: insets.bottom + 60, marginTop: 20 }}>
          {/* Section Header */}
          <Text className="text-base font-semibold text-gray-800 mb-3">
            Payment Method
          </Text>

          {/* Cash Payment Option */}
          <Pressable
            onPress={() => setPaymentMethod("cash")}
            className={`flex-row items-center justify-between rounded-xl border px-4 py-3 mb-3 ${
              paymentMethod === "cash"
                ? "border-[#FFA840] bg-[#FFF6EB]"
                : "border-gray-300 bg-white"
            }`}
          >
            <View className="flex-row items-center gap-3">
              <View className="h-6 w-6 bg-lightPrimary/20 rounded-full items-center justify-center">
                <Text className="text-lightPrimary font-bold">₱</Text>
              </View>
              <View>
                <Text className="text-sm font-medium text-gray-800">
                  Cash Payment
                </Text>
                <Text className="text-xs text-gray-500">
                  Pay directly to driver
                </Text>
              </View>
            </View>
            {paymentMethod === "cash" && (
              <Ionicons name="checkmark-sharp" size={24} color="#FFA840" />
            )}
          </Pressable>

          {/* Online Payment Option (Disabled for now) */}
          <Pressable
            onPress={() => setPaymentMethod("xendit")}
            className={`flex-row items-center justify-between rounded-xl border px-4 py-3 mb-3 ${
              paymentMethod === "xendit"
                ? "border-[#FFA840] bg-[#FFF6EB]"
                : "border-gray-300 bg-white"
            }`}
          >
            <View className="flex-row items-center gap-3">
              <View className="h-6 w-6 bg-lightPrimary/20 rounded-full items-center justify-center">
                <Text className="text-lightPrimary font-bold">💳</Text>
              </View>
              <View>
                <Text className="text-sm font-medium text-gray-800">
                  Xendit Online Payment
                </Text>
                <Text className="text-xs text-gray-500">Pay online</Text>
              </View>
            </View>
            {paymentMethod === "xendit" && (
              <Ionicons name="checkmark-sharp" size={24} color="#FFA840" />
            )}
          </Pressable>
        </View>
      </BottomSheetScrollView>
      {modalVisible && (
        <VehicleInfoModal
          visible={modalVisible}
          setModalVisible={setModalVisible}
        />
      )}
    </BottomSheet>
  );
};

export default BookSheet;

export const VehicleInfoModal = ({
  visible,
  setModalVisible,
}: {
  visible: boolean;
  setModalVisible: (visible: boolean) => void;
}) => {
  return (
    <Modal
      visible={visible}
      onRequestClose={() => setModalVisible(false)}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <SafeAreaView className="flex-1 bg-white px-4">
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-semibold text-[#1E1E1E]">
            FastMet Services
          </Text>
          <Pressable onPress={() => setModalVisible(false)}>
            <Ionicons name="close" size={28} color="#FFA840" />
          </Pressable>
        </View>

        {/* Vehicle list */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-col gap-4 mb-8">
            {vehicles.map((v) => (
              <View
                key={v.id}
                className="bg-[#F7F9FC] border border-[#FFA840] rounded-2xl p-4 flex-row justify-between items-center"
              >
                <View className="flex-1 pr-3">
                  <Text className="text-base font-semibold text-[#333]">
                    {v.name}
                  </Text>
                  <Text className="text-sm text-gray-500 mt-1">{v.desc}</Text>
                </View>
                <Image
                  source={v.img}
                  style={{ width: 96, height: 64 }}
                  contentFit="contain"
                />
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Done button */}
        <Pressable
          onPress={() => setModalVisible(false)}
          className="bg-[#FFA840] rounded-xl py-3 mb-4"
        >
          <Text className="text-white text-center text-base font-semibold">
            Done
          </Text>
        </Pressable>
      </SafeAreaView>
    </Modal>
  );
};

{
  /* <Pressable
className="absolute -top-2 -right-2"
onPress={() => {
  setSelectedInfo(v);
  setModalVisible(true);
}}
>
<Ionicons name="information-circle" size={22} color="#FFA840" />
</Pressable> */
}
