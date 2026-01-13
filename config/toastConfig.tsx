// config/toastConfig.tsx
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import Toast from "react-native-toast-message";

export const toastConfig = {
  bookingAccepted: ({ text1, text2 }: any) => (
    <View className="bg-white mx-4 rounded-2xl shadow-lg border border-gray-200 p-4 flex-row items-center justify-between">
      <View className="flex-1">
        <View className="flex-row items-center gap-2 mb-1">
          <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
          <Text className="font-bold text-gray-800">{text1}</Text>
        </View>
        <Text numberOfLines={2} className="text-gray-600 text-sm">
          {text2}
        </Text>
      </View>

      <Pressable
        onPress={() => {
          Toast.hide();
          router.push("/(drawer)/(tabs)/request"); // Navigate to requests tab
        }}
        className="bg-primary px-4 py-2 rounded-lg ml-3"
      >
        <Text className="font-semibold underline">Track Driver</Text>
      </Pressable>
    </View>
  ),

  newMessage: ({ text1, text2 }: any) => (
    <View className="bg-white mx-4 rounded-2xl shadow-lg border border-gray-200 p-4 flex-row items-center justify-between">
      <View className="flex-1">
        <View className="flex-row items-center gap-2 mb-1">
          <Ionicons name="chatbubble-ellipses" size={20} color="#FFA840" />
          <Text className="font-bold text-gray-800">{text1}</Text>
        </View>
        <Text className="text-gray-600 text-sm" numberOfLines={2}>
          {text2}
        </Text>
      </View>

      <Pressable
        onPress={() => {
          Toast.hide();
          router.push("/(drawer)/(tabs)/chats");
        }}
        className="bg-lightPrimary px-4 py-2 rounded-lg ml-3"
      >
        <Text className="text-white font-semibold">Reply</Text>
      </Pressable>
    </View>
  ),
  success: ({ text1, text2 }: any) => (
    <View className="bg-white mx-4 rounded-2xl shadow-lg border border-gray-200 p-4 flex-row items-center justify-between">
      <View className="flex-1">
        <View className="flex-row items-center gap-2 mb-1">
          <Ionicons name="checkmark-circle" size={20} color="#22C55E" />
          <Text className="font-bold text-gray-800">{text1}</Text>
        </View>
        <Text numberOfLines={2} className="text-gray-600 text-sm">
          {text2}
        </Text>
      </View>
    </View>
  ),
  info: ({ text1, text2 }: any) => (
    <View className="mx-4 flex-row items-center justify-between rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
      <View className="flex-1">
        <View className="mb-1 flex-row items-center gap-2">
          <Ionicons name="information-circle" size={20} color="#3B82F6" />
          <Text className="font-bold text-gray-800">{text1}</Text>
        </View>
        <Text numberOfLines={2} className="text-sm text-gray-600">
          {text2}
        </Text>
      </View>
    </View>
  ),
  error: ({ text1, text2 }: any) => (
    <View className="bg-white mx-4 rounded-2xl shadow-lg border border-gray-200 p-4 flex-row items-center justify-between">
      <View className="flex-1">
        <View className="flex-row items-center gap-2 mb-1">
          <Ionicons name="alert-circle" size={20} color="#EF4444" />
          <Text className="font-bold text-gray-800">{text1}</Text>
        </View>
        <Text numberOfLines={2} className="text-gray-600 text-sm">
          {text2}
        </Text>
      </View>
    </View>
  ),
};
