import CustomKeyAvoidingView from "@/components/CustomKeyAvoid";
import LogoWithText from "@/components/LogoWithText";
import LoadingModal from "@/components/modals/loading";
import {login} from "@/lib/firebase/auth";
import {useRegisterProfile} from "@/mutations/userMutations";
import {LoginSchema} from "@/schemas/authSchema";
import {signInWithGoogle} from "@/services/googleAuth";
import {useProfileStore} from "@/store/useProfileStore";
import {User} from "@/types/user";
import {validateForm} from "@/utils/validateForm";
import {Ionicons} from "@expo/vector-icons";
import {Image} from "expo-image";
import {Link, router} from "expo-router";
import React, {useRef, useState} from "react";
import {Pressable, Text, TextInput, TouchableOpacity, View} from "react-native";
import {SafeAreaView} from "react-native-safe-area-context";

const Login = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const passwordRef = useRef<TextInput>(null);
  const {setProfile} = useProfileStore();
  const {mutate, isPending} = useRegisterProfile();

  const handleLogin = async () => {
    const result = validateForm(LoginSchema, form);

    if (!result.success) {
      setErrors(result.errors);
      return;
    }
    setErrors({});

    try {
      setLoading(true);
      const res = await login(form.email, form.password);
      console.log("Login success:", res.user.uid);

      router.push("/(drawer)/(tabs)");
    } catch (err: any) {
      console.log(JSON.stringify(err, null, 2));

      let message = "An unexpected error occurred. Please try again.";

      switch (err.code) {
        case "auth/invalid-email":
          message = "The email address is not valid.";
          break;
        case "auth/user-disabled":
          message = "This account has been disabled.";
          break;
        case "auth/user-not-found":
          message = "No user found with this email.";
          break;
        case "auth/wrong-password":
        case "auth/invalid-credential": // Firebase sometimes sends this instead
          message = "Incorrect email or password.";
          break;
        case "auth/too-many-requests":
          message = "Too many login attempts. Please try again later.";
          break;
      }

      setErrors({form: message});
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const user = await signInWithGoogle();

      if (!user) {
        // User cancelled — exit silently
        return;
      }

      // Optional: Split displayName into name parts
      const nameParts = user.displayName?.split(" ") ?? [];
      const firstName = nameParts[0] ?? "";
      const lastName = nameParts.length > 1 ? nameParts.slice(1).join(" ") : "";

      const dataToSave: User = {
        uid: user.uid,
        email: user.email ?? "",
        firstName,
        middleName: "", // Google doesn't provide this
        lastName,
        birthDate: "", // Google doesn't provide this
        profilePictureUrl: user.photoURL ?? "",
        fromOAuth: true,
      };

      mutate(dataToSave, {
        onSuccess: () => {
          setProfile(dataToSave);
          console.log("Profile registered successfully");
          router.push("/(drawer)/(tabs)");
        },
      });

      // Navigation will be handled by your auth flow
      // Or manually navigate:
      // router.replace('/(tabs)');
    } catch (error: any) {
      // Don't show error if user cancelled
      if (error.message !== "Sign in was cancelled") {
        setErrors({form: error.message});
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
      <CustomKeyAvoidingView>
        <View className="justify-center flex-1 gap-6 px-6">
          {/* Logo and Title */}
          <LogoWithText />

          {/* Username Input */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700 ">Email</Text>
            <TextInput
              value={form.email}
              onChangeText={(text) => setForm({...form, email: text})}
              autoCapitalize="none"
              placeholder="Email"
              keyboardType="email-address"
              placeholderTextColor="#9CA3AF"
              returnKeyType="next"
              onSubmitEditing={() => passwordRef.current?.focus()} // focus password
              submitBehavior="submit" // 👈 replacement for blurOnSubmit={false}
              className={`p-4 text-base bg-gray-100 rounded-lg ${
                errors.email || errors.form ? "border border-red-500" : ""
              }`}
            />
            {errors.email && (
              <Text className="ml-2 text-xs text-red-500">{errors.email}</Text>
            )}
          </View>

          {/* Password Input */}
          <View className="gap-2">
            <Text className="text-sm font-medium text-gray-700">Password</Text>
            <View className="relative">
              <TextInput
                value={form.password}
                onChangeText={(text) => setForm({...form, password: text})}
                autoCapitalize="none"
                ref={passwordRef}
                placeholder="Password"
                placeholderTextColor="#9CA3AF"
                secureTextEntry={!showPassword}
                className={`p-4 pr-12 text-base bg-gray-100 rounded-lg ${
                  errors.password || errors.form ? "border border-red-500" : ""
                }`}
              />
              <Pressable
                onPress={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3.5"
              >
                <Ionicons
                  name={showPassword ? "eye-outline" : "eye-off-outline"}
                  size={22}
                  color="#9CA3AF"
                />
              </Pressable>
            </View>
            {errors.password && (
              <Text className="ml-2 text-xs text-red-500">
                {errors.password}
              </Text>
            )}
          </View>

          {errors.form && (
            <Text className="ml-2 text-red-500">{errors.form}</Text>
          )}

          {/* Forgot Password */}
          <Link asChild href="/(auth)/forgot-pass">
            <Pressable className="self-end">
              {({pressed}) => (
                <Text
                  className={`text-sm font-semibold text-gray-600 ${pressed ? "underline" : ""}`}
                >
                  Forgot Password?
                </Text>
              )}
            </Pressable>
          </Link>

          {/* Sign In Button */}
          <Pressable
            className="items-center py-4 rounded-lg bg-lightPrimary active:bg-darkPrimary"
            onPress={handleLogin}
            disabled={loading}
          >
            <Text className="text-base font-bold text-white">Sign In</Text>
          </Pressable>

          {/* Divider */}
          <Text className="text-sm font-semibold text-center text-gray-600">
            Sign in with
          </Text>

          {/* Social Login Buttons */}
          <View className="flex-row justify-center gap-10">
            <TouchableOpacity
              className="items-center justify-center bg-blue-500 rounded-lg size-12"
              activeOpacity={0.8}
            >
              <Ionicons name="logo-facebook" size={24} color="#fff" />
            </TouchableOpacity>

            <TouchableOpacity
              className="items-center justify-center bg-gray-100 rounded-lg size-12"
              onPress={handleGoogleSignIn}
              disabled={loading}
              activeOpacity={0.8}
            >
              <Image
                source={require("@/assets/images/google.png")}
                style={{width: 20, height: 20}}
                contentFit="contain"
              />
            </TouchableOpacity>

            <TouchableOpacity
              className="items-center justify-center bg-gray-800 rounded-lg size-12"
              activeOpacity={0.8}
            >
              <Ionicons name="logo-apple" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          {/* Create Account Button */}
          <Pressable
            className="items-center py-4 mt-2 border rounded-lg border-lightPrimary active:bg-gray-50"
            onPress={() => {
              setErrors({form: ""});
              router.push("/(auth)/register");
            }}
          >
            <Text className="text-base font-semibold text-gray-800">
              Create Account
            </Text>
          </Pressable>

          <Link
            className="text-base font-semibold text-center text-gray-800 underline"
            href="/(drawer)/(tabs)"
          >
            Continue as Guest
          </Link>
        </View>
      </CustomKeyAvoidingView>
      <LoadingModal visible={loading || isPending} />
    </SafeAreaView>
  );
};

export default Login;
