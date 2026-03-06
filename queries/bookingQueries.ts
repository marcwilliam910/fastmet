import { getBookingById, getBookingsCounts, getUserBookings } from "@/api/book";
import { LocationDetails } from "@/types/book";
import { fetchDrivingDistance } from "@/utils/helpers/calculatePrice";
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

export const useDrivingDistance = (
  pickUp: LocationDetails | null,
  dropOff: LocationDetails | null,
  vehicleType: string | undefined,
) => {
  return useQuery({
    queryKey: [
      "drivingDistance",
      pickUp?.coords.lat,
      pickUp?.coords.lng,
      dropOff?.coords.lat,
      dropOff?.coords.lng,
      vehicleType,
    ],
    queryFn: () => fetchDrivingDistance(pickUp!, dropOff!, vehicleType!),
    enabled: !!pickUp && !!dropOff && !!vehicleType,
    staleTime: Infinity,
    gcTime: 1000 * 60 * 60, // cache kept in memory for 10 min after unmount
  });
};
