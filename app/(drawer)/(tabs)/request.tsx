import NotLoggedIn from "@/components/notLoggedIn";
import ActiveRoute from "@/components/request_tabs/Active";
import CancelledRoute from "@/components/request_tabs/Cancelled";
import CompleteRoute from "@/components/request_tabs/Complete";
import RequestRoute from "@/components/request_tabs/Request";
import useAuth from "@/hooks/useAuth";
import { useBookingCounts } from "@/queries/bookingQueries";
import { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Animated from "react-native-reanimated";
import {
  NavigationState,
  SceneRendererProps,
  TabView,
} from "react-native-tab-view";

type TabRoute = {
  key: string;
  title: string;
};

type CustomTabBarProps = SceneRendererProps & {
  navigationState: NavigationState<TabRoute>;
  counts: Record<string, number>;
};

function CustomTabBar({ navigationState, jumpTo, counts }: CustomTabBarProps) {
  const layout = useWindowDimensions();
  const tabWidth = layout.width / navigationState.routes.length;

  return (
    <View className="flex-row bg-white border-b border-gray-200">
      {navigationState.routes.map((route, idx) => {
        const isFocused = navigationState.index === idx;
        const count = counts[route.key];

        return (
          <Pressable
            key={route.key}
            onPress={() => jumpTo(route.key)}
            className="flex-1 items-center justify-center py-4"
            style={{ width: tabWidth }}
          >
            <View className="relative">
              <Text
                className={`text-sm font-medium ${
                  isFocused ? "text-[#0F2535]" : "text-gray-400"
                }`}
              >
                {route.title}
              </Text>
              {count !== undefined && count > 0 && (
                <View className="absolute -top-3 -right-4 bg-red-500 rounded-full size-[16px] justify-center items-center">
                  <Text className="text-white text-[8px] scale-125 font-bold">
                    {count > 9 ? "9+" : count}
                  </Text>
                </View>
              )}
            </View>
          </Pressable>
        );
      })}
      <Animated.View
        className="absolute bottom-0 h-[3px] bg-[#0F2535]"
        style={{
          width: tabWidth,
          transform: [
            {
              translateX: navigationState.index * tabWidth,
            },
          ],
        }}
      />
    </View>
  );
}

export default function Request() {
  const { user, loading } = useAuth();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState<TabRoute[]>([
    { key: "pending", title: "Request" },
    { key: "active", title: "Active" },
    { key: "complete", title: "Complete" },
    { key: "canceled", title: "Cancelled" },
  ]);

  const { data: counts, isPending, error } = useBookingCounts(user?.uid!);

  // Lazy render - only renders the active tab
  const renderScene = ({ route }: { route: TabRoute }) => {
    switch (route.key) {
      case "pending":
        return <RequestRoute />;
      case "active":
        return <ActiveRoute />;
      case "complete":
        return <CompleteRoute />;
      case "canceled":
        return <CancelledRoute />;
      default:
        return null;
    }
  };

  if (isPending || loading)
    return (
      <View className="flex-1 items-center bg-white justify-center">
        <ActivityIndicator size="large" color="#FFA840" />
      </View>
    );
  if (error)
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-semibold text-gray-500">
          {error.message}
        </Text>
      </View>
    );

  if (user === null) {
    return <NotLoggedIn />;
  }

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      lazy
      renderLazyPlaceholder={() => (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color="#999" />
        </View>
      )}
      renderTabBar={(props) => <CustomTabBar {...props} counts={counts} />}
    />
  );
}
