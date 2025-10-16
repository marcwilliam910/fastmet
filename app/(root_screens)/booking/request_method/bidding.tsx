import BookedDetailsCard from "@/components/maps/BookedDetails";
import {BidCardProps} from "@/types/book";
import {Ionicons} from "@expo/vector-icons";
import {Image} from "expo-image";
import React, {useState} from "react";
import {Pressable, ScrollView, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import {InfoModal} from ".";
import Header from "../header";

const Bidding = () => {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView className="flex-1 bg-white" style={{paddingBottom: 15}}>
      {/* Header */}
      <Header text="Bidding Request" />

      <View className="flex-1 gap-5 mx-4 mt-6">
        {/* Pick Up Now Card */}
        <BookedDetailsCard />

        {/* Waiting for other drivers to bid */}
        <View className="items-center gap-2">
          <View className="flex-row items-center gap-2">
            <Text className="text-base font-medium text-gray-700">
              Waiting for other drivers to bid
            </Text>
            <Pressable onPress={() => setModalVisible(true)}>
              <Ionicons name="information-circle" size={20} color="#FFA840" />
            </Pressable>
          </View>

          <View className="flex-row items-center justify-center gap-2 px-4 py-2 border rounded-full bg-orange-50 border-lightPrimary">
            <Ionicons name="time-outline" size={18} color="#FFA000" />
            <Text className="text-base font-bold tracking-wide text-darkPrimary">
              3:00
            </Text>
            <Text className="text-sm font-medium text-darkPrimary">
              remaining to bid
            </Text>
          </View>
        </View>

        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            gap: 10,
            paddingBottom: 10,
          }}
        >
          {[1, 2, 3, 4, 5, 6, 7].map((item) => (
            <BidCard
              key={item}
              driverName="Driver’s name"
              rating={3}
              totalBooking={100}
              amount={4802}
            />
          ))}
        </ScrollView>
      </View>
      <InfoModal
        visible={modalVisible}
        setModalVisible={setModalVisible}
        selectedInfo={{
          label: "Bidding Request",
          description:
            "Drivers submit their proposed delivery price through bidding. The sender can review all bids and choose the most suitable offer based on rate, driver rating, and booking history.",
        }}
      />
    </SafeAreaView>
  );
};

export default Bidding;

function BidCard({driverName, rating, totalBooking, amount}: BidCardProps) {
  return (
    <View className={`rounded-xl p-4 border bg-white border-lightPrimary`}>
      <View className="flex-row items-start justify-between">
        {/* Left: Profile and Rating */}
        <View className="flex-row gap-3">
          <Image
            source={require("@/assets/images/user.png")}
            style={{width: 45, height: 45, borderRadius: 9999}}
          />

          <View>
            <Text
              className={`text-base font-semibold 
      text-secondary
              `}
            >
              {driverName}
            </Text>

            <View className="flex-row mt-0.5">
              {Array.from({length: 5}).map((_, i) => (
                <Ionicons
                  key={i}
                  name={i < rating ? "star" : "star-outline"}
                  size={17}
                  color={i < rating ? "#FACC15" : "#D1D5DB"}
                />
              ))}
            </View>
          </View>
        </View>

        {/* Right: Booking count */}
        <Text className={`text-sm font-medium text-gray-600`}>
          {totalBooking} Booking
        </Text>
      </View>

      {/* Bottom section */}
      <View className="flex-row items-center justify-between mt-3">
        <View>
          <Text className="text-sm text-gray-500">Bid amount:</Text>
          <Text
            className={`text-xl font-bold text-secondary
            `}
          >
            Php {amount.toLocaleString()}
          </Text>
        </View>

        <Pressable
          className={`px-5 py-2.5 rounded-lg bg-green-500 active:bg-green-600`}
        >
          <Text className={`text-sm px-3 font-semibold text-white`}>
            Accept
          </Text>
        </Pressable>
      </View>
    </View>
  );
}
