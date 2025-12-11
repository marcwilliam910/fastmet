import CustomKeyAvoidingView from "@/components/CustomKeyAvoid";
import api from "@/lib/axios";
import { useAppStore } from "@/store/useAppStore";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function PhoneOTPScreen() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [resendTimer, setResendTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [error, setError] = useState("");
  const loading = useAppStore((state) => state.isLoading);
  const setLoading = useAppStore((state) => state.setLoading);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  useEffect(() => {
    if (resendTimer > 0) {
      const timer = setTimeout(() => setResendTimer(resendTimer - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [resendTimer]);

  const handleOtpChange = (value: string, index: number) => {
    if (value && !/^\d+$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async () => {
    const { phoneNumber } = useAppStore.getState();

    setLoading(true);
    try {
      const otpCode: string = otp.join("");
      const res = await api.post("/auth/verify-otp", {
        phoneNumber,
        otpCode,
      });

      console.log(JSON.stringify(res.data, null, 2));

      if (res.data.success) {
        // Store everything in Zustand including status
        useAppStore.getState().setAuthData({
          token: res.data.token,
          id: res.data.client.id,
          isProfileComplete: res.data.client.isProfileComplete,
          name: res.data.client.fullName,
          profilePictureUrl: res.data.client.profilePictureUrl,
        });

        if (res.data.status === "existing" && res.data.client.isProfileComplete)
          router.replace("/(drawer)/book");
        else router.replace("/(auth)/profile-register");
      }
    } catch (error: any) {
      setError(error.response?.data?.error || "Something went wrong");
      console.error("OTP verification error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CustomKeyAvoidingView>
        <View className="flex-1 items-center justify-center px-6">
          {/* Title */}
          <Text className="text-3xl font-extrabold text-[#111] mb-3">
            Verify Your Number
          </Text>

          {/* Subtitle */}
          <Text className="text-base text-gray-500 mb-10 text-center leading-6">
            Enter the 6-digit verification code sent to{" "}
            <Text className="font-semibold text-[#111] underline">
              0{useAppStore.getState().phoneNumber}
            </Text>
          </Text>

          {/* OTP Inputs */}
          <View className="flex-row justify-between w-full mb-4">
            {otp.map((digit, index) => (
              <TextInput
                key={index}
                ref={(ref: TextInput | null) => {
                  inputRefs.current[index] = ref;
                }}
                className={`w-14 h-16 rounded-2xl text-center text-2xl font-bold
                ${digit ? "bg-orange-100 border border-darkPrimary" : "bg-white border border-gray-300"}
                ${error ? "border-red-500" : ""}
              `}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={1}
                selectTextOnFocus
                editable={!loading}
                autoFocus={index === 0}
              />
            ))}
          </View>

          {/* Error */}
          {error && (
            <View
              className="flex-row items-center justify-center w-full mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl"
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
                elevation: 2, // Android
              }}
            >
              <Ionicons name="alert-circle" size={20} color="#DC2626" />

              <Text
                className="text-red-700 text-sm ml-3  leading-5
      "
              >
                {error}
              </Text>
            </View>
          )}

          {/* Resend */}
          <View className="items-center mb-10">
            <Text className="text-sm text-gray-600 mb-1">
              Didn&apos;t receive the code?
            </Text>

            {canResend ? (
              <Pressable disabled={loading}>
                <Text className="text-base font-semibold text-darkPrimary">
                  Resend Code
                </Text>
              </Pressable>
            ) : (
              <Text className="text-base font-semibold text-gray-400">
                Resend in {Math.floor(resendTimer / 60)}:
                {(resendTimer % 60).toString().padStart(2, "0")}
              </Text>
            )}
          </View>

          {/* Verify Button */}
          <Pressable
            onPress={handleVerifyOTP}
            className={`rounded-xl py-4 items-center w-full mb-4 
            ${
              loading || otp.join("").length !== 6
                ? "bg-lightPrimary/50"
                : "bg-lightPrimary"
            }
          `}
            disabled={loading || otp.join("").length !== 6}
          >
            <Text className="text-white text-base font-semibold">Verify</Text>
          </Pressable>

          {/* Change Number */}
          <Pressable
            onPress={() => router.back()}
            disabled={loading}
            className="items-center"
          >
            <Text className="text-sm font-medium text-gray-600">
              Wrong number? Change it
            </Text>
          </Pressable>
        </View>
      </CustomKeyAvoidingView>
    </SafeAreaView>
  );
}
