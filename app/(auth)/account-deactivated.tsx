import RestrictedScreen from "@/components/RestrictedScreen";
import {SUPPORT_EMAIL} from "@/utils/constants";
import {router} from "expo-router";
import {Alert, Linking} from "react-native";

export default function AccountDeactivatedScreen() {
  const handleEmail = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}`).catch(() =>
      Alert.alert("Error", "Unable to open mail app."),
    );
  };

  return (
    <RestrictedScreen
      iconName="person-remove-outline"
      iconColor="#D97706"
      iconBgClass="bg-yellow-100"
      title="Account Deactivated"
      description="Your Fastmet account has been deactivated by an administrator. Please contact support to restore access."
      infoBoxText="If you believe this is a mistake, please reach out to our support team using the details below."
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
