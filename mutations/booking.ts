import { rateDriver } from "@/api/book";
import { queryClient } from "@/lib/queryClient";
import { useMutation } from "@tanstack/react-query";
import { AxiosError } from "axios";
import Toast from "react-native-toast-message";

interface RateDriverParams {
  bookingId: string;
  rating: number;
}

interface RateDriverResponse {
  message: string;
  driverRating: {
    average: number;
    count: number;
  };
}

export const useRateDriverMutation = () =>
  useMutation<
    RateDriverResponse,
    AxiosError<{ message: string }>,
    { bookingId: string; rating: number }
  >({
    mutationFn: ({ bookingId, rating }: RateDriverParams) =>
      rateDriver(bookingId, rating),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userBookings", "completed"],
        exact: false,
      });

      Toast.show({
        type: "success",
        text1: "Driver rated successfully!",
        text2: "Thank you for your feedback",
        position: "top",
        visibilityTime: 3000,
        swipeable: true,
        topOffset: 50,
      });
    },
    onError: (error) => {
      console.error("Error rating driver:", error);

      Toast.show({
        type: "error",
        text1: "Failed to rate driver",
        text2: error.response?.data?.message || "Please try again",
        position: "top",
        visibilityTime: 3000,
        swipeable: true,
        topOffset: 50,
      });
    },
  });

// export const useCancelBookingMutation = () =>
//   useMutation<
//     { message: string },
//     AxiosError<{ message: string }>,
//     { bookingId: string; status: string }
//   >({
//     mutationFn: ({
//       bookingId,
//       status,
//     }: {
//       bookingId: string;
//       status: string;
//     }) => cancelBooking(bookingId, status),
//     onSuccess: () => {
//       queryClient.invalidateQueries({
//         queryKey: ["userBookings", "pending"],
//         exact: false,
//       });
//       Toast.show({
//         type: "success",
//         text1: "Booking Cancelled",
//         text2: "Successfully cancelled booking",
//         position: "top",
//         visibilityTime: 3000,
//         swipeable: true,
//         topOffset: 50,
//       });
//     },
//     onError: (error) => {
//       Toast.show({
//         type: "error",
//         text1: "Failed to cancel booking",
//         text2: error.response?.data?.message || "Please try again",
//         position: "top",
//         visibilityTime: 3000,
//         swipeable: true,
//         topOffset: 50,
//       });
//     },
//   });
