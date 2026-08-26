import {previewVoucher} from "@/api/reward";
import {useEligibleVouchers} from "@/queries/rewardQueries";
import {IssuedReward} from "@/types/voucher";
import {formatCurrency} from "@/utils/helpers/voucher";
import {Ionicons} from "@expo/vector-icons";
import {useQuery} from "@tanstack/react-query";
import {useEffect, useState} from "react";
import {
  ActivityIndicator,
  FlatList,
  Modal,
  Platform,
  Pressable,
  Text,
  View,
} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import VoucherSelectCard from "./VoucherSelectCard";

type VoucherPickerModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (
    reward: IssuedReward,
    preview: {discountAmount: number; netAmount: number},
  ) => void;
  orderValue: number;
  selectedRewardId?: string | null;
};

export default function VoucherPickerModal({
  visible,
  onClose,
  onSelect,
  orderValue,
  selectedRewardId,
}: VoucherPickerModalProps) {
  const inset = useSafeAreaInsets();
  const [previewingReward, setPreviewingReward] = useState<IssuedReward | null>(
    null,
  );
  const previewingId = previewingReward?._id ?? null;

  const {
    data: eligibleVouchers,
    isPending,
    error,
    refetch,
  } = useEligibleVouchers(orderValue);

  // Preview query for the currently previewing voucher
  const {
    data: previewData,
    isPending: isPreviewPending,
    error: previewError,
  } = useQuery({
    queryKey: ["voucherPreview", previewingId, orderValue],
    queryFn: () =>
      previewVoucher({
        issuedRewardId: previewingId!,
        orderValue,
      }),
    enabled: !!previewingId,
  });

  useEffect(() => {
    if (!visible) {
      setPreviewingReward(null);
    }
  }, [visible]);

  // Auto-select when preview succeeds
  useEffect(() => {
    if (
      !previewingReward ||
      isPreviewPending ||
      !previewData?.success ||
      !previewData.eligible
    ) {
      return;
    }

    onSelect(previewingReward, {
      discountAmount: previewData.discountAmount!,
      netAmount: previewData.netAmount!,
    });
    setPreviewingReward(null);
    onClose();
  }, [previewData, previewingReward, isPreviewPending, onSelect, onClose]);

  const handleSelectVoucher = (reward: IssuedReward) => {
    setPreviewingReward(reward);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View className="flex-1">
        <Pressable
          className="flex-1 bg-black/50"
          onPress={onClose}
          accessible
          accessibilityRole="button"
          accessibilityLabel="Close modal"
        />
        <View
          className="max-h-[75%] rounded-t-3xl bg-white"
          style={{paddingBottom: inset.bottom}}
        >
          {/* Header */}
          <View className="flex-row justify-between items-center px-6 py-4 border-b border-gray-200">
            <View>
              <Text className="text-xl font-bold text-gray-900">
                Select Voucher
              </Text>
              <Text className="text-sm text-gray-500 mt-0.5">
                Order: {formatCurrency(orderValue)}
              </Text>
            </View>
            <Pressable onPress={onClose} hitSlop={20}>
              <Ionicons
                name="close"
                size={Platform.OS === "ios" ? 30 : 28}
                color="#6B7280"
              />
            </Pressable>
          </View>

          {/* Voucher List */}
          {isPending ? (
            <View className="justify-center items-center py-12">
              <ActivityIndicator size="large" color="#FFA840" />
              <Text className="text-sm text-gray-500 mt-2">
                Loading vouchers...
              </Text>
            </View>
          ) : error ? (
            <View className="justify-center items-center px-8 py-12">
              <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
              <Text className="text-lg font-semibold text-gray-700 mt-4 text-center">
                Failed to load vouchers
              </Text>
              <Text className="text-sm text-gray-500 mt-2 text-center">
                {error.message}
              </Text>
              <Pressable
                onPress={() => refetch()}
                className="bg-lightPrimary py-3 px-6 rounded-lg mt-4 active:bg-[#E89338]"
              >
                <Text className="text-white font-semibold">Try Again</Text>
              </Pressable>
            </View>
          ) : !eligibleVouchers || eligibleVouchers.length === 0 ? (
            <View className="justify-center items-center px-8 py-12">
              <Ionicons name="ticket-outline" size={80} color="#9CA3AF" />
              <Text className="mt-6 text-2xl font-bold text-center text-gray-800">
                No Eligible Vouchers
              </Text>
              <Text className="mt-2 text-base text-center text-gray-500">
                You don&apos;t have any vouchers that can be applied to this
                order.
              </Text>
              <Text className="mt-1 text-sm text-center text-gray-400">
                Minimum order requirements may not be met.
              </Text>
            </View>
          ) : (
            <FlatList
              data={eligibleVouchers}
              keyExtractor={(item) => item._id}
              showsVerticalScrollIndicator={false}
              className="px-4 py-4"
              contentContainerStyle={{
                gap: 16,
                paddingBottom: 20,
              }}
              renderItem={({item}) => {
                const isSelected = selectedRewardId === item._id;
                const isChecking =
                  previewingId === item._id && isPreviewPending;

                return (
                  <View>
                    <Pressable
                      onPress={() => handleSelectVoucher(item)}
                      disabled={isChecking}
                      accessibilityRole="button"
                      accessibilityLabel={`Select voucher ${item.voucherId?.code}`}
                      className={
                        isChecking ? "opacity-60" : "active:opacity-80"
                      }
                    >
                      <VoucherSelectCard
                        reward={item}
                        isSelected={isSelected}
                        isChecking={isChecking}
                      />
                    </Pressable>

                    {previewError &&
                      previewingId === item._id &&
                      !isPreviewPending && (
                        <View className="mt-2 bg-red-50 px-3 py-2 rounded-lg">
                          <Text className="text-xs text-red-700">
                            {(previewError as any)?.response?.data?.error ||
                              "Failed to preview voucher"}
                          </Text>
                        </View>
                      )}
                  </View>
                );
              }}
            />
          )}
        </View>
      </View>
    </Modal>
  );
}
