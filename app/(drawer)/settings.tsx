import LogoutModal from "@/components/modals/logoutModal";
import NotLoggedIn from "@/components/notLoggedIn";
import {useAuth} from "@/hooks/useAuth";
import {useDrawerFallbackBack} from "@/hooks/useDrawerFallbackBack";
import api from "@/lib/axios";
import {pushOnce} from "@/utils/helpers/navigation";
import {Ionicons} from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import React, {useEffect, useMemo, useState} from "react";
import {Alert, Linking, Pressable, Switch, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const Settings = () => {
  useDrawerFallbackBack();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const {isLoggedIn} = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [isLoadingNotifications, setIsLoadingNotifications] = useState(true);
  const [osPermissionStatus, setOsPermissionStatus] = useState<
    "granted" | "denied" | "undetermined"
  >("undetermined");

  // Fetch notification settings on mount
  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    fetchNotificationSettings();
  }, [isLoggedIn]);

  const fetchNotificationSettings = async () => {
    try {
      // Check OS permission
      const {status} = await Notifications.getPermissionsAsync();
      setOsPermissionStatus(status);

      // Check backend setting
      const response = await api.get("/notifications/settings");
      if (response.data.success) {
        const backendEnabled = response.data.data.enabled;
        // Only enabled if both OS and backend allow
        setNotificationsEnabled(backendEnabled && status === "granted");
      }
    } catch (error) {
      console.error("Error fetching notification settings:", error);
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  const handleNotificationToggle = async (value: boolean) => {
    try {
      if (value) {
        // User wants to ENABLE notifications
        const {status} = await Notifications.getPermissionsAsync();

        if (status === "denied") {
          // OS permission was denied - send to device settings
          Alert.alert(
            "Notifications Blocked",
            "To receive trip alerts, please enable notifications in your device settings.",
            [
              {text: "Cancel", style: "cancel"},
              {
                text: "Open Settings",
                onPress: () => Linking.openSettings(),
              },
            ],
          );
          return;
        }

        if (status === "undetermined") {
          // Haven't asked for permission yet - request it
          Alert.alert(
            "🔔 Enable Notifications",
            "Allow notifications to receive alerts about scheduled trips and booking updates.",
            [
              {
                text: "Not Now",
                style: "cancel",
              },
              {
                text: "Allow",
                onPress: async () => {
                  const {status: newStatus} =
                    await Notifications.requestPermissionsAsync();

                  if (newStatus === "granted") {
                    // Get push token and save
                    const token = (
                      await Notifications.getExpoPushTokenAsync({
                        projectId: process.env.EXPO_PUBLIC_EAS_PROJECT_ID, // Add your project ID
                      })
                    ).data;

                    // Save token to backend
                    await api.post("/notifications/token", {
                      expoPushToken: token,
                    });

                    // Enable on backend
                    await api.post("/notifications/enable");

                    setOsPermissionStatus("granted");
                    setNotificationsEnabled(true);

                    Toast.show({
                      type: "success",
                      text1: "✅ Notifications Enabled",
                      text2: "You will receive alerts for scheduled trips",
                    });
                  } else {
                    // User denied permission
                    setOsPermissionStatus("denied");
                    Toast.show({
                      type: "error",
                      text1: "Permission Denied",
                      text2: "You can enable it later in device settings",
                    });
                  }
                },
              },
            ],
          );
          return;
        }

        // Permission already granted - just enable on backend
        setIsLoadingNotifications(true);
        const response = await api.post("/notifications/enable");

        if (response.data.success) {
          setNotificationsEnabled(true);
          Toast.show({
            type: "success",
            text1: "✅ Notifications Enabled",
            text2: "You will receive alerts for scheduled trips",
          });
        }
      } else {
        // User wants to DISABLE notifications
        setIsLoadingNotifications(true);
        const response = await api.post("/notifications/disable");

        if (response.data.success) {
          setNotificationsEnabled(false);
          Toast.show({
            type: "success",
            text1: "🔕 Notifications Disabled",
            text2: "You won't receive push notifications",
          });
        }
      }
    } catch (error: any) {
      console.error("Error toggling notifications:", error);
      Toast.show({
        type: "error",
        text1: "Error",
        text2: error.response?.data?.error || "Failed to update settings",
      });
    } finally {
      setIsLoadingNotifications(false);
    }
  };

  const menuItems = useMemo(
    () => [
      {
        label: "Privacy Policy",
        onPress: () => pushOnce("/(public_screens)/privacyPolicy"),
      },
      {
        label: "Terms & Conditions",
        onPress: () => pushOnce("/(public_screens)/terms&conditions"),
      },

      {
        label: "About Us",
        onPress: () => pushOnce("/(root_screens)/about"),
      },
      {
        label: isLoggedIn ? "Logout" : "Register / Login",
        onPress: () =>
          isLoggedIn ? setShowLogoutModal(true) : pushOnce("/(auth)/auth"),
      },
    ],
    [isLoggedIn],
  );

  if (!isLoggedIn) {
    return <NotLoggedIn />;
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="gap-3 px-4">
        <Pressable
          onPress={() =>
            !isLoadingNotifications &&
            handleNotificationToggle(!notificationsEnabled)
          }
          className="flex-row items-center px-5 py-4 bg-gray-100 rounded-2xl active:opacity-70"
          disabled={isLoadingNotifications}
        >
          <Ionicons
            name={notificationsEnabled ? "notifications" : "notifications-off"}
            size={24}
            color={notificationsEnabled ? "#FFA840" : "#9CA3AF"}
          />
          <View className="flex-1 ml-4">
            <Text className="text-base font-semibold text-gray-800">
              Notifications
            </Text>
            {osPermissionStatus === "denied" && (
              <Text className="mt-1 text-xs text-orange-600">
                Enable in device settings
              </Text>
            )}
          </View>

          <Switch
            value={notificationsEnabled}
            onValueChange={handleNotificationToggle}
            disabled={isLoadingNotifications}
            trackColor={{false: "#D1D5DB", true: "#FFA840"}}
            thumbColor={notificationsEnabled ? "#fff" : "#f4f3f4"}
            ios_backgroundColor="#D1D5DB"
          />
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
