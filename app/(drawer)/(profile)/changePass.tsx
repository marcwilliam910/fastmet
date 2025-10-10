import CustomKeyAvoidingView from "@/components/CustomKeyAvoid";
import LoadingModal from "@/components/modals/loading";
import {changePassword} from "@/lib/firebase/auth";
import {ChangePassSchema, ChangePassSchemaType} from "@/schemas/authSchema";
import {validateForm} from "@/utils/validateForm";
import {Ionicons} from "@expo/vector-icons";
import {router} from "expo-router";
import React, {useRef, useState} from "react";
import {Pressable, Text, TextInput, View} from "react-native";

const ChangePass = () => {
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const newPassRef = useRef<TextInput | null>(null);
  const confirmPassRef = useRef<TextInput | null>(null);
  const [form, setForm] = useState<ChangePassSchemaType>({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (value: string, name: string) => {
    setForm({...form, [name]: value});
  };

  const onSubmit = async () => {
    const result = validateForm(ChangePassSchema, form);
    if (!result.success) {
      setErrors(result.errors);
      return;
    }
    setErrors({});

    try {
      setLoading(true);
      // Reauthenticate first
      await changePassword(form);

      console.log("Password changed successfully");

      setForm({oldPassword: "", newPassword: "", confirmPassword: ""});
    } catch (error: any) {
      console.log(error);
      let message = "Failed to change password.";
      if (error.code === "auth/invalid-credential")
        message = "Old password is incorrect.";
      else if (error.code === "auth/weak-password")
        message = "Password should be at least 6 characters.";
      else if (error.code === "auth/requires-recent-login")
        message = "Please log in again to change your password.";

      setErrors({oldPassword: message});
    } finally {
      setLoading(false);
    }
  };

  return (
    <CustomKeyAvoidingView>
      <View className="justify-between flex-1 px-6 pt-6 bg-white">
        <View className="justify-center gap-6 ">
          {/* Input */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700">
              Old Password
            </Text>
            <View className="relative">
              <TextInput
                value={form.oldPassword}
                onChangeText={(value) => handleChange(value, "oldPassword")}
                returnKeyType="next"
                onSubmitEditing={() => newPassRef.current?.focus()}
                submitBehavior="submit"
                placeholder="Old Password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showOldPassword}
                className={`p-4 pr-12 text-base bg-gray-100 rounded-lg ${
                  errors.oldPassword ? "border border-red-500" : ""
                }`}
              />
              <Pressable
                onPress={() => setShowOldPassword(!showOldPassword)}
                className="absolute right-4 top-3.5"
              >
                <Ionicons
                  name={showOldPassword ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color="#9CA3AF"
                />
              </Pressable>
            </View>
            {errors.oldPassword && (
              <Text className="ml-2 text-xs text-red-500">
                {errors.oldPassword}
              </Text>
            )}
          </View>

          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700">
              New Password
            </Text>
            <View className="relative">
              <TextInput
                value={form.newPassword}
                onChangeText={(value) => handleChange(value, "newPassword")}
                ref={newPassRef}
                returnKeyType="next"
                onSubmitEditing={() => confirmPassRef.current?.focus()}
                submitBehavior="submit"
                placeholder="New Password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                className={`p-4 pr-12 text-base bg-gray-100 rounded-lg ${errors.newPassword ? "border border-red-500" : ""}`}
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5"
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color="#9CA3AF"
                />
              </Pressable>
            </View>
            {errors.newPassword && (
              <Text className="ml-2 text-xs text-red-500">
                {errors.newPassword}
              </Text>
            )}
          </View>

          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700">
              Confirm New Password
            </Text>
            <View className="relative">
              <TextInput
                value={form.confirmPassword}
                onChangeText={(value) => handleChange(value, "confirmPassword")}
                ref={confirmPassRef}
                placeholder="Confirm New Password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showConfirmPassword}
                className={`p-4 pr-12 text-base bg-gray-100 rounded-lg ${errors.confirmPassword ? "border border-red-500" : ""}`}
              />
              <Pressable
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-3.5"
              >
                <Ionicons
                  name={showConfirmPassword ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color="#9CA3AF"
                />
              </Pressable>
            </View>
            {errors.confirmPassword && (
              <Text className="ml-2 text-xs text-red-500">
                {errors.confirmPassword}
              </Text>
            )}
          </View>
        </View>

        {/*  Button */}
        <View className="mt-5 mb-16">
          <Pressable
            className="items-center py-4 rounded-lg bg-lightPrimary active:bg-darkPrimary"
            onPress={onSubmit}
            disabled={loading}
          >
            <Text className="text-base font-bold text-white">
              Change Password
            </Text>
          </Pressable>
          <Pressable
            className="items-center py-4 my-2 border border-gray-300 rounded-lg bg-ctaSecondary active:bg-ctaSecondaryActive"
            onPress={() => router.back()}
          >
            <Text className="text-base font-bold ">Cancel</Text>
          </Pressable>
        </View>
      </View>
      <LoadingModal visible={loading} />
    </CustomKeyAvoidingView>
  );
};

export default ChangePass;
