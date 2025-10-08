import NotLoggedIn from "@/components/notLoggedIn";
import useAuth from "@/hooks/useAuth";
import {useProfileStore} from "@/store/useProfileStore";
import {Ionicons} from "@expo/vector-icons";
import {Image} from "expo-image";
import {router} from "expo-router";
import React from "react";
import {Pressable, ScrollView, Text, View} from "react-native";

export default function MyProfile() {
  const profile = useProfileStore((state) => state.profile);
  const {user} = useAuth();

  const menuItems = [
    {
      icon: "person",
      label: "Edit Profile",
      onPress: () => router.push("/(drawer)/(profile)/editProfile"),
    },
    // {icon: "call", label: "Contact Number", onPress: () => {}},
    // {icon: "mail", label: "Email address", onPress: () => {}},
    {
      icon: "lock-closed",
      label: "Change Password",
      onPress: () => router.push("/(drawer)/(profile)/changePass"),
    },
    {
      icon: "settings",
      label: "Settings",
      onPress: () => router.push("/(drawer)/settings"),
    },
  ];

  if (!user || !profile) return <NotLoggedIn />;

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="items-center gap-4 pt-12 pb-8">
        {/* Profile Image with Border */}
        <View className="border border-[#FFA840] rounded-full p-2">
          <Image
            source={require("@/assets/images/icon.png")}
            style={{width: 120, height: 120, borderRadius: 999}}
            contentFit="contain"
          />
        </View>

        {/* User Info */}
        <View className="items-center gap-1">
          <Text className="text-xl font-bold text-gray-800">
            {profile?.firstName} {profile?.lastName}
          </Text>
          <Text className="text-base text-gray-400">{profile?.email}</Text>
        </View>
      </View>

      {/* Menu Items */}
      <View className="gap-3 px-4">
        {menuItems.map((item, index) => (
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
