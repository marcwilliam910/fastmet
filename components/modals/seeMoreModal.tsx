import {Service} from "@/types/book";
import {Ionicons} from "@expo/vector-icons";
import React from "react";
import {Modal, Pressable, ScrollView, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

export default function SeeMoreModal({
  visible,
  onClose,
  type,
  data,
}: {
  visible: boolean;
  onClose: () => void;
  type: string;
  data: any;
}) {
  if (!data) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-center px-4 pb-4">
          <Pressable onPress={onClose} className="absolute left-4 -top-1">
            <Ionicons name="chevron-back-outline" size={28} color="#FFA840" />
          </Pressable>
          <Text className="text-lg font-semibold capitalize">{type}</Text>
        </View>

        {/* Content - Scrollable */}
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{gap: 20, paddingBottom: 30}}
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
                  {data.vehicle}
                </Text>
              </View>
              <View className="items-end">
                <Text className="mb-1 text-sm text-white opacity-90">
                  {type === "Cancelled Booking" ? "Cancelled At" : "Booked At"}
                </Text>
                <Text className="text-lg font-semibold text-white">
                  {data.bookedTime}
                </Text>
              </View>
            </View>
          </View>

          {data.driverName && data.rating && (
            <View className="px-4 py-3">
              <Text className="mb-1 text-sm font-semibold text-gray-500">
                Driver
              </Text>
              <View className="flex-row items-center justify-between">
                <View className="flex-row items-center justify-center gap-2">
                  <Ionicons name="person-circle" size={44} color="#F7931E" />
                  <View>
                    <Text className="text-lg font-semibold text-gray-800">
                      {data.driverName}
                    </Text>
                    <View className="flex-row">
                      {[...Array(Math.floor(data.rating))].map((_, i) => (
                        <Ionicons
                          key={i}
                          name="star"
                          size={18}
                          color="#FFD700"
                        />
                      ))}
                      {[...Array(5 - Math.floor(data.rating))].map((_, i) => (
                        <Ionicons
                          key={i}
                          name="star-outline"
                          size={18}
                          color="#FFD700"
                        />
                      ))}
                    </View>
                  </View>
                </View>

                <View className="flex-row gap-5">
                  <Pressable className="items-center active:scale-110">
                    <Ionicons name="call" size={26} color="#F7931E" />
                    <Text className="text-xs text-gray-600">Call</Text>
                  </Pressable>
                  <Pressable className="items-center active:scale-110">
                    <Ionicons
                      name="chatbubble-ellipses"
                      size={26}
                      color="#F7931E"
                    />
                    <Text className="text-xs text-gray-600">Chat</Text>
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

            <View className="relative flex-row items-center justify-between ml-5 mr-2 border-l border-dashed border-lightPrimary pl-7">
              <View className="gap-4">
                <Text
                  className="text-sm font-medium max-w-60"
                  numberOfLines={2}
                >
                  {data.pickup}
                </Text>
                <Text
                  className="text-sm font-medium max-w-60"
                  numberOfLines={2}
                >
                  {data.dropoff}
                </Text>
              </View>

              <Ionicons
                name="location-sharp"
                size={24}
                color={"#FFA840"}
                className="absolute -left-3.5 -top-1 bg-gray-50"
              />
              <Ionicons
                name="locate-sharp"
                size={24}
                color={"#FFA840"}
                className="absolute -left-3.5 -bottom-1 bg-gray-50 "
              />
            </View>
            {/* Distance */}
            <View className="flex-row items-center justify-between p-3 mt-4 bg-white rounded-lg">
              <Text className="text-sm text-gray-600">Distance</Text>
              <Text className="text-lg font-bold text-lightPrimary">
                {data.distance}
              </Text>
            </View>
          </View>

          {/* Payment Info */}
          <View className="p-5 bg-gray-50 rounded-2xl">
            <Text className="mb-3 text-base font-semibold text-gray-800">
              Payment Information
            </Text>
            <View className="flex-row items-center justify-between p-4 bg-white rounded-xl">
              <View className="flex-row items-center">
                <Ionicons
                  name={data.isCash ? "cash-outline" : "card-outline"}
                  size={22}
                  color="#666"
                />
                <Text className="ml-3 text-base text-gray-600">
                  {data.isCash ? "Cash Payment" : "Online Payment"}
                </Text>
              </View>
              <Text className="text-xl font-bold text-darkPrimary">
                Php {data.amount.toLocaleString("en-US")}
              </Text>
            </View>
          </View>

          {/* Selected Services */}
          {data.selectedServices && data.selectedServices.length > 0 && (
            <View className="p-5 bg-gray-50 rounded-2xl">
              <Text className="mb-3 text-base font-semibold text-gray-800">
                Selected Services ({data.selectedServices.length})
              </Text>
              <View className="gap-2">
                {data.selectedServices.map((service: Service) => (
                  <View
                    key={service.id}
                    className="flex-row items-center justify-between p-4 bg-white rounded-xl"
                  >
                    <View className="flex-row items-center flex-1">
                      <Text className="mr-3 text-2xl">{service.icon}</Text>
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
          {data.images && data.images.length > 0 && (
            <View className="p-5 bg-gray-50 rounded-2xl">
              <View className="flex-row items-center mb-3">
                <Ionicons name="image-outline" size={20} color="#666" />
                <Text className="ml-2 text-base font-semibold text-gray-800">
                  Attached Images ({data.images.length})
                </Text>
              </View>
              <View className="flex-row flex-wrap gap-2">
                {data.images.map((img: any, index: number) => (
                  <View
                    key={index}
                    className="items-center justify-center bg-gray-200 rounded-xl"
                    style={{width: 100, height: 100}}
                  >
                    <Text className="text-gray-500">Image {index + 1}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}

          {data.driverName && data.rating && (
            <Pressable className="flex-row items-center justify-center gap-1 py-3 rounded-md active:bg-darkPrimary bg-lightPrimary">
              <Text className="text-lg font-bold text-white">View on Map</Text>
              <Ionicons name="arrow-forward" size={18} color="white" />
            </Pressable>
          )}
        </ScrollView>
      </SafeAreaView>
    </Modal>
  );
}
