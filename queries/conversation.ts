import { fetchConversations, getConversationById } from "@/api/conversation";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useConversations = (limit: number) => {
  return useInfiniteQuery({
    queryKey: ["conversations"],
    queryFn: ({ pageParam = 1 }) => fetchConversations(pageParam, limit),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });
};

export const useConversationById = (conversationId: string) => {
  return useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => getConversationById(conversationId),
    enabled: !!conversationId,
  });
};
