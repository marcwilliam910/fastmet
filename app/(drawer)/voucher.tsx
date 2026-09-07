import NotLoggedIn from "@/components/notLoggedIn";
import ClaimableVoucherTab from "@/components/voucher/ClaimableVoucherTab";
import MyVouchersTab from "@/components/voucher/MyVouchersTab";
import VoucherHistoryTab from "@/components/voucher/VoucherHistoryTab";
import {useAuth} from "@/hooks/useAuth";
import {useMyVouchersCount} from "@/queries/rewardQueries";
import {useState} from "react";
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

function CustomTabBar({navigationState, jumpTo, counts}: CustomTabBarProps) {
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
            style={{width: tabWidth}}
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
                <View
                  className={`absolute -top-2 -right-5 bg-red-500 rounded-full justify-center items-center ${count > 9 ? "w-5 h-4" : "size-4"}`}
                >
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

export default function VoucherScreen() {
  const {isLoggedIn} = useAuth();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState<TabRoute[]>([
    {key: "claimable", title: "Claimable"},
    {key: "my-vouchers", title: "My Vouchers"},
    {key: "history", title: "History"},
  ]);

  const {data: myVouchersCount = 0} = useMyVouchersCount();

  const renderScene = ({route}: {route: TabRoute}) => {
    switch (route.key) {
      case "claimable":
        return (
          <ClaimableVoucherTab onCodeClaimSuccess={() => setIndex(1)} />
        );
      case "my-vouchers":
        return <MyVouchersTab />;
      case "history":
        return <VoucherHistoryTab />;
      default:
        return null;
    }
  };

  if (!isLoggedIn) {
    return <NotLoggedIn />;
  }

  return (
    <TabView
      navigationState={{index, routes}}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{width: layout.width}}
      lazy
      renderLazyPlaceholder={() => (
        <View className="flex-1 items-center justify-center bg-white">
          <ActivityIndicator size="small" color="#999" />
        </View>
      )}
      className="bg-white"
      renderTabBar={(props) => (
        <CustomTabBar {...props} counts={{"my-vouchers": myVouchersCount}} />
      )}
    />
  );
}
