import {useBookingSettings} from "@/hooks/useBookingSettings";
import {Ionicons} from "@expo/vector-icons";
import {router} from "expo-router";
import React from "react";
import {Pressable, ScrollView, Text, View} from "react-native";

export default function ReportTab() {
  const {reportWindowDays} = useBookingSettings();

  return (
    <ScrollView
      className="flex-1 px-5 py-4"
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{paddingBottom: 40}}
    >
      <View className="items-center mb-6">
        <View className="justify-center items-center mb-4 w-20 h-20 bg-orange-100 rounded-full">
          <Ionicons name="document-text" size={40} color="#FFA840" />
        </View>
        <Text className="mb-2 text-2xl font-bold text-gray-900">
          File a Report
        </Text>
        <Text className="text-center text-gray-600">
          Report issues with completed or cancelled bookings
        </Text>
      </View>

      <Pressable
        onPress={() => router.push("/(drawer)/support/fileReport")}
        className="flex-row justify-between items-center px-3 py-4 mb-4 bg-white rounded-2xl border border-gray-200 active:bg-gray-50"
      >
        <View className="flex-row gap-2 items-center">
          <View className="justify-center items-center bg-orange-100 rounded-full size-12">
            <Ionicons name="alert-circle" size={24} color="#FFA840" />
          </View>
          <View>
            <Text className="text-base font-semibold text-gray-900">
              New Report
            </Text>
            <Text className="text-[12px] text-gray-500">
              File a complaint about a driver or booking
            </Text>
          </View>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
      </Pressable>

      <View className="mt-6">
        <Text className="mb-3 text-sm font-semibold text-gray-700">
          Common Issues
        </Text>

        <View className="gap-2">
          {[
            {
              icon: "time-outline",
              label: "Driver No-Show",
              description: "Driver didn't arrive",
            },
            {
              icon: "warning-outline",
              label: "Damaged Package",
              description: "Item was damaged during delivery",
            },
            {
              icon: "location-outline",
              label: "Wrong Drop-off",
              description: "Delivered to wrong location",
            },
            {
              icon: "person-remove-outline",
              label: "Driver Misconduct",
              description: "Unprofessional behavior",
            },
          ].map((issue, index) => (
            <View
              key={index}
              className="flex-row items-center p-4 bg-gray-50 rounded-xl"
            >
              <Ionicons name={issue.icon as any} size={20} color="#6B7280" />
              <View className="flex-1 ml-3">
                <Text className="font-medium text-gray-900">{issue.label}</Text>
                <Text className="text-xs text-gray-500">
                  {issue.description}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View className="p-4 mt-6 bg-amber-50 rounded-xl">
        <View className="flex-row gap-2 items-start">
          <Ionicons name="information-circle" size={20} color="#F59E0B" />
          <View className="flex-1">
            <Text className="mb-1 font-semibold text-amber-900">
              Reporting Guidelines
            </Text>
            <Text className="text-sm text-amber-700">
              • Reports must be filed within {reportWindowDays} days of
              completion/cancellation{"\n"}• Provide clear description and photos
              if available{"\n"}• Driver can reply to your report once{"\n"}•
              Admin will review and take appropriate action
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}
