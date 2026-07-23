import api from "@/lib/axios";
import {ApprovalStatus} from "@/store/slices/authSlice";

export type AuthMetaResponse = {
  success: boolean;
  registrationStep: number;
  approvalStatus: ApprovalStatus;
};

export const fetchAuthMeta = async (): Promise<AuthMetaResponse> => {
  const res = await api.get<AuthMetaResponse>("/auth/me");
  return res.data;
};
