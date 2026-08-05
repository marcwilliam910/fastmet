import {PICKUP_SERVICE_AREAS} from "@/utils/constants";
import {Ionicons} from "@expo/vector-icons";
import React from "react";
import {Modal, Pressable, ScrollView, Text, View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";

type PickupCoverageModalProps = {
  visible: boolean;
  onClose: () => void;
};

const PickupCoverageModal: React.FC<PickupCoverageModalProps> = ({
  visible,
  onClose,
}) => {
  const insets = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          paddingTop: insets.top + 5,
          paddingBottom: insets.bottom,
          backgroundColor: "white",
        }}
      >
        <View
          className="flex-row items-center justify-center px-4"
          style={{paddingBottom: 16}}
        >
          <Pressable
            onPress={onClose}
            className="absolute -top-1 left-4"
            hitSlop={20}
          >
            <Ionicons name="close" size={28} color="#4B5563" />
          </Pressable>
          <Text className="text-lg font-semibold">Supported pickup areas</Text>
        </View>

        <ScrollView className="flex-1 px-4">
          {Object.entries(PICKUP_SERVICE_AREAS).map(([region, cities]) => (
            <View key={region} className="mb-5">
              <Text className="mb-2 text-xs font-semibold tracking-wider text-gray-500 uppercase">
                {region}
              </Text>
              {cities.map((city) => (
                <View
                  key={city}
                  className="flex-row items-center py-2 border-b border-gray-100"
                >
                  <Ionicons
                    name="location-outline"
                    size={16}
                    color="#6B7280"
                    style={{marginRight: 8}}
                  />
                  <Text className="text-base text-gray-800">{city}</Text>
                </View>
              ))}
            </View>
          ))}
        </ScrollView>
      </View>
    </Modal>
  );
};

export default PickupCoverageModal;
