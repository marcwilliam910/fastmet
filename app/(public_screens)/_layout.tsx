import HeaderProfile from "@/components/headers/HeaderProfile";
import {Stack} from "expo-router";

export default function PublicScreenLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {backgroundColor: "#0F2535"},
        headerLeft: () => null,
        headerBackVisible: false, // <- disables built-in back
        headerTitle: ({children}) => <HeaderProfile title={children} />,
      }}
    >
      <Stack.Screen
        name="privacyPolicy"
        options={{
          title: "Privacy Policy",
        }}
      />
      <Stack.Screen
        name="terms&conditions"
        options={{
          title: "Terms & Conditions",
        }}
      />
    </Stack>
  );
}
