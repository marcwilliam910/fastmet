import {useQuery} from "@tanstack/react-query";
import {getMyRewards, getClaimableVouchers} from "@/api/reward";
import {useAppStore} from "@/store/useAppStore";

/**
 * Query key factory for rewards
 */
export const rewardKeys = {
  all: ["rewards"] as const,
  myRewards: (filters?: {status?: string; rewardType?: string}) =>
    ["rewards", "my-rewards", filters] as const,
  claimable: () => ["rewards", "claimable"] as const,
  badge: () => ["rewards", "badge-count"] as const,
};

/**
 * Fetch user's wallet rewards
 * Only enabled when authenticated
 */
export const useMyRewards = (filters?: {
  status?: string;
  rewardType?: string;
}) => {
  const {token} = useAppStore();

  return useQuery({
    queryKey: rewardKeys.myRewards(filters),
    queryFn: () => getMyRewards(filters),
    enabled: !!token,
    staleTime: 1000 * 60, // 1 minute
  });
};

/**
 * Fetch claimable public vouchers
 * Only enabled when authenticated
 */
export const useClaimableVouchers = () => {
  const {token} = useAppStore();

  return useQuery({
    queryKey: rewardKeys.claimable(),
    queryFn: getClaimableVouchers,
    enabled: !!token,
    staleTime: 1000 * 60, // 1 minute
  });
};

/**
 * Get actionable voucher count for badge
 * Counts: pending rewards + claimable public vouchers
 * Only enabled when authenticated
 */
export const useVoucherBadgeCount = () => {
  const {token} = useAppStore();

  return useQuery({
    queryKey: rewardKeys.badge(),
    queryFn: async () => {
      // Fetch both in parallel
      const [pendingResult, claimableResult] = await Promise.all([
        getMyRewards({status: "pending", rewardType: "voucher"}),
        getClaimableVouchers(),
      ]);

      const pendingCount = pendingResult.success
        ? pendingResult.rewards.length
        : 0;
      const claimableCount = claimableResult.success
        ? claimableResult.vouchers.length
        : 0;

      return pendingCount + claimableCount;
    },
    enabled: !!token,
    staleTime: 1000 * 60, // 1 minute
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });
};

/**
 * Get claimed delivery vouchers eligible for a given order value
 * Filters to only show vouchers that can be applied
 */
export const useEligibleVouchers = (orderValue?: number) => {
  const {token} = useAppStore();

  return useQuery({
    queryKey: [...rewardKeys.myRewards({status: "claimed"}), orderValue],
    queryFn: async () => {
      const result = await getMyRewards({
        status: "claimed",
        rewardType: "voucher",
      });

      if (!result.success || !orderValue) {
        return [];
      }

      // Filter for delivery vouchers that are not expired and meet minimum order
      // (template.isActive gates new claims only, not redemption of owned vouchers)
      const now = new Date();
      return result.rewards.filter((reward) => {
        const template = reward.voucherId;
        if (!template) return false;

        return (
          template.type === "delivery" &&
          new Date(template.expiresAt) > now &&
          orderValue >= template.minOrderValue
        );
      });
    },
    enabled: !!token && !!orderValue,
    staleTime: 1000 * 30, // 30 seconds
  });
};
