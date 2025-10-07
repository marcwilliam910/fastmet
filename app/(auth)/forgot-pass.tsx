import CustomKeyAvoidingView from "@/components/CustomKeyAvoid";
import LogoWithText from "@/components/LogoWithText";
import LoadingModal from "@/components/modals/loading";
import ResetPassModal from "@/components/modals/resetPassModal";
import {forgotPassword} from "@/lib/auth";
import {ResetPassSchema} from "@/schemas/authSchema";
import {validateForm} from "@/utils/validateForm";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import React, {useState} from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

const ForgotPass = () => {
  const router = useRouter();
  const [resetPassModal, setResetPassModal] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);

  const handleResetPass = async () => {
    const result = validateForm(ResetPassSchema, {email});
    if (!result.success) {
      setError(result.errors);
      return;
    }
    setError({});

    try {
      setLoading(true);
      await forgotPassword(email);
      setResetPassModal(true);
    } catch (error: any) {
      let message = "Something went wrong. Please try again.";

      if (error.code) {
        switch (error.code) {
          case "auth/invalid-email":
            message = "Invalid email address.";
            break;
          case "auth/user-not-found":
            message = "No user found with this email.";
            break;
          case "auth/missing-email":
            message = "Please enter your email.";
            break;
          default:
            message = error.message || message;
        }
      }

      setError({email: message});
    } finally {
      setLoading(false);
    }
  };

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
          {/* Logo and Title */}
          <LogoWithText />

          <Text className="mt-5 mb-5 text-lg font-bold text-center text-gray-700">
            Forgot Password
          </Text>
          {/* Username Input */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700 ">
              Email Address
            </Text>
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="Enter email"
              placeholderTextColor="#9CA3AF"
              keyboardType="email-address"
              className={`p-4 text-base bg-gray-100 rounded-lg ${
                error.email ? "border border-red-500" : ""
              }`}
              autoCapitalize="none"
            />
            {error.email && (
              <Text className="ml-2 text-xs text-red-500">{error.email}</Text>
            )}
          </View>

          <Pressable
            className="items-center py-3.5 rounded-lg bg-lightPrimary active:bg-darkPrimary"
            onPress={handleResetPass}
            disabled={loading}
          >
            <Text className="text-base font-bold text-white">
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                "Reset Password"
              )}
            </Text>
          </Pressable>
        </View>
      </CustomKeyAvoidingView>
      <LoadingModal visible={loading} />
      <ResetPassModal
        visible={resetPassModal}
        onClose={() => setResetPassModal(false)}
      />
    </SafeAreaView>
  );
};

export default ForgotPass;
