import * as Haptics from "expo-haptics";
import {
  useAnimatedStyle,
  useSharedValue,
  withSequence,
  withTiming,
} from "react-native-reanimated";

export function useShake() {
  const offset = useSharedValue(0);

  const shake = () => {
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);

    offset.value = withSequence(
      withTiming(-10, {duration: 50}),
      withTiming(10, {duration: 50}),
      withTiming(-8, {duration: 50}),
      withTiming(8, {duration: 50}),
      withTiming(0, {duration: 50})
    );
  };

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{translateX: offset.value}],
  }));

  return {shake, animatedStyle};
}
