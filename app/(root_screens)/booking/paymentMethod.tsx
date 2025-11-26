import SheetButton from "@/components/maps/SheetButton";
import useAuth from "@/hooks/useAuth";
import { useSocket } from "@/sockets/context/SocketProvider";
import { handleBookingSaved, requestBooking } from "@/sockets/handlers/booking";
import { useAppStore } from "@/store/useAppStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function PaymentMethod() {
  const book = useAppStore.getState();
  const paymentMethod = useAppStore((state) => state.paymentMethod);
  const setPaymentMethod = useAppStore((state) => state.setPaymentMethod);

  const setLoading = useAppStore((state) => state.setLoading);

  const { user } = useAuth();

  const socket = useSocket();

  const submitRequest = async () => {
    setLoading(true);
    const payload = {
      userId: user?.uid,
      pickUp: book.pickUp,
      dropOff: book.dropOff,
      bookingType: book.bookingType,
      selectedVehicle: {
        id: book.selectedVehicle?.id,
        name: book.selectedVehicle?.name,
        capacity: book.selectedVehicle?.capacity,
      },
      routeData: book.routeData,
      paymentMethod: book.paymentMethod,
      addedServices: book.addedServices,
    };

    requestBooking(socket, payload);
  };

  useEffect(() => {
    const bookingSaved = (data: { success: boolean }) => {
      setLoading(false);
      if (data.success) {
        book.clearStates();

        Toast.show({
          type: "success",
          text1: "Booking Request Saved",
          text2: "You will be notified when a driver accepts your request",
          position: "top",
          visibilityTime: 5_000,
          swipeable: true,
          topOffset: 50,
        });

        router.push("/(drawer)/(tabs)/request");
      }
    };

    handleBookingSaved(socket, bookingSaved);

    return () => {
      socket.off("booking_request_saved", bookingSaved);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {/* header */}
      <View className="relative flex-row items-center justify-center px-6 pt-2 pb-8">
        <Pressable
          className="absolute left-5 top-1.5"
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={28} color="#FFA840" />
        </Pressable>
        <Text className="text-lg font-semibold">Payment Method</Text>
        <Text className="absolute text-sm font-semibold right-5 top-3.5">
          Step 4/4
        </Text>
      </View>

      <View className="gap-3 px-6">
        {/* Cash Payment Option */}
        <Pressable
          onPress={() => setPaymentMethod("cash")}
          className={`flex-row items-center justify-between rounded-xl border px-4 py-3 ${
            paymentMethod === "cash"
              ? "border-[#FFA840] bg-[#FFF6EB]"
              : "border-gray-300 bg-white"
          }`}
        >
          <View className="flex-row items-center gap-3">
            <View className="items-center justify-center w-6 h-6 rounded-full bg-lightPrimary/20">
              <Text className="font-bold text-lightPrimary">₱</Text>
            </View>
            <View>
              <Text className="text-sm font-medium text-gray-800">
                Cash Payment
              </Text>
              <Text className="text-xs text-gray-500">
                Pay directly to driver
              </Text>
            </View>
          </View>
          {paymentMethod === "cash" && (
            <Ionicons name="checkmark-sharp" size={24} color="#FFA840" />
          )}
        </Pressable>

        {/* Online Payment Option (Disabled for now) */}
        <Pressable
          onPress={() => setPaymentMethod("online")}
          className={`flex-row items-center justify-between rounded-xl border px-4 py-3 ${
            paymentMethod === "online"
              ? "border-[#FFA840] bg-[#FFF6EB]"
              : "border-gray-300 bg-white"
          }`}
        >
          <View className="flex-row items-center gap-3">
            <View className="items-center justify-center w-6 h-6 rounded-full bg-lightPrimary/20">
              <Text className="font-bold text-lightPrimary">💳</Text>
            </View>
            <View>
              <Text className="text-sm font-medium text-gray-800">
                Online Payment
              </Text>
              <Text className="text-xs text-gray-500">by Xendit</Text>
            </View>
          </View>
          {paymentMethod === "online" && (
            <Ionicons name="checkmark-sharp" size={24} color="#FFA840" />
          )}
        </Pressable>
      </View>
      <SheetButton next={submitRequest} isLast={true} />
    </SafeAreaView>
  );
}
