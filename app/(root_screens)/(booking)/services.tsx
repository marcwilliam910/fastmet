import {useBookStore} from "@/store/useBookStore";
import {Service} from "@/types/book";
import {defaultService, serviceAddons} from "@/utils/constants";
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
  const addedServices = useBookStore((state) => state.addedServices);
  const toggleService = useBookStore((state) => state.toggleService);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "white"}}>
      <View className="relative flex-row items-center justify-center px-6 pt-2 pb-4">
        <Pressable
          className="absolute left-5 top-1.5"
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={28} color="#FFA840" />
        </Pressable>
        <Text className="text-lg font-semibold">Services</Text>
        <Text className="absolute text-sm font-semibold right-5 top-3.5">
          Step 2/3
        </Text>
      </View>
      <KeyboardAvoidingView className="flex-1" behavior="padding">
        <ScrollView
          className="flex-1 px-6"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            paddingBottom: insets.bottom + (insets.bottom == 0 ? 70 : 30),
          }}
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
          <Text className="mt-6 mb-4 text-lg font-bold">Services Add-Ons</Text>

          {/* Service Items */}
          <View className="gap-3 mb-6">
            {defaultService.map((service) => (
              <View
                key={service.id}
                className="flex-row items-center justify-between p-3 border border-gray-200 rounded-lg bg-gray-50"
              >
                <View className="flex-row items-center flex-1 gap-3">
                  <View className="items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
                    <Text className="text-xl">{service.icon}</Text>
                  </View>
                  <View className="flex-1 gap-1">
                    <Text className="text-sm font-semibold text-gray-600">
                      {service.name}
                    </Text>
                    {service.price && (
                      <Text className="text-sm font-semibold text-darkPrimary">
                        {service.price}
                      </Text>
                    )}
                  </View>
                </View>
                <View className="items-center justify-center w-6 h-6 rounded bg-lightPrimary">
                  <Ionicons name="checkmark" size={16} color="white" />
                </View>
              </View>
            ))}

            {serviceAddons.map((service) => {
              const isSelected = addedServices.some((s) => s.id === service.id);

              return (
                <ServiceCard
                  key={service.id}
                  service={service}
                  isSelected={isSelected}
                  toggleService={toggleService}
                />
              );
            })}
          </View>

          {/* Note and attachment */}
          <View className="gap-5">
            <View className="gap-2">
              <Text className="text-lg font-bold">Note and attachment</Text>
              <TextInput
                multiline
                numberOfLines={4}
                placeholder="Type here..."
                style={{height: 120, textAlignVertical: "top"}}
                className="p-4 border border-gray-300 rounded-lg"
              />
            </View>

            <View className="gap-2">
              <Text className="text-lg font-bold">Upload Photo</Text>
              <View className="flex-row items-center justify-between gap-2">
                <Pressable className="items-center justify-center flex-1 gap-1 border border-gray-300 h-28 rounded-xl active:bg-gray-100">
                  <Ionicons name="add-outline" size={22} color="gray" />
                </Pressable>
                <Pressable className="items-center justify-center flex-1 gap-1 border border-gray-300 h-28 rounded-xl active:bg-gray-100">
                  <Ionicons name="add-outline" size={22} color="gray" />
                </Pressable>
                <Pressable className="items-center justify-center flex-1 gap-1 border border-gray-300 h-28 rounded-xl active:bg-gray-100">
                  <Ionicons name="add-outline" size={22} color="gray" />
                </Pressable>
              </View>
            </View>
          </View>
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
        <Pressable
          className="self-center px-10 py-4 rounded-lg bg-lightPrimary active:bg-darkPrimary"
          onPress={() =>
            router.push("/(root_screens)/(booking)/payment-review")
          }
        >
          <Text className="text-base font-bold text-center text-white">
            Payment Review
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default Services;

export const ServiceCard = ({
  service,
  isSelected,
  toggleService,
}: {
  service: Service;
  isSelected: boolean;
  toggleService: (service: Service) => void;
}) => {
  return (
    <Pressable
      key={service.id}
      onPress={() => toggleService(service)}
      className="flex-row items-center justify-between p-3 border border-gray-300 rounded-lg active:bg-gray-50"
    >
      <View className="flex-row items-center flex-1 gap-3">
        <View className="items-center justify-center w-10 h-10 bg-gray-100 rounded-lg">
          <Text className="text-xl">{service.icon}</Text>
        </View>
        <View className="flex-1 gap-1">
          <Text className="text-sm font-semibold">{service.name}</Text>
          {service.price && (
            <Text className="text-sm font-semibold text-darkPrimary">
              {service.price}
            </Text>
          )}
        </View>
      </View>
      <View
        className={`w-6 h-6 rounded items-center justify-center ${
          isSelected ? "bg-lightPrimary" : "bg-gray-300"
        }`}
      >
        {isSelected && <Ionicons name="checkmark" size={16} color="white" />}
      </View>
    </Pressable>
  );
};
