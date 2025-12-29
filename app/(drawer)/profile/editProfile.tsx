import CustomKeyAvoidingView from "@/components/CustomKeyAvoid";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import api from "@/lib/axios";
import { ProfileSchema } from "@/schemas/authSchema";
import { useAppStore } from "@/store/useAppStore";
import { openGallery } from "@/utils/imagePicker";
import { validateForm } from "@/utils/validateForm";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import {
  Alert,
  findNodeHandle,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  UIManager,
  View,
} from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const EditProfile = () => {
  const { isAuthenticated } = useAuthGuard();

  const inset = useSafeAreaInsets();

  const numRef = useRef<TextInput>(null);
  const scrollRef = useRef<ScrollView>(null);
  const [form, setForm] = useState<{ [key: string]: string }>({
    fullName: "",
    profilePictureUrl: "",
    phoneNumber: "",
    address: "",
    gender: "",
  });
  // Store original values to compare against
  const [originalForm, setOriginalForm] = useState<{ [key: string]: string }>({
    fullName: "",
    profilePictureUrl: "",
    phoneNumber: "",
    address: "",
    gender: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const setLoading = useAppStore((state) => state.setLoading);
  const loading = useAppStore((state) => state.isLoading);

  const name = useAppStore((state) => state.name);
  const profilePictureUrl = useAppStore((state) => state.profilePictureUrl);
  const phoneNumber = useAppStore((state) => state.phoneNumber);
  const address = useAppStore((state) => state.address);
  const gender = useAppStore((state) => state.gender);

  const input1Ref = useRef<TextInput>(null);
  const input2Ref = useRef<TextInput>(null);

  useEffect(() => {
    setForm({
      fullName: name,
      profilePictureUrl: profilePictureUrl,
      phoneNumber: phoneNumber,
      address: address || "",
      gender: gender || "",
    });
  }, [name, profilePictureUrl, phoneNumber, address, gender]);

  useEffect(() => {
    const initialData = {
      fullName: name,
      profilePictureUrl: profilePictureUrl,
      phoneNumber: phoneNumber,
      address: address || "",
      gender: gender || "",
    };

    setForm(initialData);
    setOriginalForm(initialData); // Store original values
  }, [name, profilePictureUrl, phoneNumber, address, gender]);

  // Check if form has changes
  const hasChanges = () => {
    // Check if image was deleted
    if (
      form.profilePictureUrl === "" &&
      originalForm.profilePictureUrl !== ""
    ) {
      return true;
    }

    // Check if new image was selected
    if (selectedAsset) {
      return true;
    }

    // Check text fields
    return (
      form.fullName !== originalForm.fullName ||
      form.address !== originalForm.address ||
      form.gender !== originalForm.gender
    );
  };

  const isButtonDisabled = loading || !hasChanges();

  const onFormChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const scrollToInput = (ref: React.RefObject<TextInput | null>) => {
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
      setSelectedAsset(result.assets[0]); // Store the asset
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

    setLoading(true);

    const formData = new FormData();
    formData.append("fullName", form.fullName);
    formData.append("address", form.address);
    formData.append("gender", form.gender || "");

    // Handle profile picture deletion
    if (!form.profilePictureUrl) {
      formData.append("deleteProfilePicture", "true");
    }
    // Handle new profile picture upload
    else if (selectedAsset) {
      formData.append("profilePicture", {
        uri: selectedAsset.uri,
        type: selectedAsset.mimeType || "image/jpeg",
        name: selectedAsset.fileName || "profile.jpg",
      } as any);
    }

    try {
      const response = await api.patch("/profile/update-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${useAppStore.getState().token}`,
        },
      });

      if (response.data.success) {
        Toast.show({
          type: "success",
          text1: "Success",
          text2: "Profile updated successfully",
          position: "top",
          visibilityTime: 5_000,
          swipeable: true,
          topOffset: 50,
        });

        const updatedData = {
          name: response.data.user.fullName,
          profilePictureUrl: response.data.user.profilePictureUrl || "",
          address: response.data.user.address,
          gender: response.data.user.gender,
        };

        useAppStore.getState().setAuthData(updatedData);

        // Reset selectedAsset since image is now uploaded
        setSelectedAsset(null);

        // Update originalForm to match new current state
        setOriginalForm({
          fullName: response.data.user.fullName,
          profilePictureUrl: response.data.user.profilePictureUrl || "",
          phoneNumber: form.phoneNumber,
          address: response.data.user.address,
          gender: response.data.user.gender,
        });

        // Update form with server response (in case server modified anything)
        setForm({
          fullName: response.data.user.fullName,
          profilePictureUrl: response.data.user.profilePictureUrl || "",
          phoneNumber: form.phoneNumber,
          address: response.data.user.address,
          gender: response.data.user.gender,
        });

        console.log("Profile updated successfully");
      }
    } catch (error: any) {
      console.error("Error updating profile:", error);
      Alert.alert(
        "Error",
        error.response?.data?.message ||
          "Failed to update profile. Please try again."
      );
    } finally {
      setLoading(false);
    }
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
              }
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
                <Ionicons name="close-outline" size={24} color="red" />
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
              Full Name <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              ref={input1Ref}
              onFocus={() => scrollToInput(input1Ref)}
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

          {/* phone number */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700 ">
              Phone Number <Text className="text-red-500">*</Text>
            </Text>
            {/* display the phone number, not as input. disabled */}
            <Text className="p-4 text-base bg-gray-100 opacity-50 rounded-lg ">
              0{useAppStore.getState().phoneNumber}
            </Text>
          </View>

          {/* Address */}
          {/* <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700">
              Address <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              ref={input2Ref}
              onFocus={() => scrollToInput(input2Ref)}
              value={form.address}
              onChangeText={(text) => onFormChange("address", text)}
              placeholder="Enter Address"
              placeholderTextColor="#9CA3AF"
              className={`p-4 text-base bg-gray-100 rounded-lg ${
                errors.address ? "border border-red-500" : ""
              }`}
            />
            {errors.address && (
              <Text className="text-xs ml-2 text-red-500">
                {errors.address}
              </Text>
            )}
          </View> */}

          {/* Gender Dropdown */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700">Gender</Text>

            <Dropdown
              style={{
                backgroundColor: "#F3F4F6",
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderRadius: 10,
              }}
              placeholderStyle={{ color: "#9CA3AF", fontSize: 14 }}
              selectedTextStyle={{ color: "#111827" }}
              data={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
                { label: "Prefer not to say", value: "prefer_not" },
              ]}
              dropdownPosition="top"
              labelField="label"
              valueField="value"
              placeholder="Select Gender"
              value={form.gender}
              onChange={(item) => onFormChange("gender", item.value)}
            />
          </View>
        </View>
      </CustomKeyAvoidingView>
      {/*  Button */}
      <View
        className="absolute left-0 right-0 px-6 bg-white"
        style={{ bottom: inset.bottom + 10 }}
      >
        <Pressable
          className={`items-center py-4 rounded-lg bg-lightPrimary  ${isButtonDisabled ? "opacity-65" : "active:bg-darkPrimary"}`}
          disabled={isButtonDisabled}
          onPress={onSubmit}
        >
          <Text className="text-base font-bold text-white">Update Profile</Text>
        </Pressable>
        <Pressable
          className="items-center py-4 my-2 border border-gray-200 rounded-lg bg-ctaSecondary active:bg-ctaSecondaryActive"
          onPress={() => router.back()}
        >
          <Text className="text-base font-bold ">Back</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
};

export default EditProfile;
