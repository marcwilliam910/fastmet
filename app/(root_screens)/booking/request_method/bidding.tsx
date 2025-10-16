import BiddingSheet from "@/components/maps/BiddingSheet";
import BookedDetailsCard from "@/components/maps/BookedDetails";
import {useBookStore} from "@/store/useBookStore";
import {Image} from "expo-image";
import React from "react";
import {FlatList, ScrollView, Text, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";
import HeaderRoot from "../../../../components/headers/HeaderRoot";

const Bidding = () => {
  const addedServices = useBookStore((state) => state.addedServices);

  return (
    <SafeAreaView className="flex-1 bg-white">
      {/* Header */}
      <HeaderRoot text="Bidding Request" />

      <ScrollView
        className="flex-1 mx-4 mt-4"
        contentContainerStyle={{
          paddingBottom: 140,
          gap: 20,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Pick Up Now Card */}
        <BookedDetailsCard />

        {/* Pickup and Drop Point */}
        <View className="gap-3">
          <Text className="text-lg font-bold">Pickup and Drop Point</Text>

          <View className="gap-4 p-4 border border-gray-100 bg-gray-50 rounded-2xl">
            {/* Pickup */}
            <View className="flex-row items-start gap-3">
              <View className="w-3 h-3 mt-1.5 rounded-full bg-green-500" />
              <View className="flex-1 gap-1">
                <Text className="text-[15px] font-semibold text-gray-800">
                  Balagtas Bulacan
                </Text>
                <Text className="text-sm text-gray-600">
                  Balagtas Bulacan 37 street building 657
                </Text>
                <Text className="text-sm text-gray-600">
                  Jonathan B ·{" "}
                  <Text className="font-medium">0923 734 2345</Text>
                </Text>
              </View>
            </View>

            {/* Divider */}
            <View className="h-[1px] bg-gray-200 mx-1" />

            {/* Drop */}
            <View className="flex-row items-start gap-3">
              <View className="w-3 h-3 mt-1.5 rounded-full bg-red-500" />
              <View className="flex-1 gap-1">
                <Text className="text-[15px] font-semibold text-gray-800">
                  Marilao
                </Text>
                <Text className="text-sm text-gray-600">
                  Marilao Street, JCS Building
                </Text>
                <Text className="text-sm text-gray-600">
                  <Text className="font-medium">0923 734 2345</Text>
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Service Add-ons */}
        <FlatList
          data={addedServices}
          keyExtractor={(item) => item.id}
          numColumns={2}
          scrollEnabled={false}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{gap: 10}}
          columnWrapperStyle={{
            gap: 10,
            justifyContent: "flex-start", // aligns items to the left
          }}
          ListHeaderComponent={
            <View>
              <Text className="text-lg font-bold">
                Service Add-ons{" "}
                {addedServices.length > 0 && `(${addedServices.length})`}
              </Text>
            </View>
          }
          renderItem={({item}) => (
            <View
              style={{width: 160}} // fixed width for consistent layout (or 48%)
              className="flex-row items-center gap-3 p-3 bg-white border border-gray-200 rounded-xl"
            >
              <Text className="text-lg">{item.icon}</Text>
              <View className="flex-1">
                <Text
                  className="text-sm font-semibold text-gray-800"
                  numberOfLines={1}
                >
                  {item.name}
                </Text>
                {item.price && (
                  <Text className="text-xs text-gray-500">{item.price}</Text>
                )}
              </View>
            </View>
          )}
        />

        {/* Note and attachment */}
        <View className="gap-5">
          <View className="gap-2">
            <Text className="text-lg font-bold">Note and attachment</Text>
            <Text className="text-sm text-gray-500">
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Laborum
              nemo, unde hic ut provident aut totam harum dignissimos quibusdam
              nisi. Quasi commodi ipsum veniam sed qui ipsa incidunt corporis
              velit!
            </Text>
          </View>

          <View className="gap-3">
            <Text className="text-lg font-bold">Uploaded Photo</Text>
            <View className="flex-row items-center gap-2">
              <View className="px-3 border border-gray-400 rounded-md">
                <Image
                  source={require("@/assets/vehicle/truck.png")}
                  style={{width: 80, height: 80}}
                />
              </View>
              <View className="px-3 border border-gray-400 rounded-md">
                <Image
                  source={require("@/assets/vehicle/truck.png")}
                  style={{width: 80, height: 80}}
                />
              </View>
              {/* <View className="px-3 border border-gray-400 rounded-md">
                <Image
                  source={require("@/assets/vehicle/truck.png")}
                  style={{width: 80, height: 80}}
                />
              </View> */}
            </View>
          </View>
        </View>
      </ScrollView>

      <BiddingSheet />
    </SafeAreaView>
  );
};

export default Bidding;
