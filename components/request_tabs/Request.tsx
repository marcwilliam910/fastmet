import {serviceAddons} from "@/utils/constants";
import {Ionicons} from "@expo/vector-icons";
import React, {useState} from "react";
import {FlatList, Pressable, Text, View} from "react-native";
import SeeMoreModal from "../modals/seeMoreModal";

const DUMMY_DATA = [
  {
    id: "1",
    vehicle: "Motorcycle",
    bookedTime: "3:30 PM",
    pickup: "13, Allen Street Village, San Isidro hagonoy Bulacan sfsd ddfg",
    drop: "Hernandez Street",
    distance: "3KM",
    isCash: true,
    amount: "Php 100",
    selectedServices: serviceAddons,
    note: " Please handle with care.",
    images: [1, 2],
  },
];

export default function RequestRoute() {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);

  const handleSeeMorePress = (request: any) => {
    setSelectedRequest(request);
    setModalVisible(true);
  };

  return (
    <>
      <FlatList
        data={DUMMY_DATA}
        renderItem={({item}) => (
          <RequestCard
            vehicle={item.vehicle}
            bookedTime={item.bookedTime}
            pickup={item.pickup}
            drop={item.drop}
            distance={item.distance}
            isCash={item.isCash}
            amount={item.amount}
            onCancel={() => setModalVisible(true)}
            onUpdateNote={() => {}}
            onPressSeeMore={() => handleSeeMorePress(item)}
          />
        )}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        className="flex-1 p-4 bg-white"
        contentContainerStyle={{
          paddingBottom: 40,
          gap: 15,
        }}
      />

      <SeeMoreModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        type="Request Booking"
        data={selectedRequest}
      />
    </>
  );
}

type RequestCardProps = {
  vehicle: string;
  bookedTime: string;
  pickup: string;
  drop: string;
  distance: string;
  isCash: boolean;
  amount: string;
  onCancel: () => void;
  onUpdateNote: () => void;
  onPressSeeMore: () => void;
};

const RequestCard = ({
  vehicle,
  bookedTime,
  pickup,
  drop,
  distance,
  isCash,
  amount,
  onCancel,
  onUpdateNote,
  onPressSeeMore,
}: RequestCardProps) => {
  return (
    <Pressable
      onPress={onPressSeeMore}
      className="overflow-hidden bg-white rounded-2xl active:scale-95"
      style={{
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8, // for Android
      }}
    >
      {/* Header */}
      <View className="flex-row items-center justify-between px-5 py-3 bg-lightPrimary">
        <Text className="text-lg font-semibold text-white">{vehicle}</Text>
        <Text className="text-sm text-white">Booked at {bookedTime}</Text>
      </View>

      {/* Body */}
      <View className="px-3 py-5">
        {/* Pickup & Drop */}
        <View className="relative flex-row items-center justify-between ml-5 mr-2 border-l border-dashed pl-7">
          <View className="gap-4">
            <Text className="font-medium max-w-60" numberOfLines={2}>
              {pickup}
            </Text>
            <Text className="font-medium max-w-60" numberOfLines={2}>
              {drop}
            </Text>
          </View>
          <Text className="font-bold">{distance}</Text>

          <Ionicons
            name="location-sharp"
            size={24}
            className="absolute -left-3.5 -top-1 bg-white"
          />
          <Ionicons
            name="locate-sharp"
            size={24}
            className="absolute -left-3.5 -bottom-1 bg-white"
          />
        </View>
        {/* Payment */}
        <View className="flex-row items-center justify-between p-4 mt-6 bg-gray-100 rounded-lg">
          <Text className="text-base text-gray-600">
            {isCash ? "Cash Payment" : "Online Payment"}
          </Text>
          <Text className="text-lg font-semibold text-darkPrimary">
            {amount}
          </Text>
        </View>

        {/* Buttons */}
        <View className="flex-row justify-between mt-6">
          <Pressable
            className="flex-row items-center justify-center flex-1 py-3 mr-2 border border-lightPrimary rounded-xl"
            onPress={onCancel}
          >
            <Ionicons name="close" size={18} color="#333" />
            <Text className="ml-2 font-medium text-gray-700">Cancel Book</Text>
          </Pressable>

          <Pressable
            className="flex-row items-center justify-center flex-1 py-3 ml-2 border border-lightPrimary rounded-xl"
            onPress={onUpdateNote}
          >
            <Ionicons name="create-outline" size={18} color="#333" />
            <Text className="ml-2 font-medium text-gray-700">Update Note</Text>
          </Pressable>
        </View>
      </View>
    </Pressable>
  );
};
