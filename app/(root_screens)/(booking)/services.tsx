import {Ionicons} from "@expo/vector-icons";
import {router} from "expo-router";
import React from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import {SafeAreaView, useSafeAreaInsets} from "react-native-safe-area-context";

const Services = () => {
  const insets = useSafeAreaInsets();

  const serviceAddons = [
    {
      id: 1,
      name: "Standard service free",
      price: null,
      icon: "📦",
      checked: true,
    },
    {
      id: 2,
      name: "Toll and Parking Fee",
      price: null,
      icon: "🚗",
      checked: true,
    },
    {id: 3, name: "Small Truck", price: "Php 100", icon: "🚚", checked: true},
    {id: 4, name: "Safety Shoes", price: "Php 100", icon: "👞", checked: true},
    {
      id: 5,
      name: "1 Extra Helper",
      price: "Php 100",
      icon: "🧑",
      checked: true,
    },
    {id: 6, name: "Reflector Vest", price: null, icon: "🦺", checked: false},
    {id: 7, name: "Extra Space", price: null, icon: "📦", checked: false},
    {id: 8, name: "Fire Extinguisher", price: null, icon: "🧯", checked: false},
    {id: 9, name: "Document Print", price: null, icon: "📄", checked: false},
    {id: 10, name: "FastMet ID", price: null, icon: "🪪", checked: false},
  ];

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "white"}}>
      <View className="relative flex-row items-center justify-center px-6 pt-2 pb-4">
        <Pressable className="absolute left-5" onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={28} color="#FFA840" />
        </Pressable>
        <Text className="text-lg font-semibold">Services</Text>
        <Text
          className="font-semibold"
          style={{position: "absolute", right: 24}}
        >
          Step 2/3
        </Text>
      </View>
      <KeyboardAvoidingView className="flex-1" behavior="padding">
        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{paddingBottom: insets.bottom + 40}}
        >
          {/* Summary Card */}
          <View className="flex-row justify-around py-4 mt-4 border-2 rounded-lg border-lightPrimary">
            <View className="items-center">
              <Text className="mb-1 text-xs font-semibold text-lightPrimary">
                Price:
              </Text>
              <Text className="text-base font-bold">Php 5,500</Text>
            </View>
            <View className="items-center">
              <Text className="mb-1 text-xs font-semibold text-lightPrimary">
                Distance:
              </Text>
              <Text className="text-base font-bold">1,000km</Text>
            </View>
            <View className="items-center">
              <Text className="mb-1 text-xs font-semibold text-lightPrimary">
                Time:
              </Text>
              <Text className="text-base font-bold">18hr: 23min</Text>
            </View>
          </View>

          {/* Services Add's on */}
          <Text className="mt-6 mb-4 text-lg font-bold">Services Add's on</Text>

          {/* Service Items */}
          <View className="gap-3 mb-6">
            {serviceAddons.map((service) => (
              <View
                key={service.id}
                className="flex-row items-center justify-between p-3 border border-gray-300 rounded-lg"
              >
                <View className="flex-row items-center flex-1 gap-3">
                  <View className="items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                    <Text className="text-xl">{service.icon}</Text>
                  </View>
                  <View className="flex-1 gap-1">
                    <Text className="text-sm font-semibold">
                      {service.name}
                    </Text>
                    {service.price && (
                      <Text className="text-sm font-semibold text-darkPrimary">
                        {service.price}
                      </Text>
                    )}
                  </View>
                </View>
                <View
                  className={`w-6 h-6 rounded items-center justify-center ${
                    service.checked ? "bg-lightPrimary" : "bg-gray-300"
                  }`}
                >
                  {service.checked && (
                    <Ionicons name="checkmark" size={16} color="white" />
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* Note and attachment */}
          <Text className="mb-3 text-lg font-bold">Note and attachment</Text>
          <TextInput
            multiline
            numberOfLines={4}
            placeholder="Type here..."
            style={{height: 120, textAlignVertical: "top"}}
            className="p-4 border border-gray-300 rounded-lg"
          />

          {/* Payment Review Button */}
        </ScrollView>
      </KeyboardAvoidingView>

      <View
        className="items-center justify-center"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: insets.bottom + 10, // respect safe area
        }}
      >
        <Pressable className="self-center px-10 py-4 rounded-lg bg-lightPrimary">
          <Text className="text-base font-bold text-center text-white">
            Payment Review
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Services;
