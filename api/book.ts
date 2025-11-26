import api from "@/lib/axios";
import { Booking } from "@/types/book";

export const getUserBookings = async (
  userId: string,
  status: string,
  page = 1,
  limit = 5
): Promise<{ bookings: Booking[]; nextPage: number | null }> => {
  const res = await api.get(`/booking/${userId}`, {
    params: { status, page, limit },
  });
  return res.data;
};
