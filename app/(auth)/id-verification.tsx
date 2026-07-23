import {uploadIdImages} from "@/api/profile";
import CaptureCard from "@/components/CaptureCard";
import CustomKeyAvoidingView from "@/components/CustomKeyAvoid";
import {useAuthGuard} from "@/hooks/useAuthGuard";
import {useAppStore} from "@/store/useAppStore";
import {takePhoto} from "@/utils/helpers/imagePicker";
import {Ionicons} from "@expo/vector-icons";
import {router} from "expo-router";
import React, {useState} from "react";
import {Alert, Pressable, Text, View} from "react-native";
import {SafeAreaView, useSafeAreaInsets} from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

type CaptureSlot = "idImage" | "selfieWithId";

const SLOT_LABELS: Record<CaptureSlot, string> = {
  idImage: "Any ID with your name and photo",
  selfieWithId: "Selfie with ID",
};

export default function IdVerification() {
  const inset = useSafeAreaInsets();
  const {isAuthenticated} = useAuthGuard();
  const setLoading = useAppStore((state) => state.setLoading);
  const loading = useAppStore((state) => state.isLoading);

  const [idImageUri, setIdImageUri] = useState<string | null>(null);
  const [selfieUri, setSelfieUri] = useState<string | null>(null);

  const capture = async (slot: CaptureSlot) => {
    const uri = await takePhoto();
    if (!uri) return;

    if (slot === "idImage") setIdImageUri(uri);
    else setSelfieUri(uri);
  };

  const onSubmit = async () => {
    if (!idImageUri || !selfieUri) {
      Alert.alert(
        "Photos required",
        "Please capture both your ID and selfie with ID.",
      );
      return;
    }

    if (!isAuthenticated()) return;

    setLoading(true);
    try {
      const data = await uploadIdImages(idImageUri, selfieUri);

      if (data.success) {
        useAppStore.getState().setAuthData({
          registrationStep: data.registrationStep ?? 3,
          approvalStatus: data.approvalStatus ?? "pending",
        });

        Toast.show({
          type: "info",
          text1: "Documents submitted",
          text2:
            "We are reviewing your account. You can browse while you wait.",
          position: "top",
          visibilityTime: 5000,
          topOffset: 50,
        });

        router.replace("/(drawer)/book");
      }
    } catch (error) {
      console.error("ID upload error:", error);
      Alert.alert("Upload failed", "Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={{flex: 1, backgroundColor: "#fff"}}>
      <View className="flex-row items-center px-4 py-3">
        <Pressable
          onPress={() => router.replace("/(drawer)/book")}
          hitSlop={20}
        >
          <Ionicons name="chevron-back" size={28} color="#FFA840" />
        </Pressable>
        <Text className="flex-1 text-lg font-semibold text-center mr-7">
          ID Verification
        </Text>
      </View>

      <CustomKeyAvoidingView>
        <View className="flex-1 gap-6 p-6 pb-36">
          <Text className="text-sm text-gray-600">
            Take clear photos using your camera. Gallery upload is not allowed
            for verification.
          </Text>

          <CaptureCard
            label={SLOT_LABELS.idImage}
            uri={idImageUri}
            onCapture={() => capture("idImage")}
            onClear={() => setIdImageUri(null)}
          />

          <CaptureCard
            label={SLOT_LABELS.selfieWithId}
            uri={selfieUri}
            onCapture={() => capture("selfieWithId")}
            onClear={() => setSelfieUri(null)}
          />
        </View>
      </CustomKeyAvoidingView>

      <View
        className="absolute left-0 right-0 mx-6 bg-white"
        style={{bottom: inset.bottom + 10}}
      >
        <Pressable
          className={`items-center py-4 my-2 rounded-lg bg-lightPrimary active:bg-darkPrimary ${!idImageUri || !selfieUri ? "opacity-50" : ""}`}
          onPress={onSubmit}
          disabled={loading || !idImageUri || !selfieUri}
        >
          <Text className="text-base font-bold text-white">
            {loading ? "Submitting..." : "Submit"}
          </Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}
