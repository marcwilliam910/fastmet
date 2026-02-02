import { RequestedDriver } from "@/types/book";
import { STATIC_IMAGES } from "@/utils/constants";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React, { memo } from "react";
import { Modal, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import StarDisplay from "../StarDisplay";

function DriverDetailsModal({
  isModalOpen,
  driver,
  handleCloseModal,
  acceptDriver,
}: {
  isModalOpen: boolean;
  driver: RequestedDriver;
  handleCloseModal: () => void;
  acceptDriver: () => void;
}) {
  const inset = useSafeAreaInsets();
  return (
    <Modal
      visible={isModalOpen}
      animationType="slide"
      transparent={true}
      onRequestClose={handleCloseModal}
    >
      <View className="flex-1 justify-end bg-black/50">
        <View className="max-h-[85%] rounded-t-3xl bg-white">
          {/* Header */}
          <View className="items-center justify-center border-b border-gray-200 py-4">
            <Pressable onPress={handleCloseModal} className="absolute left-5" hitSlop={20}>
              <Ionicons name="chevron-back" size={Platform.OS === "ios"? 32 : 28} color="#6B7280" />
            </Pressable>
            <Text className="text-xl font-bold text-gray-900">
              Driver Details
            </Text>
          </View>

          <ScrollView
            className="px-6 py-6"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: inset.bottom + 30 }}
          >
            {/* Profile Section */}
            <View className="items-center pb-6">
              <Image
                source={
                  driver.profilePicture
                    ? { uri: driver.profilePicture }
                    : STATIC_IMAGES.userPlaceholder
                }
                contentFit="cover"
                style={{ width: 120, height: 120, borderRadius: 60 }}
              />
              <Text className="mt-4 text-2xl font-bold text-gray-900">
                {driver.name}
              </Text>
              <View className="mt-2 flex-row items-center gap-2">
                <StarDisplay rating={driver.rating} />
              </View>
              <Text className="font-semibold text-sm text-gray-500">
                {driver.rating} stars
              </Text>
              <Text className="text-lg mt-2 font-semibold text-gray-700">
                Total Completed Bookings : {driver.totalBookings}
              </Text>
            </View>

            {/* Info Cards */}
            <View className="gap-4">
              {/* Distance */}
              {driver.distance && (
                <View className="rounded-xl bg-orange-50 p-4">
                  <Text className="mb-1 text-xs font-semibold uppercase tracking-wide text-orange-600">
                    Distance from pick up
                  </Text>
                  <Text className="text-2xl font-bold text-orange-600">
                    {driver.distance < 1
                      ? `${(driver.distance * 1000).toFixed(0)}m`
                      : `${driver.distance.toFixed(2)}km`}{" "}
                    away
                  </Text>
                </View>
              )}

              {/* Vehicle Images Section */}
              <View className="rounded-xl bg-gray-50 p-4">
                <Text className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700">
                  Vehicle Image
                </Text>

                <View
                  className="w-full overflow-hidden rounded-lg bg-white"
                  style={{ aspectRatio: 4 / 3 }}
                >
                  {driver.vehicleImage ? (
                    <View className="relative h-full w-full">
                      <Image
                        source={{ uri: driver.vehicleImage }}
                        style={{ width: "100%", height: "100%" }}
                        contentFit="cover"
                      />
                    </View>
                  ) : (
                    <View className="h-full w-full items-center justify-center bg-gray-200">
                      <Ionicons
                        name="image-outline"
                        size={40}
                        color="#9CA3AF"
                      />

                      <Text className="mt-1 text-gray-400">Not available</Text>
                    </View>
                  )}
                </View>
              </View>
            </View>

            {/* Action Buttons */}
            <View className="mt-6 gap-3">
              <Pressable
                className="items-center rounded-xl bg-lightPrimary py-4 active:bg-darkPrimary"
                onPress={acceptDriver}
              >
                <Text className="text-base font-bold text-white">
                  Accept Driver
                </Text>
              </Pressable>
              <Pressable
                onPress={handleCloseModal}
                className="items-center rounded-xl bg-gray-200 py-4 active:bg-gray-300"
              >
                <Text className="text-base font-bold text-gray-700">Close</Text>
              </Pressable>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

export default memo(DriverDetailsModal);
