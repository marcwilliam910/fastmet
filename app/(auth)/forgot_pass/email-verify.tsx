import CustomKeyAvoidingView from "@/components/CustomKeyAvoid";
import LogoWithText from "@/components/LogoWithText";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import {Pressable, Text, TextInput, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

export default function EmailVerify() {
  const router = useRouter();

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
      <CustomKeyAvoidingView>
        <View className="justify-center flex-1 gap-6 px-6">
          <Pressable
            onPress={() => router.back()}
            className="absolute z-10 top-5 left-5"
          >
            <Ionicons name="chevron-back-outline" size={28} color="#FFA840" />
          </Pressable>

          <View className="justify-center flex-1 gap-8">
            {/* Logo Section */}
            <LogoWithText />

            {/* Email Verification Section */}
            <View className="gap-10">
              <Text className="text-lg font-semibold text-center text-gray-900">
                Email Verification
              </Text>

              <Text className="text-sm text-center text-gray-600">
                Enter the 4-digit OTP sent to{"\n"}
                <Text className="font-medium">youremail@email.com</Text>
              </Text>

              <View className="gap-3">
                <Text className="font-medium text-secondary">
                  Enter 4 digit code
                </Text>

                {/* OTP Input Boxes */}
                <View className="flex-row justify-around">
                  <TextInput
                    keyboardType="number-pad"
                    maxLength={1}
                    className="text-2xl font-semibold text-center text-gray-900 bg-gray-200 size-[4.5rem] rounded-2xl"
                  />
                  <TextInput
                    keyboardType="number-pad"
                    maxLength={1}
                    className="text-2xl font-semibold text-center text-gray-900 bg-gray-200 size-[4.5rem] rounded-2xl"
                  />
                  <TextInput
                    keyboardType="number-pad"
                    maxLength={1}
                    className="text-2xl font-semibold text-center text-gray-900 bg-gray-200 size-[4.5rem] rounded-2xl"
                  />
                  <TextInput
                    keyboardType="number-pad"
                    maxLength={1}
                    className="text-2xl font-semibold text-center text-gray-900 bg-gray-200 size-[4.5rem] rounded-2xl"
                  />
                </View>
              </View>

              <Text className="text-sm text-center text-gray-600">
                Didn't receive the OTP?{" "}
                <Text className="font-medium color-lightPrimary">Resend</Text>
              </Text>

              {/* Continue Button */}
              <Pressable
                className="py-4 rounded-xl bg-lightPrimary active:bg-darkPrimary"
                onPress={() => router.push("/(auth)/forgot_pass/reset-pass")}
              >
                <Text className="text-base font-semibold text-center text-white">
                  Continue
                </Text>
              </Pressable>
            </View>
          </View>
        </View>
      </CustomKeyAvoidingView>
    </SafeAreaView>
  );
}
