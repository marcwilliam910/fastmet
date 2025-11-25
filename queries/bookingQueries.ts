import { getUserBookings } from "@/api/book";
import { useQuery } from "@tanstack/react-query";

export const useUserBookings = (userId: string) => {
  return useQuery({
    queryKey: ["userBookings", userId],
    queryFn: () => getUserBookings(userId),
  });
};
