export type AnnouncementItem =
  | {
      source: "news";
      _id: string;
      title: string;
      excerpt: string;
      heroImage: string;
      tag: "Announcement" | "Drivers" | "Users" | "Guide" | "Updates";
      readTime: number;
      createdAt: string;
      isRead: true;
    }
  | {
      source: "notification";
      _id: string;
      title: string;
      message: string;
      type: string;
      isBroadcast: boolean;
      isRead: boolean;
      createdAt: string;
    };
