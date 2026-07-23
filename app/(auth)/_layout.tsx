import { Stack } from "expo-router";

export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="auth" />
      <Stack.Screen name="otp" />
      <Stack.Screen name="profile-register" />
      <Stack.Screen name="id-verification" />
      <Stack.Screen name="verification-resubmit" />
    </Stack>
  );
}
