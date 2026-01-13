import { queryClient } from "@/lib/queryClient";
import Toast from "react-native-toast-message";
import { Socket } from "socket.io-client";

export const bookingAccepted = (socket: Socket) => {
  const bookingAcceptedHandler = (data: { customerId: string }) => {
    console.log("✅ Booking accepted:", data);

    Toast.show({
      type: "bookingAccepted",
      text1: "Driver Found! 🎉",
      text2: "Your driver is on the way",
      position: "top",
      visibilityTime: 10_000,
      swipeable: true,
      topOffset: 50,
    });

    queryClient.invalidateQueries({
      queryKey: ["userBookings", "active"],
      exact: false,
    });

    queryClient.invalidateQueries({
      queryKey: ["userBookings", "pending"],
      exact: false,
    });

    queryClient.invalidateQueries({
      queryKey: ["userBookingCounts"],
    });
  };

  socket.on("bookingAccepted", bookingAcceptedHandler);
  return () => socket.off("bookingAccepted", bookingAcceptedHandler); // return for cleanup
};
