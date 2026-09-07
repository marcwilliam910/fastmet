import {IssuedReward, VoucherTemplate} from "@/types/voucher";
import {
  formatExpiryDate,
  getExpiryTimeRemaining,
  getMinAmountLabel,
  getStatusLabel,
  getVoucherValueLabel,
  isVoucherExpired,
} from "@/utils/helpers/voucher";
import {Ionicons} from "@expo/vector-icons";
import {ActivityIndicator, Pressable, Text, View} from "react-native";

type VoucherCardProps = {
  reward?: IssuedReward;
  template?: VoucherTemplate;
  onClaim?: () => void;
  isClaimable?: boolean;
  isClaiming?: boolean;
  showGuidance?: boolean;
  showFulfillment?: boolean;
};

export default function VoucherCard({
  reward,
  template,
  onClaim,
  isClaimable = false,
  isClaiming = false,
  showGuidance = false,
  showFulfillment = false,
}: VoucherCardProps) {
  // Use template from reward's voucherId or standalone template
  const voucherTemplate = reward?.voucherId || template;
  if (!voucherTemplate) return null;

  const status = reward?.status;
  const isExpired = isVoucherExpired(voucherTemplate.expiresAt);
  const statusInfo = status ? getStatusLabel(status) : null;
  const timeRemaining = getExpiryTimeRemaining(voucherTemplate.expiresAt);

  // Owned rewards: ignore template.isActive (gates new claims only).
  // Claimable templates: still require isActive.
  const isOwnedReward = !!reward;
  const isRevoked = status === "revoked";
  const isTerminal =
    isExpired || status === "expired" || status === "fulfilled" || isRevoked;
  const isUnusable =
    isTerminal || (!isOwnedReward && !voucherTemplate.isActive);
  const isInactive = !isOwnedReward && !voucherTemplate.isActive && !isExpired;

  const {main, sub} = getVoucherValueLabel(voucherTemplate);

  return (
    <View
      style={{
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
      className={`rounded-xl overflow-hidden bg-white ${isUnusable ? "opacity-60" : ""}`}
    >
      {/* Header - Voucher Code and Value */}
      <View
        className={`px-4 py-4 ${
          isUnusable
            ? "bg-gray-400"
            : voucherTemplate.type === "delivery"
              ? "bg-lightPrimary"
              : "bg-purple-500"
        }`}
      >
        <View className="flex-row justify-between items-center">
          <View className="flex-1">
            <Text className="text-xs font-semibold tracking-widest uppercase text-white/80">
              {voucherTemplate.code}
            </Text>

            <Text className="mt-1 text-2xl font-extrabold text-white">
              {main}
              {sub && (
                <Text className="text-sm font-semibold text-white"> {sub}</Text>
              )}
            </Text>
          </View>
          {statusInfo && (
            <View className="px-3 py-1.5 rounded-full bg-white/20">
              <Text className="text-xs font-semibold text-white">
                {statusInfo.label}
              </Text>
            </View>
          )}
        </View>
      </View>

      {/* Perforated divider - ticket stub effect */}
      <View className="relative" style={{marginHorizontal: -1}}>
        <View
          style={{borderStyle: "dashed", borderTopWidth: 1.5}}
          className="mx-4 border-gray-300"
        />
        <View
          className="absolute -left-2 w-4 h-4 bg-gray-100 rounded-full border border-gray-200"
          style={{top: -8}}
        />
        <View
          className="absolute -right-2 w-4 h-4 bg-gray-100 rounded-full border border-gray-200"
          style={{top: -8}}
        />
      </View>

      {/* Body */}
      <View className="p-4">
        {/* Description */}
        <Text className="mb-3 text-sm leading-5 text-gray-700">
          {voucherTemplate.description}
        </Text>

        {/* Details Grid */}
        <View className="gap-2 mb-3">
          {voucherTemplate.minOrderValue > 0 && (
            <View className="flex-row items-center">
              <Ionicons name="cart-outline" size={16} color="#6B7280" />
              <Text className="ml-2 text-xs text-gray-600">
                {getMinAmountLabel(voucherTemplate.minOrderValue)}
              </Text>
            </View>
          )}

          <View className="flex-row items-center">
            <Ionicons
              name="time-outline"
              size={16}
              color={isExpired ? "#EF4444" : "#6B7280"}
            />
            <Text
              className={`text-xs ml-2 ${isExpired ? "font-semibold text-red-600" : "text-gray-600"}`}
            >
              {isExpired
                ? "Expired"
                : formatExpiryDate(voucherTemplate.expiresAt)}
            </Text>
          </View>

          {timeRemaining && !isTerminal && (
            <View className="flex-row items-center bg-amber-50 px-2 py-1.5 rounded-md">
              <Ionicons name="warning" size={14} color="#F59E0B" />
              <Text className="text-xs text-amber-700 ml-1.5 font-medium">
                {timeRemaining}
              </Text>
            </View>
          )}

          {isRevoked && (
            <View className="flex-row items-center bg-red-50 px-2 py-1.5 rounded-md">
              <Ionicons name="close-circle" size={14} color="#EF4444" />
              <Text className="text-xs text-red-700 ml-1.5 font-medium">
                This voucher was revoked and can no longer be used
              </Text>
            </View>
          )}

          {isInactive && (
            <View className="flex-row items-center bg-red-50 px-2 py-1.5 rounded-md">
              <Ionicons name="ban" size={14} color="#EF4444" />
              <Text className="text-xs text-red-700 ml-1.5 font-medium">
                This voucher is no longer active
              </Text>
            </View>
          )}
        </View>

        {showGuidance && status === "claimed" && (
          <View className="bg-blue-50 px-3 py-2.5 rounded-lg mb-3">
            <Text className="text-xs leading-4 text-blue-800">
              {voucherTemplate.type === "delivery"
                ? "Apply this voucher during booking checkout to get your discount."
                : "Please contact customer support to claim your load credit. Manual admin fulfillment required."}
            </Text>
          </View>
        )}

        {showFulfillment && reward?.fulfillment?.completedAt && (
          <View className="bg-green-50 px-3 py-2.5 rounded-lg mb-3">
            <Text className="mb-1 text-xs font-semibold text-green-900">
              Fulfilled
            </Text>
            {reward.fulfillment.notes && (
              <Text className="text-xs text-green-800">
                {reward.fulfillment.notes}
              </Text>
            )}
            {reward.fulfillment.payoutMethod && (
              <Text className="mt-1 text-xs text-green-700">
                Method: {reward.fulfillment.payoutMethod.toUpperCase()}
              </Text>
            )}
          </View>
        )}

        {isClaimable && onClaim && !isUnusable && (
          <Pressable
            onPress={onClaim}
            disabled={isClaiming}
            className={`flex-row justify-center items-center py-3 rounded-lg ${
              isClaiming ? "bg-gray-300" : "bg-lightPrimary active:bg-[#E89338]"
            }`}
          >
            {isClaiming ? (
              <>
                <ActivityIndicator size="small" color="#FFF" />
                <Text className="ml-2 font-semibold text-white">
                  Claiming...
                </Text>
              </>
            ) : (
              <>
                <Ionicons name="gift" size={18} color="#FFF" />
                <Text className="ml-2 font-semibold text-white">
                  Claim Voucher
                </Text>
              </>
            )}
          </Pressable>
        )}
      </View>

      {reward?.sourceType && showFulfillment && (
        <View className="px-4 py-2 bg-gray-50 border-t border-gray-100">
          <Text className="text-xs text-gray-500">
            Source: {reward.sourceType.replace(/_/g, " ").toUpperCase()}
          </Text>
        </View>
      )}
    </View>
  );
}
