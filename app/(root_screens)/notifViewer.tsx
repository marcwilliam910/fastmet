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
  const { driverName, driverRating, driverProfilePicture } = data;

  return (
    <View className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
      <View className="flex-row items-center">
        <View className="bg-blue-100 rounded-full size-12 justify-center items-center mr-4">
          <Image
            source={
              driverProfilePicture
                ? { uri: driverProfilePicture }
                : STATIC_IMAGES.userPlaceholder
            }
            style={{
              width: 48,
              height: 48,
              borderRadius: 24,
              borderWidth: 1,
              borderColor: "skyblue"
            }}
          />
        </View>
        <View className="flex-1">
          <Text className="text-sm text-gray-500 mb-1">Driver</Text>
          <Text className="text-lg font-bold text-gray-900">{driverName}</Text>
          {driverRating && (
            <View className="flex-row items-center mt-1">
              <Ionicons name="star" size={14} color="#F59E0B" />
              <Text className="text-sm text-gray-600 ml-1">
                {driverRating.toFixed(1)}
              </Text>
            </View>
          )}
        </View>
      </View>
    </View>
  );
};

// Booking Expired notification content
const BookingExpiredContent = ({ data }: { data: Record<string, any> }) => {
  const { pickUp, dropOff } = data;

  return (
    <View className="space-y-3">
      {/* Pick-up */}
      {pickUp && (
        <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <View className="flex-row items-start">
            <View className="bg-green-100 rounded-full size-10 justify-center items-center mr-3">
              <Ionicons name="location" size={20} color="#10B981" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-500 mb-1">Pick-up</Text>
              <Text className="text-base font-semibold text-gray-900">
                {pickUp.name}
              </Text>
              {formatLocation(pickUp) && (
                <Text className="text-sm text-gray-500 mt-1">
                  {formatLocation(pickUp)}
                </Text>
              )}
            </View>
          </View>
        </View>
      )}

      {/* Drop-off */}
      {dropOff && (
        <View className="bg-gray-50 rounded-xl p-4 border border-gray-200">
          <View className="flex-row items-start">
            <View className="bg-red-100 rounded-full size-10 justify-center items-center mr-3">
              <Ionicons name="flag" size={20} color="#EF4444" />
            </View>
            <View className="flex-1">
              <Text className="text-xs text-gray-500 mb-1">Drop-off</Text>
              <Text className="text-base font-semibold text-gray-900">
                {dropOff.name}
              </Text>
              {formatLocation(dropOff) && (
                <Text className="text-sm text-gray-500 mt-1">
                  {formatLocation(dropOff)}
                </Text>
              )}
            </View>
          </View>
        </View>
      )}
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