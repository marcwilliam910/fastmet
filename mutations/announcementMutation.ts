import { markNotificationAsRead } from "@/api/notification";
import { queryClient } from "@/lib/queryClient";
import { useAppStore } from "@/store/useAppStore";
import { AnnouncementItem } from "@/types/announcement";
import { InfiniteData, useMutation } from "@tanstack/react-query";

type AnnouncementsPage = {
  items: AnnouncementItem[];
  page: number;
  nextPage: number | null;
};

type UnreadCountResponse = { unreadCount: number };

export const useMarkAnnouncementAsRead = () => {
  const setUnreadAnnouncementCount = useAppStore(
    (state) => state.setUnreadAnnouncementCount,
  );

  return useMutation({
    mutationFn: (notificationId: string) =>
      markNotificationAsRead(notificationId),
    onMutate: async (notificationId: string) => {
      await queryClient.cancelQueries({ queryKey: ["announcements"] });
      await queryClient.cancelQueries({
        queryKey: ["announcementUnreadCount"],
      });

      const prevStoreCount = useAppStore.getState().unreadAnnouncementCount;

      const previousUnreadCount = queryClient.getQueryData<UnreadCountResponse>(
        ["announcementUnreadCount"],
      );

      const previousAnnouncementsQueries = queryClient.getQueriesData<
        InfiniteData<AnnouncementsPage>
      >({ queryKey: ["announcements"] });

      let foundInCache = false;
      let wasUnread = false;
      for (const [, data] of previousAnnouncementsQueries) {
        if (!data?.pages?.length) continue;
        for (const page of data.pages) {
          const match = page.items?.find((n) => n._id === notificationId);
          if (match) {
            foundInCache = true;
            wasUnread = match.source === "notification" && !match.isRead;
            break;
          }
        }
        if (foundInCache) break;
      }

      queryClient.setQueriesData<InfiniteData<AnnouncementsPage>>(
        { queryKey: ["announcements"] },
        (old) => {
          if (!old?.pages?.length) return old;
          return {
            ...old,
            pages: old.pages.map((page) => ({
              ...page,
              items: page.items.map((n) =>
                n._id === notificationId && n.source === "notification"
                  ? { ...n, isRead: true }
                  : n,
              ),
            })),
          };
        },
      );

      const baseCount = previousUnreadCount?.unreadCount ?? prevStoreCount;
      const shouldDecrement = wasUnread || (!foundInCache && baseCount > 0);

      if (shouldDecrement) {
        const nextCount = Math.max(0, baseCount - 1);
        queryClient.setQueryData<UnreadCountResponse>(
          ["announcementUnreadCount"],
          { unreadCount: nextCount },
        );
        setUnreadAnnouncementCount(nextCount);
      }

      return {
        previousAnnouncementsQueries,
        previousUnreadCount,
        prevStoreCount,
      };
    },
    onError: (_err, _notificationId, context) => {
      if (!context) return;

      for (const [key, data] of context.previousAnnouncementsQueries) {
        queryClient.setQueryData(key, data);
      }

      if (context.previousUnreadCount) {
        queryClient.setQueryData(
          ["announcementUnreadCount"],
          context.previousUnreadCount,
        );
        setUnreadAnnouncementCount(context.previousUnreadCount.unreadCount);
      } else {
        setUnreadAnnouncementCount(context.prevStoreCount);
      }
    },
  });
};
