import { getBookingById, getBookingsCounts, getUserBookings } from "@/api/book";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useUserBookings = <T>(
  userId: string,
  status: string,
  limit: number
) => {
  return useInfiniteQuery({
    queryKey: ["userBookings", userId, status, limit],
    queryFn: ({ pageParam = 1 }) =>
      getUserBookings<T[]>(userId, status, pageParam, limit),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });
};

export const useBooking = (bookingId: string) => {
  return useQuery({
    queryKey: ["userBooking", bookingId],
    queryFn: () => getBookingById(bookingId),
    enabled: !!bookingId,
  });
};

export const useBookingCounts = (userId: string) => {
  return useQuery({
    queryKey: ["userBookingCounts", userId],
    queryFn: () => getBookingsCounts(userId),
    enabled: !!userId,
  });
};
