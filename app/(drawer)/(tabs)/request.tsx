import NotLoggedIn from "@/components/notLoggedIn";
import ActiveRoute from "@/components/request_tabs/Active";
import CancelledRoute from "@/components/request_tabs/Cancelled";
import CompleteRoute from "@/components/request_tabs/Complete";
import RequestRoute from "@/components/request_tabs/Request";
import useAuth from "@/hooks/useAuth";
import * as React from "react";
import { useState } from "react";
import { ActivityIndicator, useWindowDimensions, View } from "react-native";
import { TabBar, TabView } from "react-native-tab-view";

export default function TabViewExample() {
  const { user, loading } = useAuth();
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const [routes] = useState([
    { key: "request", title: "Request" },
    { key: "active", title: "Active" },
    { key: "complete", title: "Complete" },
    { key: "canceled", title: "Cancelled" },
  ]);

  // Lazy render - only renders the active tab
  const renderScene = ({ route }: { route: { key: string } }) => {
    switch (route.key) {
      case "request":
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

  if (loading) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color="#FFA840" />
      </View>
    );
  }

  if (user === null) {
    return <NotLoggedIn />;
  }

  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
      lazy // Add this prop
      renderLazyPlaceholder={() => (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="small" color="#999" />
        </View>
      )}
      renderTabBar={(props) => (
        <TabBar
          {...props}
          indicatorStyle={{ backgroundColor: "#0F2535", height: 3 }}
          style={{ backgroundColor: "white" }}
          pressColor="transparent"
          activeColor="#0F2535"
          inactiveColor="#999"
        />
      )}
    />
  );
}
