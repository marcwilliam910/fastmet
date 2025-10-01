import CustomKeyAvoidingView from "@/components/CustomKeyAvoid";
import LogoWithText from "@/components/LogoWithText";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import React from "react";
import {Pressable, Text, TextInput, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

const ForgotPass = () => {
  const router = useRouter();
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
      <CustomKeyAvoidingView>
        <View className="justify-center flex-1 gap-6 px-6">
          <Pressable
            onPress={() => router.back()}
            className="absolute top-5 left-5"
          >
            <Ionicons name="chevron-back-outline" size={28} color="#FFA840" />
          </Pressable>
          {/* Logo and Title */}
          <LogoWithText />

          <Text className="mt-5 mb-5 text-lg font-bold text-center text-gray-700">
            Forgot Password
          </Text>
          {/* Username Input */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700 ">
              Email Address
            </Text>
            <TextInput
              placeholder="Enter email"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              className="p-4 text-base bg-gray-100 rounded-lg"
            />
            {/* <Text className="ml-2 text-xs text-red-500">Invalid Email</Text> */}
          </View>

          <Pressable
            className="items-center py-3.5 rounded-lg bg-lightPrimary active:bg-darkPrimary"
            onPress={() => router.push("/(auth)/forgot_pass/email-verify")}
          >
            <Text className="text-base font-bold text-white">Continue</Text>
          </Pressable>
        </View>
      </CustomKeyAvoidingView>
    </SafeAreaView>
  );
};

export default ForgotPass;
