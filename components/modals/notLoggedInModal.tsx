import {Image} from "expo-image";
import {router} from "expo-router";
import React from "react";
import {Modal, Pressable, Text, View} from "react-native";

const NotLoggedInModal = ({
  visible,
  onGooglePress,
  setVisible,
}: {
  visible: boolean;
  onGooglePress: () => Promise<void>;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <Modal
      visible={visible}
      statusBarTranslucent={true}
      transparent
      onRequestClose={() => setVisible(false)}
      animationType="fade"
    >
      <View className="items-center justify-center flex-1 bg-black/50">
        <View className="items-center w-4/5 gap-5 p-6 bg-white rounded-xl">
          <Image
            source={require("@/assets/images/phone.png")}
            style={{width: 100, height: 100}}
            contentFit="contain"
          />
          <Text className="text-lg font-bold text-secondary">
            Login to confirm your booking
          </Text>

          <View className="w-full gap-4">
            <Pressable
              className="flex-row items-center justify-center w-full gap-3 py-4 border rounded-xl border-lightPrimary active:bg-gray-50"
              onPress={onGooglePress}
            >
              <Image
                source={require("@/assets/images/google.png")}
                style={{width: 20, height: 20}}
                contentFit="contain"
              />
              <Text className="font-semibold">Continue with Gmail</Text>
            </Pressable>

            {/* Divider with 'or' */}
            <View className="flex-row items-center justify-center gap-2">
              <View className="h-[1px] flex-1 bg-gray-300" />
              <Text className="font-bold text-gray-500">or</Text>
              <View className="h-[1px] flex-1 bg-gray-300" />
            </View>

            <View className="gap-2">
              <Pressable
                className="items-center justify-center w-full py-4 rounded-xl bg-lightPrimary active:bg-darkPrimary"
                onPress={() => router.push("/(auth)/register")}
              >
                <Text className="font-semibold text-white">
                  Create Account with Email
                </Text>
              </Pressable>

              <Pressable
                className="items-center justify-center w-full py-4 rounded-xl bg-lightPrimary active:bg-darkPrimary"
                onPress={() => router.push("/(auth)/login")}
              >
                <Text className="font-semibold text-white">Login</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default NotLoggedInModal;
