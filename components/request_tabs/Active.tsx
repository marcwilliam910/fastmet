import {Ionicons} from "@expo/vector-icons";
import React from "react";
import {Pressable, ScrollView, Text, View} from "react-native";

export default function ActiveRoute() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="flex-1 p-4 bg-white"
      contentContainerStyle={{
        paddingBottom: 40,
        gap: 15,
      }}
    >
      <ActiveCard
        vehicle="Truck"
        driverName="John Doe"
        rating={4.5}
        bookedTime="3:30 PM"
        pickup="13, Allen Street Village, San Isidro hagonoy Bulacan"
        drop="Hernandez Street"
        distance="3KM"
        paymentType="Cash Payment"
        amount="Php 100"
      />
    </ScrollView>
  );
}

type ActiveCardProps = {
  vehicle: string;
  bookedTime: string;
  pickup: string;
  drop: string;
  distance: string;
  paymentType: string;
  amount: string;
  driverName: string;
  rating: number;
};

const ActiveCard = ({
  vehicle,
  bookedTime,
  pickup,
  drop,
  distance,
  paymentType,
  amount,
  driverName,
  rating,
}: ActiveCardProps) => {
  return (
    <View
      className="overflow-hidden bg-white rounded-2xl"
      style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8, // for Android
      }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-3 bg-lightPrimary">
        <Text className="text-lg font-semibold text-white">{vehicle}</Text>
        <View className="flex-row items-center gap-2">
          <Text className="text-sm font-semibold text-white underline">
            On the way
          </Text>
          <Ionicons name="arrow-forward" size={16} color="white" />
        </View>
      </View>
      <View className="px-4 py-3">
        <Text className="mb-1 text-sm font-semibold text-gray-500">Driver</Text>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center justify-center gap-2">
            <Ionicons name="person-circle" size={40} color="#F7931E" />
            <View>
              <Text className="font-semibold text-gray-800">{driverName}</Text>
              <View className="flex-row">
                {[...Array(Math.floor(rating))].map((_, i) => (
                  <Ionicons key={i} name="star" size={16} color="#FFD700" />
                ))}
                {[...Array(5 - Math.floor(rating))].map((_, i) => (
                  <Ionicons
                    key={i}
                    name="star-outline"
                    size={16}
                    color="#FFD700"
                  />
                ))}
              </View>
            </View>
          </View>

          <View className="flex-row gap-4">
            <Pressable className="items-center active:scale-110">
              <Ionicons name="call" size={22} color="#F7931E" />
              <Text className="text-xs text-gray-600">Call</Text>
            </Pressable>
            <Pressable className="items-center active:scale-110">
              <Ionicons name="chatbubble-ellipses" size={22} color="#F7931E" />
              <Text className="text-xs text-gray-600">Chat</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Body */}
      <View className="px-3 py-5">
        {/* Pickup & Drop */}
        <View className="relative flex-row items-center justify-between ml-5 mr-2 border-l border-dashed pl-7">
          <View className="gap-4">
            <Text className="font-medium max-w-60" numberOfLines={2}>
              {pickup}
            </Text>
            <Text className="font-medium max-w-60" numberOfLines={2}>
              {drop}
            </Text>
          </View>
          <Text className="font-bold">{distance}</Text>

          <Ionicons
            name="location-sharp"
            size={24}
            className="absolute -left-3.5 -top-1 bg-white"
          />
          <Ionicons
            name="locate-sharp"
            size={24}
            className="absolute -left-3.5 -bottom-1 bg-white"
          />
        </View>
        {/* Payment */}
        <View className="flex-row items-center justify-between p-4 mt-6 bg-gray-100 rounded-lg">
          <Text className="text-base text-gray-600">{paymentType}</Text>
          <Text className="text-lg font-semibold text-darkPrimary">
            {amount}
          </Text>
        </View>
        <Pressable className="items-center justify-center mt-6">
          <Text className="text-sm font-medium">+ See more</Text>
        </Pressable>
      </View>
    </View>
  );
};
