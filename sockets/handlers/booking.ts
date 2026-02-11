import { queryClient } from "@/lib/queryClient";
import { useAppStore } from "@/store/useAppStore";
import { Booking, RequestedDriver } from "@/types/book";
import { Notification, NotificationsResponse } from "@/types/notification";
import { InfiniteData } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { Socket } from "socket.io-client";

export const acceptanceRequestedSchedule = (socket: Socket) => {
  const handleAcceptanceRequestedSchedule = ({
    driverOffer,
    notification,
    unreadNotifications,
  }: {
    driverOffer: RequestedDriver;
    notification: Notification;
    unreadNotifications: number;
  }) => {
    // Update ALL pending bookings to add the driver offer
    queryClient.setQueriesData(
      { queryKey: ["userBookings", "pending"] },
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

    // Update notification
    useAppStore.getState().setUnreadNotificationCount(unreadNotifications);

    const notificationsQueries = queryClient.getQueriesData<
      InfiniteData<NotificationsResponse>
    >({ queryKey: ["notifications"] });

    const hasNotificationsCache = notificationsQueries.some(
      ([, data]) => !!data?.pages?.length,
    );

    if (hasNotificationsCache) {
      queryClient.setQueriesData<InfiniteData<NotificationsResponse>>(
        { queryKey: ["notifications"] },
        (old) => {
          if (!old?.pages?.length) return old;

          // Check if notification for this booking already exists
          let notificationExists = false;

          const updatedPages = old.pages.map((page) => ({
            ...page,
            notifications: page.notifications.map((n) => {
              // Update existing notification for the same booking
              if (
                n.type === "driver_offer" &&
                n.data?.bookingId === notification.data?.bookingId
              ) {
                notificationExists = true;
                // Replace with the updated notification from server
                return {
                  ...notification,
                  isRead: false, // Ensure it's marked as unread
                };
              }
              return n;
            }),
          }));

          // If notification doesn't exist, add it to the first page
          if (!notificationExists) {
            updatedPages[0] = {
              ...updatedPages[0],
              notifications: [notification, ...updatedPages[0].notifications],
            };
          }

          return {
            ...old,
            pages: updatedPages,
          };
        },
      );
    }

    queryClient.setQueryData(["notificationUnreadCount"], {
      unreadCount: unreadNotifications,
    });

    // Dynamic toast message based on driver count
    const driverCount = notification.data?.drivers
      ? Object.keys(notification.data.drivers).length
      : 1;

    Toast.show({
      type: "success",
      text1: "New Driver Offer!",
      text2:
        driverCount === 1
          ? `${driverOffer.name} has offered`
          : `${driverCount} drivers have offered for your booking`,
    });
  };

  socket.on("acceptanceRequestedSchedule", handleAcceptanceRequestedSchedule);
  return () =>
    socket.off(
      "acceptanceRequestedSchedule",
      handleAcceptanceRequestedSchedule,
    );
};

export const cancelScheduleDriverOffer = (socket: Socket) => {
  const handleCancelScheduleDriverOffer = ({
    driverId,
    bookingId,
  }: {
    driverId: string;
    bookingId: string;
  }) => {
    queryClient.setQueriesData(
      { queryKey: ["userBookings", "pending"] },
      (oldData: any) => {
        if (!oldData?.pages) return oldData;

        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            bookings: page.bookings.map((booking: Booking) => {
              if (booking._id === bookingId) {
                return {
                  ...booking,
                  requestedDrivers: (booking.requestedDrivers || []).filter(
                    (driver) => driver.id !== driverId,
                  ),
                };
              }
              return booking;
            }),
          })),
        };
      },
    );
  };

  socket.on("offerCancelledSchedule", handleCancelScheduleDriverOffer);
  return () =>
    socket.off("offerCancelledSchedule", handleCancelScheduleDriverOffer);
};
