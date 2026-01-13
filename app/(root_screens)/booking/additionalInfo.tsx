import SheetButton from "@/components/maps/SheetButton";
import { useAppStore } from "@/store/useAppStore";
import { openGallery, takePhoto } from "@/utils/imagePicker";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
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

export default function AdditionalInfo() {
  const insets = useSafeAreaInsets();

  const note = useAppStore((state) => state.note);
  const setNote = useAppStore((state) => state.setNote);
  const itemType = useAppStore((state) => state.itemType);
  const setItemType = useAppStore((state) => state.setItemType);

  const photos = useAppStore((state) => state.photos);
  const setPhoto = useAppStore((state) => state.setPhoto);
  const removePhoto = useAppStore((state) => state.removePhoto);

  const itemOptions = [
    { label: "Documents / Envelope", value: "Documents / Envelope" },
    { label: "Small Package / Bag", value: "Small Package / Bag" },
    { label: "Medium Box / Carton", value: "Medium Box / Carton" },
    {
      label: "Large Box / Furniture / Appliance",
      value: "Large Box / Furniture / Appliance",
    },
    { label: "Other / Oversized", value: "Other / Oversized" },
  ];

  const itemVehicleMap: Record<string, string[]> = {
    "Documents / Envelope": [
      "motorcycle",
      "sedan",
      "mpv_suv",
      "light_van",
      "small_pickup",
      "l300",
      "closed_van",
      "wing_van",
    ],

    "Small Package / Bag": [
      "motorcycle",
      "sedan",
      "mpv_suv",
      "light_van",
      "small_pickup",
      "l300",
      "closed_van",
      "wing_van",
    ],

    "Medium Box / Carton": [
      "sedan",
      "mpv_suv",
      "light_van",
      "small_pickup",
      "l300",
      "closed_van",
      "wing_van",
    ],

    "Large Box / Furniture / Appliance": [
      "mpv_suv",
      "light_van",
      "small_pickup",
      "l300",
      "closed_van",
      "wing_van",
    ],

    "Other / Oversized": ["l300", "closed_van", "wing_van"],
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
            if (uri) setPhoto(uri);
          },
        },
        {
          text: "Choose from Gallery",
          onPress: async () => {
            const result = await openGallery();
            if (result && !result.canceled && result.assets?.length) {
              setPhoto(result.assets[0].uri);
            }
          },
        },
      ],
      { cancelable: true }
    );
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

            {/* Item Type (Optional) */}
            <View className="gap-2">
              <Text className="font-semibold">
                What are you sending?{" "}
                <Text className="text-xs text-gray-400">(Optional)</Text>
              </Text>

              <Dropdown
                style={{
                  height: 50,
                  borderColor: "#D1D5DB", // gray-300
                  borderWidth: 1,
                  borderRadius: 8,
                  paddingHorizontal: 12,
                  backgroundColor: "white",
                }}
                placeholderStyle={{ color: "#9CA3AF" }} // gray-400
                selectedTextStyle={{ color: "#111827" }} // gray-900
                itemTextStyle={{ color: "#111827" }}
                data={itemOptions}
                labelField="label"
                valueField="value"
                placeholder="Select item type"
                value={itemType}
                onChange={(item) => {
                  setItemType(item.value);
                }}
              />

              {/* Compatibility Warning */}
              {itemType && !isItemCompatible(itemType) && (
                <Text className="text-red-500 text-xs font-semibold mt-1 ml-2">
                  {/* display also what vehicle is compatible */}
                  Warning: Your selected item may not fit in the chosen vehicle.
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
                Upload Photo{" "}
                <Text className="text-xs text-gray-400">(Optional)</Text>
              </Text>
              <View className="flex-row items-center justify-between gap-2">
                {[0, 1, 2].map((i) => (
                  <Pressable
                    key={i}
                    onPress={handleAddPhoto}
                    className="items-center justify-center flex-1 gap-1 border relative border-gray-300 h-28 rounded-xl active:bg-gray-100"
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
                      <Ionicons name="camera-outline" size={22} color="gray" />
                    )}
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>

      <SheetButton
        next={() => router.push("/(root_screens)/booking/paymentMethod")}
      />
    </SafeAreaView>
  );
}
