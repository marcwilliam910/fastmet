import { queryClient } from "@/lib/queryClient";
import {
  Montserrat_400Regular,
  Montserrat_700Bold,
  useFonts,
} from "@expo-google-fonts/montserrat";
import { QueryClientProvider } from "@tanstack/react-query";
import { SplashScreen, Stack } from "expo-router";
import { useEffect, useState } from "react";
import { StatusBar } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

import AnimatedSplash from "@/components/AnimatedSplash";
import LoadingModal from "@/components/modals/loading";
import { toastConfig } from "@/config/toastConfig";
import { useAuth } from "@/hooks/useAuth";
import { useSyncAuthMeta } from "@/hooks/useSyncAuthMeta";
import SocketProvider from "@/sockets/context/SocketProvider";
import Toast from "react-native-toast-message";
import "../global.css";
import * as Sentry from '@sentry/react-native';

function AuthMetaSync() {
  useSyncAuthMeta();
  return null;
}

Sentry.init({
  dsn: 'https://aceadef3929e78209242fa356db6b552@o4510836378697728.ingest.us.sentry.io/4510836521435136',

  // Adds more context data to events (IP address, cookies, user, etc.)
  // For more information, visit: https://docs.sentry.io/platforms/react-native/data-management/data-collected/
  sendDefaultPii: true,

  // Enable Logs
  enableLogs: true,

  // uncomment the line below to enable Spotlight (https://spotlightjs.com)
  // spotlight: __DEV__,
});

void SplashScreen.preventAutoHideAsync();

export default Sentry.wrap(function RootLayout() {
  const { hasHydrated } = useAuth();

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  const isReady = fontsLoaded && hasHydrated;
  const [splashAnimationFinished, setSplashAnimationFinished] = useState(false);

  useEffect(() => {
    if (!isReady) return;
    void SplashScreen.hideAsync();
  }, [isReady]);

  if (!isReady) {
    return null;
  }

  if (!splashAnimationFinished) {
    return (
      <AnimatedSplash onFinish={() => setSplashAnimationFinished(true)} />
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        {/* <FontWrapper> */}
        <QueryClientProvider client={queryClient}>
          <SocketProvider>
            <AuthMetaSync />
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
          </SocketProvider>
          <Toast config={toastConfig} />
          <LoadingModal />
        </QueryClientProvider>

        {/* </FontWrapper> */}
        <StatusBar backgroundColor="#0F2535" barStyle="light-content" />
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
});