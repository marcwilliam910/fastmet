import CustomKeyAvoidingView from "@/components/CustomKeyAvoid";
import { useAuthGuard } from "@/hooks/useAuthGuard";
import { useRegisterProfile } from "@/mutations/userMutations";
import { ProfileSchema } from "@/schemas/authSchema";
import { useAppStore } from "@/store/useAppStore";
import { NewUser } from "@/types/user";
import { openGallery } from "@/utils/imagePicker";
import { validateForm } from "@/utils/validateForm";
import { Ionicons } from "@expo/vector-icons";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
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
  const { mutate, isPending } = useRegisterProfile();

  const setLoading = useAppStore((state) => state.setLoading);

  useEffect(() => {
    if (isPending) setLoading(true);
    else setLoading(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isPending]);

  const pickProfilePic = async () => {
    const result = await openGallery();
    if (result && !result.canceled && result.assets[0]) {
      console.log(result.assets[0].uri);
      setForm({ ...form, profilePictureUrl: result.assets[0].uri });
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

    mutate(form, {
      onSuccess: () => {
        console.log("Profile registered successfully");
        router.replace("/(drawer)/book");
      },
    });
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
              className={`p-4 text-base bg-gray-100 rounded-lg ${
                errors.fullName ? "border border-red-500" : ""
              }`}
            />
            {errors.fullName && (
              <Text className="text-xs text-red-500">{errors.fullName}</Text>
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
              className={`p-4 text-base bg-gray-100 rounded-lg ${
                errors.address ? "border border-red-500" : ""
              }`}
            />
            {errors.address && (
              <Text className="text-xs text-red-500">{errors.address}</Text>
            )}
          </View>

          {/* Gender Dropdown */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700">
              Gender <Text className="text-red-500">*</Text>
            </Text>

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

            {errors.gender && (
              <Text className="text-xs text-red-500">{errors.gender}</Text>
            )}
          </View>

          {/* Buttons */}
          <View className="absolute bottom-0 left-0 right-0 mx-6">
            <Pressable
              className="items-center py-4 my-2 rounded-lg bg-lightPrimary active:bg-darkPrimary"
              onPress={onSubmit}
            >
              <Text className="text-base font-bold text-white">Create</Text>
            </Pressable>

            <Pressable
              onPress={() => router.push("/(drawer)/book")}
              className="items-center py-4 my-2 border rounded-lg border-lightPrimary active:border-darkPrimary"
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
