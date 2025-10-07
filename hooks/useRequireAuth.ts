import useAuth from "@/hooks/useAuth";
import {useCallback} from "react";
import {Platform, ToastAndroid} from "react-native";

export default function useRequireAuth() {
  const {user} = useAuth();

  const requireAuth = useCallback(
    (callback?: () => void) => {
      if (!user) {
        // ✅ Mobile-friendly login prompt
        if (Platform.OS === "android") {
          ToastAndroid.show(
            "Login required to perform this action",
            ToastAndroid.SHORT
          );
        } else {
          // You can swap this for a modal if you prefer
          alert("Login required to perform this action");
        }

        // Redirect after a small delay (optional)
        // setTimeout(() => router.push("/(auth)/login"), 500);
        return false;
      }

      // If logged in, proceed
      callback?.();
      return true;
    },
    [user]
  );

  return {requireAuth, isAuthenticated: !!user};
}
