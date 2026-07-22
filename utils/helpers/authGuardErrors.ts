import {
  ACCOUNT_DEACTIVATED_ROUTE,
  DEVICE_BANNED_ROUTE,
  DEVICE_SUSPENDED_ROUTE,
} from "@/constants/routes";
import {router} from "expo-router";
import {Alert} from "react-native";

export function routeAuthGuardError(error: {
  response?: {status?: number; data?: Record<string, unknown>};
}): boolean {
  const status = error.response?.status;
  const data = error.response?.data;

  if (status === 403) {
    if (data?.deviceBanned) {
      router.replace(DEVICE_BANNED_ROUTE);
    }

    if (data?.accountDeactivated) {
      router.replace(ACCOUNT_DEACTIVATED_ROUTE);
    }

    if (data?.accountSuspended) {
      router.replace({
        pathname: DEVICE_SUSPENDED_ROUTE,
        params: {
          suspendedUntil: (data.suspendedUntil as string) ?? "",
          suspensionReason: (data.suspensionReason as string) ?? "",
        },
      });
    }
    return true;
  }

  return false;
}

export function handleSendOtpError(
  error: {
    response?: {status?: number; data?: Record<string, unknown>};
  },
  options?: {onRetry?: () => void},
): boolean {
  if (routeAuthGuardError(error)) return true;

  const statusCode = error.response?.status;
  const errorMessage = error.response?.data?.error as string | undefined;

  if (statusCode === 429) {
    Alert.alert(
      "Too Many Requests",
      errorMessage ??
        "Too many OTP requests. Please wait a minute and try again.",
    );
    return true;
  }

  if (statusCode === 400) {
    Alert.alert(
      "Invalid Number",
      errorMessage ?? "Please enter a valid Philippine mobile number.",
    );
    return true;
  }

  if (statusCode === 401) {
    Alert.alert(
      "Invalid Number",
      errorMessage ?? "Failed to get device ID. Please try again.",
    );
    return true;
  }

  if (statusCode === 500) {
    Alert.alert(
      "Service Unavailable",
      "SMS service is temporarily unavailable. Please try again later.",
    );
    return true;
  }

  Alert.alert(
    "Connection Error",
    "Failed to send OTP. Please check your internet connection and try again.",
    options?.onRetry
      ? [{text: "Retry", onPress: options.onRetry}, {text: "Cancel"}]
      : [{text: "OK"}],
  );
  return true;
}
