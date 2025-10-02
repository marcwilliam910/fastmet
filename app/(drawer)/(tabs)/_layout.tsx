import HeaderTabs from "@/components/headers/HeaderTabs";
import {Ionicons} from "@expo/vector-icons";
import {Tabs} from "expo-router";
import {Text, View} from "react-native";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarStyle: {
          backgroundColor: "#0F2535",
          // height: 60, // Increase from default (~50px)
          // paddingTop: 5, // Add bottom padding
        },
        tabBarActiveTintColor: "#FFA840",
        tabBarInactiveTintColor: "#9FABB4",
        headerShown: true,
        headerStyle: {backgroundColor: "#0F2535"},
        headerTitle: () => <HeaderTabs />,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({color, focused}) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="request"
        options={{
          title: "Request",
          tabBarIcon: ({color, focused}) => (
            <Ionicons
              name={focused ? "calendar-clear" : "calendar-clear-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="wallet"
        options={{
          title: "Wallet",
          tabBarIcon: ({color, focused}) => (
            <Ionicons
              name={focused ? "wallet" : "wallet-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: "Chat",
          tabBarIcon: ({color, focused}) => (
            <View>
              <Ionicons
                name={focused ? "chatbubbles" : "chatbubbles-outline"}
                size={24}
                color={color}
              />
              <View className="absolute flex items-center justify-center bg-red-500 rounded-full size-4 -top-1 -right-2">
                <Text className="text-xs font-semibold text-white">4</Text>
              </View>
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: "Notification",
          tabBarIcon: ({color, focused}) => (
            <Ionicons
              name={focused ? "notifications" : "notifications-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tabs>
  );
}
