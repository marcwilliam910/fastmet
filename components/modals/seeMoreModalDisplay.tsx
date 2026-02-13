import { useAppStore } from "@/store/useAppStore";
import { ActiveBooking, Booking } from "@/types/book";
import { createConversationId } from "@/utils/helpers/booking";
import { formatDate } from "@/utils/helpers/date";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useMemo, useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import ImageView from "react-native-image-viewing";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AttachedImages, ItemType, LocationUI, Note, PaymentInfo, SeeMoreHeader, SelectedServices } from "../BookingSeeMoreInfo";
import StarDisplay from "../StarDisplay";

function isActiveBooking(
  booking: Booking | ActiveBooking,
): booking is ActiveBooking {
  return "driver" in booking;
}

export default function SeeMoreModalDisplay({
  visible,
  onClose,
  type,
  data,
  onOpenDriverOffers,
}: {
  visible: boolean;
  onClose: () => void;
  type: string;
  data: Booking | ActiveBooking;
  onOpenDriverOffers?: () => void;
}) {
  const insets = useSafeAreaInsets();
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");

  // Memoize calculations to prevent recalculation on every render
  const { totalServicesPrice, hasAddedServices, hasFreeServices } = useMemo(() => {
    if (!data) return { totalServicesPrice: 0, hasAddedServices: false, hasFreeServices: false };

    const addedServices = data.addedServices ?? [];
    const freeServices = data.selectedVehicle?.freeServices ?? [];

    return {
      // service.price is already total (unit price × quantity) from bookSlice
      totalServicesPrice: addedServices.reduce(
        (total, service) => total + service.price,
        0,
      ),
      hasAddedServices: addedServices.length > 0,
      hasFreeServices: freeServices.length > 0,
    };
  }, [data]);

  if (!data) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          paddingTop: insets.top + 10, // respect status bar / notch
          paddingBottom: insets.bottom,
          backgroundColor: "white",
        }}
      >
        {/* Header */}
        <SeeMoreHeader onClose={onClose} bookingType={type} />

        {/* Content - Scrollable */}
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 20, paddingBottom: 30 }}
        >
          {/* Vehicle & Time Card */}
          <View
            className={`p-5 rounded-2xl ${type === "Cancelled Booking" ? "bg-red-500" : "bg-lightPrimary"}`}
          >
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="mb-1 text-sm text-white opacity-90">
                  Vehicle Type
                </Text>
                <Text className="text-xl font-bold text-white">
                  {data.selectedVehicle.name}
                </Text>
              </View>
              <View className="items-end">
                <Text className="mb-1 text-sm text-white opacity-90">
                  {type === "Cancelled Booking" ? "Cancelled At" : "Booked At"}
                </Text>
                <Text className="text-sm font-semibold text-white">
                  {formatDate(
                    type === "Cancelled Booking"
                      ? data.cancelledAt!
                      : data.createdAt,
                  )}
                </Text>
              </View>
            </View>
          </View>

          {/* Driver Card */}
          {isActiveBooking(data) &&
            data.driver?.name &&
            data.driver?.rating && (
              <View className="px-4 py-3">
                <Text className="mb-1 text-sm font-semibold text-gray-500">
                  Driver
                </Text>
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center justify-center gap-2">
                    {data.driver.profilePictureUrl ? (
                      <Pressable
                        className="w-[48px] h-[48px] rounded-full overflow-hidden"
                        onPress={() => {
                          setImageViewerVisible(true);
                          setSelectedImageUrl(data.driver.profilePictureUrl);
                        }}
                      >
                        <Image
                          source={{ uri: data.driver.profilePictureUrl }}
                          style={{ width: "100%", height: "100%" }}
                          contentFit="cover"
                        />
                      </Pressable>
                    ) : (
                      <Ionicons
                        name="person-circle"
                        size={44}
                        color="#F7931E"
                      />
                    )}
                    <View>
                      <Text className="text-lg font-semibold text-gray-800">
                        {data.driver.name}
                      </Text>
                      <View className="flex-row items-center gap-2 ">
                        <StarDisplay rating={data.driver.rating} />
                        <Text className="text-sm font-semibold text-gray-600">
                          ({data.driver.rating})
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View className="flex-row gap-5">
                    <Pressable
                      className="items-center active:scale-110"
                      hitSlop={20}
                      onPress={() =>
                        router.push({
                          pathname: "/message",
                          params: {
                            conversationId: createConversationId(
                              useAppStore.getState().id!,
                              data.driver.id,
                            ),
                          },
                        })
                      }
                    >
                      <Ionicons
                        name="chatbubble-ellipses"
                        size={Platform.OS === "ios" ? 28 : 24}
                        color="#F7931E"
                      />
                      <Text className="text-sm text-gray-600">Chat</Text>
                    </Pressable>
                    <Pressable className="items-center active:scale-110">
                      <Ionicons
                        name="call"
                        size={Platform.OS === "ios" ? 28 : 24}
                        color="#F7931E"
                      />
                      <Text className="text-sm text-gray-600">Call</Text>
                    </Pressable>
                  </View>
                </View>
              </View>
            )}

          {/* Location Details */}
          <View className="p-5 bg-gray-50 rounded-2xl">
            <Text className="mb-4 text-base font-semibold text-gray-800">
              Trip Details
            </Text>

            <LocationUI
              pickUp={data.pickUp}
              dropOff={data.dropOff}
            />

            {/* Distance */}
            <View className="flex-row items-center justify-between p-3 mt-4 bg-white rounded-lg">
              <Text className="text-sm text-gray-600">Distance</Text>
              <Text className="text-lg font-bold text-lightPrimary">
                {data.routeData.distance.toFixed(2)} km
              </Text>
            </View>

            {/* Booking Type */}
            <View className="flex-row items-center justify-between p-3  bg-white rounded-lg">
              <Text className="text-sm font-semibold text-gray-600">
                {data.bookingType.type === "schedule"
                  ? "Scheduled on"
                  : data.bookingType.type.toUpperCase()}
              </Text>
              {data.bookingType.type === "schedule" ? (
                <Text className="text-sm font-bold text-gray-600">
                  {formatDate(data.bookingType.value || "")}
                </Text>
              ) : (
                <Text className="text-sm font-bold text-gray-600">
                  {data.bookingType.value}
                </Text>
              )}
            </View>

            <View className="mt-5 self-end">
              <Text className="text-xs font-bold text-gray-600">
                Reference: {data.bookingRef}
              </Text>
            </View>
          </View>

          {/* Payment Info */}
          <PaymentInfo paymentMethod={data.paymentMethod} routeData={data.routeData} />

          {/* Selected Services */}
          {(hasFreeServices || hasAddedServices) && (
            <SelectedServices
              addedServices={data.addedServices}
              hasFreeServices={hasFreeServices}
              hasAddedServices={hasAddedServices}
              totalServicesPrice={totalServicesPrice}
              freeServices={data.selectedVehicle?.freeServices}
            />
          )}

          {/* Item Type */}
          {data.itemType && (
            <ItemType itemType={data.itemType} />
          )}

          {/* Note */}
          {data.note && (
            <Note note={data.note} />
          )}

          {/* Images */}
          {data.photos && data.photos.length > 0 && (
            <AttachedImages photos={data.photos} setImageViewerVisible={setImageViewerVisible} setSelectedImageUrl={setSelectedImageUrl} />
          )}

          {type === "Active Booking" && (
            <Pressable
              className="items-center flex-row gap-2 justify-center py-3 mx-4 rounded-lg bg-lightPrimary active:bg-darkPrimary"
              onPress={() => {
                console.log(data._id);
                onClose();
                router.push({
                  pathname: "/(root_screens)/booking/viewOnMap",
                  params: { bookingId: data._id, shouldGoBack: "true" },
                });
              }}
            >
              <Ionicons name="map-outline" size={20} color="#fff" />
              <Text className="text-lg font-bold text-white">View on Map</Text>
            </Pressable>
          )}

          {type === "Request Booking" && data.requestedDrivers.length > 0 && (
            <Pressable
              className="items-center flex-row gap-2 justify-center py-3 mx-4 rounded-lg bg-lightPrimary active:bg-darkPrimary"
              onPress={() => onOpenDriverOffers?.()}
            >
              <Ionicons name="car-outline" size={22} color="#FFFFFF" />
              <Text className="text-lg font-bold text-white">
                View Driver Offers
              </Text>
            </Pressable>
          )}
        </ScrollView>
      </View>
      <ImageView
        images={[{ uri: selectedImageUrl }]}
        imageIndex={0}
        visible={imageViewerVisible}
        onRequestClose={() => setImageViewerVisible(false)}
      />
    </Modal>
  );
}
