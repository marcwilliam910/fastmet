import HeaderDrawer from "@/components/headers/HeaderDrawer";
import {Ionicons} from "@expo/vector-icons";
import {
  DrawerContentScrollView,
  DrawerItemList,
} from "@react-navigation/drawer";
import {router} from "expo-router";
import {Drawer} from "expo-router/drawer";
import {Pressable, Text, View} from "react-native";
import {GestureHandlerRootView} from "react-native-gesture-handler";

const CustomDrawerContent = (props: any) => {
  return (
    <View className="flex-1">
      <DrawerContentScrollView {...props}>
        <DrawerItemList {...props} />
        <Pressable
          className="flex-row items-center gap-3 px-5 py-4"
          onPress={() => router.push("/(auth)/login")}
        >
          <Ionicons name="log-out-outline" size={24} color="white" />
          <Text className="font-semibold text-white">Logout</Text>
        </Pressable>
      </DrawerContentScrollView>

      {/* Footer */}
      <View className="mb-5">
        <Text className="text-sm tracking-widest text-center text-gray-400">
          www.fastmet.com
        </Text>
      </View>
    </View>
  );
};

export default function DrawerLayout() {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
      <Drawer
        drawerContent={(props) => <CustomDrawerContent {...props} />}
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

          headerStyle: {backgroundColor: "#0F2535"},
          headerLeft: () => null,
          headerTitle: ({children}) => <HeaderDrawer title={children} />,
        }}
      >
        <Drawer.Screen
          name="(tabs)"
          options={{
            drawerLabel: "Home",
            title: "Home",
            drawerIcon: ({focused}) => (
              <Ionicons
                name={focused ? "home" : "home-outline"}
                size={24}
                color={focused ? "#FFA840" : "#FFFFFF"}
              />
            ),
          }}
        />
        <Drawer.Screen
          name="(profile)"
          options={{
            drawerLabel: "My Profile",
            title: "My Profile",
            // headerShown: true,
            drawerIcon: ({focused}) => (
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
            drawerIcon: ({focused}) => (
              <Ionicons
                name={focused ? "settings" : "settings-outline"}
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
            drawerIcon: ({focused}) => (
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
        <Drawer.Screen
          name="apply-driver"
          options={{
            drawerLabel: "Apply as Driver",
            title: "Apply as Driver",
            headerShown: true,
            drawerIcon: ({focused}) => (
              <Ionicons
                name={focused ? "car" : "car-outline"}
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
            drawerIcon: ({focused}) => (
              <Ionicons
                name={focused ? "heart" : "heart-outline"}
                size={24}
                color={focused ? "#FFA840" : "#FFFFFF"}
              />
            ),
          }}
        />
      </Drawer>
    </GestureHandlerRootView>
  );
}
