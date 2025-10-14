import {Ionicons} from "@expo/vector-icons";
import BottomSheet, {BottomSheetScrollView} from "@gorhom/bottom-sheet";
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

  const inset = useSafeAreaInsets();

  // Convert 40% to actual pixels, then subtract inset.bottom
  const snapPoints = useMemo(() => {
    const first = 0.07 * (screenHeight + inset.bottom) + (isCoD ? 50 : 0);
    const second = 0.4 * (screenHeight + inset.bottom) + (isCoD ? 50 : -10);
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
        <View className="relative flex-row items-center justify-between px-4 py-4 border border-gray-300 rounded-lg">
          <Text className="text-lg font-semibold text-gray-800">
            Tolls, Parking fee & others
          </Text>
          <Pressable>
            <Text className="underline">View all</Text>
          </Pressable>
          <View className="absolute items-center justify-center rounded-full -right-1 -top-2 size-6 bg-lightPrimary">
            <Ionicons name="checkmark-outline" size={16} color="white" />
          </View>
        </View>

        {/* Regular Request */}
        <View className="relative gap-3 px-4 py-4 border border-gray-300 rounded-lg">
          <View className="flex-row items-center justify-between ">
            <Text className="text-lg font-semibold text-gray-800">
              Regular Request
            </Text>
            <Pressable>
              <Text className="underline">Change</Text>
            </Pressable>
          </View>
          <View className="flex-row items-center justify-between ">
            <Text className="text-lg font-semibold text-gray-800">
              Favorite Driver First
            </Text>

            <Switch
              trackColor={{false: "gray", true: "#FFA840"}}
              thumbColor={"white"}
              ios_backgroundColor="#3e3e3e"
              onValueChange={setFavoriteFirst}
              value={favoriteFirst}
              style={{transform: [{scaleX: 1.4}, {scaleY: 1.3}]}}
            />
          </View>

          <View className="absolute items-center justify-center rounded-full -right-1 -top-2 size-6 bg-lightPrimary">
            <Ionicons name="checkmark-outline" size={16} color="white" />
          </View>
        </View>

        <View className="relative flex-row items-center justify-between px-4 py-4 border border-gray-300 rounded-lg">
          <Text className="text-lg font-semibold text-gray-800">
            Payment Method
          </Text>
          <Pressable
            className="flex-row items-center gap-2"
            onPress={() => setIsCoD(!isCoD)}
          >
            <View className="h-8 bg-gray-300 w-14" />
            <Text className="font-bold underline">Select</Text>
          </Pressable>
          <View className="absolute items-center justify-center rounded-full -right-1 -top-2 size-6 bg-lightPrimary">
            <Ionicons name="checkmark-outline" size={16} color="white" />
          </View>
        </View>
      </BottomSheetScrollView>
    </BottomSheet>
  );
};

export default PaymentSheet;
