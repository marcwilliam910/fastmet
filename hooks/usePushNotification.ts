import {
  declineNotificationPermission,
  registerForPushNotificationsAsync,
  requestNotificationPermission,
  savePushTokenToBackend,
  shouldPromptForNotificationPermission,
} from "@/hooks/pushToken";
import {handleNotificationEntry} from "@/utils/helpers/notificationRouting";
import * as Notifications from "expo-notifications";
import {useCallback, useEffect, useRef, useState} from "react";
import {useAuth} from "./useAuth";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldPlaySound: true,
    shouldSetBadge: true,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
});

let coldStartResponse: Notifications.NotificationResponse | null = null;
let hasFetchedColdStart = false;

Notifications.addNotificationResponseReceivedListener((response) => {
  if (!hasFetchedColdStart) {
    coldStartResponse = response;
  }
});

Promise.resolve(Notifications.getLastNotificationResponse()).then(
  (response) => {
    hasFetchedColdStart = true;
    if (response && !coldStartResponse) {
      coldStartResponse = response;
    }
  },
);

export function usePushNotifications() {
  const [expoPushToken, setExpoPushToken] = useState<string | undefined>();
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >();
  const [showPermissionModal, setShowPermissionModal] = useState(false);
  const notificationListener = useRef<Notifications.EventSubscription | null>(
    null,
  );
  const responseListener = useRef<Notifications.EventSubscription | null>(null);
  const {isLoggedIn} = useAuth();

  const registerToken = useCallback(async () => {
    const token = await registerForPushNotificationsAsync();
    setExpoPushToken(token);
    if (token) {
      await savePushTokenToBackend(token);
    }
  }, []);

  const closePermissionModal = useCallback(() => {
    setShowPermissionModal(false);
  }, []);

  const handlePermissionDecline = useCallback(() => {
    void declineNotificationPermission();
  }, []);

  const handlePermissionEnable = useCallback(() => {
    void (async () => {
      const granted = await requestNotificationPermission();
      if (granted) {
        await registerToken();
      }
    })();
  }, [registerToken]);

  useEffect(() => {
    if (!isLoggedIn) return;

    void (async () => {
      const token = await registerForPushNotificationsAsync();
      if (token) {
        setExpoPushToken(token);
        await savePushTokenToBackend(token);
        return;
      }

      if (await shouldPromptForNotificationPermission()) {
        setShowPermissionModal(true);
      }
    })();

    if (coldStartResponse) {
      handleNotificationEntry(coldStartResponse.notification.request.content.data);
      coldStartResponse = null;
    }

    notificationListener.current =
      Notifications.addNotificationReceivedListener((notification) => {
        setNotification(notification);
        console.log("📬 Notification received:", notification);
      });

    responseListener.current =
      Notifications.addNotificationResponseReceivedListener((response) => {
        const data = response.notification.request.content.data;
        console.log("👆 Notification tapped:", data);
        handleNotificationEntry(data);
      });

    return () => {
      notificationListener.current?.remove();
      notificationListener.current = null;
      responseListener.current?.remove();
      responseListener.current = null;
    };
  }, [isLoggedIn]);

  return {
    expoPushToken,
    notification,
    permissionModalProps: {
      visible: showPermissionModal,
      onClose: closePermissionModal,
      onDecline: handlePermissionDecline,
      onEnable: handlePermissionEnable,
    },
  };
}
