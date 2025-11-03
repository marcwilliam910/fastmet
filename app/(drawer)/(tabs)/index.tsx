import Carousel from "@/components/Carousel";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

const Home = () => {
  return (
    <View className="relative flex-1 bg-white">
      <ScrollView
        className="relative flex-1 bg-white"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ gap: 16 }}
      >
        <Carousel />
        <Text className="text-xl font-bold text-center">
          Welcome to FastMet
        </Text>
        <View className="gap-5 p-5 pb-20">
          <Pressable className="flex-row items-center bg-gray-100 p-4 h-20 rounded-lg justify-between active:border-lightPrimary active:border">
            <Text className="text-lg font-bold">Passenger</Text>
            <Ionicons name="information-circle" size={24} color="#FFA840" />
          </Pressable>
          <Pressable className="flex-row items-center bg-gray-100 p-4 h-20 rounded-lg justify-between active:border-lightPrimary active:border">
            <Text className="text-lg font-bold">Pasabay</Text>
            <Ionicons name="information-circle" size={24} color="#FFA840" />
          </Pressable>
        </View>
      </ScrollView>
      {/* buttons */}
      <Pressable
        className="px-10 py-4 mx-8 rounded-md absolute bottom-3 left-0 right-0 bg-lightPrimary justify-center items-center active:bg-darkPrimary"
        onPress={() => router.push("/(root_screens)/booking/book")}
      >
        <Text className="font-bold text-white">Book now</Text>
      </Pressable>
    </View>
  );
};

export default Home;
