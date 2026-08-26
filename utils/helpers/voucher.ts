import {IssuedReward, VoucherTemplate} from "@/types/voucher";

/**
 * Format currency as Philippine Peso
 */
export const formatCurrency = (amount: number): string => {
  return `₱${amount.toFixed(2)}`;
};

/**
 * Get display label for voucher value
 * Examples: "₱50 OFF", "20% OFF (max ₱100)"
 */
export const getVoucherValueLabel = (
  template: VoucherTemplate,
): {main: string; sub?: string} => {
  if (template.discountType === "fixed") {
    return {main: `${formatCurrency(template.value)} OFF`};
  } else {
    const main = `${template.value}% OFF`;
    if (template.maxDiscount && template.maxDiscount > 0) {
      return {main, sub: `(max ${formatCurrency(template.maxDiscount)})`};
    }
    return {main};
  }
};

/**
 * Format expiry date
 * Examples: "Valid until Aug 25, 2026"
 */
export const formatExpiryDate = (expiresAt: string): string => {
  const date = new Date(expiresAt);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return `Valid until ${date.toLocaleDateString("en-US", options)}`;
};

/**
 * Check if voucher is expired
 */
export const isVoucherExpired = (expiresAt: string): boolean => {
  return new Date(expiresAt) <= new Date();
};

/**
 * Get status label for issued reward
 */
export const getStatusLabel = (
  status: IssuedReward["status"],
): {label: string; color: string} => {
  switch (status) {
    case "pending":
      return {label: "Pending", color: "#F59E0B"}; // amber
    case "claimed":
      return {label: "Ready to use", color: "#10B981"}; // green
    case "in_use":
      return {label: "In use", color: "#3B82F6"}; // blue
    case "fulfilled":
      return {label: "Used", color: "#6B7280"}; // gray
    case "expired":
      return {label: "Expired", color: "#EF4444"}; // red
    case "revoked":
      return {label: "Revoked", color: "#EF4444"}; // red
    default:
      return {label: status, color: "#6B7280"};
  }
};

/**
 * Get minimum order label
 * Example: "Min. order: ₱100"
 */
export const getMinOrderLabel = (minOrderValue: number): string => {
  if (minOrderValue <= 0) {
    return "No minimum order";
  }
  return `Min. order: ${formatCurrency(minOrderValue)}`;
};

/**
 * Get voucher type display name
 */
export const getVoucherTypeLabel = (type: VoucherTemplate["type"]): string => {
  switch (type) {
    case "delivery":
      return "Delivery Voucher";
    case "load_credit":
      return "Load Credit";
    default:
      return type;
  }
};

/**
 * Get source type display label for issued rewards
 */
export const getSourceTypeLabel = (
  sourceType: IssuedReward["sourceType"],
): string => {
  switch (sourceType) {
    case "raffle":
      return "Raffle Prize";
    case "reward_tier":
      return "Reward Tier";
    case "manual":
      return "Admin Issued";
    case "self_claim":
      return "Self Claimed";
    default:
      return sourceType;
  }
};

/**
 * Check if reward is actionable (can be claimed)
 */
export const isRewardActionable = (reward: IssuedReward): boolean => {
  return reward.status === "pending" && reward.rewardType === "voucher";
};

/**
 * Get display guidance for voucher type and status
 */
export const getVoucherGuidance = (
  type: VoucherTemplate["type"],
  status: IssuedReward["status"],
): string | null => {
  if (type === "delivery" && status === "claimed") {
    return "Apply this voucher during booking checkout to get your discount.";
  }

  if (type === "load_credit" && status === "claimed") {
    return "Please contact customer support to claim your load credit. Manual admin fulfillment required.";
  }

  return null;
};

/**
 * Calculate time until expiry in human-readable format
 */
export const getExpiryTimeRemaining = (expiresAt: string): string | null => {
  const now = new Date();
  const expiry = new Date(expiresAt);
  const diff = expiry.getTime() - now.getTime();

  if (diff <= 0) {
    return "Expired";
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));

  if (days > 7) {
    return null; // Don't show countdown if more than a week away
  }

  if (days > 0) {
    return `Expires in ${days} day${days > 1 ? "s" : ""}`;
  }

  if (hours > 0) {
    return `Expires in ${hours} hour${hours > 1 ? "s" : ""}`;
  }

  return "Expires soon";
};

/**
 * Format fulfillment date
 */
export const formatFulfillmentDate = (
  completedAt?: string,
): string | undefined => {
  if (!completedAt) return undefined;

  const date = new Date(completedAt);
  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "short",
    day: "numeric",
  };
  return `Fulfilled on ${date.toLocaleDateString("en-US", options)}`;
};

type VoucherClaimErrorContext = "code" | "template";

export interface VoucherClaimErrorToast {
  title: string;
  message: string;
}

/**
 * Map voucher claim API/network errors to user-friendly toast copy.
 */
export function getVoucherClaimErrorToast(
  error: unknown,
  context: VoucherClaimErrorContext = "template",
): VoucherClaimErrorToast {
  const axiosError = error as {
    response?: {status?: number; data?: {error?: string}};
    message?: string;
  };

  const status = axiosError.response?.status;
  const apiError = axiosError.response?.data?.error;
  const rawMessage = apiError || axiosError.message || "";

  if (
    status === 404 ||
    rawMessage.toLowerCase().includes("not found") ||
    rawMessage.toLowerCase().includes("not claimable")
  ) {
    return context === "code"
      ? {
          title: "Invalid Code",
          message:
            "We couldn't find a voucher with that code. Please double-check and try again.",
        }
      : {
          title: "Voucher Unavailable",
          message: "This voucher is no longer available to claim.",
        };
  }

  if (rawMessage.toLowerCase().includes("already claimed")) {
    return {
      title: "Already Claimed",
      message: "You've already claimed this voucher.",
    };
  }

  if (rawMessage.toLowerCase().includes("claim limit")) {
    return {
      title: "Voucher Fully Claimed",
      message: "This voucher has reached its maximum number of claims.",
    };
  }

  if (rawMessage.toLowerCase().includes("no longer available")) {
    return {
      title: "Voucher Unavailable",
      message: "This voucher has expired or is no longer active.",
    };
  }

  if (status === 500 || rawMessage === "Server error.") {
    return {
      title: "Something Went Wrong",
      message:
        "We couldn't process your request right now. Please try again in a moment.",
    };
  }

  if (
    rawMessage.includes("status code") ||
    rawMessage.toLowerCase().includes("network")
  ) {
    return {
      title:
        context === "code" ? "Couldn't Claim Code" : "Couldn't Claim Voucher",
      message:
        context === "code"
          ? "We couldn't verify that voucher code. Please check your connection and try again."
          : "Something went wrong while claiming. Please try again.",
    };
  }

  return {
    title:
      context === "code" ? "Couldn't Claim Code" : "Couldn't Claim Voucher",
    message: rawMessage || "Please try again.",
  };
}
