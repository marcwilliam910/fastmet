import HeaderDrawer from "@/components/headers/HeaderDrawer";
import HeaderProfile from "@/components/headers/HeaderProfile";
import {Stack} from "expo-router";

export default function ProfileLayout() {
  return (
    <Stack
      screenOptions={{
        headerStyle: {backgroundColor: "#0F2535"},
        headerLeft: () => null,
        headerBackVisible: false, // <- disables built-in back
      }}
    >
      <Stack.Screen
        name="index"
        options={{
          title: "My Profile",
          headerTitle: ({children}) => <HeaderDrawer title={children} />,
        }}
      />
      <Stack.Screen
        name="editProfile"
        options={{
          title: "Edit Profile",
          headerTitle: ({children}) => <HeaderProfile title={children} />,
        }}
      />
      <Stack.Screen
        name="changePass"
        options={{
          title: "Change Password",
          headerTitle: ({children}) => <HeaderProfile title={children} />,
        }}
      />
    </Stack>
  );
}
