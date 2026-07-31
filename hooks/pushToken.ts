import api from "@/lib/axios";
import {useAppStore} from "@/store/useAppStore";
import {
  getPushRegistration,
  PUSH_REGISTRATION_KEY,
} from "@/utils/helpers/pushRegistration";
import Constants from "expo-constants";
import * as Device from "expo-device";
import * as Notifications from "expo-notifications";
import {getItemAsync, setItemAsync} from "expo-secure-store";
import {Alert, Platform} from "react-native";

export {PUSH_REGISTRATION_KEY};
export const NOTIFICATION_PERMISSION_KEY = "notification_permission_asked";

export function getEasProjectId() {
  return (
    Constants.expoConfig?.extra?.eas?.projectId ??
    Constants.easConfig?.projectId
  );
}

/** Lean token fetch — only works if OS permission is already granted. */
export async function getExpoPushToken() {
  try {
    if (Platform.OS === "android") {
      await Notifications.setNotificationChannelAsync("default", {
        name: "default",
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: "#FFA840",
      });
    }

    if (!Device.isDevice) {
      console.log("⚠️ Must use physical device for Push Notifications");
      return undefined;
    }

    const projectId = getEasProjectId();
    if (!projectId) {
      console.error("❌ EAS projectId missing");
      return undefined;
    }

    const {status} = await Notifications.getPermissionsAsync();
    if (status !== "granted") {
      console.log("⚠️ Permission not granted for push notifications");
      return undefined;
    }

    const token = (await Notifications.getExpoPushTokenAsync({projectId})).data;
    console.log("📱 Push token obtained:", token);
    return token;
  } catch (error) {
    console.error("❌ getExpoPushToken failed:", error);
    return undefined;
  }
}

/**
 * Soft-ask once (Alert). Does not block the app if declined.
 * Returns true when permission is granted.
 */
export async function ensureNotificationPermissionSoft(): Promise<boolean> {
  try {
    if (!Device.isDevice) return false;

    const hasAsked = await getItemAsync(NOTIFICATION_PERMISSION_KEY);
    const {status: existingStatus} = await Notifications.getPermissionsAsync();

    if (existingStatus === "granted") return true;

    if (hasAsked) {
      console.log("⚠️ Permission previously declined");
      return false;
    }

    return await new Promise<boolean>((resolve) => {
      Alert.alert(
        "🔔 Stay Updated",
        "Enable notifications to receive alerts about scheduled trips and booking updates.",
        [
          {
            text: "Not Now",
            style: "cancel",
            onPress: async () => {
              await setItemAsync(NOTIFICATION_PERMISSION_KEY, "declined");
              resolve(false);
            },
          },
          {
            text: "Enable",
            onPress: async () => {
              const {status} = await Notifications.requestPermissionsAsync();
              await setItemAsync(NOTIFICATION_PERMISSION_KEY, "asked");
              resolve(status === "granted");
            },
          },
        ],
      );
    });
  } catch (error) {
    console.error("❌ ensureNotificationPermissionSoft failed:", error);
    return false;
  }
}

/** Soft-ask (if needed) then fetch token. Used on login by the push hook. */
export async function registerForPushNotificationsAsync() {
  try {
    const granted = await ensureNotificationPermissionSoft();
    if (!granted) return undefined;
    return await getExpoPushToken();
  } catch (error) {
    console.error("❌ registerForPushNotificationsAsync failed:", error);
    return undefined;
  }
}

export async function savePushTokenToBackend(token: string) {
  try {
    const userId = useAppStore.getState().id;
    if (!userId) return false;

    const saved = await getPushRegistration();
    if (saved?.token === token && saved?.userId === userId) {
      console.log("✅ Push token already saved (no update needed)");
      return true;
    }

    const response = await api.post("/notifications/token", {
      expoPushToken: token,
    });

    if (response.data.success) {
      console.log("✅ Push token saved to backend");
      await setItemAsync(
        PUSH_REGISTRATION_KEY,
        JSON.stringify({token, userId}),
      );
      return true;
    }

    return false;
  } catch (error: any) {
    console.error(
      "❌ Error saving push token:",
      error.response?.data || error.message,
    );
    return false;
  }
}
