import Select from "@/components/Dropdown";
import React, {useState} from "react";
import {Pressable, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import Header from "./header";

export default function TollFeeCalculator() {
  const [activeTab, setActiveTab] = useState("journey1");

  return (
    <SafeAreaView className="flex-1 bg-white">
      <Header text="Toll Fee Calculator" />

      <View className="flex-1 px-4 mt-6">
        {/* Journey Tabs */}
        <View className="flex-row gap-2 mb-6">
          <Pressable
            onPress={() => setActiveTab("journey1")}
            className={`flex-1 py-3.5 rounded-xl ${
              activeTab === "journey1" ? "bg-[#FFA840]" : "bg-gray-200"
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === "journey1" ? "text-white" : "text-gray-400"
              }`}
            >
              Journey
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setActiveTab("journey2")}
            className={`flex-1 py-3 rounded-xl ${
              activeTab === "journey2" ? "bg-[#FFA840]" : "bg-gray-200"
            }`}
          >
            <Text
              className={`text-center font-semibold ${
                activeTab === "journey2" ? "text-white" : "text-gray-400"
              }`}
            >
              Journey
            </Text>
          </Pressable>
        </View>

        {/* Total Fee Display */}
        <View className="items-center py-6 mb-6 border border-gray-200 rounded-2xl">
          <Text className="text-2xl font-bold text-gray-400">Php 5,000</Text>
          <Text className="mt-1 text-sm text-gray-500">Total Toll Fee</Text>
        </View>

        {/* Form Fields */}
        <Select
          label="Expressway"
          placeholder="Select expressway"
          data={[{label: "NLEX-SCTEX", value: "nlex"}]}
        />
        <Select
          label="Origin"
          placeholder="Select origin"
          data={[{label: "Balintawak", value: "balintawak"}]}
        />
        <Select
          label="Destination"
          placeholder="Select destination"
          data={[{label: "Clark", value: "clark"}]}
        />
        <Select
          label="Vehicle Class"
          placeholder="Select vehicle class"
          data={[
            {label: "Class 1", value: "class1"},
            {label: "Class 2", value: "class2"},
          ]}
        />

        {/* Add Trip Button */}
        <Pressable className="py-4 mt-auto mb-5 bg-[#FFA840] rounded-xl">
          <Text className="text-base font-semibold text-center text-white">
            Add trip
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
