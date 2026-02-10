import useSeeMoreDetails from "@/hooks/useSeeMoreDetails";
import { queryClient } from "@/lib/queryClient";
import { useUserBookings } from "@/queries/bookingQueries";
import { useSocket } from "@/sockets/context/SocketProvider";
import { useAppStore } from "@/store/useAppStore";
import { Booking, Driver, LocationDetails, RequestedDriver } from "@/types/book";
import { STATIC_IMAGES } from "@/utils/constants";
import { formatDate } from "@/utils/date";
import { formatLocation } from "@/utils/helper";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import Popover, { PopoverPlacement } from "react-native-popover-view";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import ConfirmCancelBookingModal from "../modals/confirmCancelBookingModal";
import DriverDetailsModal from "../modals/driverDetailsModal";
import SeeMoreModalDisplay from "../modals/seeMoreModalDisplay";
import StarDisplay from "../StarDisplay";

export default function RequestRoute() {
  const { modalVisible, setModalVisible, selectedRequest, handleSeeMorePress } =
    useSeeMoreDetails<Booking>();
  /** Which booking's drivers list is open. Null = drivers modal closed. */
  const [driversModalBookingId, setDriversModalBookingId] = useState<
    string | null
  >(null);
  const [selectedDriver, setSelectedDriver] = useState<RequestedDriver | null>(
    null,
  );
  const [selectedFilters, setSelectedFilters] = useState(["PENDING"]);
  const setLoading = useAppStore((state) => state.setLoading);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const socket = useSocket();

  // Fetch first page of both statuses on mount
  const pendingQuery = useUserBookings<Booking>("pending", 5);
  const scheduledQuery = useUserBookings<Booking>("scheduled", 5);

  const isLoading = pendingQuery.isPending && scheduledQuery.isPending;
  const error = pendingQuery.error || scheduledQuery.error;

  // Flatten cached pages
  const pendingBookings =
    pendingQuery.data?.pages.flatMap((page) => page.bookings) ?? [];
  const scheduledBookings =
    scheduledQuery.data?.pages.flatMap((page) => page.bookings) ?? [];

  // Conditionally show data based on selected filter
  let bookings = selectedFilters.includes("PENDING") ? pendingBookings : [];
  bookings = selectedFilters.includes("SCHEDULED")
    ? [...bookings, ...scheduledBookings]
    : bookings;

  console.log(JSON.stringify(scheduledBookings, null, 2))


  const driversModalBooking = bookings.find(
    (b) => b._id === driversModalBookingId,
  );
  const driversForModal = driversModalBooking?.requestedDrivers ?? [];

  // Determine active queries for fetching / refreshing
  const activeQueries =
    selectedFilters.includes("PENDING") && selectedFilters.includes("SCHEDULED")
      ? [pendingQuery, scheduledQuery]
      : selectedFilters.includes("PENDING")
        ? [pendingQuery]
        : [scheduledQuery];

  // Combined states
  const isFetchingNextPage = activeQueries.some((q) => q.isFetchingNextPage);
  const refreshing = activeQueries.some((q) => q.isPending);

  // Pull-to-refresh
  const handleRefresh = () => {
    activeQueries.forEach((q) => q.refetch());
  };

  // Infinite scroll
  const handleEndReached = () => {
    activeQueries.forEach((q) => {
      if (q.hasNextPage && !q.isFetchingNextPage) q.fetchNextPage();
    });
  };

  const handleFilterPress = (filter: string) => {
    if (selectedFilters.includes(filter)) {
      if (selectedFilters.length === 1) return;
      setSelectedFilters(selectedFilters.filter((f) => f !== filter));
    } else {
      setSelectedFilters([...selectedFilters, filter]);
    }
  };

  const handleCancelBook = () => {
    setLoading(true);
    socket.emit("cancelBookingRequest", { bookingId: selectedId });
    setSelectedId(null);
  };

  const acceptDriver = useCallback(() => {
    if (!selectedDriver?.id || !selectedDriver?.bookingId) return;
    setLoading(true);
    socket.emit("acceptDriver", {
      driverId: selectedDriver.id,
      bookingId: selectedDriver.bookingId,
      type: "schedule",
    });
  }, [selectedDriver?.bookingId, selectedDriver?.id, setLoading, socket]);

  const closeDriversModal = useCallback(() => {
    setDriversModalBookingId(null);
    setSelectedDriver(null);
  }, []);

  useEffect(() => {
    const bookingCancelled = (bookingId: string) => {
      setLoading(false);
      queryClient.invalidateQueries({
        queryKey: ["userBookings", "pending"],
        exact: false,
      });

      queryClient.invalidateQueries({
        queryKey: ["userBookings", "cancelled"],
        exact: false,
      });

      queryClient.invalidateQueries({
        queryKey: ["userBookingCounts"],
      });

      Toast.show({
        type: "success",
        text1: "Booking Cancelled",
        text2: "Successfully cancelled booking",
        position: "top",
        visibilityTime: 3000,
        swipeable: true,
        topOffset: 50,
      });
    };
    const errorHandler = ({ message }: { message: string }) => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: message,
        position: "top",
        visibilityTime: 5_000,
        swipeable: true,
        topOffset: 50,
      });
    };
    socket.on("bookingCancelled", bookingCancelled);
    socket.on("error", errorHandler);
    return () => {
      socket.off("bookingCancelled", bookingCancelled);
      socket.off("error", errorHandler);
    };
  }, [setLoading, socket]);

  useEffect(() => {
    const driverAcceptedSchedule = ({ bookingId, success }: { bookingId: string, success: boolean }) => {
      if (bookingId !== selectedDriver?.bookingId) return;

      setLoading(false);
      closeDriversModal();
      queryClient.invalidateQueries({
        queryKey: ["userBookings", "scheduled"],
        exact: false,
      });
      queryClient.invalidateQueries({
        queryKey: ["userBookings", "pending"],
        exact: false,
      });

      Toast.show({
        type: "success",
        text1: "Offer Accepted!",
        text2: `You have accepted ${selectedDriver?.name}'s offer.`,
        position: "top",
        visibilityTime: 5_000,
        swipeable: true,
        topOffset: 50,
      });

      setSelectedFilters(["SCHEDULED"])
    }

    socket.on("driverAcceptedSchedule", driverAcceptedSchedule);
    return () => {
      socket.off("driverAcceptedSchedule", driverAcceptedSchedule);
    };
  }, [closeDriversModal, selectedDriver?.bookingId, selectedDriver?.name, setLoading, socket]);

  if (isLoading)
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


  return (
    <>
      <View className="flex-row items-center justify-between px-4 py-2">
        {/* Display current filter */}
        <Text className="font-bold">
          {selectedFilters.length === 2
            ? selectedFilters.join(" and ")
            : selectedFilters[0]}
        </Text>

        {/* Filter Popover */}
        <Popover
          placement={PopoverPlacement.LEFT}
          from={
            <Pressable className="p-2 bg-gray-200 rounded-full active:scale-95">
              <Ionicons name="options" size={28} color="black" />
            </Pressable>
          }
        >
          <View className="w-40">
            <View className="px-2 py-2 bg-lightPrimary">
              <Text className="text-lg font-bold text-white">Filter</Text>
            </View>
            {["PENDING", "SCHEDULED"].map((option) => (
              <Pressable
                onPress={() => handleFilterPress(option)}
                key={option}
                className="flex-row items-center justify-between p-3 active:scale-105"
              >
                <Text className="font-semibold">{option}</Text>
                {
                  // Check if the option is selected
                  selectedFilters.includes(option) ? (
                    <Ionicons name="checkbox" size={24} color="#FFA840" />
                  ) : (
                    <Ionicons name="square" size={24} color="#999" />
                  )
                }
              </Pressable>
            ))}
          </View>
        </Popover>
      </View>

      {/* Bookings List */}
      <FlatList
        data={bookings}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        className="flex-1 p-4"
        contentContainerStyle={{
          paddingBottom: 40,
          gap: 15,
        }}
        renderItem={({ item }) => (
          <RequestCard
            driver={item.driver}
            status={item.status as "pending" | "scheduled"}
            vehicle={item.selectedVehicle.name}
            bookingType={item.bookingType}
            pickup={item.pickUp}
            dropoff={item.dropOff}
            distance={item.routeData.distance}
            amount={item.routeData.totalPrice}
            isCash={item.paymentMethod === "cash"}
            onCancel={() => setSelectedId(item._id)}
            onPressSeeMore={() => handleSeeMorePress(item)}
            driverOffers={item.requestedDrivers}
            onOpenDrivers={() => {
              setSelectedDriver(null);
              setDriversModalBookingId(item._id);
            }}
          />
        )}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        onEndReached={handleEndReached}
        onEndReachedThreshold={0.3}
        ListFooterComponent={
          isFetchingNextPage ? (
            <View className="py-4">
              <ActivityIndicator size="small" color="#FFA840" />
            </View>
          ) : null
        }
        ListEmptyComponent={() => (
          <View className="items-center justify-center px-8 py-12">
            <Ionicons name="alert-circle-outline" size={80} color="#9CA3AF" />
            <Text className="text-2xl font-bold text-gray-800 mt-6 text-center">
              No Requests Yet
            </Text>
            <Text className="text-base text-gray-500 text-center mt-2">
              You currently don&apos;t have any active requests.
            </Text>
          </View>
        )}
      />

      {selectedRequest && (
        <SeeMoreModalDisplay
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          type="Request Booking"
          data={selectedRequest}
          onOpenDriverOffers={() => {
            setModalVisible(false);
            setSelectedDriver(null);
            setDriversModalBookingId(selectedRequest._id);
          }}
        />
      )}

      {selectedId && (
        <ConfirmCancelBookingModal
          visible={selectedId !== null}
          onClose={() => setSelectedId(null)}
          onConfirm={handleCancelBook}
        />
      )}

      <DriversListModal
        visible={driversModalBookingId !== null && selectedDriver === null}
        drivers={driversForModal}
        onClose={closeDriversModal}
        onSelectDriver={(driver) =>
          setSelectedDriver({
            ...driver,
            bookingId: driver.bookingId ?? driversModalBookingId ?? undefined,
          })
        }
      />

      {selectedDriver && (
        <DriverDetailsModal
          isModalOpen
          driver={selectedDriver}
          handleCloseModal={() => setSelectedDriver(null)}
          acceptDriver={acceptDriver}
        />
      )}
    </>
  );
}

type RequestCardProps = {
  vehicle: string;
  bookingType: {
    type: string;
    value: string;
  };
  pickup: LocationDetails;
  dropoff: LocationDetails;
  distance: number;
  isCash: boolean;
  amount: number;
  onCancel: () => void;
  onPressSeeMore: () => void;
  driverOffers?: RequestedDriver[];
  onOpenDrivers: () => void;
  driver?: Driver;
  status: "pending" | "scheduled";
};

const RequestCard = ({
  status,
  driver,
  vehicle,
  bookingType,
  pickup,
  dropoff,
  distance,
  isCash,
  amount,
  onCancel,
  onPressSeeMore,
  driverOffers = [],
  onOpenDrivers,
}: RequestCardProps) => {
  const hasOffers = driverOffers.length > 0;
  const maxStackedAvatars = 4;
  const displayedAvatars = driverOffers.slice(0, maxStackedAvatars);
  const remainingCount = Math.max(0, driverOffers.length - maxStackedAvatars);

  return (
    <>
      <View
        style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}
        className="rounded-2xl"
      >
        <Pressable
          onPress={onPressSeeMore}
          className="overflow-hidden bg-white rounded-2xl active:opacity-90"
        >
          {/* Header */}
          <View className="flex-row items-center justify-between px-5 py-3 bg-lightPrimary">
            <Text className="text-lg font-semibold text-white">
              {vehicle}
            </Text>
            <Text className="text-sm text-white">
              {status === "pending" ? bookingType.type.toUpperCase() : formatDate(bookingType.value)}
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

            {/* Assigned Driver */}
            {driver && (
              <View className="mt-6 flex-row items-center bg-green-50 p-3 rounded-xl">
                <Image
                  source={
                    driver.profilePictureUrl
                      ? { uri: driver.profilePictureUrl }
                      : STATIC_IMAGES.userPlaceholder
                  }
                  style={{
                    width: 48,
                    height: 48,
                    borderRadius: 24,
                    borderWidth: 2,
                    borderColor: "white",
                  }}
                />
                <View className="ml-3 flex-1">
                  <Text className="text-base font-semibold text-green-900">
                    {driver.name}
                  </Text>
                  <View className="flex-row items-center mt-1">
                    <StarDisplay rating={driver.rating} />
                    <Text className="text-xs text-green-700 ml-2">
                      {driver.rating.toFixed(1)}
                    </Text>
                  </View>
                </View>
                <View className="bg-green-500 px-2 py-1 rounded-md">
                  <Text className="text-xs font-medium text-white">Assigned</Text>
                </View>
              </View>
            )}

            {/* Driver Offers - Stacked Avatars */}
            {hasOffers && (
              <Pressable
                onPress={onOpenDrivers}
                className="mt-6 flex-row items-center justify-between bg-orange-50 p-3 rounded-xl active:bg-orange-100"
              >
                <View className="flex-row items-center">
                  {/* Stacked Avatars */}
                  <View
                    className="flex-row items-center"
                    style={{ marginRight: 12 }}
                  >
                    {displayedAvatars.map((driver, index) => (
                      <Image
                        key={driver.id}
                        source={
                          driver.profilePicture
                            ? { uri: driver.profilePicture }
                            : STATIC_IMAGES.userPlaceholder
                        }
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          borderWidth: 2,
                          borderColor: "white",
                          marginLeft: index === 0 ? 0 : -12, // Overlap effect
                        }}
                      />
                    ))}
                    {remainingCount > 0 && (
                      <View
                        style={{
                          width: 40,
                          height: 40,
                          borderRadius: 20,
                          backgroundColor: "#FF6B35",
                          borderWidth: 2,
                          borderColor: "white",
                          marginLeft: -12,
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text className="text-xs font-bold text-white">
                          +{remainingCount}
                        </Text>
                      </View>
                    )}
                  </View>

                  <View>
                    <Text className="text-sm font-semibold text-orange-900">
                      {driverOffers.length} Driver
                      {driverOffers.length > 1 ? "s" : ""} Offered
                    </Text>
                    <Text className="text-xs text-orange-700">
                      Tap to view details
                    </Text>
                  </View>
                </View>

                <Ionicons name="chevron-forward" size={20} color="#9A3412" />
              </Pressable>
            )}

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
            {
              status === "pending" && (
                <View className="flex-row justify-between mt-6">
                  <Pressable
                    className="flex-row items-center justify-center flex-1 py-3 mr-2 border border-lightPrimary rounded-xl active:bg-gray-50"
                    onPress={onCancel}
                  >
                    <Ionicons name="close" size={18} color="#333" />
                    <Text className="ml-2 font-medium text-gray-700">
                      Cancel Book
                    </Text>
                  </Pressable>

                  {/* <Pressable
                className="flex-row items-center justify-center flex-1 py-3 ml-2 border border-lightPrimary rounded-xl active:bg-gray-50"
                onPress={onUpdateNote}
              >
                <Ionicons name="create-outline" size={18} color="#333" />
                <Text className="ml-2 font-medium text-gray-700">
                  Update Note
                </Text>
              </Pressable> */}
                </View>
              )
            }
          </View>
        </Pressable>
      </View>
    </>
  );
};

const DriversListModal = ({
  visible,
  drivers,
  onClose,
  onSelectDriver,
}: {
  visible: boolean;
  drivers: RequestedDriver[];
  onClose: () => void;
  onSelectDriver: (driver: RequestedDriver) => void;
}) => {
  const inset = useSafeAreaInsets();

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1">
        <Pressable
          className="flex-1 bg-black/50"
          onPress={onClose}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Close modal"
        />
        <View
          className="max-h-[75%] rounded-t-3xl bg-white"
          style={{ paddingBottom: inset.bottom }}
        >
          {/* Header */}
          <View className="flex-row items-center justify-between border-b border-gray-200 px-6 py-4">
            <Text className="text-xl font-bold text-gray-900">
              Driver Offers ({drivers.length})
            </Text>
            <Pressable onPress={onClose} hitSlop={20}>
              <Ionicons
                name="close"
                size={Platform.OS === "ios" ? 30 : 28}
                color="#6B7280"
              />
            </Pressable>
          </View>

          {/* Driver List */}
          <ScrollView
            className="px-4 py-4"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            {drivers.map((driver) => (
              <Pressable
                key={driver.id}
                onPress={() => onSelectDriver(driver)}
                className="flex-row items-center justify-between bg-gray-50 rounded-xl p-3 mb-3 active:bg-gray-100"
              >
                <View className="flex-row items-center gap-3 flex-1">
                  <Image
                    source={
                      driver.profilePicture
                        ? { uri: driver.profilePicture }
                        : STATIC_IMAGES.userPlaceholder
                    }
                    style={{ width: 50, height: 50, borderRadius: 25 }}
                  />

                  <View className="flex-1">
                    <Text className="text-base font-semibold text-gray-900">
                      {driver.name}
                    </Text>
                    <View className="mt-1 flex-row items-center gap-1">
                      <Ionicons name="star" size={14} color="#FBBF24" />
                      <Text className="text-sm text-gray-600">
                        {driver.rating} ({driver.totalBookings} bookings)
                      </Text>
                    </View>
                  </View>
                </View>

                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </Pressable>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

// Mock data
// const MOCK_DRIVER_OFFERS: RequestedDriver[] = [
//   {
//     id: "driver_001",
//     name: "Juan Dela Cruz",
//     profilePicture: "https://i.pravatar.cc/150?img=12",
//     rating: 4.8,
//     totalBookings: 245,
//     vehicleImage:
//       "https://images.unsplash.com/photo-1568605117036-5fe5e7bab0b7?w=400",
//   },
//   {
//     id: "driver_002",
//     name: "Maria Santos",
//     profilePicture: "https://i.pravatar.cc/150?img=47",
//     rating: 4.9,
//     totalBookings: 312,
//     vehicleImage:
//       "https://images.unsplash.com/photo-1619405399517-d7fce0f13302?w=400",
//   },
//   {
//     id: "driver_003",
//     name: "Pedro Reyes",
//     profilePicture: "https://i.pravatar.cc/150?img=33",
//     rating: 4.7,
//     totalBookings: 189,
//     vehicleImage:
//       "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400",
//   },
//   {
//     id: "driver_004",
//     name: "Ana Garcia",
//     profilePicture: "", // No profile picture
//     rating: 5.0,
//     totalBookings: 428,
//     vehicleImage:
//       "https://images.unsplash.com/photo-1552519507-da3b142c6e3d?w=400",
//   },
//   {
//     id: "driver_005",
//     name: "Roberto Aquino",
//     profilePicture: "https://i.pravatar.cc/150?img=68",
//     rating: 4.6,
//     totalBookings: 156,
//     vehicleImage:
//       "https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=400",
//   },

//   {
//     id: "342",
//     name: "Carmen Lopez",
//     profilePicture: "https://i.pravatar.cc/150?img=45",
//     rating: 4.85,
//     totalBookings: 267,
//     vehicleImage:
//       "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
//   },
//   {
//     id: "5435",
//     name: "Carmen Lopez",
//     profilePicture: "https://i.pravatar.cc/150?img=45",
//     rating: 4.85,
//     totalBookings: 267,
//     vehicleImage:
//       "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
//   },
//   {
//     id: "12",
//     name: "Carmen Lopez",
//     profilePicture: "https://i.pravatar.cc/150?img=45",
//     rating: 4.85,
//     totalBookings: 267,
//     vehicleImage:
//       "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
//   },
//   {
//     id: "driver_011",
//     name: "Carmen Lopez",
//     profilePicture: "https://i.pravatar.cc/150?img=45",
//     rating: 4.85,
//     totalBookings: 267,
//     vehicleImage:
//       "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400",
//   },
// ];
