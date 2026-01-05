import { useAppStore } from "@/store/useAppStore";
import { vehicles } from "@/utils/constants";
import { formatDate } from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import { Dimensions, Platform, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BookingTypeModal from "../modals/bookingTypeModal";
import SearchModal from "../modals/mapSearchModal";
import { VehicleInfoModal } from "../modals/vehicleInfoModal";
import LocationInputs from "./LocationInputs";
import SheetButton from "./SheetButton";

const BookSheet = () => {
  const sheetRef = useRef<BottomSheet>(null);
  const insets = useSafeAreaInsets();
  const { height: screenHeight } = Dimensions.get("window");
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [selectTimeModalVisible, setSelectTimeModalVisible] = useState(false);
  const [searchType, setSearchType] = useState<"pickup" | "dropoff" | null>(
    null
  );
  const bookingType = useAppStore((state) => state.bookingType);
  const selectedVehicle = useAppStore((state) => state.selectedVehicle);
  const setSelectedVehicle = useAppStore((state) => state.setSelectedVehicle);

  // take consideration the inset bottom
  const snapPoints = useMemo(() => {
    const first =
      (Platform.OS === "ios" ? 0.2 : 0.23) * screenHeight + insets.bottom;
    const second =
      (Platform.OS === "ios" ? 0.5 : 0.6) * screenHeight + insets.bottom;

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
            className="relative flex-row items-center gap-2 px-4 py-2 bg-white border-2 rounded-full border-lightPrimary active:scale-95"
          >
            <Text className="absolute text-sm font-semibold bg-white text-darkPrimary -top-3 -left-1">
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
            <View className="items-center justify-center gap-1 ">
              <View className="flex-row items-center justify-center self-start gap-1">
                <Text className="text-sm font-semibold text-gray-900">
                  Choose Vehicle
                </Text>
                <Pressable onPress={() => setInfoModalVisible(true)}>
                  <Ionicons
                    name="information-circle"
                    color="#FFA840"
                    size={20}
                  />
                </Pressable>
              </View>
              <View className="flex-row w-full py-2">
                {vehicles.map((v) => (
                  <View key={v.id} className="flex-1 items-center gap-1">
                    <Pressable
                      className={`items-center gap-3 px-4 py-2 rounded-lg ${
                        selectedVehicle?.id === v.id
                          ? "border-2 border-lightPrimary"
                          : ""
                      }`}
                      onPress={() => setSelectedVehicle(v)}
                    >
                      <Text
                        className={`text-xs text-gray-500 ${
                          selectedVehicle?.id === v.id ? "font-semibold" : ""
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
                  </View>
                ))}
              </View>
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
