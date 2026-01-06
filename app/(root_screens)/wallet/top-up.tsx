import HeaderRoot from "@/components/headers/HeaderRoot";
import {Ionicons} from "@expo/vector-icons";
import {Image} from "expo-image";
import {router} from "expo-router";
import {Pressable, ScrollView, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

const TopUp = () => {
  return (
    <SafeAreaView className="flex-1 bg-white">
      <HeaderRoot text="Top Up" />
      <ScrollView className="flex-1 px-6 pt-4">
        {/* Balance */}
        <View className="items-center p-4 rounded-2xl bg-lightPrimary">
          <Text className="text-base text-white">Current Balance</Text>
          <Text className="text-3xl font-bold text-white">Php 10,000</Text>
        </View>

        {/* Banking Options */}
        <View className="mt-6">
          <Text className="text-base font-bold text-center text-gray-800">
            Select type of banking
          </Text>

          <View className="flex-row justify-between gap-4 mt-4">
            {/* Xendit */}
            <Pressable className="relative items-center justify-between flex-1 p-2 border-2 h-36 border-lightPrimary rounded-xl active:bg-orange-50">
              <Image
                source={require("@/assets/images/xendit.png")}
                style={{width: 60, height: 60}}
                contentFit="contain"
              />
              <View className="items-center justify-center gap-1">
                <Text className="font-semibold text-gray-800">Xendit</Text>
                <Text className="text-xs text-center text-gray-500">
                  (Xendit additional fee 2.3%)
                </Text>
              </View>
              <Pressable className="absolute top-1 right-1">
                <Ionicons name="information-circle" size={26} color="#FFA840" />
              </Pressable>
            </Pressable>

            {/* Bank Transfer */}
            <Pressable className="relative items-center justify-between flex-1 p-2 border-2 h-36 border-lightPrimary rounded-xl active:bg-orange-50">
              <Image
                source={require("@/assets/images/bank.png")}
                style={{width: 60, height: 60}}
                contentFit="contain"
              />
              <View className="items-center justify-center gap-1">
                <Text className="font-semibold text-gray-800">
                  Bank Transfer
                </Text>
                <Text className="text-xs text-center text-gray-500">
                  (Wait for confirmation)
                </Text>
              </View>
              <Pressable className="absolute top-1 right-1">
                <Ionicons name="information-circle" size={26} color="#FFA840" />
              </Pressable>
            </Pressable>
          </View>
        </View>
      </ScrollView>
      {/* Buttons */}
      <View className="gap-3 px-6 mt-auto mb-6">
        <Pressable className="items-center py-4 rounded-xl bg-lightPrimary active:bg-darkPrimary">
          <Text className="text-base font-semibold text-white">Confirm</Text>
        </Pressable>

        <Pressable
          className="items-center py-4 bg-gray-100 border border-gray-300 rounded-xl active:bg-gray-200"
          onPress={() => router.back()}
        >
          <Text className="text-base font-semibold text-gray-700">Cancel</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default TopUp;
