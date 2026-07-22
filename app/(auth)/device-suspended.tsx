import {SUPPORT_EMAIL} from "@/utils/constants";
import {router, useLocalSearchParams} from "expo-router";
import {Alert, Linking, Text} from "react-native";

import RestrictedScreen from "@/components/RestrictedScreen";
import {useEffect, useState} from "react";

export default function DeviceSuspendedScreen() {
  const {suspendedUntil, suspensionReason} = useLocalSearchParams<{
    suspendedUntil?: string;
    suspensionReason?: string;
  }>();

  const handleEmail = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}`).catch(() =>
      Alert.alert("Error", "Unable to open mail app."),
    );
  };

  const until = suspendedUntil ? new Date(suspendedUntil) : null;

  return (
    <RestrictedScreen
      iconName="time-outline"
      iconColor="#D97706"
      iconBgClass="bg-yellow-100"
      title="Account Suspended"
      description={
        suspensionReason
          ? `Your account has been suspended. Reason: ${suspensionReason}`
          : "Your account has been temporarily suspended. Please contact support if you believe this is a mistake."
      }
      topExtra={until ? <CountdownText until={until} /> : null}
      infoBoxText="You cannot sign in or receive OTP on this device until the suspension is lifted."
      infoBoxVariant="warning"
      actions={[
        {
          label: "Email Support",
          icon: "mail-outline",
          onPress: handleEmail,
          variant: "filled",
        },
        {
          label: "Go back to login",
          icon: "arrow-back-outline",
          onPress: () => router.replace("/(auth)/auth"),
          variant: "ghost",
        },
      ]}
    />
  );
}

function formatRemaining(ms: number): string {
  if (ms <= 0) return "Suspension has ended";
  const totalSeconds = Math.floor(ms / 1000);
  const days = Math.floor(totalSeconds / 86400);
  const hours = Math.floor((totalSeconds % 86400) / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  if (days > 0) return `${days}d ${hours}h ${minutes}m remaining`;
  if (hours > 0) return `${hours}h ${minutes}m ${seconds}s remaining`;
  return `${minutes}m ${seconds}s remaining`;
}

export function CountdownText({until}: {until: Date}) {
  const [remaining, setRemaining] = useState(
    () => until.getTime() - Date.now(),
  );

  useEffect(() => {
    const id = setInterval(() => {
      setRemaining(until.getTime() - Date.now());
    }, 1000);
    return () => clearInterval(id);
  }, [until]);

  return (
    <Text className="mb-6 text-base font-bold text-center text-amber-600">
      {formatRemaining(remaining)}
    </Text>
  );
}
