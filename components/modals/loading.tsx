import {Image} from "expo-image";
import {cssInterop} from "nativewind";
import React, {useEffect, useRef} from "react";
import {Animated, Easing, Modal, View} from "react-native";

const AnimatedView = cssInterop(Animated.View, {className: "style"});

export default function LoadingModal({visible}: {visible: boolean}) {
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // Scale in animation when modal becomes visible
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }).start();

      // Start rotation
      Animated.loop(
        Animated.timing(rotateAnim, {
          toValue: 1,
          duration: 1500,
          easing: Easing.bezier(0.65, 0, 0.35, 1),
          useNativeDriver: true,
        })
      ).start();
    } else {
      // Reset animations when hidden
      scaleAnim.setValue(0);
      rotateAnim.setValue(0);
    }
  }, [visible, rotateAnim, scaleAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Modal
      transparent
      animationType="fade"
      visible={visible}
      statusBarTranslucent
    >
      <View className="items-center justify-center flex-1 bg-black/50">
        <AnimatedView
          className="items-center p-10 rounded-3xl backdrop-blur-xl"
          style={{
            transform: [{scale: scaleAnim}],
          }}
        >
          <View className="relative items-center justify-center w-24 h-24">
            {/* Outer spinning ring */}
            <AnimatedView
              className="absolute border-[5px] border-orange-500 rounded-full size-32 border-t-transparent border-l-transparent shadow-2xl"
              style={{transform: [{rotate: spin}]}}
            />

            {/* Inner glow effect */}
            <View className="absolute rounded-full bg-orange-400/20 size-28 blur-xl" />

            {/* Logo */}
            <Image
              source={require("@/assets/fastmet/logo.png")}
              style={{width: 60, height: 75}}
              contentFit="contain"
            />
          </View>
        </AnimatedView>
      </View>
    </Modal>
  );
}
