import CustomKeyAvoidingView from "@/components/CustomKeyAvoid";
import {Ionicons} from "@expo/vector-icons";
import React, {useState} from "react";
import {Pressable, Text, TextInput, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

const FileReport = () => {
  return (
    <SafeAreaView
      className="flex-1 bg-white"
      edges={["bottom", "left", "right"]}
    >
      <CustomKeyAvoidingView>
        <View className="flex-1 gap-10 p-4">
          <View className="flex-row items-center justify-between">
            <Pressable className="h-40 w-[7.5rem] border border-lightPrimary rounded-xl items-center justify-center gap-1 active:bg-gray-100">
              <Ionicons name="camera" size={22} color="#FFA840" />
              <Text className="text-sm font-medium text-gray-400">
                Upload photo
              </Text>
            </Pressable>
            <Pressable className="h-40 w-[7.5rem] border border-lightPrimary rounded-xl items-center justify-center gap-1 active:bg-gray-100">
              <Ionicons name="camera" size={22} color="#FFA840" />
              <Text className="text-sm font-medium text-gray-400">
                Upload photo
              </Text>
            </Pressable>
            <Pressable className="h-40 w-[7.5rem] border border-lightPrimary rounded-xl items-center justify-center gap-1 active:bg-gray-100">
              <Ionicons name="camera" size={22} color="#FFA840" />
              <Text className="text-sm font-medium text-gray-400">
                Upload photo
              </Text>
            </Pressable>
          </View>

          <View className="gap-2">
            <Text className="text-lg font-bold text-gray-700 ">
              What is your complaint?
            </Text>
            <TextInput
              multiline
              numberOfLines={4}
              placeholder="Type here..."
              style={{height: 120, textAlignVertical: "top"}}
              className="p-4 border rounded-lg border-lightPrimary"
            />
          </View>
          <Pressable className="items-center justify-center p-3.5 bg-lightPrimary active:bg-darkPrimary rounded-lg">
            <Text className="text-lg font-bold text-white">Submit Report</Text>
          </Pressable>

          <RateUs />
        </View>
      </CustomKeyAvoidingView>
    </SafeAreaView>
  );
};

export default FileReport;

function RateUs() {
  const [rating, setRating] = useState(0);

  return (
    <View className="items-center gap-2 p-4 mt-auto border rounded-lg border-lightPrimary">
      <Text className="text-lg font-bold text-lightPrimary">Rate us?</Text>
      <Text className="font-medium text-gray-700">
        How would you love this app?
      </Text>

      <View className="flex-row gap-2 mt-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <Pressable key={star} onPress={() => setRating(star)}>
            <Ionicons
              name={star <= rating ? "star" : "star-outline"}
              size={36}
              color={star <= rating ? "#FFA840" : "#d1d5db"} // gray-300
            />
          </Pressable>
        ))}
      </View>
    </View>
  );
}
