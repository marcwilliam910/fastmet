import LogoutModal from "@/components/modals/logoutModal";
import {Ionicons} from "@expo/vector-icons";
import {router} from "expo-router";
import React, {useMemo, useState} from "react";
import {Pressable, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

const Settings = () => {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const menuItems = useMemo(
    () => [
      {
        label: "Privacy Policy",
        onPress: () => router.push("/(root_screens)/privacyPolicy"),
      },
      {
        label: "Terms & Conditions",
        onPress: () => router.push("/(root_screens)/terms&conditions"),
      },
      {
        label: "Help and Support",
        onPress: () => router.push("/(root_screens)/help&support"),
      },
      {
        label: "File a Report",
        onPress: () => router.push("/(root_screens)/fileReport"),
      },
      {label: "About Us", onPress: () => router.push("/(root_screens)/about")},
      {label: "Sign Out", onPress: () => setShowLogoutModal(true)},
    ],
    [router]
  );

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="gap-3 px-4">
        <Pressable className="flex-row items-center px-5 py-1.5 bg-gray-100 rounded-2xl active:opacity-70">
          <Text className="flex-1 ml-4 text-base font-semibold text-gray-800">
            Notification
          </Text>

          <Ionicons name="toggle" size={40} color="#FFA840" />
        </Pressable>
        {menuItems.map((item, index) => (
          <Pressable
            key={index}
            onPress={item.onPress}
            className="flex-row items-center px-5 py-4 bg-gray-100 rounded-2xl active:opacity-70"
          >
            <Text className="flex-1 ml-4 text-base font-semibold text-gray-800">
              {item.label}
            </Text>

            <Ionicons name="chevron-forward" size={24} color="#FFA840" />
          </Pressable>
        ))}
      </View>
      <LogoutModal isOpen={showLogoutModal} setIsOpen={setShowLogoutModal} />
    </SafeAreaView>
  );
};

export default Settings;
