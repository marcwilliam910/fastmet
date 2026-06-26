import * as Application from "expo-application";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

export async function getDeviceId(): Promise<string> {
  if (Platform.OS === "android") {
    const androidId = Application.getAndroidId();
    if (androidId) return `android_${androidId}`;
  }

  if (Platform.OS === "ios") {
    const iosId = await Application.getIosIdForVendorAsync();
    if (iosId) return `ios_${iosId}`;
  }

  let id = await SecureStore.getItemAsync("deviceId");
  if (!id) {
    id = `fallback_${Date.now()}-${Math.random().toString(36).substring(2, 15)}`;
    await SecureStore.setItemAsync("deviceId", id);
  }
  return id;
}
