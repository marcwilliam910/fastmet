import api from "@/lib/axios";
import { ActiveBooking } from "@/types/book";

export const getUserBookings = async <T>(
  status: string,
  page = 1,
  limit = 5
): Promise<{ bookings: T; nextPage: number | null }> => {
  const res = await api.get<{ bookings: T; nextPage: number | null }>(
    `/booking`,
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

export const getBookingsCounts = async () => {
  const res = await api.get(`/booking/counts`);
  return res.data;
};
