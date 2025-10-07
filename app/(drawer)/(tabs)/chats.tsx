import NotLoggedIn from "@/components/notLoggedIn";
import useAuth from "@/hooks/useAuth";
import {Ionicons} from "@expo/vector-icons";
import {Image} from "expo-image";
import {router} from "expo-router";
import React from "react";
import {ActivityIndicator, FlatList, Pressable, Text, View} from "react-native";
import {TextInput} from "react-native-gesture-handler";

const DUMMYMESSAGES = [
  {
    id: "1",
    name: "John Doe",
    message: "Hello, how are you?",
    sent: "now",

    image: require("@/assets/images/icon.png"),
  },
  {
    id: "2",
    name: "Joel Manahan",
    sent: "Yesterday",
    message: "Can i book you today? I need to get to the airport",
    image: require("@/assets/images/icon.png"),
  },
  {
    id: "3",
    name: "Felix Lopez",
    sent: "3 days ago",
    message: "Sup! I need your truck tomorrow, I need to deliver some stuff",
    image: require("@/assets/images/icon.png"),
  },
  {
    id: "4",
    name: "Eudrudo Pangilinan",
    sent: "10:32 AM",

    message: "Hi sir, can you help me please?",
    image: require("@/assets/images/icon.png"),
  },
  // {
  //   id: "5",
  //   name: "John Doe",
  //   sent: "now",
  //   message: "Hello, how are you?",
  //   image: require("@/assets/images/icon.png"),
  // },
  // {
  //   id: "6",
  //   name: "John Doe",
  //   sent: "now",
  //   message: "Hello, how are you?",
  //   image: require("@/assets/images/icon.png"),
  // },
  // {
  //   id: "7",
  //   name: "John Doe",
  //   sent: "now",
  //   message: "Hello, how are you?",
  //   image: require("@/assets/images/icon.png"),
  // },
  // {
  //   id: "8",
  //   name: "John Doe",
  //   sent: "now",
  //   message: "Hello, how are you?",
  //   image: require("@/assets/images/icon.png"),
  // },
  // {
  //   id: "9",
  //   name: "John Doe",
  //   sent: "now",
  //   message: "Hello, how are you?",
  //   image: require("@/assets/images/icon.png"),
  // },
  // {
  //   id: "10",
  //   name: "John Doe",
  //   sent: "now",
  //   message: "Hello, how are you?",
  //   image: require("@/assets/images/icon.png"),
  // },
];

const Chat = () => {
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
      <View className="flex-row items-center px-4 py-1 mx-4 rounded-full bg-ctaSecondary">
        <TextInput placeholder="Search..." className="flex-1" />
        <Ionicons name="search" size={24} color="#9FABB4" />
      </View>

      <View>
        <FlatList
          data={DUMMYMESSAGES}
          showsVerticalScrollIndicator={false}
          renderItem={({item}) => <MessageCard item={item} />}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{gap: 3, paddingBottom: 60}}
        />
      </View>
    </View>
  );
};

export default Chat;

const MessageCard = ({item}: any) => {
  return (
    <Pressable
      className="flex-row items-center gap-4 px-4 py-2 active:bg-ctaSecondary"
      onPress={() => router.push("/(root_screens)/message")}
    >
      <Image
        source={item.image}
        style={{width: 50, height: 50, borderRadius: 999}}
        contentFit="contain"
      />
      <View className="flex-1 gap-1">
        <View className="flex-row items-center justify-between">
          <Text className="font-bold max-w-[60%]" numberOfLines={1}>
            {item.name}
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
