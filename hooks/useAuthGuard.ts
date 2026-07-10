import { Alert, Platform, ToastAndroid } from "react-native";
import { useAuth } from "./useAuth";

export function useAuthGuard() {
  const { isLoggedIn } = useAuth();

  const isAuthenticated = () => {
    if (!isLoggedIn) {
      if (Platform.OS === "android") {
        ToastAndroid.show("Login required", ToastAndroid.SHORT);
      } else {
        Alert.alert("Login required");
      }
      // router.replace("/(auth)/login");
      return false;
    }
    return true;
  };

  return { isAuthenticated };
}
