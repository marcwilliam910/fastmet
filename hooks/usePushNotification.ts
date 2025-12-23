import api from "@/lib/axios";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import { getItemAsync, setItemAsync } from "expo-secure-store";
import { useEffect, useRef, useState } from "react";
import { Alert, Platform } from "react-native";
import { useAuth } from "./useAuth";

const NOTIFICATION_PERMISSION_KEY = "notification_permission_asked";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >();
  const notificationListener = useRef<Notifications.EventSubscription | null>(
    null
  );
  const responseListener = useRef<Notifications.EventSubscription | null>(null);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) return;

    // Register for push notifications
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
      if (token) {
        savePushTokenToBackend(token);
      }
    });

    // Listen for notifications received while app is in foreground
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
        console.log("📬 Notification received:", notification);
      });

    // Listen for user taps on notifications
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        console.log("👆 Notification tapped:", data);

        // Handle navigation based on notification data
        // You can implement this later with your navigation
      });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, []);

  return {
    expoPushToken,
    notification,
  };
}

async function registerForPushNotificationsAsync() {
  let token;

  // Check if we already asked for permission using SecureStore
  const hasAsked = await getItemAsync(NOTIFICATION_PERMISSION_KEY);

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#FFA840",
    });
  }

  if (Device.isDevice) {
    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    // Only ask if we haven't asked before or permission was previously granted
    if (existingStatus !== "granted") {
      if (!hasAsked) {
        // Show explanation before asking
        return new Promise<string | undefined>((resolve) => {
          Alert.alert(
            "🔔 Stay Updated",
            "Enable notifications to receive alerts about scheduled trips and booking updates.",
            [
              {
                text: "Not Now",
                style: "cancel",
                onPress: async () => {
                  await setItemAsync(NOTIFICATION_PERMISSION_KEY, "declined");
                  resolve(undefined);
                },
              },
              {
                text: "Enable",
                onPress: async () => {
                  const { status } =
                    await Notifications.requestPermissionsAsync();
                  finalStatus = status;
                  await setItemAsync(NOTIFICATION_PERMISSION_KEY, "asked");

                  if (finalStatus === "granted") {
                    const token = (
                      await Notifications.getExpoPushTokenAsync({
                        projectId: Constants.expoConfig?.extra?.eas?.projectId,
                      })
                    ).data;
                    console.log("📱 Push token obtained:", token);
                    resolve(token);
                  } else {
                    resolve(undefined);
                  }
                },
              },
            ]
          );
        });
      } else {
        console.log("⚠️ Permission previously declined");
        return undefined;
      }
    }

    if (finalStatus !== "granted") {
      console.log("⚠️ Permission not granted for push notifications");
      return undefined;
    }

    // Get the token
    token = (
      await Notifications.getExpoPushTokenAsync({
        projectId: Constants.expoConfig?.extra?.eas?.projectId,
      })
    ).data;

    console.log("📱 Push token obtained:", token);
  } else {
    console.log("⚠️ Must use physical device for Push Notifications");
  }

  return token;
}

async function savePushTokenToBackend(token: string) {
  try {
    const response = await api.post("/notifications/token", {
      expoPushToken: token,
    });

    if (response.data.success) {
      console.log("✅ Push token saved to backend");
      // Optionally store token locally for reference
      await setItemAsync("expo_push_token", token);
    }
  } catch (error: any) {
    console.error(
      "❌ Error saving push token:",
      error.response?.data || error.message
    );
  }
}
