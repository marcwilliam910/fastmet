import { Vehicle } from "@/types/book";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const VehicleInfoModal = ({
  visible,
  setModalVisible,
  vehicles,
}: {
  visible: boolean;
  setModalVisible: (visible: boolean) => void;
  vehicles: Vehicle[];
}) => {
  const insets = useSafeAreaInsets();
  return (
    <Modal
      visible={visible}
      onRequestClose={() => setModalVisible(false)}
      animationType="slide"
      presentationStyle="fullScreen"
    >
      <View
        style={{
          flex: 1,
          paddingTop: insets.top + 10, // respect status bar / notch
          paddingBottom: insets.bottom,
          backgroundColor: "white",
          paddingHorizontal: 20,
        }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-lg font-semibold text-[#1E1E1E]">
            FastMet Services
          </Text>
          <Pressable onPress={() => setModalVisible(false)} hitSlop={20}>
            <Ionicons
              name="close"
              size={Platform.OS === "ios" ? 34 : 28}
              color="#FFA840"
            />
          </Pressable>
        </View>

        {/* Vehicle list */}
        <ScrollView showsVerticalScrollIndicator={false}>
          <View className="flex-col gap-4 mb-8">
            {vehicles.map((v) => (
              <View
                key={v.id}
                className="bg-[#F7F9FC] border border-[#FFA840] rounded-2xl p-4 flex-row justify-between items-center"
              >
                <View className="flex-1 pr-3">
                  <Text className="text-base font-semibold text-[#333]">
                    {v.name}
                  </Text>
                  <Text className="text-sm text-gray-500 mt-1">{v.desc}</Text>
                </View>
                <Image
                  source={v.img}
                  style={{ width: 96, height: 64 }}
                  contentFit="contain"
                />
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Done button */}
        <Pressable
          onPress={() => setModalVisible(false)}
          className="bg-[#FFA840] rounded-xl mb-4"
          style={{
            paddingBlock: Platform.OS === "ios" ? 14 : 12,
          }}
        >
          <Text className="text-white text-center text-base font-semibold">
            Done
          </Text>
        </Pressable>
      </View>
    </Modal>
  );
};
