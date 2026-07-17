import {
  registerForPushNotificationsAsync,
  savePushTokenToBackend,
} from "@/hooks/pushToken";
import * as Notifications from "expo-notifications";
import { useEffect, useRef, useState } from "react";
import { useAuth } from "./useAuth";

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
    null
  );
  const responseListener = useRef<Notifications.EventSubscription | null>(null);
  const { isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn) return;

    registerForPushNotificationsAsync().then((token) => {
      setExpoPushToken(token);
      if (token) {
        savePushTokenToBackend(token);
      }
    });

    // Listen for notifications received while app is in foreground
    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
        console.log("📬 Notification received:", notification);
      });

    // Listen for user taps on notifications
    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        console.log("👆 Notification tapped:", data);

        // Handle navigation based on notification data
        // You can implement this later with your navigation
      });

    return () => {
      if (notificationListener.current) {
        notificationListener.current.remove();
      }
      if (responseListener.current) {
        responseListener.current.remove();
      }
    };
  }, [isLoggedIn]);

  return {
    expoPushToken,
    notification,
  };
}
