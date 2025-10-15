import {useBookStore} from "@/store/useBookStore";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import React, {useState} from "react";
import {Pressable, ScrollView, Switch, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import Header from "./header";

const Fees = () => {
  const router = useRouter();
  const [tollEnabled, setTollEnabled] = useState(false);
  const [parkingEnabled, setParkingEnabled] = useState(true);
  const setIsTallVisited = useBookStore((state) => state.setIsTollVisited);

  return (
    <SafeAreaView className="flex-1 bg-white" style={{paddingBottom: 15}}>
      {/* Header */}
      <Header text="Tolls, Parking Fee & Others" />

      <ScrollView
        className="px-6 mt-3"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 40, paddingTop: 10}}
      >
        {/* Description */}
        <Text className="text-base leading-6 text-gray-600">
          Tolls, parking, and entry fees are not included in the booking price.
          Please reimburse your driver if your route requires payment of such
          fees.
        </Text>

        {/* Toll Reimbursement */}
        <View className="mt-6">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-semibold text-gray-800">
              Toll Reimbursement
            </Text>
            <Switch
              trackColor={{false: "#ccc", true: "#FFA840"}}
              thumbColor={"white"}
              ios_backgroundColor="#ccc"
              onValueChange={setTollEnabled}
              value={tollEnabled}
              style={{transform: [{scaleX: 1.4}, {scaleY: 1.3}]}}
            />
          </View>
          <Text className="mt-2 leading-6 text-gray-600">
            Sounds good. I'll coordinate with the driver about payment for the
            toll fee and provide instructions if needed.
          </Text>
        </View>

        {/* Parking Fee */}
        <View className="mt-6">
          <View className="flex-row items-center justify-between">
            <Text className="text-base font-semibold text-gray-800">
              Parking fee
            </Text>
            <Switch
              trackColor={{false: "#ccc", true: "#FFA840"}}
              thumbColor={"white"}
              ios_backgroundColor="#ccc"
              onValueChange={setParkingEnabled}
              value={parkingEnabled}
              style={{transform: [{scaleX: 1.4}, {scaleY: 1.3}]}}
            />
          </View>
          <Text className="mt-2 leading-6 text-gray-600">
            Do you have a preferred method for covering it? You can use our toll
            pass, or pay with cash or card—whichever works best for you.
          </Text>
        </View>

        {/* Toll Fee Calculator */}
      </ScrollView>
      <View className="gap-3 px-6 mt-auto">
        <Pressable
          className="flex-row items-center justify-center gap-2 py-4 mt-8 border-2 border-lightPrimary rounded-xl active:bg-orange-50"
          onPress={() => router.push("/(root_screens)/(booking)/fee-calcu")}
        >
          <Ionicons name="calculator-outline" size={20} color="#FFA840" />
          <Text className="text-base font-semibold text-lightPrimary">
            Toll Fee Calculator
          </Text>
        </Pressable>

        {/* Action Buttons */}
        <View className="gap-3 mt-6">
          <Pressable
            className="items-center py-4 rounded-xl bg-lightPrimary active:bg-darkPrimary"
            onPress={() => {
              setIsTallVisited(true);
              router.back();
            }}
          >
            <Text className="text-base font-semibold text-white">Confirm</Text>
          </Pressable>

          <Pressable
            className="items-center py-4 bg-gray-100 border border-gray-300 rounded-xl active:bg-gray-200"
            onPress={() => router.back()}
          >
            <Text className="text-base font-semibold text-gray-700">
              Cancel
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default Fees;
