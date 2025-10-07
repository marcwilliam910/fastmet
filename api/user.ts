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
