import {Ionicons} from "@expo/vector-icons";
import {router} from "expo-router";
import React, {useState} from "react";
import {Pressable, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import HeaderRoot from "../../../components/headers/HeaderRoot";

const CashOnDeliveryConfirmation = () => {
  const [selectedPayer, setSelectedPayer] = useState<
    "Sender" | "Recipient" | null
  >("Sender");

  return (
    <SafeAreaView className="flex-1 bg-white" style={{paddingBottom: 15}}>
      {/* Header */}
      <HeaderRoot text="Cash on Delivery" />

      <View className="flex-1 gap-10 px-6 mt-6">
        {/* Info */}
        <View>
          <Text className="mb-3 text-base leading-6 text-gray-700">
            Cash on Delivery allows payment to be made only when the parcel is
            received. Please confirm who will handle the payment below.
          </Text>

          {/* Timer notice */}
          {/* <View className="flex-row items-center justify-center gap-2 px-4 py-2 rounded-full bg-[#FFF8E1] border border-lightPrimary my-4">
            <Ionicons name="time-outline" size={18} color="#ED8718" />
            <Text className="text-base font-bold text-darkPrimary">3:00</Text>
            <Text className="text-sm font-medium text-darkPrimary">
              remaining to confirm
            </Text>
          </View> */}
        </View>

        {/* Selection */}
        <View>
          <Text className="mb-2 font-semibold text-gray-800">
            Select who will pay:
          </Text>

          {["Sender", "Recipient"].map((option) => {
            const isSelected = selectedPayer === option;
            return (
              <Pressable
                key={option}
                onPress={() =>
                  setSelectedPayer(option as "Sender" | "Recipient")
                }
                className={`flex-row justify-between items-center px-4 py-3 rounded-lg mb-3 border ${
                  isSelected
                    ? "border-lightPrimary bg-orange-50"
                    : "border-gray-300"
                }`}
              >
                <Text
                  className={`text-base font-medium ${
                    isSelected ? "text-gray-800" : "text-gray-500"
                  }`}
                >
                  {option}
                </Text>
                <Ionicons
                  name={
                    isSelected ? "checkmark-circle" : "checkmark-circle-outline"
                  }
                  size={22}
                  color={isSelected ? "#FFA840" : "#ccc"}
                />
              </Pressable>
            );
          })}
        </View>

        {/* Buttons */}
        <View className="gap-3 mt-auto">
          <Pressable
            className="items-center py-4 rounded-xl bg-lightPrimary active:bg-darkPrimary"
            disabled={!selectedPayer}
          >
            <Text className="text-base font-semibold text-center text-white">
              Confirm
            </Text>
          </Pressable>
          <Pressable
            className="items-center py-4 bg-gray-100 border border-gray-300 rounded-xl active:bg-gray-200"
            onPress={() => {
              router.back();
            }}
          >
            <Text className="text-base font-semibold text-gray-800">
              Cancel
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default CashOnDeliveryConfirmation;
