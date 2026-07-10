import SheetButton from "@/components/maps/SheetButton";
import { useAppStore } from "@/store/useAppStore";
import { openGallery, takePhoto } from "@/utils/helpers/imagePicker";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

// Size rank used to derive compatible vehicle lists dynamically
const VEHICLE_SIZE_RANK: Record<string, number> = {
  motorcycle: 0,
  sedan: 1,
  mpv_suv: 2,
  light_van: 3,
  small_pickup: 4,
  l300: 5,
  closed_van: 6,
  wing_van: 7,
};

const ITEM_OPTIONS = [
  { label: "Documents / Envelope", value: "Documents / Envelope" },
  { label: "Small Package / Bag", value: "Small Package / Bag" },
  { label: "Medium Box / Carton", value: "Medium Box / Carton" },
  {
    label: "Large Box / Furniture / Appliance",
    value: "Large Box / Furniture / Appliance",
  },
  { label: "Other / Oversized", value: "Other / Oversized" },
];

export default function AdditionalInfo() {
  const insets = useSafeAreaInsets();
  const [photoError, setPhotoError] = useState(false);

  const note = useAppStore((s) => s.note);
  const setNote = useAppStore((s) => s.setNote);
  const itemType = useAppStore((s) => s.itemType);
  const setItemType = useAppStore((s) => s.setItemType);
  const photos = useAppStore((s) => s.photos);
  const setPhoto = useAppStore((s) => s.setPhoto);
  const removePhoto = useAppStore((s) => s.removePhoto);
  const vehicles = useAppStore((s) => s.vehicles);

  const vehicleKeys = vehicles.map((v) => v.key);

  // Returns vehicleKeys whose size rank is >= minRank, eliminating hardcoded arrays
  const vehiclesFrom = (minRank: number) =>
    vehicleKeys.filter((k) => (VEHICLE_SIZE_RANK[k] ?? 99) >= minRank);

  const itemVehicleMap: Record<string, string[]> = {
    "Documents / Envelope": vehicleKeys, // all
    "Small Package / Bag": vehicleKeys, // all (motorcycle included)
    "Medium Box / Carton": vehiclesFrom(1), // no motorcycle
    "Large Box / Furniture / Appliance": vehiclesFrom(2), // no motorcycle/sedan
    "Other / Oversized": vehiclesFrom(5), // l300 and above
  };

  const isItemCompatible = (item: string | null) => {
    if (!item) return true;
    const selectedVehicle = useAppStore.getState().selectedVehicle?.key;
    if (!selectedVehicle) return false;
    return itemVehicleMap[item]?.includes(selectedVehicle) ?? false;
  };

  const handleAddPhoto = async () => {
    Alert.alert(
      "Add Photo",
      "Choose an option",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Take Photo",
          onPress: async () => {
            const uri = await takePhoto();
            if (uri) {
              setPhoto(uri);
              setPhotoError(false);
            }
          },
        },
        {
          text: "Choose from Gallery",
          onPress: async () => {
            const result = await openGallery();
            if (result && !result.canceled && result.assets?.length) {
              setPhoto(result.assets[0].uri);
              setPhotoError(false);
            }
          },
        },
      ],
      { cancelable: true },
    );
  };

  const handleNext = () => {
    if (!photos.some(Boolean)) {
      setPhotoError(true);
      return;
    }
    router.push("/(root_screens)/booking/paymentMethod");
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {/* Header */}
      <View className="relative flex-row items-center justify-center px-6 pt-2 pb-4">
        <Pressable
          className="absolute left-5 top-1"
          onPress={() => router.back()}
          hitSlop={20}
        >
          <Ionicons
            name="chevron-back"
            size={Platform.OS === "ios" ? 32 : 28}
            color="#FFA840"
          />
        </Pressable>
        <Text className="text-lg font-semibold">Additional Information</Text>
        <Text className="absolute text-sm font-semibold right-5 top-3.5">
          Step 3/4
        </Text>
      </View>

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          className="flex-1 px-6 py-2"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: insets.bottom + (insets.bottom === 0 ? 120 : 70),
          }}
        >
          <View className="gap-7">
            {/* Note to Driver */}
            <View className="gap-2">
              <Text className="font-semibold">
                Note to Driver{" "}
                <Text className="text-xs text-gray-400">(Optional)</Text>
              </Text>
              <TextInput
                multiline
                numberOfLines={4}
                placeholder="Type here..."
                value={note}
                onChangeText={setNote}
                style={{ height: 120, textAlignVertical: "top" }}
                className="p-4 border border-gray-300 rounded-lg"
              />
            </View>

            {/* Item Type */}
            <View className="gap-2">
              <Text className="font-semibold">
                What are you sending?{" "}
                <Text className="text-xs text-gray-400">(Optional)</Text>
              </Text>
              <Dropdown
                style={{
                  height: 50,
                  borderColor: "#D1D5DB",
                  borderWidth: 1,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  backgroundColor: "white",
                }}
                placeholderStyle={{ color: "#9CA3AF" }}
                selectedTextStyle={{ color: "#111827" }}
                itemTextStyle={{ color: "#111827" }}
                data={ITEM_OPTIONS}
                labelField="label"
                valueField="value"
                placeholder="Select item type"
                value={itemType}
                onChange={(item) => setItemType(item.value)}
              />
              {itemType && !isItemCompatible(itemType) && (
                <Text className="text-red-500 text-xs font-semibold mt-1 ml-2">
                  Warning: Your selected item may not fit in the chosen vehicle.{" "}
                  <Text className="capitalize">
                    (Compatible:{" "}
                    {itemVehicleMap[itemType].join(", ").replaceAll("_", " ")})
                  </Text>
                </Text>
              )}
            </View>

            {/* Upload Photos */}
            <View className="gap-2">
              <Text className="font-semibold">
                Upload Photo <Text className="text-xs text-red-500">*</Text>
              </Text>
              <View className="flex-row items-center justify-between gap-2">
                {[0, 1, 2].map((i) => (
                  <Pressable
                    key={i}
                    onPress={handleAddPhoto}
                    className={`items-center justify-center flex-1 gap-1 border relative h-28 rounded-xl active:bg-gray-100 ${
                      photoError && i === 0 && !photos[0]
                        ? "border-red-400 bg-red-50"
                        : "border-gray-300"
                    }`}
                  >
                    {photos[i] ? (
                      <>
                        <Image
                          source={{ uri: photos[i] }}
                          style={{
                            width: "100%",
                            height: "100%",
                            borderRadius: 12,
                          }}
                          contentFit="cover"
                        />
                        <Pressable
                          onPress={() => removePhoto(photos[i])}
                          className="absolute p-0.5 bg-red-500 rounded-full -right-1 -top-1"
                        >
                          <Ionicons
                            name="close-outline"
                            size={17}
                            color="white"
                          />
                        </Pressable>
                      </>
                    ) : (
                      <Ionicons
                        name="camera-outline"
                        size={22}
                        color={photoError && i === 0 ? "#F87171" : "gray"}
                      />
                    )}
                  </Pressable>
                ))}
              </View>
              {photoError && (
                <Text className="text-red-500 text-xs font-semibold ml-1">
                  At least one photo is required.
                </Text>
              )}
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <SheetButton next={handleNext} />
    </SafeAreaView>
  );
}
