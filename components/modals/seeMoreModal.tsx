import { ActiveBooking, Booking } from "@/types/book";
import { Service } from "@/types/vehicle";
import { formatDate } from "@/utils/date";
import { formatLocation } from "@/utils/helper";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useState } from "react";
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
import StarDisplay from "../StarDisplay";

function isActiveBooking(
  booking: Booking | ActiveBooking
): booking is ActiveBooking {
  return "driver" in booking;
}

export default function SeeMoreModal({
  visible,
  onClose,
  type,
  data,
}: {
  visible: boolean;
  onClose: () => void;
  type: string;
  data: Booking | ActiveBooking;
}) {
  const insets = useSafeAreaInsets();
  const [imageViewerVisible, setImageViewerVisible] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");

  if (!data) return null;

  const totalServicesPrice = data.addedServices.reduce(
    (total, service) => total + service.price,
    0
  );

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
        <View className="flex-row items-center justify-center px-4 pb-4">
          <Pressable
            onPress={onClose}
            className="absolute left-4 -top-1"
            hitSlop={30}
          >
            <Ionicons
              name="chevron-back-outline"
              size={Platform.OS === "ios" ? 34 : 28}
              color="#FFA840"
            />
          </Pressable>
          <Text className="text-lg font-semibold capitalize">{type}</Text>
        </View>

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
                  {formatDate(data.createdAt)}
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
                      <StarDisplay rating={data.driver.rating} />
                    </View>
                  </View>

                  <View className="flex-row gap-5">
                    <Pressable className="items-center active:scale-110">
                      <Ionicons
                        name="call"
                        size={Platform.OS === "ios" ? 28 : 24}
                        color="#F7931E"
                      />
                      <Text className="text-sm text-gray-600">Call</Text>
                    </Pressable>
                    <Pressable className="items-center active:scale-110">
                      <Ionicons
                        name="chatbubble-ellipses"
                        size={Platform.OS === "ios" ? 28 : 24}
                        color="#F7931E"
                      />
                      <Text className="text-sm text-gray-600">Chat</Text>
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

            <View className="relative flex-row items-start justify-between ml-5 mr-2 border-l border-dashed border-lightPrimary pl-7">
              <View className="gap-5 flex-1">
                {/* Pickup */}
                <View>
                  <Text className="text-sm font-medium text-gray-900">
                    {formatLocation(data.pickUp)}
                  </Text>

                  {data.pickUp?.additionalDetails && (
                    <Text
                      className="mt-1 text-xs text-gray-500"
                      numberOfLines={3}
                    >
                      {data.pickUp.additionalDetails}
                    </Text>
                  )}
                </View>

                {/* Dropoff */}
                <View>
                  <Text className="text-sm font-medium text-gray-900">
                    {formatLocation(data.dropOff)}
                  </Text>

                  {data.dropOff?.additionalDetails && (
                    <Text
                      className="mt-1 text-xs text-gray-500"
                      numberOfLines={3}
                    >
                      {data.dropOff.additionalDetails}
                    </Text>
                  )}
                </View>
              </View>

              <Ionicons
                name="location-sharp"
                size={24}
                color="#FFA840"
                className="absolute -left-3.5 -top-1  bg-gray-50"
              />

              <Ionicons
                name="locate-sharp"
                size={24}
                color="#FFA840"
                className="absolute -left-3.5 -bottom-3 pb-2  bg-gray-50"
              />
            </View>

            {/* Distance */}
            <View className="flex-row items-center justify-between p-3 mt-4 bg-white rounded-lg">
              <Text className="text-sm text-gray-600">Distance</Text>
              <Text className="text-lg font-bold text-lightPrimary">
                {data.routeData.distance.toFixed(2)} km
              </Text>
            </View>

            {/* Booking Type */}
            <View className="flex-row items-center justify-between p-3 mt-0 bg-white rounded-lg">
              <Text className="text-sm font-bold text-gray-600">
                {data.bookingType.type === "schedule"
                  ? "Schedule"
                  : data.bookingType.value}
              </Text>
              {data.bookingType.type === "schedule" && (
                <Text className="text-sm font-bold text-gray-600">
                  {formatDate(data.bookingType.value || "")}
                </Text>
              )}
            </View>
          </View>

          {/* Payment Info */}
          <View className="p-5 bg-gray-50 rounded-2xl">
            <Text className="mb-3 text-base font-semibold text-gray-800">
              Payment Information (
              {data.paymentMethod === "cash"
                ? "Cash Payment"
                : "Online Payment"}
              )
            </Text>
            {/* Price Breakdown */}
            <View className="p-4 bg-white rounded-xl gap-2">
              {/* <View className="flex-row items-center mb-2">
                <Ionicons
                  name={
                    data.paymentMethod === "cash"
                      ? "cash-outline"
                      : "card-outline"
                  }
                  size={22}
                  color="#666"
                />
                <Text className="ml-3 text-base text-gray-600">
                  {data.paymentMethod === "cash"
                    ? "Cash Payment"
                    : "Online Payment"}
                </Text>
              </View> */}
              <View className="flex-row justify-between">
                <Text className="text-xs text-gray-500">Base Fare</Text>
                <Text className="text-xs font-semibold text-gray-700">
                  Php{" "}
                  {data.routeData.basePrice.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-xs text-gray-500">Distance Fee</Text>
                <Text className="text-xs font-semibold text-gray-700">
                  Php{" "}
                  {data.routeData.distanceFee.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
              </View>

              <View className="flex-row justify-between">
                <Text className="text-xs text-gray-500">Service Fee</Text>
                <Text className="text-xs font-semibold text-gray-700">
                  {data.routeData.serviceFee > 0
                    ? `Php ${data.routeData.serviceFee.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : "FREE"}
                </Text>
              </View>

              {/* Divider */}
              <View className="h-px my-2 bg-gray-200" />

              {/* Total */}
              <View className="flex-row justify-between ">
                <Text className="text-base font-semibold text-gray-800">
                  Total Amount
                </Text>
                <Text className="text-xl font-bold text-darkPrimary">
                  Php{" "}
                  {data.routeData.totalPrice.toLocaleString("en-US", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  })}
                </Text>
              </View>
            </View>
          </View>

          {/* Selected Services */}
          {data.addedServices && data.addedServices.length > 0 && (
            <View className="p-5 bg-gray-50 rounded-2xl">
              <Text className="mb-3 text-base font-semibold text-gray-800">
                Selected Services ({data.addedServices.length})
              </Text>
              <View className="gap-2">
                {data.addedServices.map((service: Service) => (
                  <View
                    key={service.key}
                    className="flex-row items-center justify-between p-4 bg-white rounded-xl"
                  >
                    <View className="flex-row items-center flex-1">
                      {/* <Text className="mr-3 text-2xl">{service.icon}</Text> */}
                      <Text className="text-base text-gray-800">
                        {service.name}
                      </Text>
                    </View>
                    <Text className="font-semibold text-lightPrimary">
                      ₱{service.price}
                    </Text>
                  </View>
                ))}
              </View>

              <View className="flex-row items-center justify-between p-4 rounded-xl">
                <Text className="text-base font-semibold text-gray-800">
                  Total
                </Text>
                <Text className="font-semibold text-lightPrimary">
                  {totalServicesPrice > 0
                    ? `Php ${totalServicesPrice.toLocaleString("en-US", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}`
                    : "FREE"}
                </Text>
              </View>
            </View>
          )}

          {/* Item Type */}
          {data.itemType && (
            <View className="p-5 bg-blue-50 rounded-2xl">
              <View className="flex-row items-center mb-2">
                <Ionicons name="cube-outline" size={20} color="#3B82F6" />
                <Text className="ml-2 text-base font-semibold text-gray-800">
                  Item Type
                </Text>
              </View>
              <Text className="leading-5 text-gray-700">{data.itemType}</Text>
            </View>
          )}

          {/* Note */}
          {data.note && (
            <View className="p-5 bg-amber-50 rounded-2xl">
              <View className="flex-row items-center mb-2">
                <Ionicons
                  name="document-text-outline"
                  size={20}
                  color="#FFA840"
                />
                <Text className="ml-2 text-base font-semibold text-gray-800">
                  Note
                </Text>
              </View>
              <Text className="leading-5 text-gray-700">{data.note}</Text>
            </View>
          )}

          {/* Images */}
          {data.photos && data.photos.length > 0 && (
            <View className="p-5 bg-gray-50 rounded-2xl">
              <View className="flex-row items-center mb-3">
                <Ionicons name="image-outline" size={20} color="#666" />
                <Text className="ml-2 text-base font-semibold text-gray-800">
                  Attached Images ({data.photos.length})
                </Text>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {data.photos.map((img: any, index: number) => (
                  <Pressable
                    key={index}
                    onPress={() => {
                      setImageViewerVisible(true);
                      setSelectedImageUrl(img);
                    }}
                    className="flex-1"
                  >
                    <Image
                      source={{ uri: img }}
                      style={{
                        flex: 1,
                        height: data.photos.length > 1 ? 100 : 200,
                      }}
                    />
                  </Pressable>
                ))}
              </View>
            </View>
          )}

          {type === "Active Booking" && (
            <Pressable
              className="items-center justify-center py-3 mx-4 rounded-lg bg-lightPrimary active:bg-darkPrimary"
              onPress={() => {
                console.log(data._id);
                onClose();
                router.push({
                  pathname: "/(root_screens)/booking/viewOnMap",
                  params: { bookingId: data._id },
                });
              }}
            >
              <Text className="text-lg font-bold text-white">View on Map</Text>
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
