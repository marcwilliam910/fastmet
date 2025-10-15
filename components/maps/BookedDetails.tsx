import {useBookStore} from "@/store/useBookStore";
import {isDateString} from "@/utils/date";
import {Ionicons} from "@expo/vector-icons";
import {Image} from "expo-image";
import React, {useState} from "react";
import {Pressable, Text, View} from "react-native";
import SelectTimeModal from "../modals/SelectTimeModal";

function formatScheduleToText(schedule: string | null) {
  if (schedule === null) {
    return (
      <>
        <Ionicons name="cube" size={18} color="white" />
        <Text className="font-semibold text-white">Select Time</Text>
      </>
    );
  }

  if (schedule === "Pick up now") {
    return (
      <>
        <Ionicons name="car" size={18} color="white" />
        <Text className="font-semibold text-white">Pick up now</Text>
      </>
    );
  }

  if (!isNaN(Number(schedule))) {
    return (
      <>
        <Ionicons name="time" size={18} color="white" />
        <Text className="font-semibold text-white">
          in {schedule} hour{schedule === "1" ? "" : "s"}
        </Text>
      </>
    );
  }

  if (isDateString(schedule)) {
    const formatted = new Date(schedule).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
    return (
      <>
        <Ionicons name="calendar" size={18} color="white" />
        <Text className="font-semibold text-white">{formatted}</Text>
      </>
    );
  }

  return null;
}

const BookedDetailsCard = () => {
  const selectedTime = useBookStore((state) => state.selectedTime);
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View className="overflow-hidden border bg-lightPrimary/10 border-lightPrimary/30 rounded-2xl">
      <View className="flex-row items-center justify-between px-3 py-4 bg-lightPrimary/90">
        <View className="flex-row items-center gap-2">
          {formatScheduleToText(selectedTime)}
        </View>
        <Pressable onPress={() => setModalVisible(true)}>
          <Text className="font-medium text-white underline">
            {selectedTime ? "Change" : "Select"}
          </Text>
        </Pressable>
      </View>

      {/* Truck Info */}
      <View className="flex-row gap-4 p-4">
        <Image
          source={require("@/assets/vehicle/truck.png")}
          style={{width: 60, height: 60}}
          contentFit="contain"
        />
        <View className="flex-1 gap-1">
          <Text className="text-base font-semibold">Closed Truck Name</Text>
          <Text className="text-sm text-gray-600">Regular Service: 2000kg</Text>

          <View className="gap-1 mt-2">
            <Text className="text-sm text-gray-600">
              Pickup time: <Text className="font-medium">March 27, 2025</Text>
            </Text>
            <Text className="text-sm text-gray-600">
              Distance: <Text className="font-medium">1,000km</Text>
            </Text>
            <Text className="text-sm text-gray-600">
              Estimated Time:{" "}
              <Text className="font-medium">June 30, 2025 10:00am</Text>
            </Text>
          </View>
        </View>
      </View>

      <SelectTimeModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
      />
    </View>
  );
};

export default BookedDetailsCard;
