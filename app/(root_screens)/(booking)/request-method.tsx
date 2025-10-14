import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import React, {useState} from "react";
import {Pressable, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

const RequestMethod = () => {
  const router = useRouter();
  const [selected, setSelected] = useState("regular");

  const methods = [
    {
      id: "regular",
      label: "Regular Request",
      price: "Php 5,500",
      icon: "car-outline",
      badge: null,
    },
    {
      id: "bidding",
      label: "Bidding Request",
      price: "Php 5,500",
      icon: "briefcase-outline",
      badge: "BID",
    },
    {
      id: "pooling",
      label: "Pooling Request",
      price: "Php 500",
      icon: "people-outline",
      badge: null,
    },
  ];

  return (
    <SafeAreaView className="flex-1 bg-white" style={{paddingBottom: 15}}>
      {/* Header */}
      <View className="relative flex-row items-center justify-center px-6 py-2">
        <Pressable
          className="absolute left-5 top-1.5"
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={28} color="#FFA840" />
        </Pressable>
        <Text className="text-lg font-semibold text-gray-800">
          Select Method
        </Text>
      </View>

      {/* Options */}
      <View className="flex-1 gap-5 px-6 pt-5">
        {methods.map((item) => {
          const isSelected = selected === item.id;
          return (
            <View key={item.id} className="gap-2">
              <Text className="font-semibold text-gray-500 ">{item.label}</Text>
              <Pressable
                onPress={() => setSelected(item.id)}
                className={`flex-row items-center justify-between border rounded-xl p-4 ${
                  isSelected
                    ? "border-[#FFA840] bg-[#FFF7EE]"
                    : "border-gray-300"
                }`}
              >
                <View className="flex-row items-center gap-3">
                  {item.badge ? (
                    <View className="px-2 py-0.5 bg-[#FFA840] rounded-md">
                      <Text className="text-xs font-bold text-white">
                        {item.badge}
                      </Text>
                    </View>
                  ) : (
                    <Ionicons
                      name={item.icon as any}
                      size={24}
                      color={isSelected ? "#FFA840" : "#777"}
                    />
                  )}
                  <Text
                    className={`text-lg font-semibold ${
                      isSelected ? "text-[#FFA840]" : "text-gray-700"
                    }`}
                  >
                    {item.price}
                  </Text>
                </View>

                <Pressable onPress={() => console.log("test")}>
                  <Ionicons
                    name="information-circle"
                    size={22}
                    color="#FFA840"
                  />
                </Pressable>
              </Pressable>
            </View>
          );
        })}
      </View>

      {/* Buttons */}
      <View className="gap-3 px-6 mt-auto">
        <Pressable className="items-center py-4 rounded-xl bg-[#FFA840]">
          <Text className="text-base font-semibold text-white">
            Select{" "}
            {selected === "regular"
              ? "Regular Request"
              : selected === "bidding"
                ? "Bidding Request"
                : "Pooling Request"}
          </Text>
        </Pressable>

        <Pressable
          className="items-center py-4 bg-gray-200 rounded-xl active:bg-gray-300"
          onPress={() => router.back()}
        >
          <Text className="text-base font-semibold text-gray-800">Cancel</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default RequestMethod;
