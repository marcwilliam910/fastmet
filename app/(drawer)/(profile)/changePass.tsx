import CustomKeyAvoidingView from "@/components/CustomKeyAvoid";
import {Ionicons} from "@expo/vector-icons";
import {router} from "expo-router";
import React, {useState} from "react";
import {Pressable, Text, TextInput, View} from "react-native";

const ChangePass = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  return (
    <CustomKeyAvoidingView>
      <View className="justify-between flex-1 px-6 pt-6 bg-white">
        <View className="justify-center gap-6 ">
          {/* Input */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700">
              Old Password
            </Text>
            <View className="relative">
              <TextInput
                placeholder="Old Password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showOldPassword}
                className="p-4 pr-12 text-base bg-gray-100 rounded-lg"
              />
              <Pressable
                onPress={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-4 top-3.5"
              >
                <Ionicons
                  name={showOldPassword ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color="#9CA3AF"
                />
              </Pressable>
            </View>
            {/* <Text className="ml-2 text-xs text-red-500">Invalid Password</Text> */}
          </View>

          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700">
              New Password
            </Text>
            <View className="relative">
              <TextInput
                placeholder="New Password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                className="p-4 pr-12 text-base bg-gray-100 rounded-lg"
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5"
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color="#9CA3AF"
                />
              </Pressable>
            </View>
            {/* <Text className="ml-2 text-xs text-red-500">Invalid Password</Text> */}
          </View>

          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700">
              Confirm New Password
            </Text>
            <View className="relative">
              <TextInput
                placeholder="Confirm New Password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showConfirmPassword}
                className="p-4 pr-12 text-base bg-gray-100 rounded-lg"
              />
              <Pressable
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-3.5"
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color="#9CA3AF"
                />
              </Pressable>
            </View>
            {/* <Text className="ml-2 text-xs text-red-500">Invalid Password</Text> */}
          </View>
        </View>

        {/*  Button */}
        <View className="mt-5 mb-16">
          <Pressable className="items-center py-4 rounded-lg bg-lightPrimary active:bg-darkPrimary">
            <Text className="text-base font-bold text-white">
              Change Password
            </Text>
          </Pressable>
          <Pressable
            className="items-center py-4 my-2 border border-gray-300 rounded-lg bg-ctaSecondary active:bg-ctaSecondaryActive"
            onPress={() => router.back()}
          >
            <Text className="text-base font-bold ">Cancel</Text>
          </Pressable>
        </View>
      </View>
    </CustomKeyAvoidingView>
  );
};

export default ChangePass;
