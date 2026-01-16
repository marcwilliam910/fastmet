export type ConversationResponse = {
  _id: string;
  lastMessage: string;
  lastMessageBy: "client" | "driver";
  lastMessageAt: string;

  participantId: string;
  unreadCount: {
    client: number;
    driver: number;
  };
  driver: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePictureUrl?: string;
    phoneNumber: string;
  };
};

export type MessageResponse = {
  _id: string;
  driver: {
    _id: string;
    firstName: string;
    lastName: string;
    profilePictureUrl?: string;
    phoneNumber: string;
  };
};
