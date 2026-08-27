import api from "@/lib/axios";

export type DeletionEligibility = {
  success: boolean;
  canDelete: boolean;
  reason?: string;
  message?: string;
  bondBalance?: number;
  deletionStatus?: "active" | "pending_deletion" | "deleted";
  deletionScheduledAt?: string | null;
};

export type DeletionRequestResponse = {
  success: boolean;
  scheduledAt: string;
  message: string;
};

export const fetchDeletionEligibility =
  async (): Promise<DeletionEligibility> => {
    const res = await api.get<DeletionEligibility>(
      "/profile/deletion-eligibility",
    );
    return res.data;
  };

export const requestAccountDeletion = async (
  verifyToken: string,
): Promise<DeletionRequestResponse> => {
  const res = await api.post<DeletionRequestResponse>(
    "/profile/request-deletion",
    {verifyToken},
  );
  return res.data;
};

export const cancelAccountDeletion = async (): Promise<{
  success: boolean;
  message: string;
}> => {
  const res = await api.post<{success: boolean; message: string}>(
    "/profile/cancel-deletion",
  );
  return res.data;
};

export const sendOTPAccountDeletion = async () => {
  await api.post("/profile/send-otp-deletion");
};
