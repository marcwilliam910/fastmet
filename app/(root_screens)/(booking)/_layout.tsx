import {Stack} from "expo-router";
import {useEffect} from "react";
import {StatusBar} from "react-native";

export default function BookingLayout() {
  useEffect(() => {
    StatusBar.setHidden(true);
    return () => {
      StatusBar.setHidden(false); // restore on unmount
    };
  }, []);
  return (
    <Stack screenOptions={{headerShown: false}}>
      <Stack.Screen name="book" />
      <Stack.Screen name="services" />
    </Stack>
  );
}
