import { useAuth } from "@/hooks/useAuth";
import { useAppStore } from "@/store/useAppStore";
import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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

  const handleNext = () => {
    if (!isLoggedIn) setShowModal(true);
    else next();
  };

  const isDisable = !selectedVehicle || !pickUp || !dropOff;

  useEffect(() => {
    if (pickUp && dropOff) calculatePrice();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pickUp, dropOff]);

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
