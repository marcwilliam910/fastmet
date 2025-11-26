import { getUserBookings } from "@/api/book";
import { useInfiniteQuery } from "@tanstack/react-query";

export const useUserBookings = (
  userId: string,
  status: string,
  limit: number
) => {
  return useInfiniteQuery({
    queryKey: ["userBookings", userId, status],
    queryFn: ({ pageParam = 1 }) =>
      getUserBookings(userId, status, pageParam, limit),
    getNextPageParam: (lastPage) => lastPage.nextPage,
    initialPageParam: 1,
  });
};
