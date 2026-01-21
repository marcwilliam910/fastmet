import { queryClient } from "@/lib/queryClient";
import { useAppStore } from "@/store/useAppStore";
import { router } from "expo-router";
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
