import {claimPendingReward, claimPublicVoucher} from "@/api/reward";
import {queryClient} from "@/lib/queryClient";
import {rewardKeys} from "@/queries/rewardQueries";
import {useMutation} from "@tanstack/react-query";
import Toast from "react-native-toast-message";

/**
 * Claim a pending reward
 * Invalidates all reward queries on success
 */
export const useClaimPendingReward = () => {
  return useMutation({
    mutationFn: claimPendingReward,
    onSuccess: (data) => {
      if (data.success) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: data.message || "Reward claimed successfully!",
        });

        // Invalidate all reward queries
        void queryClient.invalidateQueries({queryKey: rewardKeys.all});
      } else {
        Toast.show({
          type: "error",
          text1: "Error",
          text2: data.error || "Failed to claim reward.",
        });
      }
    },
    onError: (error: any) => {
      const errorMessage =
        error?.response?.data?.error ||
        error?.message ||
        "Failed to claim reward.";

      Toast.show({
        type: "error",
        text1: "Error",
        text2: errorMessage,
      });
    },
  });
};

/**
 * Claim a public voucher by code or template ID
 * Invalidates all reward queries on success
 */
export const useClaimPublicVoucher = () => {
  return useMutation({
    mutationFn: claimPublicVoucher,
    onSuccess: (data) => {
      if (data.success) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: data.message || "Voucher claimed successfully!",
        });

        // Invalidate all reward queries
        void queryClient.invalidateQueries({queryKey: rewardKeys.all});
      }
    },
  });
};
