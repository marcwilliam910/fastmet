import {Ionicons} from "@expo/vector-icons";
import {Image} from "expo-image";
import React from "react";
import {Modal, Pressable, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

const InfoModal = ({
  visible,
  setModalVisible,
  selectedInfo,
}: {
  visible: boolean;
  setModalVisible: React.Dispatch<React.SetStateAction<boolean>>;
  selectedInfo: any;
}) => {
  return (
    <Modal
      visible={visible}
      onRequestClose={() => setModalVisible(false)}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <SafeAreaView className="flex-1 p-4 bg-white">
        <View className="absolute flex-row top-6 right-6">
          <Pressable onPress={() => setModalVisible(false)}>
            <Ionicons name="close" size={30} color="#FFA840" />
          </Pressable>
        </View>

        <View className="items-center gap-3 mt-4">
          {selectedInfo.img && (
            <Image
              source={selectedInfo.img}
              style={{
                width: 100,
                height: 100,
                transform: [{scale: 1.5}],
                marginTop: 20,
              }}
              contentFit="contain"
            />
          )}
          <Text className="mt-4 text-xl font-semibold text-secondary">
            {selectedInfo.label}
          </Text>
          <Text className="px-4 mt-2 text-justify text-gray-600">
            {selectedInfo.description}
          </Text>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default InfoModal;
