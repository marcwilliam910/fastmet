import { SUPPORT_EMAIL } from "@/utils/constants";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Alert, Linking, Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";


export default function DeviceBannedScreen() {


  const handleEmail = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}`).catch(() =>
      Alert.alert("Error", "Unable to open mail app."),
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-10">
        <View className="items-center mb-6">
          <View className="w-20 h-20 rounded-full bg-red-100 items-center justify-center mb-4">
            <Ionicons name="ban-outline" size={40} color="#DC2626" />
          </View>
          <Text className="text-2xl font-extrabold text-[#111] mb-2 text-center">
            Device Banned
          </Text>
          <Text className="text-sm text-gray-500 text-center leading-6">
            This device has been banned from using Fastmet. Please contact
            support if you believe this is a mistake.
          </Text>
        </View>

        <View className="flex-row items-center px-4 py-3 bg-red-50 border border-red-200 rounded-xl mb-6">
          <Ionicons
            name="information-circle-outline"
            size={18}
            color="#DC2626"
          />
          <Text className="text-red-700 text-sm ml-2 leading-5 flex-1">
            You cannot sign in or receive OTP on this device until the ban is
            lifted by an administrator.
          </Text>
        </View>


        <Pressable
          onPress={handleEmail}
          className="rounded-xl py-4 items-center w-full mb-4 border-2 border-gray-200 active:bg-gray-50"
        >
          <View className="flex-row items-center gap-2">
            <Ionicons name="mail-outline" size={18} color="#374151" />
            <Text className="text-gray-700 text-base font-semibold">
              Email Support
            </Text>
          </View>
        </Pressable>

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
