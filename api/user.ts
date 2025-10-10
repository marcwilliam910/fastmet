import api from "@/lib/axios";
import {ApiResponse} from "@/types/api";
import {User} from "@/types/user";

export async function registerUserProfile(payload: User) {
  const res = await api.post<ApiResponse<User>>(
    "/user/register-profile",
    payload
  );
  return res.data;
}

export async function getUserProfile(uid: string) {
  try {
    const res = await api.get<{success: boolean; message: string; user: User}>(
      `/user/${uid}`
    );
    return res.data;
  } catch (error: any) {
    if (error.response?.status === 404) {
      return {success: false, message: "User not found", user: null};
    }
    throw error;
  }
}
export async function updateUserProfile(uid: string, payload: Partial<User>) {
  const res = await api.put<{success: boolean; message: string; user: User}>(
    `/user/update-profile/${uid}`,
    payload
  );
  return res.data;
}
