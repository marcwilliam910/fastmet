import useSeeMoreDetails from "@/hooks/useSeeMoreDetails";
import { useUserBookings } from "@/queries/bookingQueries";
import { useAppStore } from "@/store/useAppStore";
import { ActiveBooking, Driver, LocationDetails } from "@/types/book";
import { createConversationId, formatLocation } from "@/utils/helper";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import {
  ActivityIndicator,
  FlatList,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import SeeMoreModal from "../modals/seeMoreModal";
import StarDisplay from "../StarDisplay";

export default function ActiveRoute() {
  const { modalVisible, setModalVisible, selectedRequest, handleSeeMorePress } =
    useSeeMoreDetails<ActiveBooking>();

  const {
    data,
    isPending,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserBookings<ActiveBooking>("active", 5);

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

  const activeBookings = data?.pages.flatMap((page) => page.bookings) ?? [];

  return (
    <>
      <FlatList
        data={activeBookings}
        renderItem={({ item }) => (
          <ActiveCard
            id={item._id}
            vehicle={item.selectedVehicle.name}
            pickup={item.pickUp}
            dropoff={item.dropOff}
            distance={item.routeData.distance}
            amount={item.routeData.totalPrice}
            isCash={item.paymentMethod === "cash"}
            driver={item.driver}
            onPressSeeMore={() => handleSeeMorePress(item)}
          />
        )}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        className="flex-1 p-4"
        contentContainerStyle={{
          paddingBottom: 40,
          gap: 15,
        }}
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
        ListEmptyComponent={() => (
          <View className=" items-center justify-center px-8 py-12">
            <View className="items-center">
              <Ionicons name="alert-circle-outline" size={80} color="#9CA3AF" />
              <Text className="text-2xl font-bold text-gray-800 mt-6 text-center">
                No Active Bookings
              </Text>
              <Text className="text-base text-gray-500 text-center mt-2">
                You currently don&apos;t have any active requests.
              </Text>
            </View>
          </View>
        )}
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
  id: string;
  vehicle: string;
  pickup: LocationDetails;
  dropoff: LocationDetails;
  distance: number;
  amount: number;
  driver: Driver;
  isCash: boolean;
  onPressSeeMore: () => void;
};

const ActiveCard = ({
  id,
  vehicle,
  pickup,
  dropoff,
  distance,
  isCash,
  amount,
  driver,
  onPressSeeMore,
}: ActiveCardProps) => {
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
        className="overflow-hidden bg-white rounded-2xl active:opacity-80"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 py-3 bg-lightPrimary">
          <Text className="text-lg font-semibold text-white">{vehicle}</Text>
          <Pressable
            className="flex-row items-center gap-2 active:scale-105"
            hitSlop={15}
            onPress={() =>
              router.push({
                pathname: "/(root_screens)/booking/viewOnMap",
                params: { bookingId: id, canGoBack: "true" },
              })
            }
          >
            <Text className="text-sm font-semibold text-white underline">
              View on Map
            </Text>
            <Ionicons name="arrow-forward" size={16} color="white" />
          </Pressable>
        </View>
        <View className="px-4 py-3">
          <Text className="mb-1 text-sm font-semibold text-gray-500">
            Driver
          </Text>
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center justify-center gap-2">
              {driver.profilePictureUrl ? (
                <View className="w-[44px] h-[44px] rounded-full overflow-hidden">
                  <Image
                    source={{ uri: driver.profilePictureUrl }}
                    style={{ width: "100%", height: "100%" }}
                    contentFit="cover"
                  />
                </View>
              ) : (
                <Ionicons name="person-circle" size={50} color="#F7931E" />
              )}
              <View>
                <Text className="font-semibold text-lg text-gray-800">
                  {driver.name}
                </Text>
                <StarDisplay rating={driver.rating} />
              </View>
            </View>

            <View className="flex-row gap-5">
              <Pressable
                className="items-center active:scale-110"
                hitSlop={20}
                onPress={() =>
                  router.push({
                    pathname: "/message",
                    params: {
                      conversationId: createConversationId(
                        useAppStore.getState().id!,
                        driver.id
                      ),
                    },
                  })
                }
              >
                <Ionicons
                  name="chatbubble-ellipses"
                  size={Platform.OS === "ios" ? 28 : 24}
                  color="#F7931E"
                />
                <Text className="text-sm text-gray-600">Chat</Text>
              </Pressable>
              <Pressable className="items-center active:scale-110" hitSlop={20}>
                <Ionicons
                  name="call"
                  size={Platform.OS === "ios" ? 28 : 24}
                  color="#F7931E"
                />
                <Text className="text-sm text-gray-600">Call</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Body */}
        <View className="px-3 py-5">
          {/* Pickup & Drop */}
          <View className="relative flex-row items-center justify-between ml-5 mr-2 border-l border-dashed pl-7">
            <View className="gap-4">
              <Text
                className={`font-medium ${Platform.OS === "ios" ? "max-w-60" : "max-w-52"}`}
                numberOfLines={2}
              >
                {formatLocation(pickup)}
              </Text>
              <Text
                className={`font-medium ${Platform.OS === "ios" ? "max-w-60" : "max-w-52"}`}
                numberOfLines={2}
              >
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

          <Pressable
            className="items-center justify-center mt-6 active:scale-105"
            onPress={onPressSeeMore}
          >
            <Text className="text-sm font-medium">+ See more</Text>
          </Pressable>
        </View>
      </Pressable>
    </View>
  );
};
