import CustomKeyAvoidingView from "@/components/CustomKeyAvoid";
import {Ionicons} from "@expo/vector-icons";
import axios from "axios";
import {router, useLocalSearchParams} from "expo-router";
import React, {useState} from "react";
import {
  ActivityIndicator,
  Alert,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

export default function DeviceBlockedScreen() {
  const {
    deviceId,
    phoneNumber,
    requestStatus: initialRequestStatus,
    adminNote,
  } = useLocalSearchParams<{
    deviceId: string;
    phoneNumber: string;
    requestStatus: "pending" | "rejected" | "locked" | "none";
    adminNote?: string;
  }>();

  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [requestStatus, setRequestStatus] = useState(initialRequestStatus);

  const isPending = requestStatus === "pending";
  const canSubmit = message.trim().length > 0 && !isPending && !isSubmitting;

  const handleSubmitRequest = async () => {
    if (!canSubmit) return;

    try {
      setIsSubmitting(true);

      await axios.post(
        `${process.env.EXPO_PUBLIC_BASE_URL}/api/client/auth/device/unlink-request`,
        {
          deviceId,
          phoneNumber,
          message: message.trim(),
        },
      );

      setRequestStatus("pending");
      setMessage("");

      Toast.show({
        type: "success",
        text1: "Request Submitted",
        text2: "We'll notify you once admin reviews your request.",
        position: "top",
        visibilityTime: 5000,
        topOffset: 50,
      });
    } catch (error: any) {
      const errorMessage: string | undefined = error.response?.data?.error;
      Alert.alert(
        "Failed",
        errorMessage ?? "Failed to submit request. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <CustomKeyAvoidingView>
        <View className="flex-1 px-6 pt-10">
          <View className="items-center mb-6">
            <View className="justify-center items-center mb-4 w-20 h-20 bg-red-100 rounded-full">
              <Ionicons
                name="phone-portrait-outline"
                size={40}
                color="#DC2626"
              />
            </View>
            <Text className="text-2xl font-extrabold text-[#111] mb-2 text-center">
              Device Already Linked
            </Text>
            <Text className="text-sm leading-6 text-center text-gray-500">
              This device is linked to another Fastmet account. If this is your
              device, you can request an admin to unlink it.
            </Text>
          </View>

          {isPending && (
            <View className="flex-row items-center px-4 py-3 mb-6 bg-yellow-50 rounded-xl border border-yellow-300">
              <Ionicons name="time-outline" size={18} color="#D97706" />
              <Text className="flex-1 ml-2 text-sm leading-5 text-yellow-800">
                Your unlinking request has been submitted and is awaiting admin
                review.
              </Text>
            </View>
          )}

          {requestStatus === "rejected" && (
            <View className="px-4 py-3 mb-6 bg-red-50 rounded-xl border border-red-200">
              <View className="flex-row items-center">
                <Ionicons
                  name="close-circle-outline"
                  size={18}
                  color="#DC2626"
                />
                <Text className="flex-1 ml-2 text-sm leading-5 text-red-700">
                  Your previous request was rejected. You may submit a new one.
                </Text>
              </View>
              {adminNote ? (
                <View className="mt-3 pt-3 border-t border-red-200">
                  <Text className="text-sm font-semibold text-red-700">
                    Admin note
                  </Text>
                  <Text className="mt-1 text-sm text-red-600">{adminNote}</Text>
                </View>
              ) : null}
            </View>
          )}

          {requestStatus === "locked" && (
            <View className="flex-row items-center px-4 py-3 mb-6 bg-gray-50 rounded-xl border border-gray-300">
              <Ionicons name="lock-closed-outline" size={18} color="#6B7280" />
              <Text className="flex-1 ml-2 text-sm leading-5 text-gray-700">
                Another account has already submitted an unlinking request for
                this device. Please wait for admin to resolve it.
              </Text>
            </View>
          )}

          {!isPending && requestStatus !== "locked" && (
            <>
              <Text className="text-sm font-semibold text-[#111] mb-2">
                Reason for unlinking request
              </Text>
              <TextInput
                className={`w-full border-2 rounded-xl px-4 py-3 text-sm text-[#111] mb-2
          ${isPending ? "bg-gray-100 border-gray-200 text-gray-400" : "bg-white border-gray-300"}
        `}
                placeholder="e.g. This is my personal device, I lost my previous phone..."
                placeholderTextColor="#9CA3AF"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                value={message}
                onChangeText={setMessage}
                style={{minHeight: 100}}
              />
              <Text className="mb-6 text-xs text-gray-400">
                Provide as much detail as possible to help the admin verify your
                request.
              </Text>
              <Pressable
                onPress={handleSubmitRequest}
                disabled={!canSubmit}
                className={`rounded-xl py-4 items-center w-full mb-4 active:bg-darkPrimary
              ${canSubmit ? "bg-lightPrimary" : "opacity-50 bg-lightPrimary"}
            `}
              >
                {isSubmitting ? (
                  <ActivityIndicator color="#fff" />
                ) : (
                  <Text className="text-base font-semibold text-white">
                    {isPending
                      ? "Request Submitted"
                      : "Submit Unlinking Request"}
                  </Text>
                )}
              </Pressable>
            </>
          )}

          <Pressable
            onPress={() => router.replace("/(auth)/auth")}
            className="items-center mt-3 active:opacity-70"
          >
            <Text className="text-sm font-medium text-gray-500">
              Go back to login
            </Text>
          </Pressable>
        </View>
      </CustomKeyAvoidingView>
    </SafeAreaView>
  );
}
