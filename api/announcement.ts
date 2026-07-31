import api from "@/lib/axios";

export const fetchAnnouncements = async (page: number, limit: number) => {
  const { data } = await api.get("/announcements", { params: { page, limit } });
  return data;
};

export const fetchAnnouncementUnreadCount = async (): Promise<{
  unreadCount: number;
}> => {
  const res = await api.get<{
    success: boolean;
    data: { unreadCount: number };
  }>("/announcements/unread");
  return res.data.data;
};

export const fetchNewsById = async (id: string) => {
  const { data } = await api.get(`/news/${id}`);
  return data.news;
};
