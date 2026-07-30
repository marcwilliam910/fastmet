import useSeeMoreDetails from "@/hooks/useSeeMoreDetails";
import {useUserBookings} from "@/queries/bookingQueries";
import {useAppStore} from "@/store/useAppStore";
import {ActiveBooking, Driver, LocationDetails} from "@/types/book";
import {createConversationId} from "@/utils/helpers/booking";
import {formatLocation} from "@/utils/helpers/location";
import {pushOnce} from "@/utils/helpers/navigation";
import {Ionicons} from "@expo/vector-icons";
import {Image} from "expo-image";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import SeeMoreModalDisplay from "../modals/seeMoreModalDisplay";
import StarDisplay from "../StarDisplay";

export default function ActiveRoute() {
  const {modalVisible, setModalVisible, selectedRequest, handleSeeMorePress} =
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
      <View className="items-center justify-center flex-1">
        <ActivityIndicator size="large" color="#FFA840" />
      </View>
    );
  if (error)
    return (
      <View className="items-center justify-center flex-1">
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
        renderItem={({item}) => (
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
          <View className="items-center justify-center px-8 py-12">
            <View className="items-center">
              <Ionicons name="alert-circle-outline" size={80} color="#9CA3AF" />
              <Text className="mt-6 text-2xl font-bold text-center text-gray-800">
                No Active Bookings
              </Text>
              <Text className="mt-2 text-base text-center text-gray-500">
                You currently don&apos;t have any active requests.
              </Text>
            </View>
          </View>
        )}
      />

      {selectedRequest && (
        <SeeMoreModalDisplay
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
  console.log(driver);
  return (
    <View
      style={{
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 4},
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
          <Pressable
            className="flex-row items-center gap-2 active:scale-105"
            hitSlop={15}
            onPress={() =>
              pushOnce({
                pathname: "/(root_screens)/booking/viewOnMap",
                params: {bookingId: id, shouldGoBack: "true"},
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
                    source={{uri: driver.profilePictureUrl}}
                    style={{width: "100%", height: "100%"}}
                    contentFit="cover"
                  />
                </View>
              ) : (
                <Ionicons name="person-circle" size={50} color="#F7931E" />
              )}
              <View>
                <Text className="text-lg font-semibold text-gray-800">
                  {driver.name}
                </Text>
                <View className="flex-row items-center gap-2">
                  <StarDisplay rating={driver.rating} />
                  <Text className="text-sm font-semibold text-gray-600">
                    ({driver.rating})
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-row gap-5">
              <Pressable
                className="items-center active:scale-110"
                hitSlop={20}
                onPress={() =>
                  pushOnce({
                    pathname: "/message",
                    params: {
                      conversationId: createConversationId(
                        useAppStore.getState().id!,
                        driver.id,
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
              <Pressable
                className="items-center active:scale-110"
                hitSlop={20}
                onPress={() => {
                  const phoneNumber = driver.phoneNumber;
                  if (!phoneNumber) return;
                  Linking.openURL(`tel:${phoneNumber}`).catch(() => {
                    Alert.alert("Unable to place call", "Please try again.");
                  });
                }}
              >
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
              name="flag-outline"
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
