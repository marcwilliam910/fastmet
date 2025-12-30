import useSeeMoreDetails from "@/hooks/useSeeMoreDetails";
import { useUserBookings } from "@/queries/bookingQueries";
import { Booking, LocationDetails } from "@/types/book";
import { formatDate } from "@/utils/date";
import { formatLocation } from "@/utils/helper";
import { Ionicons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  Text,
  View,
} from "react-native";
import SeeMoreModal from "../modals/seeMoreModal";

export default function RequestRoute() {
  const { modalVisible, setModalVisible, selectedRequest, handleSeeMorePress } =
    useSeeMoreDetails<Booking>();

  const {
    data,
    isPending,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserBookings<Booking>("pending", 5);

  if (isPending)
    return (
      <View className="flex-1 items-center  justify-center">
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

  const pendingBookings = data?.pages.flatMap((page) => page.bookings) ?? [];

  return (
    <>
      <FlatList
        data={pendingBookings}
        renderItem={({ item }) => (
          <RequestCard
            vehicle={item.selectedVehicle.name}
            bookingType={item.bookingType}
            pickup={item.pickUp}
            dropoff={item.dropOff}
            distance={item.routeData.distance}
            amount={item.routeData.totalPrice}
            isCash={item.paymentMethod === "cash"}
            onCancel={() => setModalVisible(true)}
            onUpdateNote={() => {}}
            onPressSeeMore={() => handleSeeMorePress(item)}
          />
        )}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        className="flex-1 p-4 "
        contentContainerStyle={{
          paddingBottom: 40,
          gap: 15,
        }}
        ListEmptyComponent={() => (
          <View className=" items-center justify-center px-8 py-12">
            <View className="items-center">
              <Ionicons name="alert-circle-outline" size={80} color="#9CA3AF" />
              <Text className="text-2xl font-bold text-gray-800 mt-6 text-center">
                No Requests Yet
              </Text>
              <Text className="text-base text-gray-500 text-center mt-2">
                You currently don&apos;t have any active requests.
              </Text>
            </View>
          </View>
        )}
        // pull to refresh
        refreshing={isPending}
        onRefresh={refetch}
        // infinite scroll
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage();
          }
        }}
        onEndReachedThreshold={0.3}
        // Loading indicator at bottom
        ListFooterComponent={() => {
          if (isFetchingNextPage) {
            return (
              <View className="py-4">
                <ActivityIndicator size="small" color="#FFA840" />
              </View>
            );
          }
          return null;
        }}
      />

      {selectedRequest && (
        <SeeMoreModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          type="Request Booking"
          data={selectedRequest}
        />
      )}
    </>
  );
}

type RequestCardProps = {
  vehicle: string;
  bookingType: {
    type: string; // "asap" | "schedule"
    value: string | null;
  };
  pickup: LocationDetails;
  dropoff: LocationDetails;
  distance: number;
  isCash: boolean;
  amount: number;
  onCancel: () => void;
  onUpdateNote: () => void;
  onPressSeeMore: () => void;
};

const RequestCard = ({
  vehicle,
  bookingType,
  pickup,
  dropoff,
  distance,
  isCash,
  amount,
  onCancel,
  onUpdateNote,
  onPressSeeMore,
}: RequestCardProps) => {
  return (
    <View
      style={{
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 8, // for Android
      }}
      className="rounded-2xl"
    >
      <Pressable
        onPress={onPressSeeMore}
        className="overflow-hidden bg-white rounded-2xl active:opacity-90"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-3 bg-lightPrimary">
          <Text className="text-lg font-semibold text-white">{vehicle}</Text>
          <Text className="text-sm text-white capitalize">
            {bookingType.type === "schedule"
              ? `Scheduled: ${formatDate(bookingType.value || "")}`
              : bookingType.value}
          </Text>
        </View>

        {/* Body */}
        <View className="px-3 py-5">
          {/* Pickup & Drop */}
          <View className="relative flex-row items-center justify-between ml-5 mr-2 border-l border-dashed pl-7">
            <View className="gap-4">
              <Text className="font-medium max-w-56" numberOfLines={2}>
                {formatLocation(pickup)}
              </Text>
              <Text className="font-medium max-w-56" numberOfLines={2}>
                {formatLocation(dropoff)}
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
              Php{" "}
              {amount.toLocaleString("en-US", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </Text>
          </View>

          {/* Buttons */}
          <View className="flex-row justify-between mt-6">
            <Pressable
              className="flex-row items-center justify-center flex-1 py-3 mr-2 border border-lightPrimary rounded-xl"
              onPress={onCancel}
            >
              <Ionicons name="close" size={18} color="#333" />
              <Text className="ml-2 font-medium text-gray-700">
                Cancel Book
              </Text>
            </Pressable>

            <Pressable
              className="flex-row items-center justify-center flex-1 py-3 ml-2 border border-lightPrimary rounded-xl"
              onPress={onUpdateNote}
            >
              <Ionicons name="create-outline" size={18} color="#333" />
              <Text className="ml-2 font-medium text-gray-700">
                Update Note
              </Text>
            </Pressable>
          </View>
        </View>
      </Pressable>
    </View>
  );
};
