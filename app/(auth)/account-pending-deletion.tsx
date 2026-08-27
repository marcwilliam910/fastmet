import {cancelAccountDeletion} from "@/api/accountDeletion";
import RestrictedScreen from "@/components/RestrictedScreen";
import {performLogout} from "@/lib/axios";
import {useLocalSearchParams, router} from "expo-router";
import {useState} from "react";
import Toast from "react-native-toast-message";

function formatScheduledDate(raw?: string | string[]) {
  const value = Array.isArray(raw) ? raw[0] : raw;
  if (!value) return "the scheduled date";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "the scheduled date";
  return date.toLocaleDateString(undefined, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function AccountPendingDeletionScreen() {
  const {scheduledAt} = useLocalSearchParams<{scheduledAt?: string}>();
  const [loading, setLoading] = useState(false);
  const formatted = formatScheduledDate(scheduledAt);

  const handleCancelDeletion = async () => {
    try {
      setLoading(true);
      await cancelAccountDeletion();
      Toast.show({
        type: "success",
        text1: "Deletion cancelled",
        text2: "Your account is active again.",
        position: "top",
        topOffset: 50,
      });
      router.replace("/(drawer)/book");
    } catch (error: any) {
      Toast.show({
        type: "error",
        text1: "Could not cancel",
        text2:
          error.response?.data?.message || error.message || "Please try again.",
        position: "top",
        topOffset: 50,
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <RestrictedScreen
      iconName="trash-outline"
      iconColor="#DC2626"
      iconBgClass="bg-red-100"
      title="Account Scheduled for Deletion"
      description={`Your account is scheduled for permanent deletion on ${formatted}. Cancel now to keep your account, or log out and leave the deletion scheduled.`}
      infoBoxText="Personal data is removed after the grace period. Trip records may be retained for legal requirements without your identity."
      infoBoxVariant="warning"
      actions={[
        {
          label: loading ? "Cancelling..." : "Cancel Deletion",
          icon: "shield-checkmark-outline",
          onPress: () => {
            if (!loading) void handleCancelDeletion();
          },
          variant: "filled",
        },
        {
          label: "Log out",
          icon: "log-out-outline",
          onPress: () => void performLogout(),
          variant: "ghost",
        },
      ]}
    />
  );
}
