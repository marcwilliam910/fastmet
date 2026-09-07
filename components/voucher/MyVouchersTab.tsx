import {useMyRewards} from "@/queries/rewardQueries";
import {Ionicons} from "@expo/vector-icons";
import {ActivityIndicator, FlatList, Pressable, Text, View} from "react-native";
import VoucherCard from "./VoucherCard";

export default function MyVouchersTab() {
  const {data, isPending, error, refetch} = useMyRewards({
    status: "claimed",
    rewardType: "voucher",
  });
  // Also fetch in_use vouchers
  const {
    data: inUseData,
    isPending: isInUsePending,
    refetch: refetchInUse,
  } = useMyRewards({
    status: "in_use",
    rewardType: "voucher",
  });

  const claimedVouchers = data?.rewards || [];
  const inUseVouchers = inUseData?.rewards || [];

  // Combine: in_use first (more important), then claimed
  const allVouchers = [...inUseVouchers, ...claimedVouchers];

  const isLoading = isPending && isInUsePending;
  const isRefreshing = isPending || isInUsePending;

  const handleRefresh = () => {
    refetch();
    refetchInUse();
  };

  if (isLoading && allVouchers.length === 0) {
    return (
      <View className="flex-1 justify-center items-center bg-white">
        <ActivityIndicator size="large" color="#FFA840" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="flex-1 justify-center items-center px-4 bg-white">
        <Ionicons name="alert-circle-outline" size={64} color="#EF4444" />
        <Text className="mt-4 text-lg font-semibold text-center text-gray-700">
          Failed to load your vouchers
        </Text>
        <Text className="mt-2 text-sm text-center text-gray-500">
          {error.message}
        </Text>
        <Pressable
          onPress={handleRefresh}
          className="bg-lightPrimary py-3 px-6 rounded-lg mt-4 active:bg-[#E89338]"
        >
          <Text className="font-semibold text-white">Try Again</Text>
        </Pressable>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-white">
      <FlatList
        data={allVouchers}
        keyExtractor={(item) => item._id}
        showsVerticalScrollIndicator={false}
        className="flex-1"
        contentContainerStyle={{
          padding: 16,
          gap: 16,
          paddingBottom: 40,
        }}
        renderItem={({item}) => <VoucherCard reward={item} showGuidance />}
        refreshing={isRefreshing}
        onRefresh={handleRefresh}
        ListEmptyComponent={() => (
          <View className="justify-center items-center px-8 py-12">
            <Ionicons name="wallet-outline" size={80} color="#9CA3AF" />
            <Text className="mt-6 text-2xl font-bold text-center text-gray-800">
              No Vouchers Yet
            </Text>
            <Text className="mt-2 text-base text-center text-gray-500">
              Claim vouchers from the Claimable tab to see them here.
            </Text>
          </View>
        )}
      />
    </View>
  );
}
