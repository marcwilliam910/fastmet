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

// Attach token to every request
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
  (error) => {
    const data = error.response?.data;

    if (error.response?.status === 403 && data?.deviceBanned) {
      const socket = getSocket("");
      if (socket?.connected) socket.disconnect();

      useAppStore.getState().logout();
      router.replace(DEVICE_BANNED_ROUTE);
      return new Promise(() => {});
    }

    if (
      error.response?.status === 403 &&
      (data?.accountDeactivated || data?.accountBlocked)
    ) {
      const socket = getSocket("");
      if (socket?.connected) socket.disconnect();

      useAppStore.getState().logout();
      router.replace(ACCOUNT_DEACTIVATED_ROUTE);
      return new Promise(() => {});
    }

    if (error.response?.status === 401) {
      const socket = getSocket("");
      if (socket?.connected) socket.disconnect();

      useAppStore.getState().logout();

      Toast.show({
        type: "error",
        text1: "Session Expired",
        text2: "Please log in again.",
        position: "top",
        visibilityTime: 4000,
        swipeable: true,
      });

      router.replace("/(auth)/auth");
      return new Promise(() => {});
    }

    return Promise.reject(error);
  },
);
export default api;
