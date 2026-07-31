import {
  registerForPushNotificationsAsync,
  savePushTokenToBackend,
} from "@/hooks/pushToken";
import {handleNotificationEntry} from "@/utils/helpers/notificationRouting";
import * as Notifications from "expo-notifications";
import {useEffect, useRef, useState} from "react";
import {useAuth} from "./useAuth";

// Configure notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >();
  const notificationListener = useRef<Notifications.EventSubscription | null>(
    null,
  );
  const responseListener = useRef<Notifications.EventSubscription | null>(null);
  const {isLoggedIn} = useAuth();

  useEffect(() => {
    if (!isLoggedIn) return;

    // Soft-ask once (if needed), then register token — never hard-requires permission.
    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
      if (token) {
        savePushTokenToBackend(token);
      }
    });

    // Cold start: app launched by tapping a notification while killed.
    Notifications.getLastNotificationResponseAsync().then((response) => {
      if (response) {
        handleNotificationEntry(response.notification.request.content.data);
      }
    });

    // Foreground receives — same as before (state + log only).
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
        console.log("📬 Notification received:", notification);
      });

    // User taps (foreground or background).
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        console.log("👆 Notification tapped:", data);
        handleNotificationEntry(data);
      });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
        notificationListener.current = null;
      }
      if (responseListener.current) {
        responseListener.current.remove();
        responseListener.current = null;
      }
    };
  }, [isLoggedIn]);

  return {
    expoPushToken,
    notification,
  };
}
