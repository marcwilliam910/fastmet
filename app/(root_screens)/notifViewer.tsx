import {useMarkNotificationAsRead} from "@/queries/notification";
import {useAppStore} from "@/store/useAppStore";
import {formatDate} from "@/utils/date";
import {Ionicons} from "@expo/vector-icons";
import {router, useLocalSearchParams} from "expo-router";
import React, {useEffect} from "react";
import {Pressable, ScrollView, Text, View} from "react-native";

const NotifViewer = () => {
  const {notificationId} = useLocalSearchParams<{notificationId: string}>();

  // Get notification from store by ID
  const notification = useAppStore((state) =>
    state.getNotificationById(notificationId || ""),
  );

  const {mutate: markAsRead} = useMarkNotificationAsRead();

  // Mark as read when viewing
  useEffect(() => {
    if (notification && !notification.isRead && notificationId) {
      markAsRead(notificationId);
    }
  }, [notification, notificationId]);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case "booking_accepted":
        return "checkmark-circle";
      case "booking_completed":
        return "checkmark-done-circle";
      case "booking_cancelled":
        return "close-circle";
      case "driver_arrived":
        return "location";
      case "driver_on_the_way":
        return "car";
      case "payment":
        return "card";
      case "promo":
        return "gift";
      case "system":
        return "information-circle";
      default:
        return "notifications";
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case "booking_accepted":
        return "#22C55E"; // green
      case "booking_completed":
        return "#22C55E"; // green
      case "booking_cancelled":
        return "#EF4444"; // red
      case "driver_arrived":
        return "#3B82F6"; // blue
      case "driver_on_the_way":
        return "#FFA840"; // orange
      case "payment":
        return "#8B5CF6"; // purple
      case "promo":
        return "#EC4899"; // pink
      case "system":
        return "#6B7280"; // gray
      default:
        return "#FFA840"; // orange
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "booking_accepted":
        return "Booking Accepted";
      case "booking_completed":
        return "Booking Completed";
      case "booking_cancelled":
        return "Booking Cancelled";
      case "driver_arrived":
        return "Driver Arrived";
      case "driver_on_the_way":
        return "Driver On The Way";
      case "payment":
        return "Payment";
      case "promo":
        return "Promotion";
      case "system":
        return "System";
      default:
        return type.charAt(0).toUpperCase() + type.slice(1).replace(/_/g, " ");
    }
  };

  if (!notification) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <Ionicons name="notifications-off-outline" size={64} color="#9CA3AF" />
        <Text className="mt-4 text-lg text-gray-400">
          Notification not found
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

  return (
    <ScrollView className="flex-1 bg-white">
      <View className="p-4">
        {/* Header with icon */}
        <View className="items-center py-6">
          <View
            className="justify-center items-center mb-4 rounded-full size-20"
            style={{
              backgroundColor: `${getNotificationColor(notification.type)}20`,
            }}
          >
            <Ionicons
              name={getNotificationIcon(notification.type) as any}
              size={40}
              color={getNotificationColor(notification.type)}
            />
          </View>
          <View
            className="px-3 py-1 mb-2 rounded-full"
            style={{
              backgroundColor: `${getNotificationColor(notification.type)}20`,
            }}
          >
            <Text
              className="text-xs font-semibold"
              style={{color: getNotificationColor(notification.type)}}
            >
              {getTypeLabel(notification.type)}
            </Text>
          </View>
          <Text className="text-sm text-gray-400">
            {formatDate(notification.createdAt)}
          </Text>
        </View>

        {/* Title */}
        <View className="pb-4 mb-4 border-b border-gray-100">
          <Text className="text-xl font-bold text-gray-900">
            {notification.title}
          </Text>
        </View>

        {/* Message */}
        <View className="mb-6">
          <Text className="text-base leading-6 text-justify text-gray-700">
            {notification.message}
          </Text>
        </View>

        {/* Additional data if available */}
        {notification.data && Object.keys(notification.data).length > 0 && (
          <View className="p-4 mb-6 bg-gray-50 rounded-xl">
            <Text className="mb-3 text-sm font-semibold text-gray-600">
              Additional Details
            </Text>
            {Object.entries(notification.data).map(([key, value]) => (
              <View
                key={key}
                className="flex-row justify-between items-center py-2 border-b border-gray-100 last:border-b-0"
              >
                <Text className="text-sm text-gray-500 capitalize">
                  {key.replace(/_/g, " ")}
                </Text>
                <Text className="text-sm font-medium text-gray-700">
                  {typeof value === "object"
                    ? JSON.stringify(value)
                    : String(value)}
                </Text>
              </View>
            ))}
          </View>
        )}
      </View>
    </ScrollView>
  );
};

export default NotifViewer;
