import { useAppStore } from "@/store/useAppStore";
import { Ionicons } from "@expo/vector-icons";
import { useEffect, useRef } from "react";
import {
  ActivityIndicator,
  Modal,
  Pressable,
  Text,
  Vibration,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ConfirmCancelBookingModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmCancelBookingModals({
  visible,
  onClose,
  onConfirm,
}: ConfirmCancelBookingModalProps) {
  const loading = useAppStore((state) => state.isLoading);
  const hasVibrated = useRef(false);
  const inset = useSafeAreaInsets();

  // Vibrate once when modal opens
  useEffect(() => {
    if (visible && !hasVibrated.current) {
      Vibration.vibrate(80);
      hasVibrated.current = true;
    }

    if (!visible) {
      hasVibrated.current = false;
    }
  }, [visible]);

  return (
    <Modal
      transparent
      animationType="slide"
      visible={visible}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50 justify-end">
        <View
          className="rounded-t-3xl bg-white dark:bg-neutral-900 p-6"
          style={{ paddingBottom: inset.bottom + 20 }}
        >
          {/* Warning Icon */}
          <View className="items-center mb-4">
            <View className="h-14 w-14 rounded-full bg-red-100 dark:bg-red-900/30 items-center justify-center">
              <Ionicons name="warning-outline" size={28} color="#dc2626" />
            </View>
          </View>

          {/* Title */}
          <Text className="text-xl font-bold text-center text-neutral-900 dark:text-white">
            Cancel Booking
          </Text>

          {/* Description */}
          <Text className="mt-3 text-base text-center text-neutral-600 dark:text-neutral-300">
            Are you sure you want to cancel this booking? This action cannot be
            undone.
          </Text>

          {/* Actions */}
          <View className="mt-6 flex-row gap-3">
            <Pressable
              disabled={loading}
              onPress={onClose}
              className="flex-1 py-3 rounded-xl bg-neutral-200 dark:bg-neutral-700"
            >
              <Text className="text-center font-semibold text-neutral-800 dark:text-neutral-200">
                Keep Booking
              </Text>
            </Pressable>

            <Pressable
              disabled={loading}
              onPress={onConfirm}
              className="flex-1 py-3 rounded-xl bg-red-600 active:bg-red-700"
            >
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text className="text-center font-semibold text-white">
                  Cancel Booking
                </Text>
              )}
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
}
