import CustomKeyAvoidingView from "@/components/CustomKeyAvoid";
import LogoWithText from "@/components/LogoWithText";
import { useAppStore } from "@/store/useAppStore";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { Link, router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { RESEND_KEY, RESEND_TIMEOUT_SECONDS } from "./otp";

const Auth = () => {
  const [checked, setChecked] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const setLoading = useAppStore((s) => s.setLoading);
  const [isValid, setIsValid] = useState(false);

  const handleSignIn = async () => {
    const formattedPhoneNumber = `63${phoneNumber}`;
    try {
      setLoading(true);
      const res = await axios.post(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/auth/send-otp-client`,
        {
          phoneNumber: formattedPhoneNumber,
        },
      );

      if (res.data.success) {
        useAppStore.getState().setAuthData({
          phoneNumber: formattedPhoneNumber,
        });

        const availableAt = Date.now() + RESEND_TIMEOUT_SECONDS * 1000;
        await SecureStore.setItemAsync(RESEND_KEY, String(availableAt));
        router.replace("/(auth)/otp");
      }
    } catch (error: any) {
      console.log(error);

      // Handle rate limit errors specifically
      if (error.response?.status === 429) {
        const retryAfter = error.response?.data?.retryAfter;
        const minutes = retryAfter ? Math.ceil(retryAfter / 60) : null;

        Alert.alert(
          "Too Many Attempts",
          error.response?.data?.error ||
            (minutes
              ? `Please try again in ${minutes} minute${minutes > 1 ? "s" : ""}.`
              : "Please try again later."),
          [{ text: "OK" }],
        );
      } else {
        Alert.alert(
          "Error",
          error.response?.data?.error ||
            "Failed to send OTP. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CustomKeyAvoidingView>
        <View className="justify-center flex-1 gap-10 px-6 pt-6">
          <LogoWithText />

          <View className="gap-4">
            {/* Mobile Number */}
            <View className="gap-2">
              <Text className="text-sm font-medium text-gray-700 ">
                Mobile Number
              </Text>

              <View className="flex-row items-center px-3 bg-gray-100 border border-gray-200 rounded-lg">
                <Text className="pr-2 mr-2 text-gray-600 border-r-2 border-lightPrimary">
                  +63
                </Text>
                <TextInput
                  value={phoneNumber}
                  onChangeText={(value) => {
                    // Remove all non-numeric characters
                    let cleaned = value.replace(/[^0-9]/g, "");

                    // Remove leading 0
                    if (!cleaned.startsWith("9")) {
                      cleaned = cleaned.substring(1);
                    }

                    // Enforce max length of 10 digits
                    if (cleaned.length > 10) {
                      cleaned = cleaned.slice(0, 10);
                    }

                    // Update state
                    setPhoneNumber(cleaned);

                    // Validate: must start with 9 and have 10 digits total
                    const valid =
                      cleaned.length === 10 && /^9\d{9}$/.test(cleaned);
                    setIsValid(valid);
                  }}
                  keyboardType="numeric"
                  placeholder="Enter mobile number"
                  placeholderTextColor="#9CA3AF"
                  className="flex-1 py-4 text-gray-800"
                  style={{
                    height: Platform.OS === "ios" ? 54 : 46,
                  }}
                />
              </View>
            </View>

            {/* Terms Checkbox */}
            <View className="flex-row justify-center gap-2 mt-4">
              <Ionicons
                name={checked ? "checkbox" : "square-outline"}
                size={22}
                color={checked ? "#FF8A00" : "gray"}
                onPress={() => setChecked(!checked)}
              />
              <Text className=" text-gray-600 text-sm text-center max-w-[80%]">
                I agree to FastMet{" "}
                <Link href="/(public_screens)/terms&conditions">
                  <Text className="font-semibold text-lightPrimary">
                    Terms and Conditions
                  </Text>{" "}
                </Link>
                and{" "}
                <Link href="/(public_screens)/privacyPolicy">
                  <Text className="font-semibold text-lightPrimary">
                    Privacy Policy
                  </Text>
                </Link>
              </Text>
            </View>

            {/* Button */}
            <Pressable
              disabled={!checked || !isValid}
              className={`mt-4 py-4 rounded-lg bg-lightPrimary items-center justify-center active:bg-darkPrimary ${
                checked && isValid ? "" : "opacity-70"
              }`}
              style={{ height: Platform.OS === "ios" ? 50 : 46 }}
              onPress={handleSignIn}
            >
              <Text className="font-semibold text-center text-white">
                Sign In
              </Text>
            </Pressable>
          </View>
        </View>
      </CustomKeyAvoidingView>
    </SafeAreaView>
  );
};

export default Auth;
