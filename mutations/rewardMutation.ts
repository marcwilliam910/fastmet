import {useMutation, useQueryClient} from "@tanstack/react-query";
import {claimPendingReward, claimPublicVoucher} from "@/api/reward";
import {rewardKeys} from "@/queries/rewardQueries";
import {ClaimPublicVoucherRequest} from "@/types/voucher";
import {getVoucherClaimErrorToast} from "@/utils/helpers/voucher";
import Toast from "react-native-toast-message";

/**
 * Claim a pending reward
 * Invalidates all reward queries on success
 */
export const useClaimPendingReward = () => {
  const queryClient = useQueryClient();

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
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: claimPublicVoucher,
    onSuccess: (data, variables) => {
      const context: "code" | "template" = variables.code ? "code" : "template";

      if (data.success) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: data.message || "Voucher claimed successfully!",
        });

        // Invalidate all reward queries
        void queryClient.invalidateQueries({queryKey: rewardKeys.all});
      } else {
        const {title, message} = getVoucherClaimErrorToast(
          {response: {data: {error: data.error}}},
          context,
        );

        Toast.show({
          type: "error",
          text1: title,
          text2: message,
        });
      }
    },
    onError: (error, variables: ClaimPublicVoucherRequest) => {
      const context: "code" | "template" = variables.code ? "code" : "template";
      const {title, message} = getVoucherClaimErrorToast(error, context);

      Toast.show({
        type: "error",
        text1: title,
        text2: message,
      });
    },
  });
};
