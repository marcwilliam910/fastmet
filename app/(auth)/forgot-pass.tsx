import CustomKeyAvoidingView from "@/components/CustomKeyAvoid";
import LogoWithText from "@/components/LogoWithText";
import LoadingModal from "@/components/modals/loading";
import ResetPassModal from "@/components/modals/resetPassModal";
import {forgotPassword} from "@/lib/auth";
import {ResetPassSchema} from "@/schemas/authSchema";
import {validateForm} from "@/utils/validateForm";
import {Ionicons} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useRouter} from "expo-router";
import React, {useEffect, useState} from "react";
import {
  ActivityIndicator,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

// Cooldown duration in seconds
const COOLDOWN_DURATION = 60;
const COOLDOWN_STORAGE_KEY = "lastPasswordResetTimestamp";

const ForgotPass = () => {
  const router = useRouter();
  const [resetPassModal, setResetPassModal] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const [error, setError] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState<boolean>(false);

  // New state variables for the timer
  const [cooldownTime, setCooldownTime] = useState(0);
  const [canResend, setCanResend] = useState(true);

  // useEffect to handle the countdown timer
  useEffect(() => {
    let timerId: ReturnType<typeof setTimeout>;
    if (cooldownTime > 0) {
      timerId = setTimeout(() => {
        setCooldownTime(cooldownTime - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }

    return () => clearTimeout(timerId);
  }, [cooldownTime]);

  // useEffect to retrieve cooldown state from AsyncStorage on component mount
  useEffect(() => {
    const checkCooldown = async () => {
      try {
        const lastTimestamp = await AsyncStorage.getItem(COOLDOWN_STORAGE_KEY);
        if (lastTimestamp) {
          const lastSentTime = parseInt(lastTimestamp, 10);
          const currentTime = Date.now();
          const timeElapsedInSeconds = (currentTime - lastSentTime) / 1000;
          const remainingTime = Math.max(
            0,
            COOLDOWN_DURATION - Math.floor(timeElapsedInSeconds)
          );

          if (remainingTime > 0) {
            setCooldownTime(remainingTime);
            setCanResend(false);
          }
        }
      } catch (e) {
        console.error("Failed to load cooldown timer from storage", e);
      }
    };

    checkCooldown();
  }, []);
  const handleResetPass = async () => {
    // Prevent execution if a cooldown is active
    if (!canResend) {
      return;
    }

    const result = validateForm(ResetPassSchema, {email});
    if (!result.success) {
      setError(result.errors);
      return;
    }
    setError({});

    try {
      setLoading(true);

      await forgotPassword(email);
      // Store the current timestamp in AsyncStorage after a successful attempt
      await AsyncStorage.setItem(COOLDOWN_STORAGE_KEY, Date.now().toString());

      // Disable resend immediately and start the timer
      setCanResend(false);
      setCooldownTime(COOLDOWN_DURATION);

      setResetPassModal(true);
    } catch (error: any) {
      let message = "Something went wrong. Please try again.";

      // Re-enable the button if the request fails
      setCanResend(true);
      setCooldownTime(0);

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
            className={`items-center py-3.5 rounded-lg  ${
              !canResend || loading
                ? "bg-gray-300"
                : "bg-lightPrimary active:bg-darkPrimary "
            }`}
            onPress={handleResetPass}
            disabled={loading || !canResend}
          >
            <Text className="text-base font-bold text-white">
              {loading ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : !canResend ? (
                `Resend in ${cooldownTime}s`
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
