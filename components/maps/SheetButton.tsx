import { useAuth } from "@/hooks/useAuth";
import { useAppStore } from "@/store/useAppStore";
import {
  canBook,
  hasProfile,
  hasSubmittedId,
} from "@/utils/helpers/onboarding";
import { router, type Href } from "expo-router";
import React, { useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import NotLoggedInModal from "../modals/notLoggedInModal";

const SheetButton = ({
  next,
  isLast,
  isSurgeLoading,
}: {
  next: () => void;
  isLast?: boolean;
  isSurgeLoading?: boolean;
}) => {
  const insets = useSafeAreaInsets();
  const [showModal, setShowModal] = useState(false);
  const { isLoggedIn } = useAuth();

  const selectedVehicle = useAppStore((state) => state.selectedVehicle);
  const pickUp = useAppStore((state) => state.pickUp);
  const dropOff = useAppStore((state) => state.dropOff);
  const routeData = useAppStore((state) => state.routeData);
  const registrationStep = useAppStore((state) => state.registrationStep);
  const approvalStatus = useAppStore((state) => state.approvalStatus);

  const handleNext = () => {
    if (!isLoggedIn) {
      setShowModal(true);
      return;
    }

    if (!hasProfile(registrationStep)) {
      Toast.show({
        type: "info",
        text1: "Complete your profile",
        text2: "Profile is required before you can book.",
        position: "top",
        visibilityTime: 5_000,
        swipeable: true,
        topOffset: 50,
      });
      router.push("/(auth)/profile-register");
      return;
    }

    if (!hasSubmittedId(registrationStep)) {
      Toast.show({
        type: "info",
        text1: "ID verification required",
        text2: "Submit your ID and selfie to continue.",
        position: "top",
        visibilityTime: 5_000,
        swipeable: true,
        topOffset: 50,
      });
      router.push("/(auth)/id-verification" as Href);
      return;
    }

    if (approvalStatus === "rejected") {
      Toast.show({
        type: "error",
        text1: "Verification rejected",
        text2: "Please resubmit your documents.",
        position: "top",
        visibilityTime: 5_000,
        swipeable: true,
        topOffset: 50,
      });
      router.push("/(auth)/verification-resubmit" as Href);
      return;
    }

    if (!canBook(approvalStatus)) {
      Toast.show({
        type: "info",
        text1: "Verification in progress",
        text2: "You can book once your account is approved.",
        position: "top",
        visibilityTime: 5_000,
        swipeable: true,
        topOffset: 50,
      });
      return;
    }

    next();
  };

  const isDisabled =
    !selectedVehicle ||
    !pickUp ||
    !dropOff ||
    !routeData.totalPrice ||
    isSurgeLoading;

  const isPriceLoading = !!pickUp && isSurgeLoading;

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

        {isPriceLoading ? (
          <View className="flex-row items-center gap-2">
            <ActivityIndicator size="small" color="#FFA840" />
            <Text className="text-gray-400 text-sm">Calculating...</Text>
          </View>
        ) : (
          <Text className="font-bold text-lightPrimary text-lg">
            Php {routeData.totalPrice.toFixed(2)}
          </Text>
        )}
      </View>

      <Pressable
        disabled={isDisabled}
        className={`flex-1 py-3 rounded-md bg-lightPrimary active:bg-darkPrimary ${isDisabled ? "opacity-60" : ""}`}
        onPress={handleNext}
      >
        {isSurgeLoading ? (
          <ActivityIndicator color="white" />
        ) : (
          <Text className="font-bold text-center text-lg text-white">
            {isLast ? "Book Now" : "Next"}
          </Text>
        )}
      </Pressable>

      <NotLoggedInModal visible={showModal} setVisible={setShowModal} />
    </View>
  );
};

export default SheetButton;
