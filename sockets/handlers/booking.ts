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

    // updating notification
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

          const alreadyExists = old.pages.some((p) =>
            p.notifications.some((n) => n._id === notification._id),
          );
          if (alreadyExists) return old;

          return {
            ...old,
            pages: old.pages.map((page, idx) =>
              idx === 0
                ? {
                    ...page,
                    notifications: [notification, ...page.notifications],
                  }
                : page,
            ),
          };
        },
      );
    }
    queryClient.setQueryData(["notificationUnreadCount"], {
      unreadCount: unreadNotifications,
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
