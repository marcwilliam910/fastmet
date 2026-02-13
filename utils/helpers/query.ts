import { queryClient } from "@/lib/queryClient";
import { useAppStore } from "@/store/useAppStore";
import { Notification, NotificationsResponse } from "@/types/notification";
import { NOTIFICATION_TYPES } from "@/utils/notification";
import { InfiniteData } from "@tanstack/react-query";

export const updateNotificationHelper = (
  notification: Notification,
  unreadNotifications: number,
  type: NOTIFICATION_TYPES,
) => {
  useAppStore.getState().setUnreadNotificationCount(unreadNotifications);

  const notificationsQueries = queryClient.getQueriesData<
    InfiniteData<NotificationsResponse>
  >({ queryKey: ["notifications"] });

  const hasNotificationsCache = notificationsQueries.some(
    ([, data]) => !!data?.pages?.length,
  );

  if (hasNotificationsCache) {
    queryClient.setQueriesData<InfiniteData<NotificationsResponse>>(
      { queryKey: ["notifications"] },
      (old) => {
        if (!old?.pages?.length) return old;

        // Check if notification for this booking already exists
        let notificationExists = false;

        const updatedPages = old.pages.map((page) => ({
          ...page,
          notifications: page.notifications.map((n) => {
            // Update existing notification for the same booking
            if (
              n.type === type &&
              n.data?.bookingId === notification.data?.bookingId
            ) {
              notificationExists = true;
              // Replace with the updated notification from server
              return {
                ...notification,
                isRead: false, // Ensure it's marked as unread
              };
            }
            return n;
          }),
        }));

        // If notification doesn't exist, add it to the first page
        if (!notificationExists) {
          updatedPages[0] = {
            ...updatedPages[0],
            notifications: [notification, ...updatedPages[0].notifications],
          };
        }

        return {
          ...old,
          pages: updatedPages,
        };
      },
    );
  }

  queryClient.setQueryData(["notificationUnreadCount"], {
    unreadCount: unreadNotifications,
  });
};
