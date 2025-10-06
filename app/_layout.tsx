import useAuth from "@/hooks/useAuth";
import {
  Montserrat_400Regular,
  Montserrat_700Bold,
  useFonts,
} from "@expo-google-fonts/montserrat";
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
      <Stack screenOptions={{headerShown: false}}>
        <Stack.Protected guard={!user}>
          <Stack.Screen name="(auth)" />
        </Stack.Protected>

        <Stack.Protected guard={!!user}>
          <Stack.Screen name="(drawer)" />
          <Stack.Screen name="(root_screens)" />
        </Stack.Protected>

        <Stack.Screen name="(public_screens)" />
      </Stack>
      {/* </FontWrapper> */}
      <StatusBar backgroundColor="#0F2535" barStyle="light-content" />
    </SafeAreaProvider>
  );
}
