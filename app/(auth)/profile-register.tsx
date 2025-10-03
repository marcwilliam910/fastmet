import CustomKeyAvoidingView from "@/components/CustomKeyAvoid";
import {Ionicons} from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import {useRouter} from "expo-router";
import React, {useRef, useState} from "react";
import {Pressable, Text, TextInput, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

export default function ProfileRegistration() {
  const router = useRouter();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const midNameRef = useRef<TextInput | null>(null);
  const lastNameRef = useRef<TextInput | null>(null);

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
      <CustomKeyAvoidingView>
        <View className="justify-center flex-1 gap-6 px-6">
          <Pressable
            onPress={() => router.back()}
            className="absolute top-5 left-5"
          >
            <Ionicons name="chevron-back-outline" size={28} color="#FFA840" />
          </Pressable>

          {/* profile picture */}
          <View className="items-center gap-3 jusctify-center">
            <Pressable className="items-center justify-center border rounded-full size-48 border-lightPrimary">
              <View className="items-center justify-center bg-gray-100 rounded-full size-40">
                <Text className="font-semibold text-gray-400">Photo</Text>
              </View>
            </Pressable>
            <Text className="text-lg font-bold text-gray-700 ">Profile</Text>
          </View>
          {/* first name */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700 ">
              First Name
            </Text>
            <TextInput
              placeholder="Enter First Name"
              placeholderTextColor="#9CA3AF"
              returnKeyType="next"
              onSubmitEditing={() => midNameRef.current?.focus()}
              submitBehavior="submit"
              className="p-4 text-base bg-gray-100 rounded-lg"
            />
          </View>

          {/* middle name */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700 ">
              Middle Name
            </Text>
            <TextInput
              ref={midNameRef}
              placeholder="Enter Middle Name"
              placeholderTextColor="#9CA3AF"
              returnKeyType="next"
              onSubmitEditing={() => lastNameRef.current?.focus()}
              submitBehavior="submit"
              className="p-4 text-base bg-gray-100 rounded-lg"
            />
          </View>

          {/* last name */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700 ">
              Last Name
            </Text>
            <TextInput
              ref={lastNameRef}
              placeholder="Enter Last Name"
              placeholderTextColor="#9CA3AF"
              className="p-4 text-base bg-gray-100 rounded-lg"
            />
          </View>

          <View className="gap-2">
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
                // iOS
                textColor="#FFA840"
                themeVariant="light"
                // Android 12+
                accentColor="#FFA840"
              />
            )}
          </View>

          {/*  Button */}
          <Pressable className="items-center py-4 my-2 rounded-lg bg-lightPrimary active:bg-darkPrimary">
            <Text className="text-base font-bold text-white">Create</Text>
          </Pressable>
        </View>
      </CustomKeyAvoidingView>
    </SafeAreaView>
  );
}
