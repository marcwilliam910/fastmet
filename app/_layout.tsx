import useAuth from "@/hooks/useAuth";
import {queryClient} from "@/lib/queryClient";
import {
  Montserrat_400Regular,
  Montserrat_700Bold,
  useFonts,
} from "@expo-google-fonts/montserrat";
import {QueryClientProvider} from "@tanstack/react-query";
import {SplashScreen, Stack} from "expo-router";
import {useEffect} from "react";
import {StatusBar} from "react-native";
import {SafeAreaProvider} from "react-native-safe-area-context";
import "../global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const {user, loading} = useAuth();

  const [fontsLoaded] = useFonts({
    Montserrat_400Regular,
    Montserrat_700Bold,
  });

  useEffect(() => {
    if (fontsLoaded && !loading) {
      // bypass TS check
      (Text as any).defaultProps = (Text as any).defaultProps || {};
      (Text as any).defaultProps.style = {
        fontFamily: "Montserrat_400Regular",
      };

      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, loading]);

  if (!fontsLoaded || loading) {
    return null;
  }

  return (
    <SafeAreaProvider>
      {/* <FontWrapper> */}
      <QueryClientProvider client={queryClient}>
        <Stack screenOptions={{headerShown: false}} initialRouteName="(drawer)">
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
      </QueryClientProvider>

      {/* </FontWrapper> */}
      <StatusBar backgroundColor="#0F2535" barStyle="light-content" />
    </SafeAreaProvider>
  );
}
