import HeaderProfile from "@/components/headers/HeaderProfile";
import { Stack } from "expo-router";

export default function RootScreenLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: { backgroundColor: "#0F2535" },
        headerLeft: () => null,
        headerBackVisible: false, // <- disables built-in back
        headerTitle: ({ children }) => <HeaderProfile title={children} />,
      }}
    >
      <Stack.Screen
        name="message"
        options={{ title: "Message", headerShown: false }}
      />
      <Stack.Screen
        name="help&support"
        options={{
          title: "Help and Support",
        }}
      />
      <Stack.Screen
        name="fileReport"
        options={{
          title: "File a Report",
        }}
      />
      <Stack.Screen
        name="about"
        options={{
          title: "About Us",
        }}
      />
      <Stack.Screen
        name="notifViewer"
        options={{
          title: "Notification",
        }}
      />
      <Stack.Screen
        name="booking"
        options={{
          title: "Book",
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="searchChat"
        options={{
          title: "Search",
          headerShown: false,
        }}
      />
    </Stack>
  );
}
