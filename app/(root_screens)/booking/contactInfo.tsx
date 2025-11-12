import SheetButton from "@/components/maps/SheetButton";
import {Ionicons} from "@expo/vector-icons";
import {router} from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import {SafeAreaView, useSafeAreaInsets} from "react-native-safe-area-context";

export default function ContactInfo() {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "white"}}>
      {/* header */}
      <View className="relative flex-row items-center justify-center px-6 pt-2 pb-4">
        <Pressable
          className="absolute left-5 top-1.5"
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={28} color="#FFA840" />
        </Pressable>
        <Text className="text-lg font-semibold">Contact Information</Text>
        <Text className="absolute text-sm font-semibold right-5 top-3.5">
          Step 3/4
        </Text>
      </View>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{flex: 1}}
      >
        <ScrollView
          className="flex-1 px-6 py-2"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: insets.bottom + (insets.bottom === 0 ? 120 : 70),
          }}
        >
          <View className="gap-5">
            <View className="gap-2">
              <Text className="font-semibold">Name</Text>
              <TextInput className="p-4 border border-gray-300 rounded-lg" />
            </View>

            <View className="gap-2">
              <Text className="font-semibold">Contact Number</Text>
              <TextInput
                keyboardType="numeric"
                className="p-4 border border-gray-300 rounded-lg"
              />
            </View>

            <View className="gap-2">
              <Text className="font-semibold">
                Note to Driver{" "}
                <Text className="text-xs text-gray-400">(Optional)</Text>
              </Text>
              <TextInput
                multiline
                numberOfLines={4}
                placeholder="Type here..."
                style={{height: 120, textAlignVertical: "top"}}
                className="p-4 border border-gray-300 rounded-lg"
              />
            </View>

            <View className="gap-2">
              <Text className="font-semibold">Upload Photo</Text>
              <View className="flex-row items-center justify-between gap-2">
                <Pressable className="items-center justify-center flex-1 gap-1 border border-gray-300 h-28 rounded-xl active:bg-gray-100">
                  <Ionicons name="add-outline" size={22} color="gray" />
                </Pressable>
                <Pressable className="items-center justify-center flex-1 gap-1 border border-gray-300 h-28 rounded-xl active:bg-gray-100">
                  <Ionicons name="add-outline" size={22} color="gray" />
                </Pressable>
                <Pressable className="items-center justify-center flex-1 gap-1 border border-gray-300 h-28 rounded-xl active:bg-gray-100">
                  <Ionicons name="add-outline" size={22} color="gray" />
                </Pressable>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
      <SheetButton
        next={() => router.push("/(root_screens)/booking/paymentMethod")}
      />
    </SafeAreaView>
  );
}
