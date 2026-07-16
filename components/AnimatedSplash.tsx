import {useEffect} from "react";
import {StyleSheet, View} from "react-native";
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from "react-native-reanimated";

type AnimatedSplashProps = {
  onFinish: () => void;
};

// Mark: arrives from the right with a slight overshoot-and-settle.
// Lower stiffness / higher mass = slower spring settle (~600-700ms here).
const MARK_START_X = 60;
const MARK_SPRING_CONFIG = {
  damping: 12,
  stiffness: 90,
  mass: 1.3,
};

// Streaks: start further out than the mark and delayed, so they arrive
// a beat *after* it — reads as trailing behind, not sliding in together.
const STREAKS_START_X = 100;
const STREAKS_DELAY = 200;
const STREAKS_DURATION = 500;

// Idle pulse: one small breath on the streaks while everything holds,
// so the screen isn't static for the full hold window.
const PULSE_DELAY = 1000;
const PULSE_DURATION = 350;

// Total runtime = HOLD_UNTIL + FADE_OUT_DURATION = 2000ms.
const HOLD_UNTIL = 1600;
const FADE_OUT_DURATION = 400;

const LOGO_SIZE = 220;

export default function AnimatedSplash({onFinish}: AnimatedSplashProps) {
  const markOpacity = useSharedValue(0);
  const markTranslateX = useSharedValue(MARK_START_X);

  const streaksOpacity = useSharedValue(0);
  const streaksTranslateX = useSharedValue(STREAKS_START_X);
  const streaksScale = useSharedValue(1);

  const containerOpacity = useSharedValue(1);

  useEffect(() => {
    // Mark arrives first, with a spring so it overshoots slightly then
    // settles — feels like something coming to a stop, not just fading in.
    markOpacity.value = withTiming(1, {
      duration: 220,
      easing: Easing.out(Easing.cubic),
    });
    markTranslateX.value = withSpring(0, MARK_SPRING_CONFIG);

    // Streaks trail in behind the mark.
    streaksOpacity.value = withDelay(
      STREAKS_DELAY,
      withTiming(1, {
        duration: STREAKS_DURATION,
        easing: Easing.out(Easing.cubic),
      }),
    );
    streaksTranslateX.value = withDelay(
      STREAKS_DELAY,
      withTiming(0, {
        duration: STREAKS_DURATION,
        easing: Easing.out(Easing.quad),
      }),
    );

    // One small pulse on the streaks during the hold, so there's a
    // second beat of motion instead of dead time before fade-out.
    streaksScale.value = withDelay(
      PULSE_DELAY,
      withSequence(
        withTiming(1.06, {
          duration: PULSE_DURATION / 2,
          easing: Easing.out(Easing.quad),
        }),
        withTiming(1, {
          duration: PULSE_DURATION / 2,
          easing: Easing.in(Easing.quad),
        }),
      ),
    );

    containerOpacity.value = withDelay(
      HOLD_UNTIL,
      withTiming(
        0,
        {
          duration: FADE_OUT_DURATION,
          easing: Easing.in(Easing.cubic),
        },
        (finished) => {
          "worklet";
          if (finished) {
            runOnJS(onFinish)();
          }
        },
      ),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
  }));

  const markStyle = useAnimatedStyle(() => ({
    opacity: markOpacity.value,
    transform: [{translateX: markTranslateX.value}],
  }));

  const streaksStyle = useAnimatedStyle(() => ({
    opacity: streaksOpacity.value,
    transform: [
      {translateX: streaksTranslateX.value},
      {scale: streaksScale.value},
    ],
  }));

  return (
    <Animated.View
      style={[styles.container, containerStyle]}
      pointerEvents="none"
    >
      <View style={styles.logoWrap}>
        <Animated.Image
          source={require("@/assets/fastmet/splash-mark.png")}
          style={[styles.logoImage, markStyle]}
          resizeMode="contain"
        />
        <Animated.Image
          source={require("@/assets/fastmet/splash-streaks.png")}
          style={[styles.logoImage, streaksStyle]}
          resizeMode="contain"
        />
      </View>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 999,
  },
  logoWrap: {
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
  logoImage: {
    ...StyleSheet.absoluteFillObject,
    width: LOGO_SIZE,
    height: LOGO_SIZE,
  },
});
