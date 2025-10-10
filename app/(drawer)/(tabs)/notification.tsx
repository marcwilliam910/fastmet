import NotLoggedIn from "@/components/notLoggedIn";
import useAuth from "@/hooks/useAuth";
import {Image} from "expo-image";
import {router} from "expo-router";
import React from "react";
import {ActivityIndicator, FlatList, Pressable, Text, View} from "react-native";

const DUMMYNOTIFICATIONS = [
  {
    id: "1",
    title: "Truck is ready",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    sent: "2h ago",
    image: require("@/assets/images/user.png"),
  },
  {
    id: "2",
    title: "Truck Arrived",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    sent: "1min ago",
    image: require("@/assets/images/user.png"),
  },
  {
    id: "3",
    title: "Truck Driver Cancelled",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    sent: "Yesterday",
    image: require("@/assets/images/user.png"),
  },
  {
    id: "4",
    title: "Truck on the way",
    message: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
    sent: "3hrs ago",
    image: require("@/assets/images/user.png"),
  },
];

const Notification = () => {
  const {user, loading} = useAuth();

  if (loading) {
    return (
      <View className="items-center justify-center flex-1">
        <ActivityIndicator size="large" color="#FFA840" />
      </View>
    );
  }

  if (user === null) {
    return <NotLoggedIn />;
  }

  return (
    <View className="flex-1 gap-6 py-6 bg-white">
      <FlatList
        data={DUMMYNOTIFICATIONS}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => <NotificationCard item={item} />}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{gap: 3, paddingBottom: 60}}
      />
    </View>
  );
};

export default Notification;

const NotificationCard = ({item}: any) => {
  return (
    <Pressable
      className="flex-row items-center gap-4 px-4 py-2 active:bg-ctaSecondary"
      onPress={() => router.push("/(root_screens)/notifViewer")}
    >
      <Image
        source={item.image}
        style={{width: 50, height: 50, borderRadius: 999}}
        contentFit="contain"
      />
      <View className="flex-1 gap-1">
        <View className="flex-row items-center justify-between">
          <Text className="font-bold max-w-[60%]" numberOfLines={1}>
            {item.title}
          </Text>
          <Text className="text-xs text-gray-400">{item.sent}</Text>
        </View>
        <Text
          className="text-sm font-medium text-gray-600 max-w-[80%]"
          numberOfLines={1}
        >
          {item.message}
        </Text>
      </View>
    </Pressable>
  );
};
