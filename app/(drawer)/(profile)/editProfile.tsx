import CustomKeyAvoidingView from "@/components/CustomKeyAvoid";
import {Ionicons} from "@expo/vector-icons";
import {Image} from "expo-image";
import {router} from "expo-router";
import React from "react";
import {Pressable, Text, TextInput, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

const EditProfile = () => {
  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}} edges={["bottom"]}>
      <CustomKeyAvoidingView>
        <View className="gap-6 px-6 pt-6 ">
          {/* profile picture */}
          <View className="border border-[#FFA840] rounded-full p-2 self-center">
            <Image
              source={require("@/assets/images/icon.png")}
              // style={{width: 32, height: 32}}
              style={{width: 128, height: 128, borderRadius: 999}}
              contentFit="contain"
            />
            <View
              className="absolute p-2 bg-white rounded-full bottom-2 right-2 "
              style={{
                shadowColor: "#000", // color of the shadow
                shadowOffset: {width: 0, height: 2}, // x/y offset
                shadowOpacity: 0.25, // opacity 0–1
                shadowRadius: 3.84, // blur radius
                elevation: 5, // Android only
              }}
            >
              <Ionicons name="camera" size={24} color="#FFA840" />
            </View>
          </View>

          {/* first name */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700 ">
              First Name
            </Text>
            <TextInput
              placeholder="Enter First Name"
              placeholderTextColor="#9CA3AF"
              className="p-4 text-base bg-gray-100 rounded-lg"
            />
          </View>

          {/* middle name */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700 ">
              Middle Name
            </Text>
            <TextInput
              placeholder="Enter Middle Name"
              placeholderTextColor="#9CA3AF"
              className="p-4 text-base bg-gray-100 rounded-lg"
            />
          </View>

          {/* last name */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700 ">
              Last Name
            </Text>
            <TextInput
              placeholder="Enter Last Name"
              placeholderTextColor="#9CA3AF"
              className="p-4 text-base bg-gray-100 rounded-lg"
            />
          </View>

          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700 ">
              Contact Number
            </Text>
            <TextInput
              placeholder="Enter Contact Number"
              placeholderTextColor="#9CA3AF"
              className="p-4 text-base bg-gray-100 rounded-lg"
              keyboardType="phone-pad"
            />
          </View>

          {/* <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700 ">Birthday</Text>

            <Pressable
              onPress={() => setIsDatePickerOpen(true)}
              className="p-4 bg-gray-100 rounded-lg"
            >
              <Text className="text-gray-400">Select Date</Text>
            </Pressable>

            {isDatePickerOpen && (
              <DateTimePicker
                value={new Date()}
                mode="date"
                display="default"
                onChange={(_, selectedDate) => {
                  setIsDatePickerOpen(false);
                  console.log(selectedDate);
                }}
              />
            )}
          </View> */}

          {/*  Button */}
          <View className="my-5 ">
            <Pressable className="items-center py-4 rounded-lg bg-lightPrimary active:bg-darkPrimary">
              <Text className="text-base font-bold text-white">Confirm</Text>
            </Pressable>
            <Pressable
              className="items-center py-4 my-2 border border-gray-300 rounded-lg bg-ctaSecondary active:bg-ctaSecondaryActive"
              onPress={() => router.back()}
            >
              <Text className="text-base font-bold ">Cancel</Text>
            </Pressable>
          </View>
        </View>
      </CustomKeyAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfile;
