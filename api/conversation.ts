import api from "@/lib/axios";
import { ConversationResponse, MessageResponse } from "@/types/chat";

export const fetchConversations = async (
  page = 1,
  limit = 5,
): Promise<{
  conversations: ConversationResponse[];
  nextPage: number | null;
}> => {
  const res = await api.get<{
    conversations: ConversationResponse[];
    nextPage: number | null;
  }>(`/message/conversations`, { params: { page, limit } });

  return res.data;
};

export const getConversationById = async (
  conversationId: string,
): Promise<MessageResponse> => {
  const response = await api.get(`/message/conversations/${conversationId}`);
  return response.data;
};

export const getConversationsByName = async (
  name: string,
): Promise<{
  conversations: ConversationResponse[];
}> => {
  const response = await api.get<{
    conversations: ConversationResponse[];
  }>(`/message/conversations/name/${encodeURIComponent(name)}`);

  return response.data;
};
