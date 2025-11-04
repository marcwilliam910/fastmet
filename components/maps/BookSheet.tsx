import { Vehicle } from "@/types/book";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, {
  BottomSheetScrollView,
  BottomSheetTextInput,
} from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Dimensions, Keyboard, Pressable, Text, View } from "react-native";
import { EdgeInsets, useSafeAreaInsets } from "react-native-safe-area-context";
import { VehicleInfoModal } from "../modals/vehicleInfoModal";
import SheetButton from "./SheetButton";

const vehicles: Vehicle[] = [
  {
    id: "1",
    name: "Motorcycle",
    img: require("@/assets/vehicle/motor.png"),
    desc: "Ideal for fast solo rides or small deliveries. Carries 1 passenger.",
    price: 100,
    capacity: "20kg",
  },
  {
    id: "2",
    name: "Sedan",
    img: require("@/assets/vehicle/car.png"),
    desc: "Perfect for city trips and comfortable rides. Fits up to 4 passengers.",
    price: 200,
    capacity: "100kg",
  },
  {
    id: "3",
    name: "MPV/SUV",
    img: require("@/assets/vehicle/suv.png"),
    desc: "Spacious and powerful for long trips or groups. Fits up to 6 passengers.",
    price: 300,
    capacity: "300kg",
  },
];

const BookSheet = ({
  isExpanded,
  method,
}: {
  isExpanded: boolean;
  method: "passenger" | "pasabay";
}) => {
  const sheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0].id);
  const { height: screenHeight } = Dimensions.get("window");
  const [paymentMethod, setPaymentMethod] = useState("");
  const [step, setStep] = useState<"ride" | "contact">("ride");

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

  useEffect(() => {
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      sheetRef.current?.snapToIndex(1); // reset
    });
    return () => {
      hideSub.remove();
    };
  }, []);

  const handleDisplay = () => {
    switch (step) {
      case "ride":
        return (
          <>
            <View className="flex-row justify-between pb-5 px-3">
              <Pressable onPress={() => router.back()}>
                <Ionicons name="chevron-back" color="#FFA840" size={26} />
              </Pressable>
              <Text className="text-lg font-bold capitalize">
                {method} ride
              </Text>
              <Pressable onPress={() => setModalVisible(true)}>
                <Ionicons name="information-circle" color="#FFA840" size={24} />
              </Pressable>
            </View>
            {method === "passenger" ? (
              <PassengerSheet
                selectedVehicle={selectedVehicle}
                setSelectedVehicle={setSelectedVehicle}
                insets={insets}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />
            ) : (
              <PasabaySheet
                selectedVehicle={selectedVehicle}
                setSelectedVehicle={setSelectedVehicle}
                insets={insets}
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />
            )}
          </>
        );

      case "contact":
        return (
          <>
            <View className="flex-row justify-center pb-5 px-3">
              <Pressable
                onPress={() => setStep("ride")}
                className="absolute left-3 top-0"
              >
                <Ionicons name="chevron-back" color="#FFA840" size={26} />
              </Pressable>
              <Text className="text-lg font-bold">Contact Information</Text>
            </View>
            <BottomSheetScrollView
              className="flex-1 px-5"
              keyboardShouldPersistTaps="handled"
              enableAutomaticScroll={true}
            >
              <View className="gap-2 mb-5">
                <Text className="ml-1 font-semibold text-gray-800">Name</Text>
                <BottomSheetTextInput className="border border-lightPrimary px-2 py-4 rounded-lg" />
              </View>
              <View className="gap-2 mb-5">
                <Text className="ml-1 font-semibold text-gray-800">
                  Contact Number
                </Text>
                <BottomSheetTextInput className="border border-lightPrimary px-2 py-4 rounded-lg" />
              </View>
              <View
                className="gap-2"
                style={{ paddingBottom: insets.bottom + 80 }}
              >
                <Text className="ml-1 font-semibold text-gray-800">
                  Note to Driver
                </Text>
                <BottomSheetTextInput
                  multiline
                  numberOfLines={4}
                  placeholder="Type here..."
                  style={{ height: 120, textAlignVertical: "top" }}
                  className="py-4 px-2 border rounded-lg border-lightPrimary"
                />
              </View>
            </BottomSheetScrollView>
          </>
        );
    }
  };

  return (
    <>
      <BottomSheet
        ref={sheetRef}
        index={1}
        snapPoints={snapPoints}
        enableDynamicSizing={false}
        handleIndicatorStyle={{ backgroundColor: "#FFA840" }}
        enableContentPanningGesture={false} // 👈 This is the key
        containerStyle={{ zIndex: 20 }}
      >
        {handleDisplay()}
      </BottomSheet>

      <SheetButton setStep={setStep} isLast={step === "contact"} />

      {modalVisible && (
        <VehicleInfoModal
          visible={modalVisible}
          setModalVisible={setModalVisible}
          vehicles={vehicles}
        />
      )}
    </>
  );
};

export default BookSheet;

const PassengerSheet = ({
  selectedVehicle,
  setSelectedVehicle,
  insets,
  paymentMethod,
  setPaymentMethod,
}: {
  insets: EdgeInsets;
  selectedVehicle: string;
  setSelectedVehicle: React.Dispatch<React.SetStateAction<string>>;
  paymentMethod: string;
  setPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <BottomSheetScrollView className="flex-1 px-3">
      <Text className=" font-semibold text-gray-900 mb-4">Choose Vehicle</Text>
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
        <PaymentBtn
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />
      </View>
    </BottomSheetScrollView>
  );
};

const PasabaySheet = ({
  selectedVehicle,
  setSelectedVehicle,
  insets,
  paymentMethod,
  setPaymentMethod,
}: {
  insets: EdgeInsets;
  selectedVehicle: string;
  setSelectedVehicle: React.Dispatch<React.SetStateAction<string>>;
  paymentMethod: string;
  setPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <BottomSheetScrollView
      className="flex-1 px-4"
      showsVerticalScrollIndicator={false}
    >
      {/* Vehicle Section */}
      <Text className="font-semibold text-gray-900 mb-4">Choose Vehicle</Text>

      {vehicles.map((v) => (
        <Pressable
          key={v.id}
          onPress={() => setSelectedVehicle(v.id)}
          android_ripple={{ color: "#f2f2f2" }}
          className={`flex-row items-center justify-between rounded-2xl border px-4 py-3 mb-3 ${
            selectedVehicle === v.id
              ? "border-[#FFA840] bg-[#FFF7EF]"
              : "border-gray-200 bg-white"
          }`}
        >
          <View className="flex-row items-center gap-4">
            <View className="w-14 h-14 rounded-xl bg-gray-50 items-center justify-center">
              <Image
                source={v.img}
                style={{ width: 56, height: 40 }}
                contentFit="contain"
              />
            </View>

            <View>
              <Text className="text-sm font-semibold text-gray-900">
                {v.name}
              </Text>
              <Text className="text-xs text-gray-500 mt-0.5">
                Max. {v.capacity} • Standard
              </Text>
            </View>
          </View>

          <Text className="text-sm font-semibold text-[#FFA840]">
            Php {v.price}
          </Text>
        </Pressable>
      ))}

      {/* Pasabay Type Input */}
      <View className="mt-5">
        <Text className="font-semibold text-gray-900 mb-3">
          Item to Pasabay
        </Text>
        <BottomSheetTextInput
          multiline
          numberOfLines={4}
          placeholder="Type here..."
          style={{ height: 120, textAlignVertical: "top" }}
          className="py-4 px-2 border rounded-lg border-lightPrimary"
        />
      </View>

      {/* Payment Section */}
      <View style={{ paddingBottom: insets.bottom + 60, marginTop: 20 }}>
        <PaymentBtn
          paymentMethod={paymentMethod}
          setPaymentMethod={setPaymentMethod}
        />
      </View>
    </BottomSheetScrollView>
  );
};

const PaymentBtn = ({
  setPaymentMethod,
  paymentMethod,
}: {
  paymentMethod: string;
  setPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
}) => {
  return (
    <>
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
              Online Payment
            </Text>
            <Text className="text-xs text-gray-500">Pay online</Text>
          </View>
        </View>
        {paymentMethod === "xendit" && (
          <Ionicons name="checkmark-sharp" size={24} color="#FFA840" />
        )}
      </Pressable>
    </>
  );
};
