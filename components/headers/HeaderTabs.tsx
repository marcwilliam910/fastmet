import { useAppStore } from "@/store/useAppStore";
import { STATIC_IMAGES } from "@/utils/constants";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { Image } from "expo-image";
import { router, useNavigation } from "expo-router";
import React from "react";
import { Platform, Pressable, Text, View } from "react-native";

const HeaderTabs = () => {
  const navigation = useNavigation();
  const unreadAnnouncementCount = useAppStore((s) => s.unreadAnnouncementCount);

  return (
    <View className="flex-row items-center justify-between w-full">
      <View className="flex-row items-center gap-8">
        <Pressable
          hitSlop={{ top: 20, left: 20, bottom: 0, right: 20 }}
          onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        >
          <Ionicons
            name="menu"
            size={Platform.OS === "ios" ? 34 : 28}
            color="#FFA840"
          />
        </Pressable>
        <View className="flex-row items-center gap-1">
          <Image
            source={STATIC_IMAGES.fastmetLogo}
            style={{ width: 40, height: 60 }}
            contentFit="contain"
          />
          <Text className="text-lg font-bold tracking-widest text-white">
            FastMet
          </Text>
        </View>
      </View>
      <Pressable onPress={() => router.push("/(root_screens)/announcements")}>
        <View>
          <Image
            source={STATIC_IMAGES.announcement}
            style={{ width: 30, height: 30 }}
            contentFit="contain"
          />
          {unreadAnnouncementCount > 0 && (
            <View className="absolute top-0 flex items-center justify-center bg-red-500 rounded-full -right-1 size-4">
              <Text className="text-xs font-semibold text-white">
                {unreadAnnouncementCount > 99 ? "99+" : unreadAnnouncementCount}
              </Text>
            </View>
          )}
        </View>
      </Pressable>
    </View>
  );
};

export default HeaderTabs;
