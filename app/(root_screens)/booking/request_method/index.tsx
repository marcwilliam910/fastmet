import {useBookStore} from "@/store/useBookStore";
import {Method} from "@/types/book";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import React, {useState} from "react";
import {Modal, Pressable, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import Header from "../header";

const methods: Method[] = [
  {
    id: "regular",
    label: "Regular Request",
    price: "Php 5,500",
    icon: "car-outline",
    badge: null,
    description:
      "Book a vehicle exclusively for your trip. This option ensures a direct, private ride with no sharing or waiting time. Ideal for users who prefer convenience, comfort, and faster travel to their destination with upfront pricing.",
  },
  {
    id: "bidding",
    label: "Bidding Request",
    price: "Php 5,500",
    icon: "briefcase-outline",
    badge: "BID",
    description:
      "Propose your preferred rate and allow drivers to bid for your request. You’ll have the flexibility to review offers and select a driver that matches your budget and schedule. Best for users who want to negotiate for potentially lower fares.",
  },
  {
    id: "pooling",
    label: "Pooling Request",
    price: "Php 500",
    icon: "people-outline",
    badge: null,
    description:
      "Join other passengers heading in the same direction to share a single trip and split the cost. This option is eco-friendly and budget-friendly, though travel time may be slightly longer due to multiple pickup and drop-off points.",
  },
];

const RequestMethod = () => {
  const router = useRouter();
  const [selectedInfo, setSelectedInfo] = useState<Method | null>(null);

  const [modalVisible, setModalVisible] = useState(false);
  const setSelectedMethod = useBookStore((state) => state.setSelectedMethod);
  const selectedMethod = useBookStore((state) => state.selectedMethod);

  return (
    <SafeAreaView className="flex-1 bg-white" style={{paddingBottom: 15}}>
      {/* Header */}
      <Header
        text="Select Method"
        additonalMethod={() => setSelectedMethod(null)}
      />

      {/* Options */}
      <View className="flex-1 gap-4 px-6 pt-5">
        {methods.map((item) => {
          const isSelected = selectedMethod === item.id;
          return (
            <View key={item.id} className="gap-2">
              <Text className="font-semibold text-gray-500 ">{item.label}</Text>
              <Pressable
                onPress={() => setSelectedMethod(item.id)}
                className={`flex-row items-center justify-between border rounded-xl p-4 ${
                  isSelected
                    ? "border-[#FFA840] bg-[#FFF7EE]"
                    : "border-gray-300"
                }`}
              >
                <View className="flex-row items-center gap-3">
                  {item.badge ? (
                    <View className="px-2 py-0.5 bg-[#FFA840] rounded-md">
                      <Text className="text-xs font-bold text-white">
                        {item.badge}
                      </Text>
                    </View>
                  ) : (
                    <Ionicons
                      name={item.icon as any}
                      size={24}
                      color={isSelected ? "#FFA840" : "#777"}
                    />
                  )}
                  <Text
                    className={`text-lg font-semibold ${
                      isSelected ? "text-[#FFA840]" : "text-gray-700"
                    }`}
                  >
                    {item.price}
                  </Text>
                </View>

                <Pressable
                  onPress={() => {
                    setSelectedInfo(item);
                    setModalVisible(true);
                  }}
                >
                  <Ionicons
                    name="information-circle"
                    size={22}
                    color="#FFA840"
                  />
                </Pressable>
              </Pressable>
            </View>
          );
        })}
      </View>

      {/* Buttons */}
      <View className="gap-3 px-6 mt-auto">
        <Pressable
          disabled={!selectedMethod}
          className={`items-center py-4 rounded-xl bg-lightPrimary active:bg-darkPrimary ${
            selectedMethod ? "" : "opacity-70"
          }`}
          onPress={() => {
            if (selectedMethod === "regular" || selectedMethod === "pooling")
              router.back();
            if (selectedMethod === "bidding")
              router.push("/(root_screens)/booking/request_method/bidding");
            // if (selectedMethod === "pooling")
            //   router.push("/(root_screens)/booking/request_method/pooling");
          }}
        >
          <Text className="text-base font-semibold text-white">
            Select{" "}
            {selectedMethod === "regular"
              ? "Regular Request"
              : selectedMethod === "bidding"
                ? "Bidding Request"
                : "Pooling Request"}
          </Text>
        </Pressable>

        <Pressable
          className="items-center py-4 bg-gray-100 border border-gray-300 rounded-xl active:bg-gray-200"
          onPress={() => {
            router.back();
            setSelectedMethod(null);
          }}
        >
          <Text className="text-base font-semibold text-gray-800">Cancel</Text>
        </Pressable>
      </View>

      {selectedInfo && (
        <InfoModal
          visible={modalVisible}
          setModalVisible={setModalVisible}
          selectedInfo={selectedInfo}
        />
      )}
    </SafeAreaView>
  );
};

export default RequestMethod;

export const InfoModal = ({
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
