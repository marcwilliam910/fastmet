import {useAppStore} from "@/store/useAppStore";
import {Ionicons} from "@expo/vector-icons";
import React from "react";
import {Platform, Pressable, Text, TextInput, View} from "react-native";

const THEME_COLOR = "#FFA840";

type ContactInfoCardProps = {
  contactLabel: "Sender" | "Receiver";
  contactName: string;
  setContactName: (value: string) => void;
  contactPhone: string;
  setContactPhone: (value: string) => void;
  additionalDetails?: string;
  onUseMyInfo: () => void;
  onPickContact: () => void;
  showNameError?: boolean;
  showPhoneError?: boolean;
  cleanPhoneInput: (value: string) => string;
};

export default function ContactInfoCard({
  contactLabel,
  contactName,
  setContactName,
  contactPhone,
  setContactPhone,
  additionalDetails,
  onUseMyInfo,
  onPickContact,
  showNameError = false,
  showPhoneError = false,
  cleanPhoneInput,
}: ContactInfoCardProps) {
  return (
    <View className="px-4 mt-4">
      <View className="p-4 bg-white rounded-2xl border border-gray-200">
        <View className="flex-row justify-between items-center mb-4">
          <View className="flex-row items-center">
            <View className="justify-center items-center mr-3 w-10 h-10 rounded-full bg-lightPrimary/10">
              <Ionicons name="person-outline" size={20} color={THEME_COLOR} />
            </View>

            <View>
              <Text className="text-base font-semibold text-gray-900">
                {contactLabel} Information{" "}
                <Text className="text-sm text-red-500">*</Text>
              </Text>
              <Text className="text-xs text-gray-500">
                Who will be at this location?
              </Text>
            </View>
          </View>

          {useAppStore.getState().id && (
            <Pressable
              onPress={onUseMyInfo}
              hitSlop={8}
              className="flex-row items-center px-3 py-2 rounded-full bg-lightPrimary/10"
            >
              <Ionicons
                name="person-circle-outline"
                size={16}
                color={THEME_COLOR}
              />
              <Text
                className="ml-1 text-xs font-medium"
                style={{color: THEME_COLOR}}
              >
                Use mine
              </Text>
            </Pressable>
          )}
        </View>

        {!!additionalDetails && (
          <View className="flex-row p-3 mb-4 bg-amber-50 rounded-xl border border-amber-200">
            <Ionicons
              name="information-circle-outline"
              size={18}
              color="#D97706"
              style={{marginTop: 2, marginRight: 8}}
            />

            <View className="flex-1">
              <Text className="text-xs font-semibold tracking-wide text-amber-700 uppercase">
                Note
              </Text>
              <Text className="mt-1 text-sm leading-5 text-amber-900">
                {additionalDetails}
              </Text>
            </View>
          </View>
        )}

        <View className="mb-4">
          <Text className="mb-2 text-sm font-medium text-gray-700">
            Full Name <Text className="text-red-500">*</Text>
          </Text>

          <TextInput
            value={contactName}
            onChangeText={setContactName}
            placeholder={`${contactLabel} full name`}
            placeholderTextColor="#9CA3AF"
            className={`px-4 py-3 text-base text-gray-800 bg-gray-50 rounded-xl border ${
              showNameError ? "border-red-400" : "border-gray-200"
            }`}
          />
          {showNameError && (
            <Text className="mt-1 ml-1 text-xs font-semibold text-red-500">
              Name is required.
            </Text>
          )}
        </View>

        <View>
          <Text className="mb-2 text-sm font-medium text-gray-700">
            Mobile Number <Text className="text-red-500">*</Text>
          </Text>

          <View
            className={`flex-row items-center px-4 bg-gray-50 rounded-xl border ${
              showPhoneError ? "border-red-400" : "border-gray-200"
            }`}
          >
            <Text className="pr-3 mr-3 text-gray-700 border-r border-gray-300">
              +63
            </Text>

            <TextInput
              value={contactPhone}
              onChangeText={(value) => setContactPhone(cleanPhoneInput(value))}
              keyboardType="numeric"
              placeholder={`${contactLabel} mobile number`}
              placeholderTextColor="#9CA3AF"
              className="flex-1 text-base text-gray-800"
              style={{
                height: Platform.OS === "ios" ? 52 : 44,
              }}
            />

            <Pressable onPress={onPickContact} hitSlop={8} className="pl-3">
              <Ionicons name="book-outline" size={20} color={THEME_COLOR} />
            </Pressable>
          </View>
          {showPhoneError && (
            <Text className="mt-1 ml-1 text-xs font-semibold text-red-500">
              Valid 10-digit mobile number is required.
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
