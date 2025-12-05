import { queryClient } from "@/lib/queryClient";
import {
  Montserrat_400Regular,
  Montserrat_700Bold,
  useFonts,
} from "@expo-google-fonts/montserrat";
import { QueryClientProvider } from "@tanstack/react-query";
import { SplashScreen, Stack } from "expo-router";
import { useEffect } from "react";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import LoadingModal from "@/components/modals/loading";
import { toastConfig } from "@/config/toastConfig";
import Toast from "react-native-toast-message";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded) {
      // NOT WORKING
      // bypass TS check
      // (Text as any).defaultProps = (Text as any).defaultProps || {};
      // (Text as any).defaultProps.style = {
      //   fontFamily: "Montserrat_400Regular",
      // };

      SplashScreen.hideAsync();
    }
  }, [fontsLoaded]);

  if (!fontsLoaded) {
    return null;
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {/* <FontWrapper> */}
        <QueryClientProvider client={queryClient}>
          <Stack screenOptions={{ headerShown: false }}>
            {/* <Stack.Protected guard={!user}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>

        <Stack.Protected guard={!!user}>
          <Stack.Screen name="(drawer)" />
          <Stack.Screen name="(root_screens)" />
        </Stack.Protected> */}
            <Stack.Screen name="(drawer)" />
            <Stack.Screen name="(auth)" />
            <Stack.Screen name="(root_screens)" />
            <Stack.Screen name="(public_screens)" />
          </Stack>
          <Toast config={toastConfig} />
          <LoadingModal />
        </QueryClientProvider>

        {/* </FontWrapper> */}
        <StatusBar backgroundColor="#0F2535" barStyle="light-content" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
