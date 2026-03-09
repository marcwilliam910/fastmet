import { useAuth } from "@/hooks/useAuth";
import { queryClient } from "@/lib/queryClient";
import { useSocket } from "@/sockets/context/SocketProvider";
import { useAppStore } from "@/store/useAppStore";
import { Booking, RequestBooking } from "@/types/book";
import { STATIC_IMAGES } from "@/utils/constants";
import { generateBookingRef } from "@/utils/helpers/booking";
import { uploadBookingImages } from "@/utils/helpers/imagePicker";
import { Ionicons } from "@expo/vector-icons";
import { InfiniteData } from "@tanstack/react-query";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Platform, Pressable, Text, View } from "react-native";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function PaymentMethod() {
  const insets = useSafeAreaInsets();
  const paymentMethod = useAppStore((state) => state.paymentMethod);
  const isLoading = useAppStore((state) => state.isLoading);

  const { bookingType, setPaymentMethod, routeData } = useAppStore.getState();
  const [loading, setLoading] = useState(false);

  const { id } = useAuth();
  const socket = useSocket();
  const hasNavigatedRef = useRef(false);
  const isSubmittingRef = useRef(false);
  const lastBookingRefRef = useRef<string | null>(null);

  const handleBookNow = async () => {
    // Immediate protection against rapid clicks (ref is synchronous, no render delay)
    if (isSubmittingRef.current || isLoading) {
      return;
    }

    try {
      isSubmittingRef.current = true;
      setLoading(true);

      const {
        selectedVehicle,
        pickUp,
        dropOff,
        addedServices,
        photos,
        note,
        itemType,
      } = useAppStore.getState();

      if (!selectedVehicle || !selectedVehicle.variant || !pickUp || !dropOff) {
        setLoading(false);
        isSubmittingRef.current = false;
        return;
      }

      const bookingRef = generateBookingRef({
        bookingType: bookingType.type,
        vehicleType: selectedVehicle.key,
        priority: bookingType.type === "asap" ? bookingType.value : undefined,
      });

      // Idempotency check: prevent duplicate submission with same booking ref
      if (lastBookingRefRef.current === bookingRef) {
        console.warn(
          "⚠️ Duplicate booking ref detected, ignoring:",
          bookingRef,
        );
        setLoading(false);
        isSubmittingRef.current = false;
        return;
      }

      lastBookingRefRef.current = bookingRef;

      // Upload images first
      const uploadResult = await uploadBookingImages(photos, bookingRef);

      if (!uploadResult.success) {
        Toast.show({
          type: "error",
          text1: "Upload Failed",
          text2: "Could not upload photos. Please try again.",
          position: "top",
          visibilityTime: 4000,
        });
        setLoading(false);
        return;
      }

      const payload: RequestBooking = {
        customerId: id!,
        bookingRef,
        pickUp: pickUp,
        dropOff: dropOff,
        bookingType: bookingType,
        selectedVehicle: {
          _id: selectedVehicle._id,
          key: selectedVehicle.key,
          variant: selectedVehicle.variant,
          searchConfig: selectedVehicle.searchConfig,
        },
        routeData: routeData,
        paymentMethod: paymentMethod,
        addedServices: addedServices.map((service) => ({
          key: service.key,
          name: service.name,
          price: service.price,
          quantity: service.quantity,
        })),
        photos: uploadResult.images, // Cloudinary URLs
        note: note.trim(),
        itemType: itemType,
      };

      console.log("📤 Sending booking request:", payload);

      // Send via socket
      if (bookingType.type === "asap") {
        socket.emit("request_asap_booking", payload);
      } else if (bookingType.type === "schedule") {
        socket.emit("request_schedule_booking", payload);
      } else if (bookingType.type === "pooling") {
        socket.emit("request_pooling_booking", payload);
      }
    } catch (error) {
      console.error("Booking submission error:", error);
      setLoading(false);
      isSubmittingRef.current = false;

      Toast.show({
        type: "error",
        text1: "Booking Failed",
        text2: error instanceof Error ? error.message : "Something went wrong",
        position: "top",
        visibilityTime: 4000,
      });
    }
  };

  useEffect(() => {
    const bookingSaved = (data: {
      success: boolean;
      bookingId: string;
      message: string;
    }) => {
      // Guard against duplicate events causing multiple navigation
      if (hasNavigatedRef.current) return;

      setLoading(false);

      if (data.success) {
        hasNavigatedRef.current = true;

        // Build a Booking from store state and prepend to pending cache
        const state = useAppStore.getState();
        const newBooking: Booking = {
          _id: data.bookingId,
          bookingRef: lastBookingRefRef.current ?? "",
          customerId: id!,
          pickUp: state.pickUp,
          dropOff: state.dropOff,
          bookingType: {
            type: state.bookingType.type,
            value: state.bookingType.value,
          },
          selectedVehicle: {
            name: state.selectedVehicle?.name ?? "",
            freeServices: state.selectedVehicle?.freeServices ?? [],
          },
          routeData: state.routeData,
          paymentMethod: state.paymentMethod,
          addedServices: state.addedServices,
          note: state.note.trim(),
          itemType: state.itemType,
          photos: state.photos,
          createdAt: new Date().toISOString(),
          status: "pending",
          driverRating: null,
          cancelledAt: null,
          requestedDrivers: [],
        };

        if (bookingType.type === "asap")
          router.push({
            pathname: "/(root_screens)/booking/searchingDriver",
            params: { bookingId: data.bookingId },
          });
        else {
          Toast.show({
            type: "success",
            text1: "Booking Request Saved",
            text2: data.message,
            position: "top",
            visibilityTime: 5_000,
            swipeable: true,
            topOffset: 50,
          });
          queryClient.invalidateQueries({
            queryKey: ["userBookingCounts"],
          });
          router.replace("/(drawer)/(tabs)/request");

          // Prepend to pending cache so the Request tab shows it immediately
          queryClient.setQueriesData<
            InfiniteData<{ bookings: Booking[]; nextPage: number | null }>
          >({ queryKey: ["userBookings", "pending"] }, (oldData) => {
            if (!oldData) return oldData;
            const newPages = [...oldData.pages];
            newPages[0] = {
              ...newPages[0],
              bookings: [newBooking, ...newPages[0].bookings],
            };
            return { ...oldData, pages: newPages };
          });
        }

        state.clearStates();
      }
    };

    socket.on("bookingRequestSaved", bookingSaved);
    return () => {
      socket.off("bookingRequestSaved", bookingSaved);
    };
  }, [id, setLoading, socket, bookingType.type]);

  useEffect(() => {
    const handleBookingFailed = (data: { message: string }) => {
      setLoading(false);
      isSubmittingRef.current = false;
      // Reset booking ref on failure so user can retry
      lastBookingRefRef.current = null;

      Toast.show({
        type: "error",
        text1: "Booking Failed",
        text2: data.message || "Something went wrong",
        position: "top",
        visibilityTime: 4000,
      });
    };

    socket.on("bookingRequestFailed", handleBookingFailed);
    return () => {
      socket.off("bookingRequestFailed", handleBookingFailed);
    };
  }, [socket, setLoading]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      {/* header */}
      <View className="relative flex-row justify-center items-center px-6 pt-2 pb-8">
        <Pressable
          className="absolute left-5 top-1.5"
          onPress={() => router.back()}
          hitSlop={20}
        >
          <Ionicons
            name="chevron-back"
            size={Platform.OS === "ios" ? 32 : 28}
            color="#FFA840"
          />
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
          <View className="flex-row gap-3 items-center">
            <View className="justify-center items-center w-10 h-10 bg-blue-50 rounded-full">
              <Image
                source={STATIC_IMAGES.cashPayment}
                style={{ width: 24, height: 24 }}
                contentFit="contain"
              />
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

        {/* GCash Payment Option */}
        <Pressable
          onPress={() => setPaymentMethod("gcash")}
          className={`flex-row items-center justify-between rounded-xl border px-4 py-3 ${
            paymentMethod === "gcash"
              ? "border-[#FFA840] bg-[#FFF6EB]"
              : "border-gray-300 bg-white"
          }`}
        >
          <View className="flex-row gap-3 items-center">
            <View className="justify-center items-center w-10 h-10 bg-blue-50 rounded-full">
              <Image
                source={STATIC_IMAGES.gcash}
                style={{ width: 24, height: 24 }}
                contentFit="contain"
              />
            </View>
            <View>
              <Text className="text-sm font-medium text-gray-800">GCash</Text>
              <Text className="text-xs text-gray-500">
                Pay via GCash wallet
              </Text>
            </View>
          </View>
          {paymentMethod === "gcash" && (
            <Ionicons name="checkmark-sharp" size={24} color="#FFA840" />
          )}
        </Pressable>
      </View>
      <View
        className="z-30 gap-2 px-5 py-3 bg-white"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          paddingBottom: insets.bottom + 10,
        }}
      >
        {/* Fare Breakdown */}
        {routeData.basePrice > 0 && (
          <View className="flex-row justify-between items-center">
            <Text className="text-xs font-semibold text-gray-500">
              Base Fare
            </Text>
            <Text className="text-xs font-semibold text-gray-500">
              Php {routeData.basePrice.toFixed(2)}
            </Text>
          </View>
        )}

        {routeData.distanceFee > 0 && (
          <View className="flex-row justify-between items-center">
            <Text className="text-xs font-semibold text-gray-500">
              Distance / Duration ({routeData.distance.toFixed(2)} km -{" "}
              {routeData.duration.toFixed(0)} min)
            </Text>
            <Text className="text-xs font-semibold text-gray-500">
              Php {routeData.distanceFee.toFixed(2)}
            </Text>
          </View>
        )}

        {routeData.serviceFee > 0 && (
          <View className="flex-row justify-between items-center">
            <Text className="text-xs font-semibold text-gray-500">
              Added Services ({useAppStore.getState().addedServices.length})
            </Text>
            <Text className="text-xs font-semibold text-gray-500">
              Php {routeData.serviceFee.toFixed(2)}
            </Text>
          </View>
        )}

        {/* Total */}
        <View className="flex-row justify-between items-center mt-1">
          <Text className="font-semibold">Total Amount</Text>
          <Text className="text-lg font-bold text-lightPrimary">
            Php {routeData.totalPrice.toFixed(2)}
          </Text>
        </View>

        <Pressable
          className={`flex-1 py-3 rounded-md bg-lightPrimary ${loading ? "opacity-50" : "active:bg-darkPrimary"}`}
          onPress={handleBookNow}
          disabled={loading}
        >
          <Text className="font-bold text-center text-lg text-white">
            {loading ? "Loading..." : "Book Now"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
