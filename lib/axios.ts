import {
  ACCOUNT_DEACTIVATED_ROUTE,
  DEVICE_BANNED_ROUTE,
} from "@/constants/routes";
import { getSocket } from "@/sockets/socket";
import { useAppStore } from "@/store/useAppStore";
import axios, { InternalAxiosRequestConfig } from "axios";
import { router } from "expo-router";
import Toast from "react-native-toast-message";

export const apiUrl = `${process.env.EXPO_PUBLIC_BASE_URL}/api/client`;

const api = axios.create({
  baseURL: apiUrl,
  headers: { "Content-Type": "application/json" },
});

// --- Refresh token queue ---
// Prevents multiple simultaneous refresh calls when several requests 401 at once.
let isRefreshing = false;
let pendingQueue: {
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}[] = [];

const flushQueue = (error: unknown, token: string | null = null) => {
  pendingQueue.forEach((p) => {
    if (error) p.reject(error);
    else p.resolve(token!);
  });
  pendingQueue = [];
};

export const performLogout = async () => {
  const store = useAppStore.getState();

  // Fire-and-forget — don't let a network error block local logout
  try {
    const token = store.token;
    if (token) {
      await api.post("/auth/logout", null, {
        headers: { Authorization: `Bearer ${token}` },
      });
    }
  } catch {
    // intentionally swallowed
  }

  const socket = getSocket("");
  if (socket?.connected) socket.disconnect();

  store.logout();
  router.replace("/(auth)/auth");
};

// Attach access token to every request
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = useAppStore.getState().token;
    if (token) {
      config.headers.set("Authorization", `Bearer ${token}`);
    }
    return config;
  },
  (error) => Promise.reject(error),
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const data = error.response?.data;
    const status = error.response?.status;
    const originalRequest = error.config;

    if (status === 403 && data?.deviceBanned) {
      const socket = getSocket("");
      if (socket?.connected) socket.disconnect();
      useAppStore.getState().logout();
      router.replace(DEVICE_BANNED_ROUTE);
      return new Promise(() => {});
    }

    if (status === 403 && data?.accountDeactivated) {
      const socket = getSocket("");
      if (socket?.connected) socket.disconnect();
      useAppStore.getState().logout();
      router.replace(ACCOUNT_DEACTIVATED_ROUTE);
      return new Promise(() => {});
    }

    // Access token expired — attempt refresh
    if (status === 401 && data?.tokenExpired && !originalRequest._retry) {
      originalRequest._retry = true;

      const storedRefreshToken = useAppStore.getState().refreshToken;

      if (!storedRefreshToken) {
        await performLogout();
        return new Promise(() => {});
      }

      if (isRefreshing) {
        // Queue this request until the ongoing refresh completes
        return new Promise((resolve, reject) => {
          pendingQueue.push({
            resolve: (newToken: string) => {
              originalRequest.headers.set(
                "Authorization",
                `Bearer ${newToken}`,
              );
              resolve(api(originalRequest));
            },
            reject,
          });
        });
      }

      isRefreshing = true;

      try {
        const { data: refreshData } = await api.post<{
          success: boolean;
          accessToken: string;
          refreshToken: string;
        }>("/auth/refresh", { refreshToken: storedRefreshToken });

        useAppStore.getState().setAuthData({
          token: refreshData.accessToken,
          refreshToken: refreshData.refreshToken,
        });

        flushQueue(null, refreshData.accessToken);

        originalRequest.headers.set(
          "Authorization",
          `Bearer ${refreshData.accessToken}`,
        );
        return api(originalRequest);
      } catch (refreshError: any) {
        flushQueue(refreshError, null);

        Toast.show({
          type: "error",
          text1: "Session Expired",
          text2: "Please log in again.",
          position: "top",
          visibilityTime: 4000,
          swipeable: true,
        });

        await performLogout();
        return new Promise(() => {});
      } finally {
        isRefreshing = false;
      }
    }

    // Any other 401 (e.g. truly invalid token) — hard logout
    if (status === 401) {
      Toast.show({
        type: "error",
        text1: "Session Expired",
        text2: "Please log in again.",
        position: "top",
        visibilityTime: 4000,
        swipeable: true,
      });

      await performLogout();
      return new Promise(() => {});
    }

    return Promise.reject(error);
  },
);

export default api;
