import CustomKeyAvoidingView from "@/components/CustomKeyAvoid";
import AddressInput from "@/components/inputs/AddressInput";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import api from "@/lib/axios";
import { ProfileSchema } from "@/schemas/authSchema";
import { useAppStore } from "@/store/useAppStore";
import { NewUser, UserAddress } from "@/types/user";
import { openGallery } from "@/utils/helpers/imagePicker";
import { validateForm } from "@/utils/helpers/validateForm";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { router } from "expo-router";
import React, { useCallback, useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function ProfileRegistration() {
  const [form, setForm] = useState<NewUser>({
    fullName: "",
    address: null,
    gender: "",
    profilePictureUrl: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { isAuthenticated } = useAuthGuard();
  const [selectedAsset, setSelectedAsset] = useState<any>(null);
  const inset = useSafeAreaInsets();
  const setLoading = useAppStore((state) => state.setLoading);
  const loading = useAppStore((state) => state.isLoading);

  const pickProfilePic = async () => {
    const result = await openGallery();
    if (result && !result.canceled && result.assets[0]) {
      const asset = result.assets[0];
      setSelectedAsset(asset);
      setForm({ ...form, profilePictureUrl: asset.uri });
    }
  };
  const onFormChange = (name: string, value: string) => {
    setForm({ ...form, [name]: value });
  };

  const onAddressChange = useCallback((address: UserAddress) => {
    setForm((prev) => ({ ...prev, address }));
  }, []);

  const onSubmit = async () => {
    const result = validateForm(ProfileSchema, {
      fullName: form.fullName,
      address: form.address?.fullAddress,
      street: form.address?.street,
      barangay: form.address?.barangay,
      city: form.address?.city,
      province: form.address?.province,
    });
    if (!result.success) {
      setErrors(result.errors);
      return;
    }
    setErrors({});

    if (!isAuthenticated()) return;

    setLoading(true);
    // Create FormData for file upload
    const formData = new FormData();
    formData.append("fullName", form.fullName.trim());
    formData.append("gender", form.gender || "");

    // Send structured address data
    if (form.address) {
      formData.append("addressName", form.address.name);
      formData.append("addressFullAddress", form.address.fullAddress);
      formData.append("addressLat", String(form.address.coords.lat));
      formData.append("addressLng", String(form.address.coords.lng));
      if (form.address.street)
        formData.append("addressStreet", form.address.street);
      if (form.address.barangay)
        formData.append("addressBarangay", form.address.barangay);
      if (form.address.city) formData.append("addressCity", form.address.city);
      if (form.address.province)
        formData.append("addressProvince", form.address.province);
    }

    if (selectedAsset) {
      formData.append("profilePicture", {
        uri: selectedAsset.uri,
        type: selectedAsset.mimeType || "image/jpeg",
        name: selectedAsset.fileName || "profile.jpg",
      } as any);
    }
    // Use regular API call since you're sending FormData
    try {
      const response = await api.post("/profile/register-profile", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${useAppStore.getState().token}`,
        },
      });

      if (response.data.success) {
        console.log("Profile registered successfully");

        useAppStore.getState().setAuthData({
          name: response.data.user.fullName,
          isProfileComplete: true,
          profilePictureUrl: response.data.user.profilePictureUrl,
          address: response.data.user.address,
          gender: response.data.user.gender,
        });

        router.replace("/(drawer)/book");
      }
    } catch (error) {
      console.error("Error registering profile:", error);
      Alert.alert("Error", "Failed to register profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
      <CustomKeyAvoidingView>
        <View className="flex-1 p-6 pb-36 gap-6">
          {/* Profile Picture */}
          <View className="items-center gap-3">
            <Pressable
              className="items-center justify-center border rounded-full size-40 border-lightPrimary active:border-2"
              onPress={pickProfilePic}
            >
              {form.profilePictureUrl ? (
                <View className="items-center justify-center bg-gray-100 rounded-full size-36">
                  <Image
                    source={{ uri: form.profilePictureUrl }}
                    style={{ width: 120, height: 120, borderRadius: 999 }}
                    contentFit="cover"
                  />
                  <Pressable
                    className="absolute right-0 p-1 bg-white rounded-full top-2"
                    onPress={() =>
                      setForm((prev) => ({ ...prev, profilePictureUrl: "" }))
                    }
                  >
                    <Ionicons name="close-outline" size={20} color="red" />
                  </Pressable>
                </View>
              ) : (
                <View className="items-center justify-center bg-gray-100 rounded-full size-36">
                  <Ionicons name="camera" size={24} color="#FFA840" />
                </View>
              )}
            </Pressable>
            <Text className="text-lg font-bold text-gray-700">Profile</Text>
          </View>

          {/* Full Name */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700">
              Full Name <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              value={form.fullName}
              onChangeText={(text) => onFormChange("fullName", text)}
              placeholder="Enter Name"
              placeholderTextColor="#9CA3AF"
              className={`p-4 text-base bg-gray-100 rounded-lg ${
                errors.fullName ? "border border-red-500" : ""
              }`}
            />
            {errors.fullName && (
              <Text className="text-xs ml-2 text-red-500">
                {errors.fullName}
              </Text>
            )}
          </View>

          {/* Address */}
          <AddressInput
            value={form.address}
            onChange={onAddressChange}
            error={
              Object.keys(errors || {}).length === 0
                ? undefined
                : "All fields in address are required and must be valid."
            }
          />

          {/* Gender Dropdown */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700">Gender</Text>

            <Dropdown
              dropdownPosition="top"
              style={{
                backgroundColor: "#F3F4F6",
                paddingHorizontal: 16,
                paddingVertical: 14,
                borderRadius: 10,
              }}
              placeholderStyle={{ color: "#9CA3AF" }}
              selectedTextStyle={{ color: "#111827" }}
              data={[
                { label: "Male", value: "male" },
                { label: "Female", value: "female" },
                { label: "Prefer not to say", value: "prefer_not" },
              ]}
              labelField="label"
              valueField="value"
              placeholder="Select Gender"
              value={form.gender}
              onChange={(item) => onFormChange("gender", item.value)}
            />
          </View>
        </View>
      </CustomKeyAvoidingView>
      {/* Buttons */}
      <View
        className="absolute bg-white left-0 right-0 mx-6"
        style={{ bottom: inset.bottom + 10 }}
      >
        <Pressable
          className="items-center py-4 my-2 rounded-lg bg-lightPrimary active:bg-darkPrimary"
          onPress={onSubmit}
          disabled={loading}
        >
          <Text className="text-base font-bold text-white">Create</Text>
        </Pressable>

        <Pressable
          onPress={() => router.push("/(drawer)/book")}
          className="items-center py-4 my-2 border rounded-lg bg-white border-lightPrimary active:bg-gray-100"
        >
          <Text className="text-base font-bold text-lightPrimary">
            Skip for now
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
