import HeaderDrawer from "@/components/headers/HeaderDrawer";
import LogoutModal from "@/components/modals/logoutModal";
import { useAuth } from "@/hooks/useAuth";
import { usePushNotifications } from "@/hooks/usePushNotification";
import { useAppStore } from "@/store/useAppStore";
import { Ionicons } from "@expo/vector-icons";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import { Drawer } from "expo-router/drawer";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CustomDrawerContent = (props: any) => {
  const inset = useSafeAreaInsets();
  const { isLoggedIn } = useAuth();

  const action = isLoggedIn
    ? () => props.setIsOpen(true)
    : () => props.navigation.navigate("(auth)");

  return (
    <View className="flex-1">
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <Pressable
          className="flex-row items-center gap-3 px-5 py-4"
          onPress={action}
        >
          <Ionicons
            name={isLoggedIn ? "log-in-outline" : "log-out-outline"}
            size={24}
            color="white"
          />
          <Text className="font-semibold text-white">
            {isLoggedIn ? "Logout" : "Register / Login"}
          </Text>
        </Pressable>
      </DrawerContentScrollView>

      {/* Footer */}
      <View style={{ marginBottom: inset.bottom + 10 }}>
        <Text className="text-sm tracking-widest text-center text-gray-400">
          www.fastmet.com
        </Text>
      </View>
    </View>
  );
};

export default function DrawerLayout() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  usePushNotifications();
  const fetchFareRates = useAppStore.getState().fetchFareRates;

  useEffect(() => {
    fetchFareRates(); // fetch once when drawer mounts
  }, [fetchFareRates]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => (
          <CustomDrawerContent {...props} setIsOpen={setShowLogoutModal} />
        )}
        screenOptions={{
          headerShown: false,
          drawerStyle: {
            backgroundColor: "#0F2535",
          },
          drawerActiveTintColor: "#FFA840",
          drawerInactiveTintColor: "#FFFFFF",
          drawerActiveBackgroundColor: "#1a3a4f",
          drawerItemStyle: {
            borderRadius: 8,
          },

          headerStyle: { backgroundColor: "#0F2535" },
          headerLeft: () => null,
          headerTitle: ({ children }) => <HeaderDrawer title={children} />,
        }}
      >
        <Drawer.Screen
          name="index"
          options={{ drawerItemStyle: { display: "none" } }}
        />
        <Drawer.Screen
          name="book"
          options={{
            drawerLabel: "Book Now",
            title: "Book",
            drawerIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "navigate" : "navigate-outline"}
                size={24}
                color={focused ? "#FFA840" : "#FFFFFF"}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: "Dashboard",
            title: "Home",
            drawerIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "speedometer" : "speedometer-outline"}
                size={24}
                color={focused ? "#FFA840" : "#FFFFFF"}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="profile"
          options={{
            drawerLabel: "My Profile",
            title: "My Profile",
            // headerShown: true,
            drawerIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "person" : "person-outline"}
                size={24}
                color={focused ? "#FFA840" : "#FFFFFF"}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="settings"
          options={{
            drawerLabel: "Settings",
            title: "Settings",
            headerShown: true,
            drawerIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "settings" : "settings-outline"}
                size={24}
                color={focused ? "#FFA840" : "#FFFFFF"}
              />
            ),
          }}
        />

        <Drawer.Screen
          name="favorite"
          options={{
            drawerLabel: "Favorite",
            title: "Favorite",
            headerShown: true,
            drawerIcon: ({ focused }) => (
              <Ionicons
                name={focused ? "heart" : "heart-outline"}
                size={24}
                color={focused ? "#FFA840" : "#FFFFFF"}
              />
            ),
          }}
        />

        <Drawer.Screen
          name="about"
          options={{
            drawerLabel: "About",
            title: "About",
            headerShown: true,
            drawerIcon: ({ focused }) => (
              <Ionicons
                name={
                  focused ? "information-circle" : "information-circle-outline"
                }
                size={24}
                color={focused ? "#FFA840" : "#FFFFFF"}
              />
            ),
          }}
        />
      </Drawer>
      <LogoutModal isOpen={showLogoutModal} setIsOpen={setShowLogoutModal} />
    </GestureHandlerRootView>
  );
}
