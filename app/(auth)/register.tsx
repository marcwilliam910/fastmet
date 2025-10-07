import CustomKeyAvoidingView from "@/components/CustomKeyAvoid";
import LogoWithText from "@/components/LogoWithText";
import LoadingModal from "@/components/modals/loading";
import {signup, updateDisplayName} from "@/lib/auth";
import {RegisterSchema} from "@/schemas/authSchema";
import {validateForm} from "@/utils/validateForm";
import {Ionicons} from "@expo/vector-icons";
import {Link, useRouter} from "expo-router";
import React, {useRef, useState} from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

const Register = () => {
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const router = useRouter();
  const emailRef = useRef<TextInput | null>(null);
  const passwordRef = useRef<TextInput | null>(null);
  const confirmPasswordRef = useRef<TextInput | null>(null);

  const handleSignup = async () => {
    const result = validateForm(RegisterSchema, form);
    if (!result.success) {
      setErrors(result.errors);
      return;
    }
    setErrors({});
    try {
      setLoading(true);
      const res = await signup(form.email, form.password);
      await updateDisplayName(form.username);

      router.push("/(root_screens)/profile-register");
      console.log("Signup success:", res.user.uid);
    } catch (err: any) {
      let message = "Signup failed. Please try again.";
      switch (err.code) {
        case "auth/email-already-in-use":
          message = "Email is already in use.";
          break;
        case "auth/invalid-email":
          message = "Invalid email address.";
          break;
        case "auth/weak-password":
          message = "Password should be at least 6 characters.";
          break;
        case "auth/network-request-failed":
          message = "Network error. Please try again.";
          break;
      }
      setErrors({form: message});
    } finally {
      setLoading(false);
    }
  };

  const onFormChange = (field: string, value: string) => {
    setForm({...form, [field]: value});
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
      <CustomKeyAvoidingView>
        <View className="justify-center flex-1 gap-6 px-6">
          <Pressable
            onPress={() => {
              setErrors({});
              router.back();
            }}
            className="absolute top-5 left-5"
          >
            <Ionicons name="chevron-back-outline" size={28} color="#FFA840" />
          </Pressable>
          {/* Logo and Title */}
          <LogoWithText />

          {/* Username Input */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700 ">Username</Text>
            <TextInput
              value={form.username}
              onChangeText={(text) => onFormChange("username", text)}
              autoCapitalize="none"
              autoCorrect={false}
              placeholder="Username"
              placeholderTextColor="#9CA3AF"
              className={`p-4 text-base bg-gray-100 rounded-lg ${
                errors.username ? "border border-red-500" : ""
              }`}
              returnKeyType="next"
              onSubmitEditing={() => emailRef.current?.focus()}
              submitBehavior="submit"
            />
            {errors.username && (
              <Text className="ml-2 text-xs text-red-500">
                {errors.username}
              </Text>
            )}
          </View>

          {/* Email Input */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700 ">
              Email Address
            </Text>
            <TextInput
              value={form.email}
              onChangeText={(text) => onFormChange("email", text)}
              autoCapitalize="none"
              ref={emailRef}
              placeholder="Enter email"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()}
              submitBehavior="submit"
              className={`p-4 text-base bg-gray-100 rounded-lg ${
                errors.email ? "border border-red-500" : ""
              }`}
            />
            {errors.email && (
              <Text className="ml-2 text-xs text-red-500">{errors.email}</Text>
            )}
          </View>

          {/* Password Input */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700">Password</Text>
            <View className="relative">
              <TextInput
                value={form.password}
                onChangeText={(text) => onFormChange("password", text)}
                autoCapitalize="none"
                autoCorrect={false}
                ref={passwordRef}
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                returnKeyType="next"
                onSubmitEditing={() => confirmPasswordRef.current?.focus()}
                submitBehavior="submit"
                className={`p-4 pr-12 text-base bg-gray-100 rounded-lg ${
                  errors.password ? "border border-red-500" : ""
                }`}
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
            {errors.password && (
              <Text className="ml-2 text-xs text-red-500">
                {errors.password}
              </Text>
            )}
          </View>

          {/* Confirm Password Input */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700">
              Confirm Password
            </Text>
            <View className="relative">
              <TextInput
                value={form.confirmPassword}
                onChangeText={(text) => onFormChange("confirmPassword", text)}
                autoCapitalize="none"
                autoCorrect={false}
                ref={confirmPasswordRef}
                placeholder="Confirm Password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showConfirmPassword}
                className={`p-4 pr-12 text-base bg-gray-100 rounded-lg ${
                  errors.confirmPassword ? "border border-red-500" : ""
                }`}
              />
              <Pressable
                onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-4 top-3.5"
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
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

          {errors.form && (
            <Text className="ml-2 text-red-500">{errors.form}</Text>
          )}

          <Text className="mt-4 text-sm text-center text-gray-700 px-14">
            By Signing up you agree to our{"\n"}
            <Link href="/(public_screens)/terms&conditions">
              <Text className="font-bold underline">Terms & Condition</Text> and
            </Link>
            <Link href="/(public_screens)/privacyPolicy">
              <Text className="font-bold underline"> Privacy Policy</Text>
            </Link>
          </Text>

          {/*  Button */}
          <Pressable
            className="items-center py-4 my-2 rounded-lg bg-lightPrimary active:bg-darkPrimary"
            onPress={handleSignup}
            disabled={loading}
          >
            <Text className="text-base font-bold text-white">
              {loading ? <ActivityIndicator color="#fff" /> : "Create Account"}
            </Text>
          </Pressable>
        </View>
      </CustomKeyAvoidingView>
      <LoadingModal visible={loading} />
    </SafeAreaView>
  );
};

export default Register;
