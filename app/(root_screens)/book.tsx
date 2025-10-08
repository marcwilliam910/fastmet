import {Ionicons} from "@expo/vector-icons";
import React from "react";
import {Pressable, Text, TextInput, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

const Book = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "white"}}>
      <View className="flex-1">
        <View className="gap-2 px-4">
          <View className="flex-row items-center px-2 py-0.5 bg-gray-200 rounded-md">
            <Ionicons name="location-sharp" size={24} color="green" />
            <TextInput
              placeholder="Enter pick up point location"
              className="flex-1 text-base"
            />
          </View>
          <View className="flex-row items-center px-2 py-0.5 bg-gray-200 rounded-md">
            <Ionicons name="location-sharp" size={24} color="red" />
            <TextInput
              placeholder="Enter drop off point location"
              className="flex-1 text-base"
            />
          </View>
          <Pressable className="flex-row items-center self-end gap-1 px-2 py-1 bg-gray-200 rounded-md">
            <Ionicons name="add" size={15} color="black" />
            <Text className="text-sm font-semibold">Add Stop</Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Book;
