import {Ionicons} from "@expo/vector-icons";
import React from "react";
import {InteractionManager, Modal, Pressable, Text, View} from "react-native";
import Animated, {FadeIn, ZoomIn} from "react-native-reanimated";

type AlertButton = {
  text: string;
  style?: "default" | "cancel" | "destructive";
  onPress?: () => void;
};

type AlertVariant = "default" | "info" | "success" | "warning" | "destructive";

type CustomAlertModalProps = {
  visible: boolean;
  title: string;
  message: string;
  buttons: AlertButton[];
  variant?: AlertVariant;
  onRequestClose?: () => void;
};

const VARIANT_CONFIG: Record<
  AlertVariant,
  {icon: keyof typeof Ionicons.glyphMap; bg: string; fg: string}
> = {
  default: {icon: "notifications", bg: "#FDEEDC", fg: "#ED8718"},
  info: {icon: "information-circle", bg: "#DBEAFE", fg: "#2563EB"},
  success: {icon: "checkmark-circle", bg: "#DCFCE7", fg: "#16A34A"},
  warning: {icon: "warning", bg: "#FEF3C7", fg: "#D97706"},
  destructive: {icon: "alert-circle", bg: "#FEE2E2", fg: "#DC2626"},
};

export function CustomAlertModal({
  visible,
  title,
  message,
  buttons,
  variant = "default",
  onRequestClose,
}: CustomAlertModalProps) {
  if (!visible) return null;

  const {icon, bg, fg} = VARIANT_CONFIG[variant];

  const handlePress = (btn: AlertButton) => {
    onRequestClose?.();
    InteractionManager.runAfterInteractions(() => {
      btn.onPress?.();
    });
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={onRequestClose}
    >
      <Animated.View
        entering={FadeIn.duration(150)}
        accessibilityViewIsModal
        className="flex-1 justify-center items-center px-6 bg-black/50"
      >
        <Animated.View
          entering={ZoomIn.duration(180)}
          className="p-6 w-full max-w-sm bg-white rounded-2xl"
          style={{
            shadowColor: "#000",
            shadowOffset: {width: 0, height: 8},
            shadowOpacity: 0.15,
            shadowRadius: 20,
            elevation: 8,
          }}
        >
          <View
            className="justify-center items-center self-center mb-4 w-12 h-12 rounded-full"
            style={{backgroundColor: bg}}
          >
            <Ionicons name={icon} size={24} color={fg} />
          </View>

          <Text
            accessibilityRole="header"
            className="text-lg font-semibold text-center text-neutral-900"
          >
            {title}
          </Text>
          <Text className="mt-2 text-sm leading-5 text-center text-neutral-500">
            {message}
          </Text>

          <View className="flex-row gap-3 justify-end mt-6">
            {buttons.map((btn, i) => (
              <Pressable
                key={i}
                onPress={() => handlePress(btn)}
                accessibilityRole="button"
                accessibilityLabel={btn.text}
                hitSlop={4}
                className="min-h-[40px] justify-center rounded-lg px-4 py-2 active:opacity-70"
                style={
                  btn.style === "destructive"
                    ? {backgroundColor: "#FEE2E2"}
                    : btn.style !== "cancel"
                      ? {backgroundColor: "#ED8718"}
                      : undefined
                }
              >
                <Text
                  className={
                    btn.style === "cancel"
                      ? "font-medium text-neutral-500"
                      : btn.style === "destructive"
                        ? "font-medium text-red-600"
                        : "font-medium text-white"
                  }
                >
                  {btn.text}
                </Text>
              </Pressable>
            ))}
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
