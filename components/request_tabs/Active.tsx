import useAuth from "@/hooks/useAuth";
import useSeeMoreDetails from "@/hooks/useSeeMoreDetails";
import { useUserBookings } from "@/queries/bookingQueries";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import SeeMoreModal from "../modals/seeMoreModal";

export default function ActiveRoute() {
  const { modalVisible, setModalVisible, selectedRequest, handleSeeMorePress } =
    useSeeMoreDetails();

  const { user } = useAuth();

  const {
    data: bookings,
    isPending,
    error,
    refetch,
  } = useUserBookings(user?.uid || "");

  if (isPending)
    return (
      <View className="flex-1 items-center justify-center">
        <ActivityIndicator size="large" color="#FFA840" />
      </View>
    );
  if (error)
    return (
      <View className="flex-1 items-center justify-center">
        <Text className="text-lg font-semibold text-gray-500">
          {error.message}
        </Text>
      </View>
    );

  const activeBookings = bookings.filter((b) => b.status === "active");

  return (
    <>
      <FlatList
        data={activeBookings}
        renderItem={({ item }) => (
          <ActiveCard
            vehicle={item.selectedVehicle.name}
            pickup={item.pickUp.address}
            dropoff={item.dropOff.address}
            distance={item.routeData.distance}
            amount={item.routeData.price}
            isCash={item.paymentMethod === "cash"}
            driverName={item.driver?.name || ""}
            rating={item.driver?.rating || 0}
            onPressSeeMore={() => handleSeeMorePress(item)}
          />
        )}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        className="flex-1 p-4 bg-white"
        contentContainerStyle={{
          paddingBottom: 40,
          gap: 15,
        }}
        refreshing={isPending}
        onRefresh={refetch}
      />

      {selectedRequest && (
        <SeeMoreModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          type="Active Booking"
          data={selectedRequest}
        />
      )}
    </>
  );
}

type ActiveCardProps = {
  vehicle: string;
  pickup: string;
  dropoff: string;
  distance: number;
  amount: number;
  driverName: string;
  rating: number;
  isCash: boolean;
  onPressSeeMore: () => void;
};

const ActiveCard = ({
  vehicle,
  pickup,
  dropoff,
  distance,
  isCash,
  amount,
  driverName,
  rating,
  onPressSeeMore,
}: ActiveCardProps) => {
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
        <Pressable
          className="flex-row items-center gap-2 active:scale-105"
          onPress={() => router.push("/(root_screens)/booking/viewOnMap")}
        >
          <Text className="text-sm font-semibold text-white underline">
            View on Map
          </Text>
          <Ionicons name="arrow-forward" size={16} color="white" />
        </Pressable>
      </View>
      <View className="px-4 py-3">
        <Text className="mb-1 text-sm font-semibold text-gray-500">Driver</Text>
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center justify-center gap-2">
            <Ionicons name="person-circle" size={40} color="#F7931E" />
            <View>
              <Text className="font-semibold text-gray-800">{driverName}</Text>
              <View className="flex-row">
                {[...Array(Math.floor(rating))].map((_, i) => (
                  <Ionicons key={i} name="star" size={16} color="#FFD700" />
                ))}
                {[...Array(5 - Math.floor(rating))].map((_, i) => (
                  <Ionicons
                    key={i}
                    name="star-outline"
                    size={16}
                    color="#FFD700"
                  />
                ))}
              </View>
            </View>
          </View>

          <View className="flex-row gap-4">
            <Pressable className="items-center active:scale-110">
              <Ionicons name="call" size={22} color="#F7931E" />
              <Text className="text-xs text-gray-600">Call</Text>
            </Pressable>
            <Pressable className="items-center active:scale-110">
              <Ionicons name="chatbubble-ellipses" size={22} color="#F7931E" />
              <Text className="text-xs text-gray-600">Chat</Text>
            </Pressable>
          </View>
        </View>
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
              {dropoff}
            </Text>
          </View>
          <Text className="font-bold">{distance.toFixed(1)}km</Text>

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
            Php {amount.toLocaleString("en-US")}
          </Text>
        </View>

        <Pressable
          className="items-center justify-center mt-6 active:scale-105"
          onPress={onPressSeeMore}
        >
          <Text className="text-sm font-medium">+ See more</Text>
        </Pressable>
      </View>
    </Pressable>
  );
};
