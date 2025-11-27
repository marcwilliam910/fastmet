import { Pressable, Text, useWindowDimensions, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

type Route = {
  key: string;
  title: string;
  badge?: number;
  component: React.ReactNode;
};

export default function SwipeTabView({ routes }: { routes: Route[] }) {
  const layout = useWindowDimensions();
  const tabCount = routes.length;

  const index = useSharedValue(0);
  const translateX = useSharedValue(0);

  const goToTab = (i: number) => {
    "worklet";
    index.value = i;
    translateX.value = withSpring(-i * layout.width, {
      damping: 50,
      stiffness: 600,
      overshootClamping: true,
    });
  };

  const panGesture = Gesture.Pan()
    .onUpdate((e) => {
      const min = -(tabCount - 1) * layout.width;
      const max = 0;

      let next = -index.value * layout.width + e.translationX;

      // clamp
      if (next > max) next = max; // stop at first tab
      if (next < min) next = min; // stop at last tab

      translateX.value = next;
    })

    .onEnd((e) => {
      const drag = e.translationX;
      const threshold = layout.width * 0.25;

      let nextIndex = index.value;

      if (drag > threshold && index.value > 0) {
        nextIndex = index.value - 1;
      } else if (drag < -threshold && index.value < tabCount - 1) {
        nextIndex = index.value + 1;
      }

      index.value = nextIndex;
      translateX.value = withSpring(-nextIndex * layout.width, {
        damping: 15,
      });
    });

  const containerStyle = useAnimatedStyle(() => ({
    width: layout.width * tabCount,
    flexDirection: "row",
    transform: [{ translateX: translateX.value }],
  }));

  const indicatorStyle = useAnimatedStyle(() => ({
    transform: [
      {
        translateX: withSpring((layout.width / tabCount) * index.value),
      },
    ],
  }));

  return (
    <View className="flex-1 bg-white">
      {/* TAB BAR */}
      <View className="flex-row border-b border-gray-200">
        {routes.map((item, i) => (
          <Pressable
            key={item.key}
            className="flex-1 flex-row items-center justify-center py-3"
            onPress={() => goToTab(i)}
          >
            <Text
              className={`text-base font-semibold ${
                i === Math.round(index.value)
                  ? "text-[#0F2535]"
                  : "text-gray-400"
              }`}
            >
              {item.title}
            </Text>

            {item.badge !== undefined && item.badge > 0 && (
              <View className="size-4 absolute top-1 right-1 bg-red-500 rounded-full items-center justify-center">
                <Text className="text-white text-xs font-bold">
                  {item.badge}
                </Text>
              </View>
            )}
          </Pressable>
        ))}
      </View>

      {/* INDICATOR */}
      <Animated.View
        className="h-1 bg-[#0F2535]"
        style={[
          {
            width: layout.width / tabCount,
          },
          indicatorStyle,
        ]}
      />

      {/* SWIPE CONTENT */}
      <GestureDetector gesture={panGesture}>
        <Animated.View className="flex-1" style={containerStyle}>
          {routes.map((r) => (
            <View
              key={r.key}
              className="flex-1"
              style={{ width: layout.width }}
            >
              {r.component}
            </View>
          ))}
        </Animated.View>
      </GestureDetector>
    </View>
  );
}
