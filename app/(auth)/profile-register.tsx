import CustomKeyAvoidingView from "@/components/CustomKeyAvoid";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import api from "@/lib/axios";
import { ProfileSchema } from "@/schemas/authSchema";
import { useAppStore } from "@/store/useAppStore";
import { NewUser } from "@/types/user";
import { openGallery } from "@/utils/imagePicker";
import { validateForm } from "@/utils/validateForm";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { Alert, Pressable, Text, TextInput, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ProfileRegistration() {
  const router = useRouter();
  const [form, setForm] = useState<NewUser>({
    fullName: "",
    address: "",
    gender: "",
    profilePictureUrl: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const { isAuthenticated } = useAuthGuard();
  const [selectedAsset, setSelectedAsset] = useState<any>(null);

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

  const onSubmit = async () => {
    const result = validateForm(ProfileSchema, form);
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
    formData.append("address", form.address);
    formData.append("gender", form.gender || "");

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
        <View className="flex-1 p-6 gap-6">
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
              className={`p-4 text-base bg-gray-100 rounded-lg ${errors.fullName ? "border border-red-500" : ""
                }`}
            />
            {errors.fullName && (
              <Text className="text-xs ml-2 text-red-500">
                {errors.fullName}
              </Text>
            )}
          </View>

          {/* Address */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700">
              Address <Text className="text-red-500">*</Text>
            </Text>
            <TextInput
              value={form.address}
              onChangeText={(text) => onFormChange("address", text)}
              placeholder="Enter Address"
              placeholderTextColor="#9CA3AF"
              className={`p-4 text-base bg-gray-100 rounded-lg ${errors.address ? "border border-red-500" : ""
                }`}
            />
            {errors.address && (
              <Text className="text-xs ml-2 text-red-500">
                {errors.address}
              </Text>
            )}
          </View>

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

          {/* Buttons */}
          <View className="absolute bottom-0 left-0 right-0 mx-6">
            <Pressable
              className="items-center py-4 my-2 rounded-lg bg-lightPrimary active:bg-darkPrimary"
              onPress={onSubmit}
              disabled={loading}
            >
              <Text className="text-base font-bold text-white">Create</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/(drawer)/book")}
              className="items-center py-4 my-2 border rounded-lg bg-white border-lightPrimary active:border-darkPrimary"
            >
              <Text className="text-base font-bold text-lightPrimary">
                Skip for now
              </Text>
            </Pressable>
          </View>
        </View>
      </CustomKeyAvoidingView>
    </SafeAreaView>
  );
}
