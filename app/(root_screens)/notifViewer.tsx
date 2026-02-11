import { useMarkNotificationAsRead } from "@/mutations/notification";
import { useNotificationById } from "@/queries/notification";
import { STATIC_IMAGES } from "@/utils/constants";
import { formatDate } from "@/utils/date";
import { formatLocation } from "@/utils/helper";
import { getNotificationConfig, NOTIFICATION_TYPES } from "@/utils/notification";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const NotifViewer = () => {
  const { notificationId } = useLocalSearchParams<{ notificationId: string }>();
  const insets = useSafeAreaInsets();

  const { mutate: markAsRead } = useMarkNotificationAsRead();
  const { data: notification, isPending, error } = useNotificationById(notificationId);


  // Mark as read when viewing
  useEffect(() => {
    if (notification && !notification.isRead && notificationId) {
      markAsRead(notificationId);
    }
  }, [markAsRead, notification, notificationId]);

  if (isPending) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#9CA3AF" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Ionicons name="notifications-off-outline" size={64} color="#9CA3AF" />
        <Text className="mt-4 text-lg text-gray-400">
          {error ? error.message : "Notification not found"}
        </Text>
        <Pressable
          className="px-6 py-3 mt-4 rounded-full bg-primary"
          onPress={() => router.back()}
        >
          <Text className="font-semibold text-white">Go Back</Text>
        </Pressable>
      </View>
    );
  }

  const config = getNotificationConfig(notification.type);

  return (
    <ScrollView
      className="flex-1 bg-white"
      contentContainerStyle={{ paddingBottom: insets.bottom }}
    >
      <View className="p-6">
        {/* Header */}
        <View className="items-center mb-8">
          <View
            className="justify-center items-center mb-4 rounded-full size-16"
            style={{ backgroundColor: `${config.color}20` }}
          >
            <Ionicons name={config.icon as any} size={32} color={config.color} />
          </View>
          <Text className="text-2xl font-bold text-gray-900 text-center mb-2">
            {notification.title}
          </Text>
          <Text className="text-sm text-gray-500">
            {formatDate(notification.createdAt)}
          </Text>
        </View>

        {/* Message */}
        <View className="mb-6 px-4">
          <Text className="text-base leading-6 text-gray-600 text-center">
            {notification.message}
          </Text>
        </View>

        {/* Type-specific details */}
        {renderNotificationContent(notification.type, notification.data)}
      </View>
    </ScrollView>
  );
};

export default NotifViewer;

// Type-specific content renderers
// Add new notification types here
const renderNotificationContent = (
  type: NOTIFICATION_TYPES,
  data: Record<string, any> | undefined
) => {
  if (!data) return null;

  switch (type) {
    case "driver_offer":
      return <DriverOfferContent data={data} />;
    case "booking_expired":
      return <BookingExpiredContent data={data} />;
    default:
      return <DefaultContent data={data} />;
  }
};

// Driver Offer notification content
const DriverOfferContent = ({ data }: { data: Record<string, any> }) => {
  const { drivers, pickUp, dropOff } = data;

  if (!drivers || Object.keys(drivers).length === 0) {
    return null;
  }

  const driverEntries = Object.entries(drivers);
  const driverCount = driverEntries.length;

  return (
    <View className="gap-4">
      {/* Route Card - Pick-up and Drop-off connected */}
      <View className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
        <Text className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wide">
          Delivery Route
        </Text>

        <View className="gap-3">
          {/* Pick-up */}
          {pickUp && (
            <View className="flex-row items-start">
              <View className="items-center mr-3">
                <View className="bg-green-500 rounded-full size-10 justify-center items-center">
                  <Ionicons name="location" size={20} color="#FFFFFF" />
                </View>
                {/* Connecting line */}
                {dropOff && (
                  <View className="w-0.5 h-16 bg-gray-300 my-1" />
                )}
              </View>
              <View className="flex-1 pt-1">
                <Text className="text-xs text-gray-500 mb-1">Pick-up</Text>
                <Text className="text-base font-semibold text-gray-900">
                  {pickUp.name}
                </Text>
                {formatLocation(pickUp) && (
                  <Text className="text-sm text-gray-500 mt-0.5">
                    {formatLocation(pickUp)}
                  </Text>
                )}
              </View>
            </View>
          )}

          {/* Drop-off */}
          {dropOff && (
            <View className="flex-row items-start">
              <View className="items-center mr-3">
                <View className="bg-red-500 rounded-full size-10 justify-center items-center">
                  <Ionicons name="flag" size={20} color="#FFFFFF" />
                </View>
              </View>
              <View className="flex-1 pt-1">
                <Text className="text-xs text-gray-500 mb-1">Drop-off</Text>
                <Text className="text-base font-semibold text-gray-900">
                  {dropOff.name}
                </Text>
                {formatLocation(dropOff) && (
                  <Text className="text-sm text-gray-500 mt-0.5">
                    {formatLocation(dropOff)}
                  </Text>
                )}
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Drivers Section - Clearly separated */}
      <View className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-xs font-semibold text-blue-700 uppercase tracking-wide">
            Available Drivers
          </Text>
          <View className="bg-blue-200 rounded-full px-3 py-1">
            <Text className="text-xs font-bold text-blue-900">
              {driverCount}
            </Text>
          </View>
        </View>

        {driverEntries.map(([driverId, driver]: [string, any], index) => (
          <View
            key={driverId}
            className={index > 0 ? "mt-4 pt-4 border-t border-blue-200" : ""}
          >
            <View className="flex-row items-center">
              <Image
                source={
                  driver.driverProfilePicture
                    ? { uri: driver.driverProfilePicture }
                    : STATIC_IMAGES.userPlaceholder
                }
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 26,
                  borderWidth: 2,
                  borderColor: "#DBEAFE",
                  marginRight: 12,
                }}
              />
              <View className="flex-1">
                <Text className="text-base font-bold text-gray-900">
                  {driver.driverName}
                </Text>
                {driver.driverRating && (
                  <View className="flex-row items-center mt-1">
                    <Ionicons name="star" size={16} color="#F59E0B" />
                    <Text className="text-sm font-semibold text-gray-700 ml-1">
                      {driver.driverRating.toFixed(1)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

// Booking Expired notification content
const BookingExpiredContent = ({ data }: { data: Record<string, any> }) => {
  const { pickUp, dropOff } = data;

  return (
    <View className="bg-gray-50 rounded-2xl p-5 border border-gray-200">
      <Text className="text-xs font-semibold text-gray-500 mb-4 uppercase tracking-wide">
        Delivery Route
      </Text>

      <View className="gap-3">
        {/* Pick-up */}
        {pickUp && (
          <View className="flex-row items-start">
            <View className="items-center mr-3">
              <View className="bg-green-500 rounded-full size-10 justify-center items-center">
                <Ionicons name="location" size={20} color="#FFFFFF" />
              </View>
              {/* Connecting line */}
              {dropOff && (
                <View className="w-0.5 h-16 bg-gray-300 my-1" />
              )}
            </View>
            <View className="flex-1 pt-1">
              <Text className="text-xs text-gray-500 mb-1">Pick-up</Text>
              <Text className="text-base font-semibold text-gray-900">
                {pickUp.name}
              </Text>
              {formatLocation(pickUp) && (
                <Text className="text-sm text-gray-500 mt-0.5">
                  {formatLocation(pickUp)}
                </Text>
              )}
            </View>
          </View>
        )}

        {/* Drop-off */}
        {dropOff && (
          <View className="flex-row items-start">
            <View className="items-center mr-3">
              <View className="bg-red-500 rounded-full size-10 justify-center items-center">
                <Ionicons name="flag" size={20} color="#FFFFFF" />
              </View>
            </View>
            <View className="flex-1 pt-1">
              <Text className="text-xs text-gray-500 mb-1">Drop-off</Text>
              <Text className="text-base font-semibold text-gray-900">
                {dropOff.name}
              </Text>
              {formatLocation(dropOff) && (
                <Text className="text-sm text-gray-500 mt-0.5">
                  {formatLocation(dropOff)}
                </Text>
              )}
            </View>
          </View>
        )}
      </View>
    </View>

  );
};

// Default fallback content for unknown notification types
const DefaultContent = ({ data }: { data: Record<string, any> }) => {
  const displayableData = Object.entries(data).filter(
    ([key, value]) =>
      key !== "bookingId" &&
      key !== "_id" &&
      key !== "driverId" &&
      value !== null &&
      value !== undefined &&
      typeof value !== "object"
  );

  if (displayableData.length === 0) return null;

  return (
    <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
      {displayableData.map(([key, value], index) => (
        <View key={key}>
          <View className="py-2">
            <Text className="text-xs text-gray-500 mb-1">
              {key.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}
            </Text>
            <Text className="text-base font-semibold text-gray-900">
              {String(value)}
            </Text>
          </View>
          {index < displayableData.length - 1 && (
            <View className="h-px bg-gray-200" />
          )}
        </View>
      ))}
    </View>
  );
};