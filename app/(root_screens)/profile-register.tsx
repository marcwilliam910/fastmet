import CustomKeyAvoidingView from "@/components/CustomKeyAvoid";
import LoadingModal from "@/components/modals/loading";
import {ProfileSchema} from "@/schemas/authSchema";
import {openGallery} from "@/utils/imagePicker";
import {validateForm} from "@/utils/validateForm";
import {Ionicons} from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import {useRouter} from "expo-router";
import React, {useRef, useState} from "react";
import {Pressable, Text, TextInput, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

export default function ProfileRegistration() {
  const router = useRouter();
  const [isDatePickerOpen, setIsDatePickerOpen] = useState(false);
  const [form, setForm] = useState({
    firstName: "",
    midName: "",
    lastName: "",
    birthday: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const midNameRef = useRef<TextInput | null>(null);
  const lastNameRef = useRef<TextInput | null>(null);

  const pickProfilePic = async () => {
    const result = await openGallery();
    if (result && !result.canceled && result.assets[0]) {
      console.log(result.assets[0].uri);
    }
  };

  const onFormChange = (name: string, value: string) => {
    setForm({...form, [name]: value});
  };

  const onSubmit = () => {
    const result = validateForm(ProfileSchema, form);

    if (!result.success) {
      setErrors(result.errors);
      return;
    }
    setErrors({});

    try {
      setLoading(true);
      console.log(form);
    } catch (error) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
      <CustomKeyAvoidingView>
        <View className="justify-center flex-1 gap-6 p-6">
          <Pressable
            onPress={() => router.back()}
            className="absolute top-5 left-5"
          >
            <Ionicons name="chevron-back-outline" size={28} color="#FFA840" />
          </Pressable>

          {/* profile picture */}
          <View className="items-center gap-3 jusctify-center">
            <Pressable
              className="items-center justify-center border rounded-full size-48 border-lightPrimary active:border-2"
              onPress={pickProfilePic}
            >
              <View className="items-center justify-center bg-gray-100 rounded-full size-40">
                <Ionicons name="camera" size={24} color="#FFA840" />
              </View>
            </Pressable>
            <Text className="text-lg font-bold text-gray-700 ">Profile</Text>
          </View>
          {/* first name */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700 ">
              First Name <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              value={form.firstName}
              onChangeText={(text) => onFormChange("firstName", text)}
              placeholder="Enter First Name"
              placeholderTextColor="#9CA3AF"
              returnKeyType="next"
              onSubmitEditing={() => midNameRef.current?.focus()}
              submitBehavior="submit"
              className={`p-4 text-base bg-gray-100 rounded-lg ${
                errors.firstName ? "border border-red-500" : ""
              }`}
            />
            {errors.firstName && (
              <Text className="text-xs text-red-500">{errors.firstName}</Text>
            )}
          </View>

          {/* middle name */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700 ">
              Middle Name
            </Text>
            <TextInput
              value={form.midName}
              onChangeText={(text) => onFormChange("midName", text)}
              ref={midNameRef}
              placeholder="Enter Middle Name"
              placeholderTextColor="#9CA3AF"
              returnKeyType="next"
              onSubmitEditing={() => lastNameRef.current?.focus()}
              submitBehavior="submit"
              className={`p-4 text-base bg-gray-100 rounded-lg ${
                errors.midName ? "border border-red-500" : ""
              }`}
            />
          </View>

          {/* last name */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700 ">
              Last Name <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              ref={lastNameRef}
              value={form.lastName}
              onChangeText={(text) => onFormChange("lastName", text)}
              placeholder="Enter Last Name"
              placeholderTextColor="#9CA3AF"
              className={`p-4 text-base bg-gray-100 rounded-lg ${
                errors.lastName ? "border border-red-500" : ""
              }`}
            />
            {errors.lastName && (
              <Text className="text-xs text-red-500">{errors.lastName}</Text>
            )}
          </View>

          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700 ">Birthday</Text>

            <Pressable
              onPress={() => setIsDatePickerOpen(true)}
              className={`p-4 bg-gray-100 rounded-lg `}
            >
              <Text className={`${form.birthday ? "" : "text-gray-400"}`}>
                {form.birthday != ""
                  ? new Date(form.birthday).toDateString()
                  : "Select date"}
              </Text>
            </Pressable>

            {isDatePickerOpen && (
              <DateTimePicker
                value={new Date(form.birthday)}
                mode="date"
                display="default"
                maximumDate={new Date()}
                minimumDate={new Date("1930-01-01")}
                onChange={(_, selectedDate) => {
                  setIsDatePickerOpen(false);
                  console.log(selectedDate);
                  if (selectedDate) {
                    onFormChange("birthday", selectedDate.toISOString());
                  }
                }}
                // iOS
                textColor="#FFA840"
                themeVariant="light"
                // Android 12+
                accentColor="#FFA840"
              />
            )}
          </View>

          <View className="mt-4">
            {/*  Button */}
            <Pressable
              className="items-center py-4 my-2 rounded-lg bg-lightPrimary active:bg-darkPrimary"
              onPress={onSubmit}
            >
              <Text className="text-base font-bold text-white">Create</Text>
            </Pressable>
            {/* secondary button */}
            <Pressable
              onPress={() => router.push("/(drawer)/(tabs)")}
              className="items-center py-4 my-2 border rounded-lg border-lightPrimary active:border-darkPrimary"
            >
              <Text className="text-base font-bold text-lightPrimary">
                Skip for now
              </Text>
            </Pressable>
          </View>
        </View>
      </CustomKeyAvoidingView>
      <LoadingModal visible={loading} />
    </SafeAreaView>
  );
}
