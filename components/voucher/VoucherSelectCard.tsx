// components/voucher/VoucherSelectCard.tsx
import {IssuedReward} from "@/types/voucher";
import {
  formatExpiryDate,
  getMinOrderLabel,
  getVoucherValueLabel,
} from "@/utils/helpers/voucher";
import {Ionicons} from "@expo/vector-icons";
import {ActivityIndicator, Text, View} from "react-native";

type VoucherSelectCardProps = {
  reward: IssuedReward;
  isSelected: boolean;
  isChecking: boolean;
};

export default function VoucherSelectCard({
  reward,
  isSelected,
  isChecking,
}: VoucherSelectCardProps) {
  const voucher = reward.voucherId;
  if (!voucher) return null;

  const {main, sub} = getVoucherValueLabel(voucher);
  const headerColor =
    voucher.type === "delivery" ? "bg-lightPrimary" : "bg-purple-500";

  return (
    <View
      style={{
        shadowColor: "#000",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
      }}
      className={`rounded-xl overflow-hidden bg-white ${
        isSelected ? "border-2 border-green-500" : ""
      }`}
    >
      {/* Header — code, value, selection state */}
      <View className={`px-4 py-3 ${headerColor}`}>
        <View className="flex-row justify-between items-center">
          <View className="flex-1 mr-3">
            <Text className="text-xs font-semibold text-white/80 uppercase tracking-widest">
              {voucher.code}
            </Text>
            <Text className="text-xl font-extrabold text-white mt-0.5">
              {main}
              {sub && (
                <Text className="text-sm font-semibold text-white"> {sub}</Text>
              )}
            </Text>
          </View>

          <View className="w-7 h-7 justify-center items-center">
            {isChecking ? (
              <ActivityIndicator size="small" color="#FFF" />
            ) : isSelected ? (
              <Ionicons name="checkmark-circle" size={28} color="#FFF" />
            ) : (
              <View className="w-6 h-6 rounded-full border-2 border-white/60" />
            )}
          </View>
        </View>
      </View>

      {/* Perforated divider — ticket stub effect */}
      <View className="relative" style={{marginHorizontal: -1}}>
        <View
          style={{borderStyle: "dashed", borderTopWidth: 1.5}}
          className="border-gray-300 mx-4"
        />
        <View
          className="absolute -left-2 w-4 h-4 rounded-full bg-gray-100 border border-gray-200"
          style={{top: -8}}
        />
        <View
          className="absolute -right-2 w-4 h-4 rounded-full bg-gray-100 border border-gray-200"
          style={{top: -8}}
        />
      </View>

      {/* Compact body — essentials only */}
      <View className="px-4 py-3 gap-1.5">
        {voucher.minOrderValue > 0 && (
          <View className="flex-row items-center">
            <Ionicons name="cart-outline" size={14} color="#6B7280" />
            <Text className="text-xs text-gray-600 ml-2">
              {getMinOrderLabel(voucher.minOrderValue)}
            </Text>
          </View>
        )}
        <View className="flex-row items-center">
          <Ionicons name="time-outline" size={14} color="#6B7280" />
          <Text className="text-xs text-gray-600 ml-2">
            {formatExpiryDate(voucher.expiresAt)}
          </Text>
        </View>
      </View>
    </View>
  );
}
