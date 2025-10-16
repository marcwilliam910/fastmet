import {BidCardProps} from "@/types/book";
import {Ionicons} from "@expo/vector-icons";
import BottomSheet, {BottomSheetScrollView} from "@gorhom/bottom-sheet";
import {Image} from "expo-image";
import React, {useMemo, useRef, useState} from "react";
import {Pressable, Text, View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import InfoModal from "../modals/infoModal";

const BiddingSheet = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const inset = useSafeAreaInsets();
  const sheetRef = useRef<BottomSheet>(null);
  // Convert 40% to actual pixels, then subtract inset.bottom
  const snapPoints = useMemo(() => ["14%", "80%"], []);
  return (
    <BottomSheet
      ref={sheetRef}
      index={1}
      enableDynamicSizing={false}
      enableContentPanningGesture={false} // 👈 This is the key
      snapPoints={snapPoints}
      handleIndicatorStyle={{backgroundColor: "#FFA840"}}
      bottomInset={inset.bottom}
      backgroundStyle={{borderWidth: 1, borderColor: "#e5e7eb"}}
    >
      <View className="items-center gap-2 pt-2 pb-4 border-b border-gray-200">
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
      <BottomSheetScrollView
        className="px-4"
        contentContainerStyle={{
          gap: 8,
          paddingBottom: 20,
          paddingTop: 15,
        }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
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
      </BottomSheetScrollView>
      <InfoModal
        visible={modalVisible}
        setModalVisible={setModalVisible}
        selectedInfo={{
          label: "Bidding Request",
          description:
            "Once you submit a bidding request, drivers nearby have 3 minutes to respond with their offers. This short window ensures quick matching and keeps your delivery moving fast. If no driver bids within that time, you can try again or adjust your request.",
        }}
      />
    </BottomSheet>
  );
};

export default BiddingSheet;

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
