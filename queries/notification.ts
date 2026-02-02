import {
  fetchNotifications,
  fetchUnreadCount,
  markAllNotificationsAsRead,
  markNotificationAsRead,
} from "@/api/notification";
import {useAuth} from "@/hooks/useAuth";
import {queryClient} from "@/lib/queryClient";
import {useAppStore} from "@/store/useAppStore";
import {useInfiniteQuery, useMutation, useQuery} from "@tanstack/react-query";

export const useNotifications = (limit = 10) => {
  const {isLoggedIn} = useAuth();

  return useInfiniteQuery({
    queryKey: ["notifications", limit],
    queryFn: ({pageParam = 1}) => fetchNotifications(pageParam, limit),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    enabled: isLoggedIn,
  });
};

export const useUnreadNotificationCount = () => {
  const {isLoggedIn} = useAuth();
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
    // refetchInterval: 30000, // Refetch every 30 seconds
  });
};

export const useMarkNotificationAsRead = () => {
  return useMutation({
    mutationFn: (notificationId: string) =>
      markNotificationAsRead(notificationId),
    onSuccess: () => {
      // Invalidate queries to refresh the list and count
      queryClient.invalidateQueries({queryKey: ["notifications"]});
      queryClient.invalidateQueries({queryKey: ["notificationUnreadCount"]});
    },
  });
};

export const useMarkAllNotificationsAsRead = () => {
  return useMutation({
    mutationFn: markAllNotificationsAsRead,
    onSuccess: () => {
      // Invalidate queries to refresh the list and count
      queryClient.invalidateQueries({queryKey: ["notifications"]});
      queryClient.invalidateQueries({queryKey: ["notificationUnreadCount"]});
    },
  });
};
