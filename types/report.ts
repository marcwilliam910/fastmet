export interface Report {
  _id: string;
  reportId: string;
  bookingId: {
    _id: string;
    bookingRef: string;
    status: string;
  };
  reportedBy: "client" | "driver";
  reporterId: string | { _id: string; firstName: string; lastName: string };
  reportedAgainst: "client" | "driver";
  reportedAgainstId: string | { _id: string; firstName: string; lastName: string };
  category: string;
  categoryLabel: string;
  description: string;
  images: string[];
  status: "pending" | "resolved" | "dismissed";
  reply: ReportReply | null;
  resolvedBy: string | null;
  resolvedAt: string | null;
  adminNotes: string | null;
  penaltyApplied: "none" | "warning" | "suspension" | "deactivation" | null;
  createdAt: string;
  updatedAt: string;
}

export interface ReportReply {
  message: string;
  repliedBy: "client" | "driver";
  repliedAt: string;
}

export interface ReportSubmission {
  bookingId: string;
  category: string;
  description: string;
  images?: {
    uri: string;
    type?: string;
    fileName?: string;
  }[];
}

export interface CategoryOption {
  category: string;
  label: string;
}
