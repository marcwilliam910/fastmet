import {pushOnce} from "@/utils/helpers/navigation";

type NotificationData = Record<string, unknown> | undefined | null;

/**
 * Applies a notification payload and routes when appropriate.
 * Shared by tap and cold-start handlers so behavior matches either entry path.
 */
export function handleNotificationEntry(
  data: NotificationData,
  options: {navigate?: boolean} = {navigate: true},
): void {
  if (!data || !options.navigate) return;

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
