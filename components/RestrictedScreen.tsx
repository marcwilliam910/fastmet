import {SUPPORT_EMAIL} from "@/utils/constants";
import {Ionicons} from "@expo/vector-icons";
import * as Clipboard from "expo-clipboard";
import {ReactNode, useState} from "react";
import {Pressable, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

export interface RestrictedAction {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  onPress: () => void;
  variant: "filled" | "ghost";
}

interface RestrictedScreenProps {
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor: string;
  iconBgClass: string;
  title: string;
  description: string;
  topExtra?: ReactNode;
  infoBoxText?: string;
  infoBoxVariant?: "error" | "warning";
  actions: RestrictedAction[];
}

function ContactCard() {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    await Clipboard.setStringAsync(SUPPORT_EMAIL);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <View className="overflow-hidden mb-6 rounded-xl border border-gray-200">
      <View className="flex-row items-center px-4 py-3 bg-gray-50">
        <Ionicons name="mail-outline" size={18} color="#6B7280" />
        <View className="flex-1 ml-3">
          <Text className="text-xs text-gray-400 mb-0.5">Email</Text>
          <Text className="text-sm font-semibold text-[#111]">
            {SUPPORT_EMAIL}
          </Text>
        </View>
        <Pressable onPress={handleCopy} className="px-2 py-1 active:opacity-60">
          <Ionicons
            name={copied ? "checkmark-outline" : "copy-outline"}
            size={18}
            color={copied ? "#16A34A" : "#6B7280"}
          />
        </Pressable>
      </View>
    </View>
  );
}

export default function RestrictedScreen({
  iconName,
  iconColor,
  iconBgClass,
  title,
  description,
  topExtra,
  infoBoxText,
  infoBoxVariant = "error",
  actions,
}: RestrictedScreenProps) {
  const infoBoxClasses =
    infoBoxVariant === "error"
      ? "bg-red-50 border-red-200"
      : "bg-yellow-50 border-yellow-200";
  const infoBoxTextClass =
    infoBoxVariant === "error" ? "text-red-700" : "text-yellow-700";
  const infoBoxIconColor = infoBoxVariant === "error" ? "#DC2626" : "#D97706";

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 px-6 pt-10">
        <View className="items-center mb-6">
          <View
            className={`justify-center items-center mb-4 w-20 h-20 rounded-full ${iconBgClass}`}
          >
            <Ionicons name={iconName} size={40} color={iconColor} />
          </View>
          <Text className="text-2xl font-extrabold text-[#111] mb-2 text-center">
            {title}
          </Text>
          <Text className="text-sm leading-6 text-center text-gray-500">
            {description}
          </Text>
        </View>

        {topExtra}

        {infoBoxText ? (
          <View
            className={`flex-row items-center px-4 py-3 mb-6 rounded-xl border ${infoBoxClasses}`}
          >
            <Ionicons
              name="information-circle-outline"
              size={18}
              color={infoBoxIconColor}
            />
            <Text
              className={`flex-1 ml-2 text-sm leading-5 ${infoBoxTextClass}`}
            >
              {infoBoxText}
            </Text>
          </View>
        ) : null}

        <ContactCard />

        {actions.map((action) => {
          if (action.variant === "ghost") {
            return (
              <Pressable
                key={action.label}
                onPress={action.onPress}
                className="items-center mt-3 active:opacity-70"
              >
                <Text className="text-sm font-medium text-gray-500">
                  {action.label}
                </Text>
              </Pressable>
            );
          }

          return (
            <Pressable
              key={action.label}
              onPress={action.onPress}
              className="items-center py-4 mb-3 w-full rounded-xl bg-lightPrimary active:bg-darkPrimary"
            >
              <View className="flex-row gap-2 items-center">
                <Ionicons name={action.icon} size={18} color="#fff" />
                <Text className="text-base font-semibold text-white">
                  {action.label}
                </Text>
              </View>
            </Pressable>
          );
        })}
      </View>
    </SafeAreaView>
  );
}
