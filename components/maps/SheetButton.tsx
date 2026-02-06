import { useAuth } from "@/hooks/useAuth";
import { useAppStore } from "@/store/useAppStore";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import NotLoggedInModal from "../modals/notLoggedInModal";

const SheetButton = ({
  next,
  isLast,
}: {
  next: () => void;
  isLast?: boolean;
}) => {
  const insets = useSafeAreaInsets();
  const [showModal, setShowModal] = useState(false);
  const { isLoggedIn } = useAuth();

  const selectedVehicle = useAppStore((state) => state.selectedVehicle);
  const pickUp = useAppStore((state) => state.pickUp);
  const dropOff = useAppStore((state) => state.dropOff);
  const routeData = useAppStore((state) => state.routeData);
  const calculatePrice = useAppStore((state) => state.calculatePrice);
  const isProfileComplete = useAppStore((state) => state.isProfileComplete);

  const handleNext = () => {
    if (!isLoggedIn) setShowModal(true);
    else if (!isProfileComplete) {
      Toast.show({
        type: "info",
        text1: "Incomplete Profile",
        text2: "Please complete your profile to continue",
        position: "top",
        visibilityTime: 5_000,
        swipeable: true,
        topOffset: 50,
      });
      router.replace("/(auth)/profile-register");
    }
    else next();
  };

  const isDisable =
    !selectedVehicle || !pickUp || !dropOff || !routeData.totalPrice;
  useEffect(() => {
    if (pickUp && dropOff && selectedVehicle?.variant) {
      calculatePrice();
    }
  }, [pickUp, dropOff, selectedVehicle?.variant, calculatePrice]);

  return (
    <View
      className="px-5 py-3 gap-3 bg-white z-30"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        bottom: 0,

        paddingBottom: insets.bottom + 10,
      }}
    >
      <View className="flex-row items-center justify-between">
        <Text className="font-semibold">Total Amount</Text>
        <Text className="font-bold text-lightPrimary text-lg">
          Php {routeData.totalPrice.toFixed(2)}
        </Text>
      </View>

      <Pressable
        disabled={isDisable}
        className={`flex-1 py-3 rounded-md bg-lightPrimary active:bg-darkPrimary ${isDisable ? "opacity-60" : ""}`}
        onPress={handleNext}
      >
        <Text className="font-bold text-center text-lg text-white">
          {isLast ? "Book Now" : "Next"}
        </Text>
      </Pressable>
      <NotLoggedInModal visible={showModal} setVisible={setShowModal} />
    </View>
  );
};

export default SheetButton;

{
  /* Distance and Duration */
}
{
  /* <View className="flex-row justify-between items-center">
<Text className="text-gray-500 text-sm">
  Distance: {routeData.distance.toFixed(2)} km
</Text>
<Text className="text-gray-500 text-sm">
  Duration: {Math.round(routeData.duration)} min
</Text>
</View> */
}
