import CustomKeyAvoidingView from "@/components/CustomKeyAvoid";
import LoadingModal from "@/components/modals/loading";
import SuccessModal from "@/components/modals/successModal";
import useAuth from "@/hooks/useAuth";
import {useAuthGuard} from "@/hooks/useAuthGuard";
import {useUpdateProfile} from "@/mutations/userMutations";
import {ProfileSchema} from "@/schemas/authSchema";
import {useProfileStore} from "@/store/useProfileStore";
import {User} from "@/types/user";
import {openGallery} from "@/utils/imagePicker";
import {validateForm} from "@/utils/validateForm";
import {Ionicons} from "@expo/vector-icons";
import {Image} from "expo-image";
import {router} from "expo-router";
import React, {useEffect, useRef, useState} from "react";
import {
  findNodeHandle,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  UIManager,
  View,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

const EditProfile = () => {
  const profile = useProfileStore((state) => state.profile);
  const setProfile = useProfileStore((state) => state.setProfile);

  const {user} = useAuth();
  const {isAuthenticated} = useAuthGuard();

  const mnameRef = useRef<TextInput>(null);
  const lnameRef = useRef<TextInput>(null);
  const numRef = useRef<TextInput>(null);
  const scrollRef = useRef<ScrollView>(null);
  const [form, setForm] = useState<Partial<User>>({
    firstName: "",
    middleName: "",
    lastName: "",
    contactNumber: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSuccess, setIsSuccess] = useState(false);

  const {mutate, isPending} = useUpdateProfile();

  useEffect(() => {
    if (profile) {
      setForm({
        firstName: profile.firstName,
        middleName: profile.middleName || "",
        lastName: profile.lastName,
        contactNumber: profile.contactNumber || "",
      });
    }
  }, [profile]);

  const onFormChange = (name: string, value: string) => {
    setForm({...form, [name]: value});
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
              scrollRef.current?.scrollTo({y: y, animated: true});
            }
          );
        }
      }
    }, 100);
  };

  const pickProfilePic = async () => {
    const result = await openGallery();
    if (result && !result.canceled && result.assets[0]) {
      console.log(result.assets[0].uri);
    }
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
        uid: user!.uid,
        user: form,
      },
      {
        onSuccess: () => {
          setIsSuccess(true);
          setProfile({...profile!, ...form});
          console.log("Profile updated successfully");
        },
      }
    );
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}} edges={["bottom"]}>
      <CustomKeyAvoidingView ref={scrollRef}>
        <View className="gap-6 px-6 pt-6 ">
          {/* profile picture */}
          <Pressable
            className="border border-[#FFA840] rounded-full p-2 self-center active:bg-gray-100"
            onPress={pickProfilePic}
          >
            <Image
              source={
                profile?.profilePictureUrl
                  ? {uri: profile.profilePictureUrl}
                  : require("@/assets/images/user.png")
              } // style={{width: 32, height: 32}}
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
          </Pressable>

          {/* first name */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700 ">
              First Name
            </Text>
            <TextInput
              value={form.firstName}
              onChangeText={(text) => onFormChange("firstName", text)}
              onSubmitEditing={() => mnameRef.current?.focus()}
              returnKeyType="next"
              submitBehavior="submit"
              placeholder="Enter First Name"
              placeholderTextColor="#9CA3AF"
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
              value={form.middleName}
              onChangeText={(text) => onFormChange("middleName", text)}
              ref={mnameRef}
              onSubmitEditing={() => lnameRef.current?.focus()}
              onFocus={() =>
                scrollToInput(mnameRef as React.RefObject<TextInput>)
              }
              submitBehavior="submit"
              returnKeyType="next"
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
              value={form.lastName}
              onChangeText={(text) => onFormChange("lastName", text)}
              ref={lnameRef}
              onSubmitEditing={() => numRef.current?.focus()}
              onFocus={() =>
                scrollToInput(lnameRef as React.RefObject<TextInput>)
              }
              submitBehavior="submit"
              returnKeyType="next"
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
            <Text className="text-sm font-medium text-gray-700 ">
              Contact Number
            </Text>
            <TextInput
              value={form.contactNumber}
              onChangeText={(text) => onFormChange("contactNumber", text)}
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
          <View className="my-5 ">
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
              className="items-center py-4 my-2 border border-gray-300 rounded-lg bg-ctaSecondary active:bg-ctaSecondaryActive"
              onPress={() => router.back()}
            >
              <Text className="text-base font-bold ">Back</Text>
            </Pressable>
          </View>
        </View>
      </CustomKeyAvoidingView>
      <LoadingModal visible={isPending} />
      <SuccessModal
        visible={isSuccess}
        text="Profile successfully updated!"
        setVisible={setIsSuccess}
      />
    </SafeAreaView>
  );
};

export default EditProfile;
