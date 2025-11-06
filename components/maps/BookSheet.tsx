import { useBookStore } from "@/store/useBookStore";
import { Vehicle } from "@/types/book";
import { formatDate } from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import { Dimensions, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BookingTypeModal from "../modals/bookingTypeModal";
import SearchModal from "../modals/mapSearchModal";
import { VehicleInfoModal } from "../modals/vehicleInfoModal";
import LocationInputs from "./LocationInputs";
import SheetButton from "./SheetButton";

const vehicles: Vehicle[] = [
  {
    id: "1",
    name: "Motorcycle",
    img: require("@/assets/vehicle/motor.png"),
    desc: "Ideal for fast solo rides or small deliveries. Carries 1 passenger.",
    capacity: "20kg",
  },
  {
    id: "2",
    name: "Sedan",
    img: require("@/assets/vehicle/car.png"),
    desc: "Perfect for city trips and comfortable rides. Fits up to 4 passengers.",
    capacity: "100kg",
  },
  {
    id: "3",
    name: "MPV/SUV",
    img: require("@/assets/vehicle/suv.png"),
    desc: "Spacious and powerful for long trips or groups. Fits up to 6 passengers.",
    capacity: "300kg",
  },
  {
    id: "4",
    name: "Truck",
    img: require("@/assets/vehicle/truck.png"),
    desc: "Spacious and powerful for long trips or groups. Fits up to 6 passengers.",
    capacity: "300kg",
  },
  {
    id: "5",
    name: "FastMet Truck",
    img: require("@/assets/vehicle/fastmet_truck.png"),
    desc: "Spacious and powerful for long trips or groups. Fits up to 6 passengers.",
    capacity: "300kg",
  },
];

const BookSheet = () => {
  const sheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  const [selectedVehicle, setSelectedVehicle] = useState(vehicles[0].id);
  const { height: screenHeight } = Dimensions.get("window");
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [selectTimeModalVisible, setSelectTimeModalVisible] = useState(false);
  const [searchType, setSearchType] = useState<"pickup" | "dropoff" | null>(
    null
  );
  const bookingType = useBookStore((state) => state.bookingType);

  // take consideration the inset bottom
  const snapPoints = useMemo(() => {
    const first = 0.23 * screenHeight + insets.bottom;
    const second = 0.6 * screenHeight + insets.bottom;

    return [first, second];
  }, [insets.bottom, screenHeight]);

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
        <View className="flex-row justify-between items-center pb-5 pt-1.5 px-3">
          <Text className="text-lg font-bold">Booking Type</Text>

          <Pressable
            onPress={() => setSelectTimeModalVisible(true)}
            className="flex-row items-center gap-2 px-4 relative py-2 border-2 border-lightPrimary bg-white rounded-full active:scale-95"
          >
            <Text className="text-sm font-semibold  bg-white text-darkPrimary absolute -top-3 -left-1">
              Option:
            </Text>

            <Text className="text-sm font-bold text-gray-900">
              {bookingType?.type === "schedule"
                ? formatDate(bookingType.value)
                : bookingType?.value}
            </Text>

            <Ionicons name="chevron-down" size={14} color="#9CA3AF" />
          </Pressable>
        </View>

        <BottomSheetScrollView className="flex-1 px-3">
          <View className="gap-4 mb-40">
            <View className=" items-center gap-1 justify-center">
              <Text className="font-semibold text-sm text-gray-900 self-start">
                Choose Vehicle
              </Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                className="py-2"
              >
                {vehicles.map((v) => (
                  <View key={v.id} className="relative items-center gap-1 mr-3">
                    <Pressable
                      className={`items-center gap-3 px-4 py-2 rounded-lg ${
                        selectedVehicle === v.id
                          ? "border-2 border-lightPrimary"
                          : ""
                      }`}
                      onPress={() => setSelectedVehicle(v.id)}
                    >
                      <Text
                        className={`text-xs text-gray-500 ${
                          selectedVehicle === v.id ? "font-semibold" : ""
                        }`}
                      >
                        {v.name}
                      </Text>
                      <Image
                        source={v.img}
                        style={{ height: 35, width: 45 }}
                        contentFit="contain"
                      />
                    </Pressable>

                    <Pressable
                      onPress={() => setInfoModalVisible(true)}
                      className="absolute -right-2 -top-2 p-0.5  bg-white rounded-full"
                    >
                      <Ionicons
                        name="information-circle"
                        color="#FFA840"
                        size={20}
                      />
                    </Pressable>
                  </View>
                ))}
              </ScrollView>
            </View>
            <LocationInputs
              onOpenSearch={(type) => {
                setSearchType(type);
                setSearchModalVisible(true);
              }}
            />
          </View>
        </BottomSheetScrollView>
      </BottomSheet>

      <SheetButton
        next={() => router.push("/(root_screens)/booking/services")}
      />

      {infoModalVisible && (
        <VehicleInfoModal
          visible={infoModalVisible}
          setModalVisible={setInfoModalVisible}
          vehicles={vehicles}
        />
      )}

      {searchType && (
        <SearchModal
          visible={searchModalVisible}
          type={searchType}
          onClose={() => setSearchModalVisible(false)}
        />
      )}

      {selectTimeModalVisible && (
        <BookingTypeModal
          visible={selectTimeModalVisible}
          onClose={() => setSelectTimeModalVisible(false)}
        />
      )}
    </>
  );
};

export default BookSheet;

/*
    <View style={{ paddingBottom: insets.bottom + 60, marginTop: 20 }}>
              <PaymentBtn
                paymentMethod={paymentMethod}
                setPaymentMethod={setPaymentMethod}
              />
            </View>
*/

// const PaymentBtn = ({
//   setPaymentMethod,
//   paymentMethod,
// }: {
//   paymentMethod: string;
//   setPaymentMethod: React.Dispatch<React.SetStateAction<string>>;
// }) => {
//   return (
//     <>
//       {/* Section Header */}
//       <Text className="text-base font-semibold text-gray-800 mb-3">
//         Payment Method
//       </Text>

//       {/* Cash Payment Option */}
//       <Pressable
//         onPress={() => setPaymentMethod("cash")}
//         className={`flex-row items-center justify-between rounded-xl border px-4 py-3 mb-3 ${
//           paymentMethod === "cash"
//             ? "border-[#FFA840] bg-[#FFF6EB]"
//             : "border-gray-300 bg-white"
//         }`}
//       >
//         <View className="flex-row items-center gap-3">
//           <View className="h-6 w-6 bg-lightPrimary/20 rounded-full items-center justify-center">
//             <Text className="text-lightPrimary font-bold">₱</Text>
//           </View>
//           <View>
//             <Text className="text-sm font-medium text-gray-800">
//               Cash Payment
//             </Text>
//             <Text className="text-xs text-gray-500">
//               Pay directly to driver
//             </Text>
//           </View>
//         </View>
//         {paymentMethod === "cash" && (
//           <Ionicons name="checkmark-sharp" size={24} color="#FFA840" />
//         )}
//       </Pressable>

//       {/* Online Payment Option (Disabled for now) */}
//       <Pressable
//         onPress={() => setPaymentMethod("xendit")}
//         className={`flex-row items-center justify-between rounded-xl border px-4 py-3 mb-3 ${
//           paymentMethod === "xendit"
//             ? "border-[#FFA840] bg-[#FFF6EB]"
//             : "border-gray-300 bg-white"
//         }`}
//       >
//         <View className="flex-row items-center gap-3">
//           <View className="h-6 w-6 bg-lightPrimary/20 rounded-full items-center justify-center">
//             <Text className="text-lightPrimary font-bold">💳</Text>
//           </View>
//           <View>
//             <Text className="text-sm font-medium text-gray-800">
//               Online Payment
//             </Text>
//             <Text className="text-xs text-gray-500">Pay online</Text>
//           </View>
//         </View>
//         {paymentMethod === "xendit" && (
//           <Ionicons name="checkmark-sharp" size={24} color="#FFA840" />
//         )}
//       </Pressable>
//     </>
//   );
// };
