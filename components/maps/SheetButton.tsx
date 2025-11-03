import useAuth from "@/hooks/useAuth";
import { useRegisterProfile } from "@/mutations/userMutations";
import { signInWithGoogle } from "@/services/googleAuth";
import { User } from "@/types/user";
import React, { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import LoadingModal from "../modals/loading";
import NotLoggedInModal from "../modals/notLoggedInModal";

const SheetButton = ({
  isLast,
  setStep,
}: {
  isLast: boolean;
  setStep: (step: "ride" | "contact") => void;
}) => {
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const { mutate } = useRegisterProfile();

  const handleNext = () => {
    if (user === null) setShowModal(true);
    else if (isLast) return;
    else setStep("contact");
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
          setShowModal(false);
          console.log("Profile registered successfully");
        },
      });
    } catch (error: any) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View
      className="px-5 py-2 bg-white z-30"
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        // bottom: insets.bottom + 10, // respect safe area
        bottom: 0,

        paddingBottom: insets.bottom + 10,
      }}
    >
      <Pressable
        className="flex-1 py-3 rounded-md bg-lightPrimary active:bg-darkPrimary"
        onPress={handleNext}
      >
        <Text className="font-bold text-center text-lg text-white">
          {isLast ? "Book now" : "Next"}
        </Text>
      </Pressable>
      <NotLoggedInModal
        visible={showModal}
        onGooglePress={handleGoogleSignIn}
        setVisible={setShowModal}
      />
      <LoadingModal visible={loading} />
    </View>
  );
};

export default SheetButton;
