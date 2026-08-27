import {Ionicons} from "@expo/vector-icons";
import {useEffect, useState} from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

export const DELETE_CONFIRM_PHRASE = "delete-my-account";

type Props = {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onConfirm: () => Promise<void> | void;
  loading?: boolean;
};

export default function DeleteAccountModal({
  isOpen,
  setIsOpen,
  onConfirm,
  loading = false,
}: Props) {
  const [confirmText, setConfirmText] = useState("");

  useEffect(() => {
    if (!isOpen) setConfirmText("");
  }, [isOpen]);

  const canSubmit =
    confirmText.trim() === DELETE_CONFIRM_PHRASE && !loading;

  return (
    <Modal
      visible={isOpen}
      statusBarTranslucent
      transparent
      animationType="fade"
      onRequestClose={() => !loading && setIsOpen(false)}
    >
      <View className="items-center justify-center flex-1 bg-black/50 px-5">
        <View className="w-full max-w-md gap-4 p-6 bg-white rounded-2xl">
          <View className="items-center self-center p-4 bg-red-100 rounded-full">
            <Ionicons name="warning-outline" size={36} color="#DC2626" />
          </View>

          <Text className="text-xl font-bold text-center text-gray-800">
            Delete Account
          </Text>

          <Text className="text-sm text-center text-gray-600 leading-5">
            Your account will be scheduled for deletion. You have 30 days to
            cancel by logging back in. After that, personal data is permanently
            removed.
          </Text>

          <Text className="text-sm text-gray-700">
            Type{" "}
            <Text className="font-bold text-red-600">
              {DELETE_CONFIRM_PHRASE}
            </Text>{" "}
            to confirm:
          </Text>

          <TextInput
            value={confirmText}
            onChangeText={setConfirmText}
            autoCapitalize="none"
            autoCorrect={false}
            editable={!loading}
            placeholder={DELETE_CONFIRM_PHRASE}
            className="px-4 py-3 text-base border border-gray-300 rounded-xl text-gray-800"
          />

          <Pressable
            disabled={!canSubmit}
            onPress={() => void onConfirm()}
            className={`items-center py-4 rounded-lg ${
              canSubmit ? "bg-red-600 active:bg-red-700" : "bg-red-300"
            }`}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text className="text-base font-bold text-white">
                Delete My Account
              </Text>
            )}
          </Pressable>

          <Pressable
            disabled={loading}
            onPress={() => setIsOpen(false)}
            className="items-center py-3"
          >
            <Text className="text-base font-semibold text-gray-600">
              Cancel
            </Text>
          </Pressable>
        </View>
      </View>
    </Modal>
  );
}
