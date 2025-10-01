import CustomKeyAvoidingView from "@/components/CustomKeyAvoid";
import LogoWithText from "@/components/LogoWithText";
import {Ionicons} from "@expo/vector-icons";
import {Image} from "expo-image";
import {router, useRouter} from "expo-router";
import React, {useState} from "react";
import {Modal, Pressable, Text, TextInput, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

export default function ResetPass() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

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

          <Text className="mt-5 mb-5 text-lg font-bold text-center text-gray-700">
            Reset Password
          </Text>
          {/* Password Input */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700 ">
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
            {/* <Text className="ml-2 text-xs text-red-500">
              Password must be 8 characters long
            </Text> */}
          </View>

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

          <Pressable
            className="items-center py-3.5 my-2 rounded-lg bg-lightPrimary active:bg-darkPrimary"
            onPress={() => setIsVisible(true)}
          >
            <Text className="text-base font-bold text-white">Confirm</Text>
          </Pressable>
        </View>
      </CustomKeyAvoidingView>

      <SuccessModal isVisible={isVisible} setVisible={setIsVisible} />
    </SafeAreaView>
  );
}

const SuccessModal = ({
  isVisible,
  setVisible,
}: {
  isVisible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Modal
      statusBarTranslucent={true}
      visible={isVisible}
      animationType="fade"
      onRequestClose={() => setVisible(false)}
    >
      <View className="items-center justify-center flex-1 bg-black/50">
        <View className="items-center w-4/5 gap-4 p-6 bg-white rounded-2xl">
          {/* Placeholder Logo */}
          <View className="flex-row items-center">
            <Image
              source={require("@/assets/fastmet/logo.png")}
              style={{width: 50, height: 70}}
              contentFit="contain"
            />
            <Text className="text-xl font-bold tracking-widest text-secondary">
              FastMet
            </Text>
          </View>

          {/* Checkmark */}
          <View className="p-5 mb-5 bg-orange-400 rounded-full">
            <Ionicons name="checkmark" size={40} color="white" />
          </View>

          {/* Text */}
          <Text className="text-lg font-bold text-center">
            Password successfully changed.
          </Text>
          <Text className="mt-1 text-center text-gray-600">
            You can now log in with your new password.
          </Text>

          {/* Button */}
          <Pressable
            className="items-center w-full px-6 py-3 mt-6 rounded-lg bg-darkPrimary"
            onPress={() => {
              setVisible(false);
              router.push("/(auth)/login");
            }}
          >
            <Text className="font-semibold text-white">Go to Login</Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};
