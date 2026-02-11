import api from "@/lib/axios";
import {
  Notification,
  NotificationsApiResponse,
  NotificationsResponse,
  UnreadCountResponse,
} from "@/types/notification";

export const fetchNotifications = async (
  page = 1,
  limit = 10,
): Promise<NotificationsResponse> => {
  const res = await api.get<NotificationsApiResponse>("/notifications", {
    params: { page, limit },
  });

  const { data } = res.data;
  const { pagination, notifications } = data;

  // Transform to expected format
  return {
    notifications,
    nextPage: pagination.hasNextPage ? pagination.currentPage + 1 : null,
    totalCount: pagination.totalCount,
  };
};

export const fetchUnreadCount = async (): Promise<UnreadCountResponse> => {
  const res = await api.get<{ success: boolean; data: UnreadCountResponse }>(
    "/notifications/unread",
  );
  return res.data.data;
};

export const markNotificationAsRead = async (
  notificationId: string,
): Promise<Notification> => {
  const res = await api.patch<{
    success: boolean;
    message: string;
    data: Notification;
  }>(`/notifications/read/${notificationId}`);
  return res.data.data;
};

export const markAllNotificationsAsRead = async (): Promise<{
  message: string;
  modifiedCount: number;
}> => {
  const res = await api.patch<{
    success: boolean;
    message: string;
    data: { modifiedCount: number };
  }>("/notifications/read-all");
  return {
    message: res.data.message,
    modifiedCount: res.data.data.modifiedCount,
  };
};

export const getNotificationById = async (
  notificationId: string,
): Promise<Notification> => {
  const response = await api.get(
    `/notifications/get-notification/${notificationId}`,
  );
  return response.data;
};
