import { queryClient } from "@/lib/queryClient";
import { useAppStore } from "@/store/useAppStore";
import { Booking, RequestedDriver } from "@/types/book";
import { router } from "expo-router";
import Toast from "react-native-toast-message";
import { Socket } from "socket.io-client";

// export const bookingAccepted = (socket: Socket) => {
//   const bookingAcceptedHandler = (data: { customerId: string }) => {
//     console.log("✅ Booking accepted:", data);

//     Toast.show({
//       type: "bookingAccepted",
//       text1: "Driver Found! 🎉",
//       text2: "Your driver is on the way",
//       position: "top",
//       visibilityTime: 10_000,
//       swipeable: true,
//       topOffset: 50,
//     });

//     queryClient.invalidateQueries({
//       queryKey: ["userBookings", "active"],
//       exact: false,
//     });

//     queryClient.invalidateQueries({
//       queryKey: ["userBookings", "pending"],
//       exact: false,
//     });

//     queryClient.invalidateQueries({
//       queryKey: ["userBookingCounts"],
//     });
//   };

//   socket.on("bookingAccepted", bookingAcceptedHandler);
//   return () => socket.off("bookingAccepted", bookingAcceptedHandler); // return for cleanup
// };

export const bookingExpired = (socket: Socket) => {
  const handleBookingExpired = ({ message }: { message: string }) => {
    Toast.show({
      type: "error",
      text1: "Request Expired",
      text2: message,
      position: "top",
      visibilityTime: 5_000,
      swipeable: true,
      topOffset: 50,
    });

    useAppStore.getState().clearStates();

    // Navigate to home - works from any screen
    router.replace("/(drawer)/book");
  };

  socket.on("bookingExpired", handleBookingExpired);
  return () => socket.off("bookingExpired", handleBookingExpired);
};

export const acceptanceRequestedSchedule = (socket: Socket) => {
  const handleAcceptanceRequestedSchedule = ({
    driverOffer,
  }: {
    driverOffer: RequestedDriver;
  }) => {
    queryClient.setQueryData(["userBookings", "pending"], (oldData: any) => {
      if (!oldData) return oldData;

      return {
        ...oldData,
        pages: oldData.pages.map((page: any) => ({
          ...page,
          bookings: page.bookings.map((booking: Booking) =>
            booking._id === driverOffer.bookingId
              ? {
                  ...booking,
                  requestedDrivers: [...booking.requestedDrivers, driverOffer],
                }
              : booking,
          ),
        })),
      };
    });

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
