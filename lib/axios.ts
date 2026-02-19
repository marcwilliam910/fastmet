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
    if (error.response?.status === 401) {
      // Disconnect existing socket if any
      const socket = getSocket(""); // will return existing socket instance
      if (socket?.connected) socket.disconnect();

      // Log out
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

      // return Promise.resolve({
      //   data: null,
      //   status: 401,
      //   handled: true,
      // });

      return new Promise(() => {});
    }

    return Promise.reject(error);
  },
);
export default api;
