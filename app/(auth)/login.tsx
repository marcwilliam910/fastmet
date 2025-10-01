import CustomKeyAvoidingView from "@/components/CustomKeyAvoid";
import LogoWithText from "@/components/LogoWithText";
import {Ionicons} from "@expo/vector-icons";
import {Link} from "expo-router";
import React, {useState} from "react";
import {Pressable, Text, TextInput, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
      <CustomKeyAvoidingView>
        <View className="justify-center flex-1 gap-6 px-6">
          {/* Logo and Title */}
          <LogoWithText />

          {/* Username Input */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700 ">Username</Text>
            <TextInput
              placeholder="Username"
              placeholderTextColor="#9CA3AF"
              className="p-4 text-base bg-gray-100 rounded-lg"
            />
            {/* <Text className="ml-2 text-xs text-red-500">Invalid Username</Text> */}
          </View>

          {/* Password Input */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700">Password</Text>
            <View className="relative">
              <TextInput
                placeholder="Password"
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

          {/* Forgot Password */}
          <Link asChild href="/(auth)/forgot_pass/forgot-pass">
            <Pressable className="self-end">
              {({pressed}) => (
                <Text
                  className={`text-sm font-semibold text-gray-600 ${pressed ? "underline" : ""}`}
                >
                  Forgot Password?
                </Text>
              )}
            </Pressable>
          </Link>

          {/* Sign In Button */}
          <Pressable className="items-center py-4 rounded-lg bg-lightPrimary active:bg-darkPrimary">
            <Text className="text-base font-bold text-white">Sign In</Text>
          </Pressable>

          {/* Divider */}
          <Text className="text-sm font-semibold text-center text-gray-600">
            Sign in with
          </Text>

          {/* Social Login Buttons */}
          <View className="flex-row justify-center gap-10">
            <TouchableOpacity
              className="items-center justify-center bg-blue-500 rounded-lg size-12"
              activeOpacity={0.8}
            >
              <Ionicons name="logo-facebook" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              className="items-center justify-center bg-red-500 rounded-lg size-12"
              activeOpacity={0.8}
            >
              <Ionicons name="logo-google" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              className="items-center justify-center bg-gray-800 rounded-lg size-12"
              activeOpacity={0.8}
            >
              <Ionicons name="logo-apple" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Create Account Button */}
          <Link asChild href="/(auth)/register">
            <Pressable className="items-center py-4 my-2 border rounded-lg border-lightPrimary active:bg-gray-50">
              <Text className="text-base font-semibold text-gray-800">
                Create Account
              </Text>
            </Pressable>
          </Link>
        </View>
      </CustomKeyAvoidingView>
    </SafeAreaView>
  );
};

export default Login;
