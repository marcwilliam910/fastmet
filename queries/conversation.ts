import {
  fetchConversations,
  getConversationById,
  getConversationsByName,
} from "@/api/conversation";
import { useAuth } from "@/hooks/useAuth";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useConversations = (limit: number) => {
  const { isLoggedIn } = useAuth();
  return useInfiniteQuery({
    queryKey: ["conversations", limit],
    queryFn: ({ pageParam = 1 }) => fetchConversations(pageParam, limit),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
    enabled: isLoggedIn,
  });
};

export const useConversationById = (conversationId: string) => {
  return useQuery({
    queryKey: ["conversation", conversationId],
    queryFn: () => getConversationById(conversationId),
    enabled: !!conversationId,
  });
};

export const useConversationsByName = (name: string) => {
  return useQuery({
    queryKey: ["conversations", "search", name],
    queryFn: () => getConversationsByName(name),
    enabled: name.trim().length > 0,
  });
};
