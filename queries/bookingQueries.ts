import { getBookingById, getBookingsCounts, getUserBookings } from "@/api/book";
import { useInfiniteQuery, useQuery } from "@tanstack/react-query";

export const useUserBookings = <T>(status: string, limit: number) => {
  return useInfiniteQuery({
    queryKey: ["userBookings", status, limit],
    queryFn: ({ pageParam = 1 }) =>
      getUserBookings<T[]>(status, pageParam, limit),
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

export const useBookingCounts = () => {
  return useQuery({
    queryKey: ["userBookingCounts"],
    queryFn: () => getBookingsCounts(),
  });
};
