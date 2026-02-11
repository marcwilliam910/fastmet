import useSeeMoreDetails from "@/hooks/useSeeMoreDetails";
import { useMarkAsReadMutation, useRateDriverMutation } from "@/mutations/booking";
import { useUserBookings } from "@/queries/bookingQueries";
import { useAppStore } from "@/store/useAppStore";
import { CompletedBooking, LocationDetails } from "@/types/book";
import { formatDate } from "@/utils/date";
import { createConversationId, formatLocation } from "@/utils/helper";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import { useEffect, useMemo, useState } from "react";
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
import ImageView from "react-native-image-viewing";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { AttachedImages, ItemType, LocationUI, Note, PaymentInfo, SeeMoreHeader, SelectedServices } from "../BookingSeeMoreInfo";
import StarDisplay from "../StarDisplay";

export default function CompletedRoute({ count }: { count: number }) {
  const { modalVisible, setModalVisible, selectedRequest, handleSeeMorePress } =
    useSeeMoreDetails<CompletedBooking>();

  const {
    data,
    isPending,
    error,
    refetch,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useUserBookings<CompletedBooking>("completed", 5);


  const { mutate: markAsReadBooking, isPending: isMarkingAsRead } = useMarkAsReadMutation();

  useEffect(() => {
    if (count > 0) markAsReadBooking("completed");
  }, [count, markAsReadBooking]);

  if (isPending || isMarkingAsRead)
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

  const completedBookings = data?.pages.flatMap((page) => page.bookings) ?? [];

  return (
    <>
      <FlatList
        data={completedBookings}
        renderItem={({ item }) => (
          <CompletedCard
            vehicle={item.selectedVehicle.name}
            bookingType={item.bookingType}
            pickup={item.pickUp}
            dropoff={item.dropOff}
            distance={item.routeData.distance}
            amount={item.routeData.totalPrice}
            isCash={item.paymentMethod === "cash"}
            completedTime={item.completedAt}
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
          data={selectedRequest}
          isAccepted={true}
        />
      )}
    </>
  );
}

type CompleteCardProps = {
  vehicle: string;
  pickup: LocationDetails;
  bookingType: {
    type: string; // "asap" | "schedule"
    value: string | null;
  };
  dropoff: LocationDetails;
  distance: number;
  isCash: boolean;
  amount: number;
  completedTime: string;
  onPressSeeMore: () => void;
};

const CompletedCard = ({
  vehicle,
  completedTime,
  pickup,
  dropoff,
  distance,
  isCash,
  amount,
  onPressSeeMore,
}: CompleteCardProps) => {
  const formatted = new Date(completedTime).toLocaleString("en-US", {
    month: "short", // "Nov"
    day: "numeric", // "13"
    hour: "numeric", // "1"
    minute: "2-digit",
    hour12: true,
  });

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
          <Text className="text-sm text-white">Completed at {formatted}</Text>
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
    </View>
  );
};

function SeeMoreModal({
  visible,
  onClose,
  data,
}: {
  visible: boolean;
  onClose: () => void;
  data: CompletedBooking;
  isAccepted: boolean;
}) {
  const insets = useSafeAreaInsets();
  const [isImageViewVisible, setIsImageViewVisible] = useState(false);
  const [selectedImage, setSelectedImage] = useState<string>("");
  const [userRating, setUserRating] = useState(0);
  const [showRatingCard, setShowRatingCard] = useState(false);

  const { mutate, isPending, error } = useRateDriverMutation();

  const openImageViewer = (imageUrl: string) => {
    setSelectedImage(imageUrl);
    setIsImageViewVisible(true);
  };

  const handleRateDriver = () => {
    if (userRating > 0) {
      mutate(
        { bookingId: data._id, rating: userRating },
        {
          onSuccess: (data) => {
            setShowRatingCard(false);
            setUserRating(0);
            onClose();
          },
        }
      );
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (data.driverRating !== null) setShowRatingCard(false);
      else setShowRatingCard(true);
    }, 7000);

    return () => clearTimeout(timeoutId);
  }, [visible, data.driverRating]);


  // Memoize calculations to prevent recalculation on every render
  const { totalServicesPrice, hasAddedServices, hasFreeServices } = useMemo(() => {
    if (!data) return { totalServicesPrice: 0, hasAddedServices: false, hasFreeServices: false };

    const addedServices = data.addedServices ?? [];
    const freeServices = data.selectedVehicle?.freeServices ?? [];

    return {
      // service.price is already total (unit price × quantity) from bookSlice
      totalServicesPrice: addedServices.reduce(
        (total, service) => total + service.price,
        0,
      ),
      hasAddedServices: addedServices.length > 0,
      hasFreeServices: freeServices.length > 0,
    };
  }, [data]);

  if (!data) return null;


  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
      statusBarTranslucent={true}
    >
      <View
        style={{
          flex: 1,
          paddingTop: insets.top + 10,
          paddingBottom: insets.bottom,
          backgroundColor: "white",
        }}
      >
        {/* Header */}
        <SeeMoreHeader onClose={onClose} bookingType={data.bookingType.type} />

        {/* Content - Scrollable */}
        <ScrollView
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            gap: 20,
            paddingBottom: showRatingCard ? 170 : 30,
          }}
        >
          <View className="p-5 rounded-2xl bg-lightPrimary">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="mb-1 text-sm text-white opacity-90">
                  Order Reference
                </Text>
                <Text className="text-sm font-bold text-white">
                  #{data.bookingRef}
                </Text>
              </View>
              <View className="items-end">
                <Text className="mb-1 text-sm text-white opacity-90">
                  Vehicle Type
                </Text>
                <Text className="text-lg font-semibold text-white">
                  {data.selectedVehicle.name}
                </Text>
              </View>
            </View>
          </View>

          {/* Driver Info */}
          <View className="px-4 py-3">
            <Text className="mb-1 text-sm font-semibold text-gray-500">
              Driver
            </Text>
            <View className="flex-row items-center justify-between">
              <View className="flex-row items-center justify-center gap-2">
                {data.driver.profilePictureUrl ? (
                  <Pressable
                    className="w-[48px] h-[48px] rounded-full overflow-hidden"
                    onPress={() =>
                      openImageViewer(data.driver.profilePictureUrl)
                    }
                  >
                    <Image
                      source={{ uri: data.driver.profilePictureUrl }}
                      style={{ width: "100%", height: "100%" }}
                      contentFit="cover"
                    />
                  </Pressable>
                ) : (
                  <Ionicons name="person-circle" size={44} color="#F7931E" />
                )}
                <View>
                  <Text className="text-lg font-semibold text-gray-800">
                    {data.driver.name}
                  </Text>
                  <View className="flex-row items-center gap-2 ">
                    <StarDisplay rating={data.driver.rating} />
                    <Text className="text-sm font-semibold text-gray-600">
                      ({data.driver.rating})
                    </Text>
                  </View>
                </View>
              </View>

              <Pressable
                className="items-center active:scale-110"
                onPress={() =>
                  router.push({
                    pathname: "/message",
                    params: {
                      conversationId: createConversationId(
                        useAppStore.getState().id!,
                        data.driver.id
                      ),
                    },
                  })
                }
                hitSlop={20}
              >
                <Ionicons
                  name="chatbubble-ellipses"
                  size={Platform.OS === "ios" ? 28 : 24}
                  color="#F7931E"
                />
                <Text className="text-sm text-gray-600">Chat</Text>
              </Pressable>
            </View>
          </View>

          {/* Location Details */}
          <View className="p-5 bg-gray-50 rounded-2xl">
            <Text className="mb-4 text-base font-semibold text-gray-800">
              Trip Details
            </Text>

            <LocationUI
              pickUp={data.pickUp}
              dropOff={data.dropOff}
            />

            {/* Distance */}
            <View className="flex-row items-center justify-between p-3 mt-4 bg-white rounded-lg">
              <Text className="text-sm text-gray-600">Distance</Text>
              <Text className="text-lg font-bold text-lightPrimary">
                {data.routeData.distance.toFixed(2)}km
              </Text>
            </View>

            {/* Booking Type */}
            <View className="flex-row items-center justify-between p-3  bg-white rounded-lg">
              <Text className="text-sm font-semibold text-gray-600">
                {data.bookingType.type === "schedule"
                  ? "Scheduled on"
                  : data.bookingType.value}
              </Text>
              {data.bookingType.type === "schedule" && (
                <Text className="text-sm font-bold text-gray-600">
                  {formatDate(data.bookingType.value || "")}
                </Text>
              )}
            </View>

            {/* Completed At */}
            <View className="flex-row items-center justify-between p-3  bg-white rounded-lg">
              <Text className="text-sm font-semibold text-gray-600">
                Completed on
              </Text>
              <Text className="text-sm font-bold text-gray-800">
                {formatDate(data.completedAt)}
              </Text>
            </View>
          </View>

          {/* Payment Info */}
          <PaymentInfo paymentMethod={data.paymentMethod} routeData={data.routeData} />

          {/* Delivery Proof Images */}
          <View className="p-5 bg-gray-50 rounded-2xl">
            <View className="flex-row items-center mb-3 gap-2">
              <View className="bg-green-100 rounded-full p-1">
                <Ionicons
                  name="checkmark-done-circle"
                  size={22}
                  color="#10B981"
                />
              </View>
              <Text className="text-base font-bold text-gray-800">
                Delivery Proof Images
              </Text>
            </View>

            <View className="p-4 bg-white rounded-xl gap-3">
              {/* Pickup Section */}
              <View className="gap-2">
                <Text className="text-xs font-bold text-gray-500">
                  Pickup Confirmation
                </Text>

                <View className="flex-row gap-2">
                  {data.bookingImages.pickup.beforeImageUrl && (
                    <Pressable
                      onPress={() =>
                        openImageViewer(
                          data.bookingImages.pickup.beforeImageUrl
                        )
                      }
                      className="flex-1"
                    >
                      <Image
                        source={{
                          uri: data.bookingImages.pickup.beforeImageUrl,
                        }}
                        style={{ height: 90, width: "100%" }}
                        contentFit="cover"
                      />
                      <View className="p-2">
                        <Text className="text-xs text-center text-gray-600">
                          Before Loading
                        </Text>
                      </View>
                    </Pressable>
                  )}

                  {data.bookingImages.pickup.afterImageUrl && (
                    <Pressable
                      onPress={() =>
                        openImageViewer(data.bookingImages.pickup.afterImageUrl)
                      }
                      className="flex-1"
                    >
                      <Image
                        source={{
                          uri: data.bookingImages.pickup.afterImageUrl,
                        }}
                        style={{ height: 90, width: "100%" }}
                        contentFit="cover"
                      />
                      <View className="p-2">
                        <Text className="text-xs text-center text-gray-600">
                          After Loading
                        </Text>
                      </View>
                    </Pressable>
                  )}
                </View>
              </View>

              {/* Dropoff Section */}
              <View className="gap-2">
                <Text className="text-xs font-bold text-gray-500">
                  Delivery Confirmation
                </Text>

                <View className="flex-row gap-2">
                  {data.bookingImages.dropoff.receiptImageUrl && (
                    <Pressable
                      onPress={() =>
                        openImageViewer(
                          data.bookingImages.dropoff.receiptImageUrl
                        )
                      }
                      className="flex-1"
                    >
                      <Image
                        source={{
                          uri: data.bookingImages.dropoff.receiptImageUrl,
                        }}
                        style={{ height: 90, width: "100%" }}
                        contentFit="cover"
                      />
                      <View className="p-2">
                        <Text className="text-xs text-center text-gray-600">
                          Receipt
                        </Text>
                      </View>
                    </Pressable>
                  )}

                  {data.bookingImages.dropoff.packageImageUrl && (
                    <Pressable
                      onPress={() =>
                        openImageViewer(
                          data.bookingImages.dropoff.packageImageUrl
                        )
                      }
                      className="flex-1"
                    >
                      <Image
                        source={{
                          uri: data.bookingImages.dropoff.packageImageUrl,
                        }}
                        style={{ height: 90, width: "100%" }}
                        contentFit="cover"
                      />
                      <View className="p-2">
                        <Text className="text-xs text-center text-gray-600">
                          Delivered Package
                        </Text>
                      </View>
                    </Pressable>
                  )}
                </View>
              </View>
            </View>
          </View>

          {/* Selected Services */}
          {(hasFreeServices || hasAddedServices) && (
            <SelectedServices
              addedServices={data.addedServices}
              hasFreeServices={hasFreeServices}
              hasAddedServices={hasAddedServices}
              totalServicesPrice={totalServicesPrice}
              freeServices={data.selectedVehicle?.freeServices}
            />
          )}

          {/* Item Type */}
          {data.itemType && (
            <ItemType itemType={data.itemType} />
          )}

          {/* Note */}
          {data.note && (
            <Note note={data.note} />
          )}

          {/* Images */}
          {data.photos && data.photos.length > 0 && (
            <AttachedImages photos={data.photos} setImageViewerVisible={setIsImageViewVisible} setSelectedImageUrl={setSelectedImage} />
          )}

        </ScrollView>

        {/* Floating Rating Card */}
        {showRatingCard && (
          <View
            style={{
              position: "absolute",
              bottom: insets.bottom + 10,
              left: 16,
              right: 16,
              backgroundColor: "white",
              borderRadius: 16,
              padding: 16,
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 5,
            }}
          >
            <View className="flex-row items-center justify-between mb-3">
              <Text className="text-base font-semibold text-gray-800">
                Rate this driver
              </Text>
              <Pressable
                onPress={() => setShowRatingCard(false)}
                hitSlop={{ top: 10, left: 10, bottom: 10, right: 10 }}
              >
                <Ionicons name="close" size={24} color="#666" />
              </Pressable>
            </View>

            {/* Star Rating */}
            <View className="flex-row items-center justify-center gap-2 mb-4">
              {[1, 2, 3, 4, 5].map((star) => (
                <Pressable
                  key={star}
                  onPress={() => setUserRating(star)}
                  className="active:scale-110"
                >
                  <Ionicons
                    name={star <= userRating ? "star" : "star-outline"}
                    size={40}
                    color={star <= userRating ? "#FFD700" : "#D1D5DB"}
                  />
                </Pressable>
              ))}
            </View>

            {/* Rate Button */}
            <Pressable
              onPress={handleRateDriver}
              disabled={userRating === 0 || isPending}
              className={`py-3 rounded-xl ${userRating > 0 ? "bg-lightPrimary" : "bg-gray-300"
                }`}
            >
              <Text className="text-base font-semibold text-center text-white">
                {isPending
                  ? "Please wait..."
                  : userRating > 0
                    ? `Rate ${userRating} Star${userRating > 1 ? "s" : ""}`
                    : "Select Rating"}
              </Text>
            </Pressable>
            {error && (
              <Text className="mt-2 text-sm text-center text-red-500">
                {error.response?.data?.message ??
                  "Failed to submit rating. Please try again."}
              </Text>
            )}
          </View>
        )}
      </View>
      <ImageView
        images={[{ uri: selectedImage }]}
        imageIndex={0}
        visible={isImageViewVisible}
        onRequestClose={() => setIsImageViewVisible(false)}
      />
    </Modal>
  );
}
