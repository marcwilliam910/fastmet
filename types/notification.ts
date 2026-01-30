export interface Notification {
  _id: string;
  userId: string;
  userType: "Client" | "Driver" | "All";
  isBroadcast: boolean;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  readAt: string | null;
  data?: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

// Backend API response structure
export interface NotificationsApiResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    pagination: {
      currentPage: number;
      hasNextPage: boolean;
      hasPrevPage: boolean;
      limit: number;
      totalCount: number;
      totalPages: number;
    };
  };
}

// Transformed response for the app
export interface NotificationsResponse {
  notifications: Notification[];
  nextPage: number | null;
  totalCount: number;
}

export interface UnreadCountResponse {
  unreadCount: number;
}
