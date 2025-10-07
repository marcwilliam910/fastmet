// hooks/useAuthGuard.ts
import {Alert, Platform, ToastAndroid} from "react-native";
import useAuth from "./useAuth";

export function useAuthGuard() {
  const {user} = useAuth();

  const isAuthenticated = () => {
    if (!user) {
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

  return {isAuthenticated};
}
