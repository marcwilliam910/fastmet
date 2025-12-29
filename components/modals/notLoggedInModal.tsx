import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

const NotLoggedInModal = ({
  visible,
  setVisible,
}: {
  visible: boolean;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const handleGoToLogin = () => {
    setVisible(false);
    router.push("/(auth)/auth");
  };
  return (
    <Modal
      visible={visible}
      statusBarTranslucent
      transparent
      onRequestClose={() => setVisible(false)}
      animationType="fade"
    >
      <View className="items-center justify-center flex-1 bg-black/50">
        <View className="relative items-center w-4/5 gap-5 p-6 bg-white rounded-xl">
          <Pressable
            className="absolute top-4 right-4"
            onPress={() => setVisible(false)}
          >
            <Ionicons name="close" size={28} color="#FFA840" />
          </Pressable>

          <Image
            source={require("@/assets/images/phone.png")}
            style={{ width: 100, height: 100 }}
            contentFit="contain"
          />

          <Text className="text-lg font-bold text-secondary text-center">
            Login required
          </Text>

          <Text className="text-sm text-center text-gray-600">
            Please log in to continue with your request and shipment processing.
          </Text>

          <Pressable
            onPress={handleGoToLogin}
            className="w-full py-3 mt-2 rounded-lg bg-lightPrimary"
          >
            <Text className="font-semibold text-center text-white">
              Go to Login
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
};

export default NotLoggedInModal;
