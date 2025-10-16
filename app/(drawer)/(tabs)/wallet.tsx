import useAuth from "@/hooks/useAuth";
import {Ionicons} from "@expo/vector-icons";
import {Image, ImageBackground} from "expo-image";
import {router} from "expo-router";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";

const Wallet = () => {
  const {user, loading} = useAuth();

  if (loading) {
    return (
      <View className="items-center justify-center flex-1 bg-white">
        <ActivityIndicator size="large" color="#FFA840" />
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 px-3 pt-4 bg-white"
      contentContainerStyle={{gap: 16}}
    >
      {/* Balance Card */}
      <ImageBackground
        source={require("@/assets/images/credit_card.png")}
        style={{width: "100%", height: 180}}
        imageStyle={{borderRadius: 16}}
        contentFit="fill"
      >
        <View className="justify-between flex-1 p-5">
          <View className="flex-row items-center justify-between">
            <Text className="text-lg font-semibold text-white">
              Current Balance
            </Text>
            <View className="p-2 rounded-lg bg-secondary">
              <Image
                source={require("@/assets/fastmet/logo.png")}
                style={{width: 40, height: 25}}
                contentFit="contain"
              />
            </View>
          </View>

          <Text className="text-4xl font-bold text-white">Php 10,000</Text>

          <View className="flex-row items-center justify-between pt-2 border-t border-yellow-400">
            <Text className="text-lg font-light tracking-wide text-white">
              FastMet
            </Text>
            <Ionicons name="alert-circle" size={24} color="#fff" />
          </View>
        </View>
      </ImageBackground>

      {/* Action Buttons */}
      <View className="flex-row gap-3 px-2">
        {[
          {
            src: require("@/assets/images/wallet_top_up.png"),
            label: "Top up",
            onPress: () => router.push("/(root_screens)/wallet/top-up"),
          },
          {
            src: require("@/assets/images/voucher.png"),
            label: "Voucher",
            onPress: () => {},
          },
          {
            src: require("@/assets/images/clock.png"),
            label: "...",
            onPress: () => {},
          },
        ].map((item, i) => (
          <Pressable
            key={i}
            onPress={item.onPress}
            className="items-center justify-center flex-1 py-3 bg-lightPrimary rounded-2xl active:bg-darkPrimary"
          >
            <Image
              source={item.src}
              style={{width: 30, height: 30}}
              contentFit="contain"
            />
            <Text className="mt-1 font-semibold text-white">{item.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* Transaction History */}
      <View className="px-2 ">
        <Text className="mb-3 text-lg font-bold">Transaction History</Text>
        <View className="gap-3">
          <TransactionCard
            type="Regular Request"
            date="August 4, 2025"
            amount="Php 1,340"
            toAdd={false}
          />
          <TransactionCard
            type="Top up balance"
            date="August 3, 2025"
            amount="Php 1,340"
            toAdd={true}
          />
          <TransactionCard
            type="Pooling Request"
            date="August 2, 2025"
            amount="Php 1,340"
            toAdd={false}
          />
        </View>
      </View>
      <Text className="mt-3 font-semibold text-center text-primary">
        + Show more
      </Text>
    </ScrollView>
  );
};

const TransactionCard = ({
  type,
  date,
  amount,
  toAdd,
}: {
  type: string;
  date: string;
  amount: string;
  toAdd: boolean;
}) => (
  <View className="flex-row items-center justify-between p-3 bg-gray-100 shadow-sm rounded-2xl">
    <View className="flex-row items-center gap-3">
      <View
        className={`w-3 h-3 rounded-full ${
          toAdd ? "bg-green-500" : "bg-red-500"
        }`}
      />
      <Text className="font-medium">{type}</Text>
    </View>
    <View className="items-end gap-1">
      <Text className="text-sm text-gray-500">{date}</Text>
      <Text
        className={`font-semibold ${toAdd ? "text-green-600" : "text-red-500"}`}
      >
        {toAdd ? "+ " : "- "}
        {amount}
      </Text>
    </View>
  </View>
);

export default Wallet;
