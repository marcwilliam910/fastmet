import { Ionicons } from "@expo/vector-icons";
import React from "react";
import { Pressable, Text, TouchableOpacity, View } from "react-native";

export interface ContactTabProps {
  onCall: () => void;
  onEmail: () => void;
  onOpenLiveChat: () => void;
}
export default function ContactTab({
  onCall,
  onEmail,
  onOpenLiveChat,
}: ContactTabProps) {
  const supportHours = [
    { day: "Mon – Fri", hours: "8:00 AM – 9:00 PM" },
    { day: "Saturday", hours: "9:00 AM – 6:00 PM" },
    { day: "Sun & Holidays", hours: "10:00 AM – 4:00 PM" },
  ];

  const directContacts: {
    icon: keyof typeof Ionicons.glyphMap;
    label: string;
    value: string;
    onPress: () => void;
  }[] = [
    {
      icon: "call",
      label: "Call Us",
      value: "(02) 8800-1234",
      onPress: onCall,
    },
    {
      icon: "mail",
      label: "Email Us",
      value: "support@fastmet.ph",
      onPress: onEmail,
    },
  ];

  return (
    <View className="gap-3.5">
      <Text className="text-base font-bold text-secondary">Contact Us</Text>

      {/* Live Chat */}
      <Pressable
        onPress={onOpenLiveChat}
        className="bg-secondary rounded-2xl p-4 flex-row items-center gap-3.5"
      >
        <View className="w-12 h-12 rounded-xl bg-lightPrimary items-center justify-center">
          <Ionicons name="chatbubble-ellipses" size={22} color="#0F2535" />
        </View>
        <View className="flex-1">
          <View className="flex-row items-center gap-2 mb-1">
            <Text className="text-sm font-bold text-white">Live Chat</Text>
            <View className="flex-row items-center gap-1 px-2 py-0.5 rounded-full bg-green-500/10">
              <View className="w-1.5 h-1.5 rounded-full bg-green-500" />
              <Text className="text-[10px] font-bold text-green-500">
                Online
              </Text>
            </View>
          </View>
          <Text className="text-xs text-white/40">Avg. response ~2 mins</Text>
        </View>
        <Ionicons name="chevron-forward" size={18} color="#FFA84066" />
      </Pressable>

      {/* Call / Email */}
      <View className="flex-row gap-3">
        {directContacts.map((item) => (
          <TouchableOpacity
            key={item.label}
            onPress={item.onPress}
            activeOpacity={0.8}
            className="flex-1 bg-white rounded-2xl p-4 items-center gap-2 border border-gray-100"
          >
            <View className="w-11 h-11 rounded-xl bg-orange-50 items-center justify-center">
              <Ionicons name={item.icon} size={20} color="#FFA840" />
            </View>
            <Text className="text-xs font-bold text-secondary">
              {item.label}
            </Text>
            <Text className="text-[10px] text-gray-400 text-center">
              {item.value}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Support Hours */}
      <View className="bg-white rounded-2xl p-4 border border-gray-100">
        <View className="flex-row items-center gap-2 mb-3">
          <Ionicons name="time-outline" size={16} color="#FFA840" />
          <Text className="text-sm font-bold text-secondary">
            Support Hours
          </Text>
        </View>
        {supportHours.map((row, i) => (
          <View
            key={row.day}
            className={`flex-row justify-between py-2.5 ${
              i < supportHours.length - 1 ? "border-b border-gray-100" : ""
            }`}
          >
            <Text className="text-sm text-gray-500">{row.day}</Text>
            <Text className="text-sm font-semibold text-secondary">
              {row.hours}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}
