import api from "@/lib/axios";
import {
  GetMyRewardsResponse,
  GetClaimableVouchersResponse,
  ClaimRewardResponse,
  PreviewVoucherResponse,
  PreviewVoucherRequest,
  ClaimPublicVoucherRequest,
} from "@/types/voucher";

/**
 * Get user's reward wallet (all issued rewards)
 */
export const getMyRewards = async (params?: {
  status?: string;
  rewardType?: string;
}): Promise<GetMyRewardsResponse> => {
  const response = await api.get("/rewards/my-rewards", {
    params,
  });
  return response.data;
};

/**
 * Claim a pending reward (transition pending → claimed)
 */
export const claimPendingReward = async (
  rewardId: string,
): Promise<ClaimRewardResponse> => {
  const response = await api.post(
    `/rewards/my-rewards/${rewardId}/claim`,
  );
  return response.data;
};

/**
 * Get list of claimable public vouchers
 */
export const getClaimableVouchers =
  async (): Promise<GetClaimableVouchersResponse> => {
    const response = await api.get("/rewards/vouchers/claimable");
    return response.data;
  };

/**
 * Claim a public voucher by code or template ID
 */
export const claimPublicVoucher = async (
  data: ClaimPublicVoucherRequest,
): Promise<ClaimRewardResponse> => {
  const response = await api.post(
    "/rewards/vouchers/claim",
    data,
  );
  return response.data;
};

/**
 * Preview voucher discount (non-mutating)
 */
export const previewVoucher = async (
  data: PreviewVoucherRequest,
): Promise<PreviewVoucherResponse> => {
  const response = await api.post(
    "/rewards/vouchers/preview",
    data,
  );
  return response.data;
};
