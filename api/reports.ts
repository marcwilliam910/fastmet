import api from "@/lib/axios";
import {Booking} from "@/types/book";
import {Report, ReportReply, ReportSubmission} from "@/types/report";

export const reportAPI = {
  // Get eligible bookings for filing reports
  getEligibleBookings: async (): Promise<{bookings: Booking[]}> => {
    const response = await api.get("/reports/eligible-bookings");
    return response.data;
  },

  // Submit a new report
  submit: async (data: ReportSubmission): Promise<{report: Report}> => {
    const formData = new FormData();
    formData.append("bookingId", data.bookingId);
    formData.append("category", data.category);
    formData.append("description", data.description);

    if (data.images) {
      data.images.forEach((image, index) => {
        formData.append("images", {
          uri: image.uri,
          type: image.type || "image/jpeg",
          name: image.fileName || `image_${index}.jpg`,
        } as any);
      });
    }

    const response = await api.post("/reports", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    console.log(response.data);

    return response.data;
  },

  // Get my reports (filed or received)
  getReports: async (params: {
    type?: "filed" | "received";
    status?: "pending" | "resolved" | "dismissed";
    limit?: number;
    offset?: number;
  }): Promise<{
    reports: Report[];
    total: number;
    limit: number;
    offset: number;
  }> => {
    const response = await api.get("/reports", {params});
    return response.data;
  },

  // Get report by ID
  getReportById: async (reportId: string): Promise<{report: Report}> => {
    const response = await api.get(`/reports/${reportId}`);
    return response.data;
  },

  // Reply to a report
  reply: async (
    reportId: string,
    message: string,
  ): Promise<{message: string; reply: ReportReply}> => {
    const response = await api.post(`/reports/${reportId}/reply`, {
      message,
    });
    return response.data;
  },
};
