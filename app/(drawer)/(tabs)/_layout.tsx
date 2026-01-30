import HeaderTabs from "@/components/headers/HeaderTabs";
import {useAppStore} from "@/store/useAppStore";
import {Ionicons} from "@expo/vector-icons";
import {Tabs} from "expo-router";
import {Text, View} from "react-native";

export default function TabLayout() {
  const unreadConversationsCount = useAppStore(
    (state) => state.unreadConversationsCount,
  );
  const unreadNotificationCount = useAppStore(
    (state) => state.unreadNotificationCount,
  );
  return (
    <Tabs
      initialRouteName="request"
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
        name="request"
        options={{
          title: "Request",
          tabBarIcon: ({color, focused}) => (
            <View>
              <Ionicons
                name={focused ? "calendar" : "calendar-outline"}
                size={24}
                color={color}
              />
              {/* <View className="absolute flex items-center justify-center bg-red-500 rounded-full size-4 -top-1 -right-2">
                <Text className="text-xs font-semibold text-white">4</Text>
              </View> */}
            </View>
          ),
        }}
      />

      <Tabs.Screen
        name="chats"
        options={{
          title: "Chat",
          tabBarIcon: ({color, focused}) => (
            <View>
              <Ionicons
                name={focused ? "chatbubbles" : "chatbubbles-outline"}
                size={24}
                color={color}
              />
              {unreadConversationsCount > 0 && (
                <View className="absolute flex items-center justify-center bg-red-500 rounded-full size-4 -top-1 -right-2">
                  <Text className="text-xs font-semibold text-white">
                    {unreadConversationsCount > 9
                      ? "9+"
                      : unreadConversationsCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="notification"
        options={{
          title: "Notification",
          tabBarIcon: ({color, focused}) => (
            <View>
              <Ionicons
                name={focused ? "notifications" : "notifications-outline"}
                size={24}
                color={color}
              />
              {unreadNotificationCount > 0 && (
                <View className="absolute flex items-center justify-center bg-red-500 rounded-full -top-1 -right-1 size-4">
                  <Text className="text-xs font-semibold text-white">
                    {unreadNotificationCount > 9
                      ? "9+"
                      : unreadNotificationCount}
                  </Text>
                </View>
              )}
            </View>
          ),
        }}
      />
    </Tabs>
  );
}
