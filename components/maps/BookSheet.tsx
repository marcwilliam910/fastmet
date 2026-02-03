import { useAppStore } from "@/store/useAppStore";
import { ILoadVariant, IVehicleType } from "@/types/vehicle";
import { formatDate } from "@/utils/date";
import { Ionicons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Dimensions,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import BookingTypeModal from "../modals/bookingTypeModal";
import { VehicleInfoModal } from "../modals/vehicleInfoModal";
import LocationInputs from "./LocationInputs";
import SheetButton from "./SheetButton";

const BookSheet = ({
  isDragging,
  onOpenSearch,
}: {
  isDragging: boolean;
  onOpenSearch: (type: "pickup" | "dropoff") => void;
}) => {
  const sheetRef = useRef<BottomSheet>(null);
  const previousSnapIndex = useRef<number>(1); // Store the previous index (default to 1, second snap point)

  const insets = useSafeAreaInsets();
  const { height: screenHeight } = Dimensions.get("window");
  const [infoModalVisible, setInfoModalVisible] = useState(false);
  const [selectTimeModalVisible, setSelectTimeModalVisible] = useState(false);

  const bookingType = useAppStore((state) => state.bookingType);
  const selectedVehicle = useAppStore((state) => state.selectedVehicle);
  const setSelectedVehicle = useAppStore((state) => state.setSelectedVehicle);
  const vehicles = useAppStore((state) => state.vehicles);
  const vehicleError = useAppStore((state) => state.vehicleError);
  const fetchVehicles = useAppStore((state) => state.fetchVehicles);
  const vehicleLoading = useAppStore((state) => state.vehicleLoading);

  const vehicleScrollRef = useRef<ScrollView>(null);
  const [vehicleItemWidth] = useState(90);

  const variantScrollRef = useRef<ScrollView>(null);
  const [variantItemWidth] = useState(140);

  // Memoize the selected vehicle's full data to avoid repeated .find() calls
  const selectedVehicleData = useMemo(() => {
    if (!selectedVehicle) return null;
    return vehicles.find((v) => v.key === selectedVehicle.key) ?? null;
  }, [selectedVehicle, vehicles]);

  // Memoize active variants for the selected vehicle
  const activeVariants = useMemo(() => {
    if (!selectedVehicleData?.variants) return [];
    return selectedVehicleData.variants.filter((v) => v.isActive);
  }, [selectedVehicleData]);

  const hasMultipleVariants = (selectedVehicleData?.variants?.length ?? 0) > 1;

  // to adjust the height of the sheet
  const snapPoints = useMemo(() => {
    const first =
      (Platform.OS === "ios" ? 0.19 : 0.23) * screenHeight + insets.bottom;

    const second =
      (Platform.OS === "ios" ? 0.5 : 0.6) * screenHeight +
      insets.bottom +
      (hasMultipleVariants ? 50 : 0);

    return [first, second];
  }, [insets.bottom, screenHeight, hasMultipleVariants]);

  const bookingTypeDisplay = useMemo(() => {
    if (bookingType.type === "asap") {
      return `${bookingType.type.toUpperCase()} - ${bookingType.value}`;
    } else if (bookingType.type === "schedule") {
      return formatDate(bookingType.value);
    } else return bookingType.value;
  }, [bookingType.type, bookingType.value]);

  const handleVehicleSelect = (vehicle: IVehicleType, index: number) => {
    setSelectedVehicle({
      _id: vehicle._id,
      key: vehicle.key,
      name: vehicle.name,
      imageUrl: vehicle.imageUrl,
      freeServices: vehicle.freeServices,
      searchConfig: vehicle.searchConfig,
      paidServices: vehicle.paidServices,
      variant: vehicle.variants[0],
    });

    if (vehicleScrollRef.current) {
      const screenWidth = Dimensions.get("window").width;
      const scrollPosition =
        index * vehicleItemWidth - screenWidth / 2 + vehicleItemWidth / 2 + 15;
      vehicleScrollRef.current.scrollTo({ x: scrollPosition, animated: true });
    }
  };

  const handleVariantSelect = (variant: ILoadVariant, index: number) => {
    setSelectedVehicle({
      ...selectedVehicle!,
      variant,
    });

    if (variantScrollRef.current) {
      const screenWidth = Dimensions.get("window").width;
      const scrollPosition =
        index * variantItemWidth - screenWidth / 2 + variantItemWidth / 2 + 50; // Adjust -20 to move left/right
      variantScrollRef.current.scrollTo({ x: scrollPosition, animated: true });
    }
  };

  // Snap to first position when dragging, restore when not dragging
  useEffect(() => {
    if (isDragging) sheetRef.current?.snapToIndex(0);
    else
      // Restore to previous position when user stops dragging
      sheetRef.current?.snapToIndex(previousSnapIndex.current);
  }, [isDragging]);

  const handleSheetChange = useCallback(
    (index: number) => {
      if (!isDragging) {
        previousSnapIndex.current = index;
      }
    },
    [isDragging],
  );

  return (
    <>
      <BottomSheet
        ref={sheetRef}
        index={1}
        snapPoints={snapPoints}
        onChange={handleSheetChange}
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
              {bookingTypeDisplay}
            </Text>

            <Ionicons name="chevron-down" size={14} color="#9CA3AF" />
          </Pressable>
        </View>

        <BottomSheetScrollView className="flex-1 px-3">
          <View className="gap-4 mb-40">
            <View className="items-center justify-center gap-1">
              <View className="flex-row items-center self-start justify-center gap-1">
                <Text className="text-sm font-semibold text-gray-900">
                  Choose Vehicle
                </Text>
                <Pressable
                  onPress={() => setInfoModalVisible(true)}
                  hitSlop={20}
                >
                  <Ionicons
                    name="information-circle"
                    color="#FFA840"
                    size={Platform.OS === "ios" ? 22 : 20}
                  />
                </Pressable>
              </View>

              {vehicleLoading ? (
                <View className="w-full px-2 py-2">
                  <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ gap: 10 }}
                  >
                    {[1, 2, 3, 4].map((item) => (
                      <View key={item} className="items-center gap-1">
                        <View className="items-center px-4 py-2 bg-gray-100 rounded-lg">
                          {/* Vehicle name skeleton */}
                          <View className="w-16 h-3 mb-3 bg-gray-300 rounded" />
                          {/* Vehicle image skeleton */}
                          <View className="bg-gray-300 rounded w-11 h-9" />
                        </View>
                      </View>
                    ))}
                  </ScrollView>
                </View>
              ) : vehicleError ? (
                <View className="flex-row items-center h-12 gap-2 px-3 py-2 bg-red-100 rounded-lg">
                  <Text className="flex-1 text-xs text-red-800">
                    {vehicleError}
                  </Text>
                  <Pressable onPress={fetchVehicles}>
                    <Text className="text-sm font-semibold text-red-900 underline">
                      Retry
                    </Text>
                  </Pressable>
                </View>
              ) : (
                <>
                  <ScrollView
                    ref={vehicleScrollRef}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    className="w-full px-2 py-2"
                    contentContainerStyle={{ gap: 10 }}
                  >
                    {vehicles.map((v, index) => (
                      <View key={v.key} className="relative items-center gap-1">
                        <Pressable
                          className={`items-center gap-3 px-4 py-2 rounded-lg ${selectedVehicle?.key === v.key
                            ? "border-2 border-lightPrimary"
                            : ""
                            }`}
                          onPress={() => handleVehicleSelect(v, index)}
                        >
                          <Text
                            className={`text-xs text-gray-500 ${selectedVehicle?.key === v.key
                              ? "font-semibold"
                              : ""
                              }`}
                          >
                            {v.name}
                          </Text>
                          <Image
                            source={v.imageUrl}
                            style={{ height: 35, width: 45 }}
                            contentFit="contain"
                          />
                        </Pressable>
                      </View>
                    ))}
                  </ScrollView>

                  {hasMultipleVariants && (
                    <Animated.View
                      key={selectedVehicle!.key}
                      entering={FadeInDown.duration(300).springify()}
                      className="w-full px-2 py-1"
                    >
                      <ScrollView
                        ref={variantScrollRef}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        className="px-2"
                        contentContainerStyle={{ gap: 8 }}
                      >
                        {activeVariants.map((variant, index) => {
                          const isSelected =
                            selectedVehicle!.variant?.maxLoadKg === variant.maxLoadKg;

                          return (
                            <Pressable
                              key={variant.maxLoadKg}
                              className={`px-5 py-3 rounded-xl ${isSelected ? "bg-lightPrimary" : "bg-gray-200"
                                }`}
                              onPress={() => handleVariantSelect(variant, index)}
                            >
                              <Text
                                className={`text-sm ${isSelected
                                  ? "text-white font-semibold"
                                  : "text-gray-700 font-medium"
                                  }`}
                              >
                                Max Load: {variant.maxLoadKg}kg
                              </Text>
                            </Pressable>
                          );
                        })}
                      </ScrollView>
                    </Animated.View>
                  )}
                </>
              )}
            </View>

            <LocationInputs onOpenSearch={onOpenSearch} />
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
