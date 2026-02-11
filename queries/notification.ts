import {
  fetchNotifications,
  fetchUnreadCount,
  getNotificationById,
} from "@/api/notification";
import { useAuth } from "@/hooks/useAuth";
import { useAppStore } from "@/store/useAppStore";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useNotifications = (limit = 10) => {
  const { isLoggedIn } = useAuth();

  return useInfiniteQuery({
    queryKey: ["notifications", limit],
    queryFn: ({ pageParam = 1 }) => fetchNotifications(pageParam, limit),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    enabled: isLoggedIn,
  });
};

export const useUnreadNotificationCount = () => {
  const { isLoggedIn } = useAuth();
  const setUnreadNotificationCount = useAppStore(
    (state) => state.setUnreadNotificationCount,
  );

  return useQuery({
    queryKey: ["notificationUnreadCount"],
    queryFn: async () => {
      const data = await fetchUnreadCount();
      setUnreadNotificationCount(data.unreadCount);
      return data;
    },
    enabled: isLoggedIn,
  });
};

export const useNotificationById = (notificationId: string) => {
  return useQuery({
    queryKey: ["notification", notificationId],
    queryFn: () => getNotificationById(notificationId),
    enabled: !!notificationId,
  });
};
