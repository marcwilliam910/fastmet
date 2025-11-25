import api from "@/lib/axios";
import { Booking } from "@/types/book";

export async function getUserBookings(userId: string): Promise<Booking[]> {
  const res = await api.get<Booking[]>(`/booking/${userId}`);
  return res.data;
}
