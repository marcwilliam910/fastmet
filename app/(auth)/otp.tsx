import CustomKeyAvoidingView from "@/components/CustomKeyAvoid";
import {Countdown} from "@/components/Timers";
import {useAppStore} from "@/store/useAppStore";
import {UserAddress} from "@/types/user";
import {routeAuthGuardError, handleSendOtpError} from "@/utils/helpers/authGuardErrors";
import {getDeviceId} from "@/utils/helpers/deviceId";
import {formatPHNumber} from "@/utils/helpers/format";
import {Ionicons} from "@expo/vector-icons";
import axios from "axios";
import {router} from "expo-router";
import * as SecureStore from "expo-secure-store";
import React, {useEffect, useRef, useState} from "react";
import {Pressable, Text, TextInput, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export const RESEND_TIMEOUT_SECONDS = 60;
export const RESEND_KEY = "resend_available_at";
const OTP_VALIDITY_SECONDS = 600;

type LoginResponse = {
  success: boolean;
  accessToken: string;
  refreshToken: string;
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

  const [initialResendSeconds, setInitialResendSeconds] = useState(
    RESEND_TIMEOUT_SECONDS,
  );
  const [canResend, setCanResend] = useState(false);
  const [otpExpired, setOtpExpired] = useState(false);
  const [otpTimerKey, setOtpTimerKey] = useState(0);
  const [resendTimerKey, setResendTimerKey] = useState(0);

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
        setInitialResendSeconds(remaining);
        setCanResend(false);
      } else {
        await SecureStore.deleteItemAsync(RESEND_KEY);
        setCanResend(true);
      }
    };

    initCountdown();
    setTimeout(() => inputRefs.current[0]?.focus(), 50);
  }, []);

  const clearOTPInputs = () => {
    setOtp(["", "", "", "", "", ""]);
    setTimeout(() => inputRefs.current[0]?.focus(), 50);
  };

  const handleResendOtp = async () => {
    if (!canResend || loading) return;

    try {
      const deviceId = await getDeviceId();

      await axios.post(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/auth/send-otp-client`,
        {
          phoneNumber: useAppStore.getState().phoneNumber,
          deviceId,
        },
      );

      const availableAt = Date.now() + RESEND_TIMEOUT_SECONDS * 1000;
      await SecureStore.setItemAsync(RESEND_KEY, String(availableAt));

      setInitialResendSeconds(RESEND_TIMEOUT_SECONDS);
      setCanResend(false);
      setOtpExpired(false);
      setOtpTimerKey((k) => k + 1);
      setResendTimerKey((k) => k + 1);
      clearOTPInputs();

      Toast.show({
        type: "success",
        text1: "Code sent",
        text2: "Please check your messages",
        position: "top",
        visibilityTime: 5000,
        topOffset: 50,
      });
    } catch (error: any) {
      if (handleSendOtpError(error, { onRetry: handleResendOtp })) return;
    }
  };

  const handleOtpChange = (value: string, index: number) => {
    if (value && !/^\d+$/.test(value)) return;

    // Handle paste — distribute digits across boxes
    if (value.length > 1) {
      const digits = value
        .replace(/\D/g, "")
        .slice(0, 6 - index)
        .split("");
      const newOtp = [...otp];
      digits.forEach((d, i) => {
        newOtp[index + i] = d;
      });
      setOtp(newOtp);
      setError("");
      const nextIndex = Math.min(index + digits.length, 5);
      inputRefs.current[nextIndex]?.focus();
      if (newOtp.every((d) => d)) {
        // FIX: pass newOtp.join("") — avoids stale otp state
        setTimeout(() => handleVerifyOTP(newOtp.join("")), 200);
      }
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    setError("");

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    if (index === 5 && value && newOtp.every((d) => d)) {
      // FIX: pass newOtp.join("") — avoids stale otp state
      setTimeout(() => handleVerifyOTP(newOtp.join("")), 300);
    }
  };

  const handleKeyPress = (e: any, index: number) => {
    if (e.nativeEvent.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOTP = async (code?: string) => {
    if (otpExpired) return;

    const {phoneNumber} = useAppStore.getState();
    const otpCode = code ?? otp.join("");

    setLoading(true);
    try {
      const {data: otpData} = await axios.post<{
        success: boolean;
        verifyToken: string;
      }>(`${process.env.EXPO_PUBLIC_BASE_URL}/api/auth/verify-otp`, {
        phoneNumber,
        otpCode,
      });

      if (otpData.success) {
        await SecureStore.deleteItemAsync(RESEND_KEY);

        const deviceId = await getDeviceId();

        const {data} = await axios.post<LoginResponse>(
          `${process.env.EXPO_PUBLIC_BASE_URL}/api/client/auth/login`,
          { deviceId },
          {
            headers: {
              Authorization: `Bearer ${otpData.verifyToken}`,
            },
          },
        );

        if (data.success) {
          useAppStore.getState().setAuthData({
            token: data.accessToken,
            refreshToken: data.refreshToken,
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
      if (routeAuthGuardError(error)) return;

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
        clearOTPInputs();
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CustomKeyAvoidingView>
        <View className="items-center justify-center flex-1 px-6">
          {/* Title */}
          <Text className="text-3xl font-extrabold text-[#111] mb-3">
            Verify Your Number
          </Text>

          {/* Subtitle */}
          <Text className="mb-2 text-base leading-6 text-center text-gray-500">
            Enter the 6-digit verification code sent to{" "}
            <Text className="font-semibold text-[#111] underline">
              {formatPHNumber(useAppStore.getState().phoneNumber)}
            </Text>
          </Text>

          {/* OTP expiry countdown */}
          <View className="flex-row items-center gap-1 mb-8">
            <Ionicons
              name="time-outline"
              size={14}
              color={otpExpired ? "#DC2626" : "#6B7280"}
            />
            {otpExpired ? (
              <Text className="text-sm font-medium text-red-600">
                Code expired — please request a new one
              </Text>
            ) : (
              <View className="flex-row items-center gap-1">
                <Text className="text-sm text-gray-500">Code expires in</Text>
                <Countdown
                  key={otpTimerKey}
                  seconds={OTP_VALIDITY_SECONDS}
                  onExpire={() => setOtpExpired(true)}
                  className="text-sm font-medium text-gray-500"
                />
              </View>
            )}
          </View>

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
                ${otpExpired ? "opacity-40" : ""}
              `}
                value={digit}
                onChangeText={(value) => handleOtpChange(value, index)}
                onKeyPress={(e) => handleKeyPress(e, index)}
                keyboardType="number-pad"
                maxLength={6}
                selectTextOnFocus
                editable={!loading && !otpExpired}
                autoFocus={index === 0}
              />
            ))}
          </View>

          {/* Error */}
          {error && (
            <View
              className="flex-row items-center justify-center w-full gap-2 px-4 py-3 mb-5 border border-red-200 bg-red-50 rounded-xl"
              style={{
                shadowColor: "#000",
                shadowOpacity: 0.05,
                shadowRadius: 4,
                shadowOffset: {width: 0, height: 2},
                elevation: 2,
              }}
            >
              <Ionicons name="alert-circle" size={20} color="#DC2626" />
              <Text className="text-sm leading-5 text-red-700">{error}</Text>
            </View>
          )}

          {/* Resend */}
          <View className="items-center mb-10">
            <Text className="mb-1 text-sm text-gray-600">
              Didn&apos;t receive the code?
            </Text>

            {canResend ? (
              <Pressable disabled={loading} onPress={handleResendOtp}>
                <Text className="text-base font-semibold text-darkPrimary">
                  Resend Code
                </Text>
              </Pressable>
            ) : (
              <View className="flex-row items-center gap-1">
                <Text className="text-base font-semibold text-gray-400">
                  Resend in{" "}
                </Text>
                <Countdown
                  key={resendTimerKey}
                  seconds={initialResendSeconds}
                  onExpire={() => setCanResend(true)}
                  className="text-base font-semibold text-gray-400"
                />
              </View>
            )}
          </View>

          {/* Verify Button */}
          <Pressable
            onPress={() => handleVerifyOTP()}
            className={`rounded-xl py-4 items-center w-full mb-4 
            ${
              loading || otp.join("").length !== 6
                ? "bg-lightPrimary/50"
                : "bg-lightPrimary"
            }
          `}
            disabled={loading || otp.join("").length !== 6 || otpExpired}
          >
            <Text className="text-base font-semibold text-white">
              {otpExpired ? "Code Expired" : "Verify"}
            </Text>
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
