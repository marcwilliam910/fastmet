// Voucher Template (from VoucherTemplateModel)
export interface VoucherTemplate {
  _id: string;
  code: string;
  description: string;
  type: "delivery" | "load_credit";
  discountType: "fixed" | "percentage";
  value: number;
  minOrderValue: number;
  maxDiscount: number | null;
  maxClaim: number;
  totalClaimed: number;
  claimType: "public" | "assigned";
  expiresAt: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

// Issued Reward (from IssuedRewardModel)
export interface IssuedReward {
  _id: string;
  recipientType: "user" | "driver";
  recipientId: string;
  rewardType: "voucher" | "cash_bonus" | "physical" | "badge" | "raffle_entry";
  sourceType: "raffle" | "reward_tier" | "manual" | "self_claim";
  sourceId: string;
  voucherId: VoucherTemplate | null;
  status: "pending" | "claimed" | "in_use" | "fulfilled" | "expired" | "revoked";
  bookingId: string | null;
  issuanceKey: string | null;
  label: string;
  value?: string;
  amount?: number | null;
  claimedAt?: string;
  fulfillment?: {
    notes?: string;
    completedAt?: string;
    payoutMethod?: "gcash" | "security_bond" | null;
    payoutReference?: string | null;
  };
  createdAt: string;
  updatedAt: string;
}

// API Response Types
export interface GetMyRewardsResponse {
  success: boolean;
  rewards: IssuedReward[];
  error?: string;
}

export interface GetClaimableVouchersResponse {
  success: boolean;
  vouchers: VoucherTemplate[];
  error?: string;
}

export interface ClaimRewardResponse {
  success: boolean;
  message?: string;
  reward?: IssuedReward;
  error?: string;
}

export interface PreviewVoucherResponse {
  success: boolean;
  eligible: boolean;
  discountAmount?: number;
  netAmount?: number;
  error?: string;
}

export interface PreviewVoucherRequest {
  issuedRewardId: string;
  orderValue: number;
}

export interface ClaimPublicVoucherRequest {
  code?: string;
  templateId?: string;
}
