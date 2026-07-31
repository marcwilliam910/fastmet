import {
  fetchAnnouncements,
  fetchAnnouncementUnreadCount,
  fetchNewsById,
} from "@/api/announcement";
import {useAuth} from "@/hooks/useAuth";
import {useAppStore} from "@/store/useAppStore";
import {useInfiniteQuery, useQuery} from "@tanstack/react-query";

export const useAnnouncements = (limit = 10) => {
  const {isLoggedIn} = useAuth();

  return useInfiniteQuery({
    queryKey: ["announcements", limit],
    queryFn: ({pageParam = 1}) => fetchAnnouncements(pageParam, limit),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    enabled: isLoggedIn,
  });
};

export const useAnnouncementUnreadCount = () => {
  const {isLoggedIn} = useAuth();
  const setUnreadAnnouncementCount = useAppStore(
    (state) => state.setUnreadAnnouncementCount,
  );

  return useQuery({
    queryKey: ["announcementUnreadCount"],
    queryFn: async () => {
      const data = await fetchAnnouncementUnreadCount();
      setUnreadAnnouncementCount(data.unreadCount);
      return data;
    },
    enabled: isLoggedIn,
  });
};

export const useNews = (id: string) =>
  useQuery({
    queryKey: ["news", id],
    queryFn: () => fetchNewsById(id),
    enabled: !!id,
  });
