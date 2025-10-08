import Carousel from "@/components/Carousel";
import {Ionicons} from "@expo/vector-icons";
import React from "react";
import {Pressable, ScrollView, Text, View} from "react-native";

const Home = () => {
  return (
    <View className="relative flex-1 bg-white">
      <ScrollView
        className="relative flex-1 bg-white"
        showsVerticalScrollIndicator={false}
      >
        <Carousel />
        <View className="gap-5 p-5 pb-20">
          {/* FastMet Services */}
          <View className="gap-3">
            <View className="flex-row items-center justify-between">
              <Text className="text-lg font-bold">FastMet Services</Text>
              <View className="flex-row gap-5">
                <Ionicons name="call" size={26} color="#FFA840" />
                <Ionicons name="chatbubbles" size={26} color="#FFA840" />
              </View>
            </View>
            <View className="w-full border rounded-md h-52 border-lightPrimary"></View>
          </View>
          {/* Company */}
          <View className="gap-3">
            <Text className="text-lg font-bold">Company</Text>

            <View className="w-full border rounded-md h-52 border-lightPrimary"></View>
          </View>
        </View>
      </ScrollView>
      {/* buttons */}
      <View className="absolute flex-row w-full bottom-3 justify-evenly">
        <Pressable className="bg-[#f59e0b] px-10 py-4 rounded-md">
          <Text className="font-bold text-white">Book now</Text>
        </Pressable>
        <Pressable className="px-10 py-4 bg-gray-400 rounded-md">
          <Text className="font-bold text-white">Schedule</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default Home;
