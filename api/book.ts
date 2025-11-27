import api from "@/lib/axios";
import { ActiveBooking } from "@/types/book";

export const getUserBookings = async <T>(
  userId: string,
  status: string,
  page = 1,
  limit = 5
): Promise<{ bookings: T; nextPage: number | null }> => {
  const res = await api.get<{ bookings: T; nextPage: number | null }>(
    `/booking/${userId}`,
    { params: { status, page, limit } }
  );

  return res.data;
};

export const getBookingById = async (
  bookingId: string
): Promise<ActiveBooking> => {
  const res = await api.get(`/booking/live/${bookingId}`);
  return res.data;
};
