import {useFocusEffect, router} from "expo-router";
import {useCallback} from "react";
import {BackHandler} from "react-native";

/**
 * On Android hardware back while this screen is focused:
 * - pop if there is history, otherwise replace to Book.
 * Prevents landing on the blank drawer index redirect.
 */
export function useDrawerFallbackBack() {
  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (router.canGoBack()) {
          router.back();
        } else {
          router.replace("/(drawer)/book");
        }
        return true;
      };

      const subscription = BackHandler.addEventListener(
        "hardwareBackPress",
        onBackPress,
      );

      return () => subscription.remove();
    }, []),
  );
}
