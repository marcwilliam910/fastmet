import { SUPPORT_EMAIL } from "@/utils/constants";
import { Ionicons } from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import { router } from "expo-router";
import { useState } from "react";
import { Alert, Linking, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function AccountDeactivatedScreen() {
  const [emailCopied, setEmailCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(SUPPORT_EMAIL);
    setEmailCopied(true);
    setTimeout(() => setEmailCopied(false), 3000);
  };

  const handleEmail = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}`).catch(() =>
      Alert.alert("Error", "Unable to open mail app."),
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-10">
        {/* Icon */}
        <View className="items-center mb-6">
          <View className="w-20 h-20 rounded-full bg-yellow-100 items-center justify-center mb-4">
            <Ionicons name="person-remove-outline" size={40} color="#D97706" />
          </View>
          <Text className="text-2xl font-extrabold text-[#111] mb-2 text-center">
            Account Deactivated
          </Text>
          <Text className="text-sm text-gray-500 text-center leading-6">
            Your Fastmet account has been deactivated by an administrator.
            Please contact support to restore access.
          </Text>
        </View>

        {/* Info Banner */}
        <View className="flex-row items-center px-4 py-3 bg-yellow-50 border border-yellow-200 rounded-xl mb-6">
          <Ionicons
            name="information-circle-outline"
            size={18}
            color="#D97706"
          />
          <Text className="text-yellow-700 text-sm ml-2 leading-5 flex-1">
            If you believe this is a mistake, please reach out to our support
            team using the details below.
          </Text>
        </View>

        {/* Support Contact Card */}
        <View className="border border-gray-200 rounded-xl overflow-hidden mb-6">
          <View className="flex-row items-center px-4 py-3 bg-gray-50">
            <Ionicons name="mail-outline" size={18} color="#6B7280" />
            <View className="flex-1 ml-3">
              <Text className="text-xs text-gray-400 mb-0.5">Email</Text>
              <Text className="text-sm font-semibold text-[#111]">
                {SUPPORT_EMAIL}
              </Text>
            </View>
            <Pressable
              onPress={handleCopy}
              className="active:opacity-60 px-2 py-1"
            >
              <Ionicons
                name={emailCopied ? "checkmark-outline" : "copy-outline"}
                size={18}
                color={emailCopied ? "#16A34A" : "#6B7280"}
              />
            </Pressable>
          </View>
        </View>

        {/* Email Button */}
        <Pressable
          onPress={handleEmail}
          className="rounded-xl py-4 items-center w-full mb-3 bg-lightPrimary active:bg-darkPrimary"
        >
          <View className="flex-row items-center gap-2">
            <Ionicons name="mail-outline" size={18} color="#fff" />
            <Text className="text-white text-base font-semibold">
              Email Support
            </Text>
          </View>
        </Pressable>

        {/* Back */}
        <Pressable
          onPress={() => router.replace("/(auth)/auth")}
          className="items-center active:opacity-70 mt-3"
        >
          <Text className="text-sm font-medium text-gray-500">
            Go back to login
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}