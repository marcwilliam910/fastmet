import React from "react";
import {Text, View} from "react-native";

const NotLoggedIn = () => {
  return (
    <View className="items-center justify-center flex-1 px-4 bg-white">
      <Text className="text-lg font-semibold text-center text-gray-600">
        You are not logged in
      </Text>
      {/* <Pressable
        className="items-center w-full py-4 mt-2 border rounded-lg border-lightPrimary active:bg-gray-50"
        onPress={() => {
          router.push("/(auth)/register");
        }}
      >
        <Text className="text-base font-semibold text-gray-800">
          Create Account
        </Text>
      </Pressable> */}
    </View>
  );
};
export default NotLoggedIn;
