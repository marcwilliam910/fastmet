import {Image} from "expo-image";
import React from "react";
import {Pressable, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import Header from "./header";

const PaymentMethod = () => {
  return (
    <SafeAreaView className="flex-1 bg-white" style={{paddingBottom: 15}}>
      {/* Header */}
      <Header text="Payment Method" />

      <View className="justify-between flex-1 px-5 mt-6">
        {/* Payment Options */}
        <View className="flex-row justify-around">
          <View className="items-center justify-center w-[30%]">
            <Pressable className="items-center p-4 border-2 border-orange-400 rounded-2xl active:bg-gray-100">
              <Image
                source={require("@/assets/images/xendit.png")}
                style={{width: 40, height: 40}}
                contentFit="contain"
              />
            </Pressable>
            <Text className="mt-3 text-sm font-medium text-neutral-800">
              Xendit
            </Text>
          </View>
          <View className="items-center justify-center w-[30%]">
            <Pressable className="items-center p-4 border-2 border-orange-400 rounded-2xl active:bg-gray-100">
              <Image
                source={require("@/assets/images/cash.png")}
                style={{width: 40, height: 40}}
                contentFit="contain"
              />
            </Pressable>
            <Text className="mt-3 text-sm font-medium text-neutral-800">
              Cash
            </Text>
          </View>

          <View className="items-center justify-center w-[30%]">
            <Pressable className="items-center p-4 border-2 border-orange-400 rounded-2xl active:bg-gray-100">
              <Image
                source={require("@/assets/images/wallet.png")}
                style={{width: 40, height: 40}}
                contentFit="contain"
              />
            </Pressable>
            <Text className="mt-3 text-sm font-medium text-neutral-800">
              Wallet
            </Text>
          </View>
        </View>

        {/* Footer Total */}
        <View className="flex-row items-center justify-between px-5 py-4 bg-lightPrimary rounded-xl">
          <Text className="text-lg font-semibold text-white">Total Amount</Text>
          <Text className="text-lg font-bold text-white">
            Php 5,500 <Text className="text-sm font-normal">(vat in)</Text>
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default PaymentMethod;
