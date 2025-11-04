import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function BookRoute() {
  return (
    <ScrollView
      showsVerticalScrollIndicator={false}
      className="flex-1 p-4 bg-white"
      contentContainerStyle={{
        paddingBottom: 40,
        gap: 15,
      }}
    >
      <BookingCard
        vehicle="Motorcycle"
        bookedTime="3:30 PM"
        pickup="13, Allen Street Village, San Isidro hagonoy Bulacan"
        drop="Hernandez Street"
        distance="3KM"
        paymentType="Cash Payment"
        amount="Php 100"
        onCancel={() => console.log("Cancel")}
        onUpdateNote={() => console.log("Update Note")}
      />
      <BookingCard
        vehicle="Motorcycle"
        bookedTime="3:30 PM"
        pickup="13, Allen Street Village, San Isidro hagonoy Bulacan"
        drop="Hernandez Street"
        distance="3KM"
        paymentType="Cash Payment"
        amount="Php 100"
        onCancel={() => console.log("Cancel")}
        onUpdateNote={() => console.log("Update Note")}
      />
      <BookingCard
        vehicle="Motorcycle"
        bookedTime="3:30 PM"
        pickup="13, Allen Street Village, San Isidro hagonoy Bulacan"
        drop="Hernandez Street"
        distance="3KM"
        paymentType="Cash Payment"
        amount="Php 100"
        onCancel={() => console.log("Cancel")}
        onUpdateNote={() => console.log("Update Note")}
      />
    </ScrollView>
  );
}

type BookingCardProps = {
  vehicle: string;
  bookedTime: string;
  pickup: string;
  drop: string;
  distance: string;
  paymentType: string;
  amount: string;
  onCancel: () => void;
  onUpdateNote: () => void;
};

const BookingCard = ({
  vehicle,
  bookedTime,
  pickup,
  drop,
  distance,
  paymentType,
  amount,
  onCancel,
  onUpdateNote,
}: BookingCardProps) => {
  return (
    <View
      className=" rounded-2xl overflow-hidden bg-white"
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
      <View className="flex-row justify-between items-center bg-lightPrimary px-5 py-3">
        <Text className="text-white text-lg font-semibold">{vehicle}</Text>
        <Text className="text-white text-sm">Booked at {bookedTime}</Text>
      </View>

      {/* Body */}
      <View className="py-5 px-3">
        {/* Pickup & Drop */}
        <View className="flex-row justify-between items-center pl-7  ml-5 mr-2 border-l border-dashed relative">
          <View className="gap-4">
            <Text className="font-semibold max-w-60" numberOfLines={2}>
              {pickup}
            </Text>
            <Text className="font-semibold max-w-60" numberOfLines={2}>
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
        <View className="flex-row justify-between items-center mt-6 bg-gray-100 p-4 rounded-lg">
          <Text className="text-base text-gray-600">{paymentType}</Text>
          <Text className="text-lg font-semibold text-darkPrimary">
            {amount}
          </Text>
        </View>

        {/* Buttons */}
        <View className="flex-row justify-between mt-6">
          <Pressable
            className="flex-1 flex-row justify-center items-center border border-lightPrimary rounded-xl py-3 mr-2"
            onPress={onCancel}
          >
            <Ionicons name="close" size={18} color="#333" />
            <Text className="ml-2 font-medium text-gray-700">Cancel Book</Text>
          </Pressable>

          <Pressable
            className="flex-1 flex-row justify-center items-center border border-lightPrimary rounded-xl py-3 ml-2"
            onPress={onUpdateNote}
          >
            <Ionicons name="create-outline" size={18} color="#333" />
            <Text className="ml-2 font-medium text-gray-700">Update Note</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};
