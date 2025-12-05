import CustomKeyAvoidingView from "@/components/CustomKeyAvoid";
import SuccessModal from "@/components/modals/successModal";
import { useAuth } from "@/hooks/useAuth";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useUpdateProfile } from "@/mutations/userMutations";
import { ProfileSchema } from "@/schemas/authSchema";
import { useAppStore } from "@/store/useAppStore";
import { NewUser } from "@/types/user";
import { openGallery } from "@/utils/imagePicker";
import { validateForm } from "@/utils/validateForm";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  findNodeHandle,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  UIManager,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const EditProfile = () => {
  const name = useAppStore((state) => state.name);
  const phoneNumber = useAppStore((state) => state.phoneNumber);
  const profilePictureUrl = useAppStore((state) => state.profilePictureUrl);

  const { id } = useAuth();

  const { isAuthenticated } = useAuthGuard();

  const numRef = useRef<TextInput>(null);
  const scrollRef = useRef<ScrollView>(null);
  const [form, setForm] = useState<Partial<NewUser>>({
    fullName: "",
    phoneNumber: "",
    profilePictureUrl: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const { mutate, isPending } = useUpdateProfile();

  const setLoading = useAppStore((state) => state.setLoading);

  useEffect(() => {
    if (isPending) setLoading(true);
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending]);

  useEffect(() => {
    setForm({
      fullName: name,
      phoneNumber: phoneNumber,
      profilePictureUrl: profilePictureUrl,
    });
  }, [name, phoneNumber, profilePictureUrl]);

  const onFormChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const scrollToInput = (ref: React.RefObject<TextInput>) => {
    setTimeout(() => {
      if (ref.current && scrollRef.current) {
        const node = findNodeHandle(ref.current);
        if (node) {
          UIManager.measureLayout(
            node,
            findNodeHandle(scrollRef.current) as number,
            () => {},
            (x, y) => {
              scrollRef.current?.scrollTo({ y: y, animated: true });
            }
          );
        }
      }
    }, 100);
  };

  const pickProfilePic = async () => {
    setLoading(true);
    const result = await openGallery();
    if (result && !result.canceled && result.assets[0]) {
      console.log(result.assets[0].uri);
      setForm({ ...form, profilePictureUrl: result.assets[0].uri });
    }
    setLoading(false);
  };

  const onSubmit = async () => {
    const result = validateForm(ProfileSchema, form);

    if (!result.success) {
      setErrors(result.errors);
      return;
    }
    setErrors({});

    if (!isAuthenticated()) return;

    mutate(
      {
        id: id!,
        user: form,
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
          useAppStore.getState().setAuthData({
            name: form.fullName,
            phoneNumber: form.phoneNumber,
            profilePictureUrl: form.profilePictureUrl,
          });
          console.log("Profile updated successfully");
        },
      }
    );
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "#fff" }}
      edges={["bottom"]}
    >
      <CustomKeyAvoidingView ref={scrollRef}>
        <View className="gap-6 px-6 pt-6 flex-1">
          {/* profile picture */}
          <Pressable
            className="border border-[#FFA840] rounded-full p-2 self-center active:bg-gray-100"
            onPress={pickProfilePic}
          >
            <Image
              source={
                form.profilePictureUrl
                  ? { uri: form.profilePictureUrl }
                  : require("@/assets/images/user.png")
              } // style={{width: 32, height: 32}}
              style={{ width: 128, height: 128, borderRadius: 999 }}
              contentFit="contain"
            />

            {form.profilePictureUrl && (
              <Pressable
                className="absolute p-1 bg-white rounded-full right-2 top-2"
                onPress={() =>
                  setForm((prev) => ({ ...prev, profilePictureUrl: "" }))
                }
              >
                <Ionicons
                  name="close-outline"
                  size={24}
                  color="red"
                  className="font-bold"
                />
              </Pressable>
            )}

            <View
              className="absolute p-2 bg-white rounded-full bottom-2 right-2 "
              style={{
                shadowColor: "#000", // color of the shadow
                shadowOffset: { width: 0, height: 2 }, // x/y offset
                shadowOpacity: 0.25, // opacity 0–1
                shadowRadius: 3.84, // blur radius
                elevation: 5, // Android only
              }}
            >
              <Ionicons name="camera" size={24} color="#FFA840" />
            </View>
          </Pressable>

          {/* first name */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700 ">
              Full Name
            </Text>
            <TextInput
              value={form.fullName}
              onChangeText={(text) => onFormChange("fullName", text)}
              onSubmitEditing={() => numRef.current?.focus()}
              returnKeyType="next"
              submitBehavior="submit"
              placeholder="Enter Name"
              placeholderTextColor="#9CA3AF"
              className={`p-4 text-base bg-gray-100 rounded-lg ${
                errors.fullName ? "border border-red-500" : ""
              }`}
            />
            {errors.fullName && (
              <Text className="text-xs text-red-500">{errors.fullName}</Text>
            )}
          </View>

          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700 ">
              Phone Number
            </Text>
            <TextInput
              value={form.phoneNumber}
              onChangeText={(text) => onFormChange("phoneNumber", text)}
              ref={numRef}
              onFocus={() =>
                scrollToInput(numRef as React.RefObject<TextInput>)
              }
              placeholder="ex. 09xxxxxxxxx"
              placeholderTextColor="#9CA3AF"
              className={`p-4 text-base bg-gray-100 rounded-lg ${
                errors.contactNumber ? "border border-red-500" : ""
              }`}
              keyboardType="phone-pad"
            />
            {errors.contactNumber && (
              <Text className="text-xs text-red-500">
                {errors.contactNumber}
              </Text>
            )}
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
          <View className="absolute bottom-6 left-0 right-0 mx-6">
            <Pressable
              className="items-center py-4 rounded-lg bg-lightPrimary active:bg-darkPrimary"
              disabled={isPending}
              onPress={onSubmit}
            >
              <Text className="text-base font-bold text-white">
                Update Profile
              </Text>
            </Pressable>
            <Pressable
              className="items-center py-4 my-2 border border-gray-200 rounded-lg bg-ctaSecondary active:bg-ctaSecondaryActive"
              onPress={() => router.back()}
            >
              <Text className="text-base font-bold ">Back</Text>
            </Pressable>
          </View>
        </View>
      </CustomKeyAvoidingView>
      <SuccessModal
        visible={isSuccess}
        text="Profile successfully updated!"
        setVisible={setIsSuccess}
      />
    </SafeAreaView>
  );
};

export default EditProfile;
