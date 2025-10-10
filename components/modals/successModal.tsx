import {Ionicons} from "@expo/vector-icons";
import {Image} from "expo-image";
import React, {useEffect} from "react";
import {Modal, Text, View} from "react-native";

const SuccessModal = ({
  visible,
  text,
  setVisible,
}: {
  visible: boolean;
  text: string;
  setVisible: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      setVisible(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, [visible, setVisible]);

  return (
    <Modal
      visible={visible}
      statusBarTranslucent={true}
      transparent
      animationType="fade"
    >
      <View className="items-center justify-center flex-1 bg-black/50">
        <View className="items-center w-4/5 gap-5 p-6 bg-white rounded-xl">
          {/* logo */}
          <View className="flex-row items-center">
            <Image
              source={require("@/assets/fastmet/logo.png")}
              style={{width: 50, height: 50}}
              contentFit="contain"
            />
            <Text className="text-xl font-bold tracking-widest text-secondary">
              FastMet
            </Text>
          </View>

          <Ionicons name="checkmark-circle" size={120} color="#FFA840" />
          <Text className="mb-2 text-xl font-bold text-center">{text}</Text>
        </View>
      </View>
    </Modal>
  );
};

export default SuccessModal;
