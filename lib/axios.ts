import axios from "axios";
import { router } from "expo-router";
import { getAuth, signOut } from "firebase/auth";

// const apiUrl = "http://192.168.100.12:3000/api";
const apiUrl = "http://192.168.100.125:3000/api/client";
// when i rebuild the app, change the apiUrl to the following line
// const apiUrl = Constants.expoConfig?.extra?.apiUrl ?? "http://192.168.100.125:3000/api";

const api = axios.create({
  baseURL: apiUrl,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use(async (config) => {
  const auth = getAuth();
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (res) => res,
  async (err) => {
    if (err.response?.status === 401) {
      await signOut(getAuth());
      router.replace("/(auth)/login");
    }
    return Promise.reject(err);
  }
);

export default api;
