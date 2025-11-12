import SheetButton from "@/components/maps/SheetButton";
import {Ionicons} from "@expo/vector-icons";
import {router} from "expo-router";
import React, {useState} from "react";
import {Pressable, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

export default function PaymentMethod() {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "white"}}>
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
          onPress={() => setPaymentMethod("xendit")}
          className={`flex-row items-center justify-between rounded-xl border px-4 py-3 ${
            paymentMethod === "xendit"
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
          {paymentMethod === "xendit" && (
            <Ionicons name="checkmark-sharp" size={24} color="#FFA840" />
          )}
        </Pressable>
      </View>
      <SheetButton next={() => {}} />
    </SafeAreaView>
  );
}
