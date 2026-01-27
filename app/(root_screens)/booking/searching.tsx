import { useSocket } from "@/sockets/context/SocketProvider";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { Pressable, Text, View } from "react-native";

export default function Searching() {
  const socket = useSocket();
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();

  const handleCancelRequest = () => {
    console.log("Confirming cancellation");
    socket.emit("cancelBookingRequest", { bookingId });
  };
  return (
    <View>
      <Pressable
        onPress={handleCancelRequest}
        className="items-center w-full py-4  shadow-lg bg-red-500 mt-20 rounded-2xl active:opacity-90"
      >
        <Text className="text-lg font-bold text-white">{bookingId}</Text>
      </Pressable>
    </View>
  );
}
