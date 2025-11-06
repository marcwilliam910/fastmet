import SheetButton from "@/components/maps/SheetButton";
import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ContactInfo() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "white" }}>
      <View className="gap-5 px-6 py-2">
        <View className="gap-2">
          <Text className="text-lg font-bold">Name</Text>
          <TextInput
            placeholder="Type here..."
            className="p-4 border border-gray-300 rounded-lg"
          />
        </View>

        <View className="gap-2">
          <Text className="text-lg font-bold">Contact</Text>
          <TextInput
            placeholder="Type here..."
            className="p-4 border border-gray-300 rounded-lg"
          />
        </View>

        <View className="gap-2">
          <Text className="text-lg font-bold">Note and attachment</Text>
          <TextInput
            multiline
            numberOfLines={4}
            placeholder="Type here..."
            style={{ height: 120, textAlignVertical: "top" }}
            className="p-4 border border-gray-300 rounded-lg"
          />
        </View>

        <View className="gap-2">
          <Text className="text-lg font-bold">Upload Photo</Text>
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
      <SheetButton next={() => {}} />
    </SafeAreaView>
  );
}
