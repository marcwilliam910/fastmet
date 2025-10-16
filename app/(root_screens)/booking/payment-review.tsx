import BookedDetailsCard from "@/components/maps/BookedDetails";
import PaymentSheet from "@/components/maps/PaymentSheet";
import {useBookStore} from "@/store/useBookStore";
import {Service} from "@/types/book";
import {defaultService} from "@/utils/constants";
import {Ionicons} from "@expo/vector-icons";
import {router} from "expo-router";
import {useEffect, useState} from "react";
import {
  KeyboardAvoidingView,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import {SafeAreaView, useSafeAreaInsets} from "react-native-safe-area-context";
import {ServiceCard} from "./services";

export default function PaymentReview() {
  const addedServices = useBookStore((state) => state.addedServices);
  const toggleService = useBookStore((state) => state.toggleService);
  const [newServices, setNewServices] = useState<Service[]>([]);

  const inset = useSafeAreaInsets();

  useEffect(() => {
    setNewServices(addedServices.slice(2));
  }, []);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "white"}}>
      {/* Header */}
      <View className="relative flex-row items-center justify-center px-6 pt-2 pb-4">
        <Pressable
          className="absolute left-5 top-1.5"
          onPress={() => router.back()}
        >
          <Ionicons name="chevron-back" size={28} color="#FFA840" />
        </Pressable>
        <Text className="text-lg font-semibold">Payment Review</Text>
        <Text className="absolute text-sm font-semibold right-5 top-3.5">
          Step 3/3
        </Text>
      </View>

      <KeyboardAvoidingView className="flex-1" behavior="padding">
        <ScrollView
          className="flex-1 px-4"
          contentContainerStyle={{
            paddingBottom: inset.bottom + (inset.bottom === 0 ? 120 : 80),
            gap: 25,
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

          <View className="gap-3">
            {/* Services Add's on */}
            <Text className="text-lg font-bold">
              Services Add-Ons ({addedServices.length})
            </Text>
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
            {newServices.map((service) => {
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
          <View className="gap-3">
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

      <PaymentSheet />

      {/* confirm btn */}

      <View
        className="flex-row px-4 py-2 bg-white"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          // bottom: insets.bottom + 10, // respect safe area
          bottom: 0,
          paddingBottom: inset.bottom + 10,
        }}
      >
        <Pressable
          disabled={true}
          className={`flex-row items-center justify-between flex-1 px-6 py-4 rounded-lg bg-lightPrimary active:bg-darkPrimary ${false ? "" : "opacity-70"}`}
        >
          <Text className="text-lg font-semibold text-white">Confirm</Text>
          <Text className="text-lg font-semibold text-white">Php 5,500</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
