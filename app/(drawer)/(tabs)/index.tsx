import Carousel from "@/components/Carousel";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";

const Home = () => {
  const [selection, setSelection] = useState<"passenger" | "pasabay" | "">("");

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
          <Pressable
            className={`flex-row items-center bg-gray-100 p-4 h-20 rounded-lg justify-between  active:bg-gray-200 ${selection === "passenger" ? "border-2 border-lightPrimary" : ""}`}
            onPress={() => setSelection("passenger")}
          >
            <Text className="text-lg font-bold">Passenger</Text>
            <Ionicons name="information-circle" size={24} color="#FFA840" />
          </Pressable>
          <Pressable
            className={`flex-row items-center bg-gray-100 p-4 h-20 rounded-lg justify-between active:bg-gray-200 ${selection === "pasabay" ? " border-2 border-lightPrimary" : ""}`}
            onPress={() => setSelection("pasabay")}
          >
            <Text className="text-lg font-bold">Pasabay</Text>
            <Ionicons name="information-circle" size={24} color="#FFA840" />
          </Pressable>
        </View>
      </ScrollView>
      {/* buttons */}
      <Pressable
        disabled={selection === ""}
        onPress={() =>
          router.push({
            pathname: "/(root_screens)/booking/[method]",
            params: { method: selection },
          })
        }
        className={`px-10 py-4 mx-8 rounded-md absolute bottom-3 left-0 right-0 justify-center items-center bg-lightPrimary ${selection === "" ? "opacity-80" : "active:bg-darkPrimary "}`}
      >
        <Text className="font-bold text-white">Book now</Text>
      </Pressable>
    </View>
  );
};

export default Home;
