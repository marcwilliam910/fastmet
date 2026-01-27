import { useAppStore } from "@/store/useAppStore";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";

interface UpdateBookingNoteModalProps {
  visible: boolean;
  initialNote?: string;
  onClose: () => void;
  onSave: (note: string) => void;
}

export default function UpdateBookingNoteModal({
  visible,
  initialNote = "",
  onClose,
  onSave,
}: UpdateBookingNoteModalProps) {
  const loading = useAppStore((state) => state.isLoading);
  const [note, setNote] = useState(initialNote);

  useEffect(() => {
    if (visible) {
      setNote(initialNote);
    }
  }, [visible, initialNote]);

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        className="flex-1 bg-black/50 items-center justify-center px-6"
      >
        <View className="w-full max-w-md rounded-2xl bg-white dark:bg-neutral-900 p-6">
          {/* Header */}
          <View className="flex-row items-center mb-4">
            <View className="h-10 w-10 rounded-full bg-lightPrimary/10 items-center justify-center">
              <Ionicons name="create-outline" size={20} color="#2563eb" />
            </View>
            <Text className="ml-3 text-lg font-bold text-neutral-900 dark:text-white">
              Update Note
            </Text>
          </View>

          {/* Input */}
          <TextInput
            value={note}
            onChangeText={setNote}
            placeholder="Add instructions for the driver (optional)"
            placeholderTextColor="#9ca3af"
            multiline
            numberOfLines={4}
            editable={!loading}
            className="min-h-[96px] rounded-xl border border-neutral-300 dark:border-neutral-700 px-4 py-3 text-base text-neutral-900 dark:text-white"
          />

          {/* Actions */}
          <View className="mt-6 flex-row gap-3">
            <Pressable
              disabled={loading}
              onPress={onClose}
              className="flex-1 py-3 rounded-xl bg-neutral-200 dark:bg-neutral-700"
            >
              <Text className="text-center font-semibold text-neutral-800 dark:text-neutral-200">
                Cancel
              </Text>
            </Pressable>

            <Pressable
              disabled={loading || note.trim() === initialNote.trim()}
              onPress={() => onSave(note.trim())}
              className="flex-1 py-3 rounded-xl bg-lightPrimary active:bg-lightPrimary/90 disabled:opacity-50"
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-center font-semibold text-white">
                  Save Note
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}
