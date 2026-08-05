import {LinearGradient} from "expo-linear-gradient";
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

// Background — estimated from your logo image. Swap for exact brand hex
// if you have a style guide; this is eyeballed, not sourced.
const BG_TOP = "#1C2B39";
const BG_BOTTOM = "#141F29";

const MARK_START_X = 60;
const MARK_START_SCALE = 0.9;
const MARK_SPRING_CONFIG = {damping: 12, stiffness: 90, mass: 1.3};

const STREAKS_START_X = 100;
const STREAKS_DELAY = 200;
const STREAKS_DURATION = 500;

const PULSE_DELAY = 1000;
const PULSE_DURATION = 350;

const HOLD_UNTIL = 1600;
const EXIT_DURATION = 400; // scale+fade exit, same total runtime as before

const LOGO_SIZE = 220;

export default function AnimatedSplash({onFinish}: AnimatedSplashProps) {
  const markOpacity = useSharedValue(0);
  const markTranslateX = useSharedValue(MARK_START_X);
  const markScale = useSharedValue(MARK_START_SCALE);

  const streaksOpacity = useSharedValue(0);
  const streaksTranslateX = useSharedValue(STREAKS_START_X);
  const streaksScale = useSharedValue(1);

  const containerOpacity = useSharedValue(1);
  const containerScale = useSharedValue(1);

  useEffect(() => {
    markOpacity.value = withTiming(1, {
      duration: 220,
      easing: Easing.out(Easing.cubic),
    });
    markTranslateX.value = withSpring(0, MARK_SPRING_CONFIG);
    markScale.value = withSpring(1, MARK_SPRING_CONFIG);

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

    // Exit: scale up slightly + fade, reads as "launching forward"
    // instead of just disappearing.
    containerOpacity.value = withDelay(
      HOLD_UNTIL,
      withTiming(
        0,
        {duration: EXIT_DURATION, easing: Easing.in(Easing.cubic)},
        (finished) => {
          "worklet";
          if (finished) runOnJS(onFinish)();
        },
      ),
    );
    containerScale.value = withDelay(
      HOLD_UNTIL,
      withTiming(1.08, {
        duration: EXIT_DURATION,
        easing: Easing.in(Easing.cubic),
      }),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const containerStyle = useAnimatedStyle(() => ({
    opacity: containerOpacity.value,
    transform: [{scale: containerScale.value}],
  }));

  const markStyle = useAnimatedStyle(() => ({
    opacity: markOpacity.value,
    transform: [{translateX: markTranslateX.value}, {scale: markScale.value}],
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
      <LinearGradient
        colors={[BG_TOP, BG_BOTTOM]}
        style={StyleSheet.absoluteFillObject}
      />
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
