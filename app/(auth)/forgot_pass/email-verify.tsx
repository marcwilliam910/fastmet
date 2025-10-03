import CustomKeyAvoidingView from "@/components/CustomKeyAvoid";
import LogoWithText from "@/components/LogoWithText";
import {Ionicons} from "@expo/vector-icons";
import {useRouter} from "expo-router";
import {useRef} from "react";
import {Keyboard, Pressable, Text, TextInput, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

export default function EmailVerify() {
  const router = useRouter();
  const input1Ref = useRef<TextInput | null>(null);
  const input2Ref = useRef<TextInput | null>(null);
  const input3Ref = useRef<TextInput | null>(null);
  const input4Ref = useRef<TextInput | null>(null);

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
                    ref={input1Ref}
                    keyboardType="number-pad"
                    maxLength={1}
                    className="text-2xl font-semibold text-center text-gray-900 bg-gray-200 size-[4.5rem] rounded-2xl"
                    onChangeText={(text) => {
                      if (text) input2Ref.current?.focus();
                    }}
                  />
                  <TextInput
                    ref={input2Ref}
                    keyboardType="number-pad"
                    maxLength={1}
                    className="text-2xl font-semibold text-center text-gray-900 bg-gray-200 size-[4.5rem] rounded-2xl"
                    onChangeText={(text) => {
                      if (text) input3Ref.current?.focus();
                      else input1Ref.current?.focus(); // go back if deleted
                    }}
                  />
                  <TextInput
                    ref={input3Ref}
                    keyboardType="number-pad"
                    maxLength={1}
                    className="text-2xl font-semibold text-center text-gray-900 bg-gray-200 size-[4.5rem] rounded-2xl"
                    onChangeText={(text) => {
                      if (text) input4Ref.current?.focus();
                      else input2Ref.current?.focus();
                    }}
                  />
                  <TextInput
                    ref={input4Ref}
                    keyboardType="number-pad"
                    maxLength={1}
                    className="text-2xl font-semibold text-center text-gray-900 bg-gray-200 size-[4.5rem] rounded-2xl"
                    onChangeText={(text) => {
                      if (text) Keyboard.dismiss();
                      else input3Ref.current?.focus(); // go back if deleted
                    }}
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
