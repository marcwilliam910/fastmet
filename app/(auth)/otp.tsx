import CustomKeyAvoidingView from "@/components/CustomKeyAvoid";
import { useAppStore } from "@/store/useAppStore";
import { UserAddress } from "@/types/user";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { router } from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, { useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export const RESEND_TIMEOUT_SECONDS = 60;
export const RESEND_KEY = "resend_available_at";

type LoginResponse = {
  success: boolean;
  token: string;
  client: {
    id: string;
    isProfileComplete: boolean;
    fullName: string;
    profilePictureUrl: string;
    address: UserAddress | null;
    gender: string;
    preRegistered: boolean;
  };
  status: "new" | "existing" | "pre-registered";
};

export default function PhoneOTPScreen() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const loading = useAppStore((state) => state.isLoading);
  const setLoading = useAppStore((state) => state.setLoading);

  const inputRefs = useRef<(TextInput | null)[]>([]);

  const [resendTimer, setResendTimer] = useState(0);
  const [canResend, setCanResend] = useState(false);

  // Initialize timer on mount
  useEffect(() => {
    const initCountdown = async () => {
      const stored = await SecureStore.getItemAsync(RESEND_KEY);
      if (!stored) {
        setCanResend(true);
        return;
      }

      const availableAt = Number(stored);
      const remaining = Math.ceil((availableAt - Date.now()) / 1000);

      if (remaining > 0) {
        setResendTimer(remaining);
        setCanResend(false);
      } else {
        await SecureStore.deleteItemAsync(RESEND_KEY);
        setCanResend(true);
      }
    };

    initCountdown();
    setTimeout(() => inputRefs.current[0]?.focus(), 50);
  }, []);

  // Separate effect for countdown logic
  useEffect(() => {
    if (resendTimer <= 0) {
      setCanResend(true);
      return;
    }

    const interval = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          SecureStore.deleteItemAsync(RESEND_KEY);
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [resendTimer]);

  const handleResendOtp = async () => {
    if (!canResend || loading) return;

    try {
      await axios.post(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/auth/send-otp`,
        {
          phoneNumber: useAppStore.getState().phoneNumber,
        },
      );

      const availableAt = Date.now() + RESEND_TIMEOUT_SECONDS * 1000;
      await SecureStore.setItemAsync(RESEND_KEY, String(availableAt));

      setResendTimer(RESEND_TIMEOUT_SECONDS);
      setCanResend(false);

      Toast.show({
        type: "success",
        text1: "Code sent",
        text2: "Please check your messages",
        position: "top",
        visibilityTime: 5000,
        topOffset: 50,
      });
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Failed to resend",
        text2: error.response?.data?.error || "Please try again",
        position: "top",
        visibilityTime: 3000,
        topOffset: 50,
      });
    }
  };

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
      const { data: otpData } = await axios.post<{
        success: boolean;
        verifyToken: string;
      }>(`${process.env.EXPO_PUBLIC_BASE_URL}/api/auth/verify-otp`, {
        phoneNumber,
        otpCode,
      });

      if (otpData.success) {
        await SecureStore.deleteItemAsync(RESEND_KEY);

        const { data } = await axios.post<LoginResponse>(
          `${process.env.EXPO_PUBLIC_BASE_URL}/api/client/auth/login`,
          {},
          {
            headers: {
              Authorization: `Bearer ${otpData.verifyToken}`,
            },
          },
        );

        if (data.success) {
          useAppStore.getState().setAuthData({
            token: data.token,
            id: data.client.id,
            isProfileComplete: data.client.isProfileComplete,
            name: data.client.fullName,
            profilePictureUrl: data.client.profilePictureUrl,
            address: data.client.address,
            gender: data.client.gender,
            preRegistered: data.client.preRegistered,
          });

          if (data.client.isProfileComplete) {
            const status = data.status;
            const message =
              status === "existing"
                ? "Welcome to FastMet"
                : "Thank you for pre-registering with Fastmet";

            Toast.show({
              type: "success",
              text1: "Verified!",
              text2: message,
              position: "top",
              visibilityTime: 5_000,
              swipeable: true,
              topOffset: 50,
            });
            router.replace("/(drawer)/book");
          } else router.replace("/(auth)/profile-register");
        }
      }
    } catch (error: any) {
      // Handle rate limit errors for verification
      if (error.response?.status === 429) {
        const retryAfter = error.response?.data?.retryAfter;
        const minutes = retryAfter ? Math.ceil(retryAfter / 60) : null;

        setError(
          error.response?.data?.error ||
            (minutes
              ? `Too many failed attempts. Try again in ${minutes} minute${minutes > 1 ? "s" : ""}.`
              : "Too many attempts. Please try again later."),
        );
      } else {
        setError(error.response?.data?.error || "Something went wrong");
      }
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
              {useAppStore.getState().phoneNumber}
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
              className="flex-row items-center justify-center gap-2 w-full mb-5 px-4 py-3 bg-red-50 border border-red-200 rounded-xl"
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 4,
                shadowOffset: { width: 0, height: 2 },
                elevation: 2,
              }}
            >
              <Ionicons name="alert-circle" size={20} color="#DC2626" />
              <Text className="text-red-700 text-sm leading-5">{error}</Text>
            </View>
          )}

          {/* Resend */}
          <View className="items-center mb-10">
            <Text className="text-sm text-gray-600 mb-1">
              Didn&apos;t receive the code?
            </Text>

            {canResend ? (
              <Pressable disabled={loading} onPress={handleResendOtp}>
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
            onPress={() => router.push("/(auth)/auth")}
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
