import axios from "axios";
import {router} from "expo-router";
import {getAuth, signOut} from "firebase/auth";

const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL || "http://192.168.100.85:3000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token automatically for every request
api.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken(); // get fresh Firebase ID token
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const status = error.response?.status;

    // Token expired or invalid → logout
    if (status === 401) {
      const auth = getAuth();
      await signOut(auth);
      router.replace("/(auth)/login");
    }

    return Promise.reject(error);
  }
);
export default api;
