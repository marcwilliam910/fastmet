import {useBookStore} from "@/store/useBookStore";
import {METHODS} from "@/utils/constants";
import {Ionicons} from "@expo/vector-icons";
import BottomSheet, {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {router} from "expo-router";
import React, {useMemo, useRef, useState} from "react";
import {Dimensions, Pressable, Switch, Text, View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";

const PaymentSheet = ({
  isCoD,
  setIsCoD,
}: {
  isCoD: boolean;
  setIsCoD: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const sheetRef = useRef<BottomSheet>(null);
  const {height: screenHeight} = Dimensions.get("window");
  const [favoriteFirst, setFavoriteFirst] = useState(false);
  const selectedMethod = useBookStore((state) => state.selectedMethod);
  const isTollVisited = useBookStore((state) => state.isTollVisited);

  const inset = useSafeAreaInsets();

  // Convert 40% to actual pixels, then subtract inset.bottom
  const snapPoints = useMemo(() => {
    const first = 0.07 * (screenHeight + inset.bottom) + (isCoD ? 40 : 0);
    const second = 0.4 * (screenHeight + inset.bottom) + (isCoD ? 40 : -20);
    return [first, second];
  }, [inset.bottom, screenHeight, isCoD]);
  return (
    <BottomSheet
      ref={sheetRef}
      index={1}
      enableDynamicSizing={false}
      enableContentPanningGesture={false} // 👈 This is the key
      snapPoints={snapPoints}
      handleIndicatorStyle={{backgroundColor: "#FFA840"}}
      bottomInset={inset.bottom}
      backgroundStyle={{borderWidth: 1, borderColor: "#e5e7eb"}}
    >
      <BottomSheetScrollView
        className="px-4 "
        contentContainerStyle={{
          gap: 8,
          paddingBottom: 10,
          paddingTop: 15,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Tolls, Parking fee & others */}
        <View
          className={`relative flex-row items-center justify-between px-4 py-4 border rounded-lg  ${isTollVisited ? "border-lightPrimary" : "border-gray-300"}`}
        >
          <Text className="font-semibold text-gray-800">
            Tolls, Parking fee & others
          </Text>
          <Pressable
            onPress={() => router.push("/(root_screens)/booking/fees")}
          >
            <Text className="text-sm underline">View all</Text>
          </Pressable>
          {isTollVisited && (
            <View className="absolute items-center justify-center rounded-full -right-1 -top-2 size-5 bg-lightPrimary">
              <Ionicons name="checkmark-outline" size={14} color="white" />
            </View>
          )}
        </View>

        {/* Request Method*/}
        <View
          className={`relative gap-3 px-4 py-4 border rounded-lg ${selectedMethod ? "border-lightPrimary" : "border-gray-300"} ${isTollVisited ? "" : "bg-gray-100 opacity-50"}`}
        >
          <View className="flex-row items-center justify-between ">
            <Text className="font-semibold text-gray-800">
              {selectedMethod ? METHODS[selectedMethod] : "Request Method"}
            </Text>
            <Pressable
              disabled={!isTollVisited}
              onPress={() =>
                router.push("/(root_screens)/booking/request_method")
              }
            >
              <Text className="text-sm underline">
                {selectedMethod ? "Change" : "Select"}
              </Text>
            </Pressable>
          </View>
          <View className="flex-row items-center justify-between ">
            <Text className="font-semibold text-gray-800">
              Favorite Driver First
            </Text>

            <Switch
              disabled={!isTollVisited}
              trackColor={{false: "gray", true: "#FFA840"}}
              thumbColor={"white"}
              ios_backgroundColor="#ccc"
              onValueChange={setFavoriteFirst}
              value={favoriteFirst}
              style={{transform: [{scaleX: 1.2}, {scaleY: 1.1}]}}
            />
          </View>

          {selectedMethod && (
            <View className="absolute items-center justify-center rounded-full -right-1 -top-2 size-5 bg-lightPrimary">
              <Ionicons name="checkmark-outline" size={14} color="white" />
            </View>
          )}
        </View>

        {/* Payment Method */}
        <View
          className={`relative flex-row items-center justify-between px-4 py-4 border border-gray-300 rounded-lg ${selectedMethod ? "" : "bg-gray-100 opacity-50"}`}
        >
          <Text className="font-semibold text-gray-800 ">Payment Method</Text>
          <Pressable
            disabled={!selectedMethod}
            className="flex-row items-center gap-2"
            onPress={() =>
              router.push("/(root_screens)/booking/payment-method")
            }
          >
            <View className="items-center justify-center h-8 bg-gray-300 w-14" />
            <Text className="text-sm font-bold underline">Select</Text>
          </Pressable>
          {/* <View className="absolute items-center justify-center rounded-full -right-1 -top-2 size-5 bg-lightPrimary">
            <Ionicons name="checkmark-outline" size={14} color="white" />
          </View> */}
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default PaymentSheet;
