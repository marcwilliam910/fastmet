import {pushOnce} from "@/utils/helpers/navigation";
import {router} from "expo-router";

type NotificationData = Record<string, unknown> | undefined | null;

/**
 * CLIENT APP - Push Notification Routing Handler
 * 
 * This function handles all push notification taps and routes to the appropriate screen.
 * See NOTIFICATION_ROUTING_GUIDE.md in backend for how to add new routes.
 * 
 * Current supported targets:
 * - "searchingDriver": Navigate back to driver search screen (for driver offers)
 * - default: Navigate to generic notification viewer
 */
export function handleNotificationEntry(
  data: NotificationData,
  options: {navigate?: boolean} = {navigate: true},
): void {
  if (!data || !options.navigate) return;

  const target = data.target as string | undefined;

  // Driver offer notification → navigate back to searchingDriver page
  if (target === "searchingDriver") {
    const bookingId = data.bookingId as string | undefined;
    if (bookingId) {
      setTimeout(() => {
        try {
          router.push({
            pathname: "/(root_screens)/booking/searchingDriver",
            params: {bookingId},
          });
        } catch {
          // navigation not ready — ignore
        }
      }, 0);
    }
    return;
  }

  // Default notification viewer for other types
  const notificationId =
    (data.notificationId as string | undefined) ??
    (data._id as string | undefined);

  if (!notificationId) return;

  // Defer so the router/layout is mounted on cold start.
  setTimeout(() => {
    try {
      pushOnce({
        pathname: "/(root_screens)/notifViewer",
        params: {notificationId},
      });
    } catch {
      // navigation not ready — ignore
    }
  }, 0);
}
