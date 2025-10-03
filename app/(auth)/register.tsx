import CustomKeyAvoidingView from "@/components/CustomKeyAvoid";
import LogoWithText from "@/components/LogoWithText";
import {Ionicons} from "@expo/vector-icons";
import {Link, useRouter} from "expo-router";
import React, {useState} from "react";
import {Pressable, Text, TextInput, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

const Register = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
      <CustomKeyAvoidingView>
        <View className="justify-center flex-1 gap-6 px-6">
          <Pressable
            onPress={() => router.back()}
            className="absolute top-5 left-5"
          >
            <Ionicons name="chevron-back-outline" size={28} color="#FFA840" />
          </Pressable>
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
          </View>

          {/* Email Input */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700 ">
              Email Address
            </Text>
            <TextInput
              placeholder="Enter email"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              className="p-4 text-base bg-gray-100 rounded-lg"
            />
            {/* <Text className="ml-2 text-xs text-red-500">Invalid Email</Text> */}
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
            {/* <Text className="ml-2 text-xs text-red-500">
              Password must be 8 characters long
            </Text> */}
          </View>

          {/* Confirm Password Input */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700">
              Confirm Password
            </Text>
            <View className="relative">
              <TextInput
                placeholder="Confirm Password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showConfirmPassword}
                className="p-4 pr-12 text-base bg-gray-100 rounded-lg"
              />
              <Pressable
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-3.5"
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color="#9CA3AF"
                />
              </Pressable>
            </View>
            {/* <Text className="ml-2 text-xs text-red-500">
              Password do not match
            </Text> */}
          </View>

          <Text className="mt-4 text-sm text-center text-gray-700 px-14">
            By Signing up you agree to our{"\n"}
            <Link href="/(root_screens)/terms&conditions">
              <Text className="font-bold underline">Terms & Condition</Text> and
            </Link>
            <Link href="/(root_screens)/privacyPolicy">
              <Text className="font-bold underline"> Privacy Policy</Text>
            </Link>
          </Text>

          {/*  Button */}
          <Pressable
            className="items-center py-4 my-2 rounded-lg bg-lightPrimary active:bg-darkPrimary"
            onPress={() => router.push("/(auth)/profile-register")}
          >
            <Text className="text-base font-bold text-white">
              Create Account
            </Text>
          </Pressable>
        </View>
      </CustomKeyAvoidingView>
    </SafeAreaView>
  );
};

export default Register;
