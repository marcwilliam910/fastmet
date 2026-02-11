import HeaderDrawer from "@/components/headers/HeaderDrawer";
import LogoutModal from "@/components/modals/logoutModal";
import NotLoggedInModal from "@/components/modals/notLoggedInModal";
import { useAuth } from "@/hooks/useAuth";
import { usePushNotifications } from "@/hooks/usePushNotification";
import { useUnreadChatCount } from "@/queries/conversation";
import { useUnreadNotificationCount } from "@/queries/notification";
import { useAppStore } from "@/store/useAppStore";
import { Ionicons } from "@expo/vector-icons";
import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import { router } from "expo-router";
import { Drawer } from "expo-router/drawer";
import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CustomDrawerContent = (props: any) => {
  const inset = useSafeAreaInsets();
  const { isLoggedIn } = useAuth();
  const isProfileComplete = useAppStore((state) => state.isProfileComplete);

  console.log(isProfileComplete)

  const { state, descriptors, navigation } = props;

  const handlePress = (routeName: string) => {
    if (!isProfileComplete && routeName === "profile") {
      router.replace("/(auth)/profile-register");
      return;
    }
    if (!isLoggedIn && routeName !== "book") {
      props.setShowNotLoggedInModal(true); // open login modal
      return;
    }

    navigation.navigate(routeName);
  };

  return (
    <View className="flex-1">
      <DrawerContentScrollView {...props}>
        {state.routes.map((route: any, index: number) => {
          const { options } = descriptors[route.key];

          // Hide index route
          if (route.name === "index") return null;

          const focused = state.index === index;

          return (
            <DrawerItem
              key={route.key}
              label={options.drawerLabel ?? route.name}
              icon={({ color, size }) =>
                options.drawerIcon?.({ focused, color, size })
              }
              focused={focused}
              activeTintColor="#FFA840"
              inactiveTintColor="#FFFFFF"
              activeBackgroundColor="#1a3a4f"
              onPress={() => handlePress(route.name)}
            />
          );
        })}

        {/* Login / Logout action */}
        <Pressable
          className="flex-row gap-3 items-center px-5 py-4"
          onPress={() =>
            isLoggedIn
              ? props.setShowLogoutModal(true)
              : props.navigation.navigate("(auth)")
          }
        >
          <Ionicons
            name={isLoggedIn ? "log-out-outline" : "log-in-outline"}
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
  const [showNotLoggedInModal, setShowNotLoggedInModal] = useState(false);

  const { notification } = usePushNotifications();
  // Fetch and sync unread notification count
  useUnreadNotificationCount();
  useUnreadChatCount();

  // useEffect(() => {
  //   if (notification) {
  //     // Invalidate notification queries to refresh the list and count
  //     queryClient.invalidateQueries({
  //       queryKey: ["notifications"],
  //     });
  //     queryClient.invalidateQueries({
  //       queryKey: ["notificationUnreadCount"],
  //     });

  //     if (notification.request?.content?.data?.type === "booking_completed") {
  //       // show modal or something

  //       queryClient.invalidateQueries({
  //         queryKey: ["userBookings", "active"],
  //         exact: false,
  //       });

  //       queryClient.invalidateQueries({
  //         queryKey: ["userBookings", "completed"],
  //         exact: false,
  //       });

  //       queryClient.invalidateQueries({
  //         queryKey: ["userBookingCounts"],
  //       });
  //     }
  //   }
  // }, [notification]);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Drawer
        drawerContent={(props) => (
          <CustomDrawerContent
            {...props}
            setShowLogoutModal={setShowLogoutModal}
            setShowNotLoggedInModal={setShowNotLoggedInModal}
          />
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
      <NotLoggedInModal
        visible={showNotLoggedInModal}
        setVisible={setShowNotLoggedInModal}
      />
    </GestureHandlerRootView>
  );
}
