import api from "@/lib/axios";
import { ApiResponse } from "@/types/api";
import { NewUser, User } from "@/types/user";

export async function registerUserProfile(payload: NewUser) {
  const res = await api.post<ApiResponse<NewUser>>(
    "/user/register-profile",
    payload
  );
  return res.data;
}

export async function updateUserProfile(uid: string, payload: Partial<User>) {
  const res = await api.put<{ success: boolean; message: string; user: User }>(
    `/user/update-profile/${uid}`,
    payload
  );
  return res.data;
}
