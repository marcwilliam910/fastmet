import NotLoggedIn from "@/components/notLoggedIn";
import { useAuth } from "@/hooks/useAuth";
import { useAppStore } from "@/store/useAppStore";
import { STATIC_IMAGES } from "@/utils/constants";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

export default function MyProfile() {
  const { isLoggedIn } = useAuth();
  const name = useAppStore((state) => state.name);
  const profilePictureUrl = useAppStore((state) => state.profilePictureUrl);
  const options = [
    {
      icon: "person",
      label: "Edit Profile",
      onPress: () => router.push("/(drawer)/profile/editProfile"),
    },
    {
      icon: "settings",
      label: "Settings",
      onPress: () => router.push("/(drawer)/settings"),
    },
  ];

  if (!isLoggedIn) return <NotLoggedIn />;

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="items-center gap-4 pt-12 pb-8">
        {/* Profile Image with Border */}
        <View className="border border-lightPrimary rounded-full p-2">
          <Image
            source={
              profilePictureUrl
                ? { uri: profilePictureUrl }
                : STATIC_IMAGES.userPlaceholder
            }
            style={{ width: 120, height: 120, borderRadius: 999 }}
            contentFit="cover"
          />
        </View>

        {/* User Info */}
        <View className="items-center gap-1">
          <Text className="text-xl font-bold text-gray-800">{name}</Text>
          <Text className="text-base text-gray-400">
            {useAppStore.getState().phoneNumber.replace("+63", "+63 ")}
          </Text>
        </View>
      </View>

      {/* Menu Items */}
      <View className="gap-3 px-4">
        {options.map((item, index) => (
          <Pressable
            key={index}
            onPress={item.onPress}
            className="flex-row items-center px-5 py-4 bg-gray-100 rounded-2xl active:opacity-70"
          >
            <View className="items-center justify-center w-10 h-10">
              <Ionicons name={item.icon as any} size={22} color="#FFA840" />
            </View>

            <Text className="flex-1 ml-4 text-base font-semibold text-gray-800">
              {item.label}
            </Text>

            <Ionicons name="chevron-forward" size={24} color="#FFA840" />
          </Pressable>
        ))}
      </View>
    </ScrollView>
  );
}
