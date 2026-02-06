import { queryClient } from "@/lib/queryClient";
import { Booking, RequestedDriver } from "@/types/book";
import Toast from "react-native-toast-message";
import { Socket } from "socket.io-client";

// export const bookingExpired = (socket: Socket) => {
//   const handleBookingExpired = ({ message }: { message: string }) => {
//     Toast.show({
//       type: "error",
//       text1: "Request Expired",
//       text2: message,
//       position: "top",
//       visibilityTime: 5_000,
//       swipeable: true,
//       topOffset: 50,
//     });

//     useAppStore.getState().clearStates();

//     // Navigate to home - works from any screen
//     router.replace("/(drawer)/book");
//   };

//   socket.on("bookingExpired", handleBookingExpired);
//   return () => socket.off("bookingExpired", handleBookingExpired);
// };

export const acceptanceRequestedSchedule = (socket: Socket) => {
  const handleAcceptanceRequestedSchedule = ({
    driverOffer,
  }: {
    driverOffer: RequestedDriver;
  }) => {
    // Update ALL pending bookings queries regardless of limit
    queryClient.setQueriesData(
      { queryKey: ["userBookings", "pending"] }, // Partial match
      (oldData: any) => {
        if (!oldData?.pages) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            bookings: page.bookings.map((booking: Booking) => {
              if (booking._id === driverOffer.bookingId) {
                return {
                  ...booking,
                  requestedDrivers: [
                    ...(booking.requestedDrivers || []),
                    driverOffer,
                  ],
                };
              }
              return booking;
            }),
          })),
        };
      },
    );

    Toast.show({
      type: "success",
      text1: "New Driver Offer!",
      text2: `${driverOffer.name} has offered`,
    });
  };

  socket.on("acceptanceRequestedSchedule", handleAcceptanceRequestedSchedule);
  return () =>
    socket.off(
      "acceptanceRequestedSchedule",
      handleAcceptanceRequestedSchedule,
    );
};
