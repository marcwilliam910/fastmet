import {Ionicons} from "@expo/vector-icons";
import React from "react";
import {InteractionManager, Modal, Pressable, Text, View} from "react-native";
import Animated, {FadeIn, ZoomIn} from "react-native-reanimated";

type NotificationPermissionModalProps = {
  visible: boolean;
  onDecline: () => void;
  onEnable: () => void;
};

export function NotificationPermissionModal({
  visible,
  onDecline,
  onEnable,
}: NotificationPermissionModalProps) {
  if (!visible) return null;

  const handlePress = (action: () => void) => {
    onDecline === action ? undefined : undefined; // no-op guard removed below
  };

  const press = (action: () => void) => () => {
    InteractionManager.runAfterInteractions(action);
  };

  return (
    <Modal
      transparent
      visible={visible}
      animationType="none"
      statusBarTranslucent
      onRequestClose={onDecline}
    >
      <Animated.View
        entering={FadeIn.duration(150)}
        accessibilityViewIsModal
        className="flex-1 justify-center items-center px-6 bg-black/50"
      >
        <Animated.View
          entering={ZoomIn.duration(180)}
          className="w-full max-w-sm bg-white rounded-3xl overflow-hidden"
          style={{
            shadowColor: "#000",
            shadowOffset: {width: 0, height: 12},
            shadowOpacity: 0.18,
            shadowRadius: 24,
            elevation: 10,
          }}
        >
          {/* Icon header */}
          <View className="items-center pt-8 pb-2">
            <View
              className="justify-center items-center w-16 h-16 rounded-full"
              style={{backgroundColor: "#FDEEDC"}}
            >
              <Ionicons name="notifications" size={30} color="#ED8718" />
            </View>
          </View>

          <View className="px-6 pt-3 pb-6">
            <Text
              accessibilityRole="header"
              className="text-lg font-semibold text-center text-neutral-900"
            >
              Stay Updated
            </Text>
            <Text className="mt-2 text-sm leading-5 text-center text-neutral-500">
              Enable notifications to receive alerts about scheduled trips and
              booking updates.
            </Text>
          </View>

          {/* Buttons stacked, primary on top — easier thumb reach, clearer hierarchy */}
          <View className="px-4 pb-4 gap-2">
            <Pressable
              onPress={press(onEnable)}
              accessibilityRole="button"
              accessibilityLabel="Enable"
              hitSlop={4}
              className="justify-center items-center h-12 rounded-xl active:bg-darkPrimary bg-lightPrimary"
            >
              <Text className="font-semibold text-white text-[15px]">
                Enable
              </Text>
            </Pressable>

            <Pressable
              onPress={press(onDecline)}
              accessibilityRole="button"
              accessibilityLabel="Not Now"
              hitSlop={4}
              className="justify-center items-center h-12 rounded-xl active:opacity-60"
            >
              <Text className="font-medium text-neutral-500 text-[15px]">
                Not Now
              </Text>
            </Pressable>
          </View>
        </Animated.View>
      </Animated.View>
    </Modal>
  );
}
