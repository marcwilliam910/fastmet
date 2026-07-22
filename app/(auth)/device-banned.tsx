import RestrictedScreen from "@/components/RestrictedScreen";
import {SUPPORT_EMAIL} from "@/utils/constants";
import {router} from "expo-router";
import {Alert, Linking} from "react-native";

export default function DeviceBannedScreen() {
  const handleEmail = () => {
    Linking.openURL(`mailto:${SUPPORT_EMAIL}`).catch(() =>
      Alert.alert("Error", "Unable to open mail app."),
    );
  };

  return (
    <RestrictedScreen
      iconName="ban-outline"
      iconColor="#DC2626"
      iconBgClass="bg-red-100"
      title="Device Banned"
      description="This device has been banned from using Fastmet. Please contact support if you believe this is a mistake."
      infoBoxText="You cannot sign in or receive OTP on this device until the ban is lifted by an administrator."
      infoBoxVariant="error"
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
