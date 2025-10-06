import React from "react";
import {ActivityIndicator, Modal, View} from "react-native";
import LogoWithText from "../LogoWithText";

interface LoadingModalProps {
  visible: boolean;
}

export default function LoadingModal({visible}: LoadingModalProps) {
  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      statusBarTranslucent
    >
      <View className="items-center justify-center flex-1 bg-black/70">
        <View className="items-center gap-2 p-8 pb-5 bg-white shadow-2xl rounded-3xl">
          <View className="p-6 mb-4 rounded-xl bg-secondary/10">
            <LogoWithText />
          </View>
          <ActivityIndicator size="large" color="#FFA840" />
        </View>
      </View>
    </Modal>
  );
}
