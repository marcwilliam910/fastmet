import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import React from "react";
import { Modal, Pressable, Text, View } from "react-native";

const NotLoggedInModal = ({
  visible,
  setVisible,
}: {
  visible: boolean;
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
        <View className="relative items-center w-4/5 gap-5 p-6 bg-white rounded-xl">
          <Pressable
            className="absolute top-4 right-4 "
            onPress={() => setVisible(false)}
          >
            <Ionicons name="close" size={28} color="#FFA840" />
          </Pressable>
          <Image
            source={require("@/assets/images/phone.png")}
            style={{ width: 100, height: 100 }}
            contentFit="contain"
          />
          <Text className="text-lg font-bold text-secondary">
            Login to confirm your booking
          </Text>
        </View>
      </View>
    </Modal>
  );
};

export default NotLoggedInModal;
