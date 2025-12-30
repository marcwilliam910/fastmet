import { queryClient } from "@/lib/queryClient";
import { RequestBooking } from "@/types/book";
import Toast from "react-native-toast-message";
import { Socket } from "socket.io-client";

export const requestBooking = (socket: Socket, bookingData: RequestBooking) => {
  socket.emit("request_booking", bookingData);
};

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
  };

  socket.on("bookingAccepted", bookingAcceptedHandler);
  return () => socket.off("bookingAccepted", bookingAcceptedHandler); // return for cleanup
};

export const handleBookingSaved = (
  socket: Socket,
  callback: (data: { success: boolean }) => void
) => {
  socket.on("booking_request_saved", callback);
};
