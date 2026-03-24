import { useEffect, useRef, useState } from "react";
import { Text, TextStyle, View } from "react-native";

// ✅ Separate Timer Component - Counts down then goes negative
interface TimerDisplayProps {
  visible: boolean;
  onTimerEnd: () => void;
}

export const TimerDisplay = ({ visible, onTimerEnd }: TimerDisplayProps) => {
  const [displayTime, setDisplayTime] = useState("1:00");
  const [isNegative, setIsNegative] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const hasEndedRef = useRef(false); // Track if we've already called onTimerEnd

  useEffect(() => {
    if (visible) {
      // Reset on mount
      setDisplayTime("1:00");
      setIsNegative(false);
      hasEndedRef.current = false;

      let timeRemaining = 60;

      timerRef.current = setInterval(() => {
        timeRemaining -= 1;

        // After reaching 0, continue counting negatively
        if (timeRemaining === 0 && !hasEndedRef.current) {
          onTimerEnd(); // Call this only once
          hasEndedRef.current = true;
        }

        if (timeRemaining < 0) {
          setIsNegative(true);
          const absTime = Math.abs(timeRemaining);
          const mins = Math.floor(absTime / 60);
          const secs = absTime % 60;
          setDisplayTime(`-${mins}:${secs.toString().padStart(2, "0")}`);
        } else {
          const mins = Math.floor(timeRemaining / 60);
          const secs = timeRemaining % 60;
          setDisplayTime(`${mins}:${secs.toString().padStart(2, "0")}`);
        }
      }, 1000);

      return () => {
        if (timerRef.current) clearInterval(timerRef.current);
      };
    }
  }, [onTimerEnd, visible]); // Only depend on visible, not onTimerEnd

  const getTimeColor = () => {
    if (isNegative) return "#EF4444"; // Red for negative time

    const [mins, secs] = displayTime.split(":").map(Number);
    const totalSeconds = mins * 60 + secs;

    if (totalSeconds > 40) return "#10B981"; // Green (40-60 seconds)
    if (totalSeconds > 20) return "#F59E0B"; // Orange (20-40 seconds)
    return "#EF4444"; // Red (0-20 seconds)
  };

  return (
    <View className="mb-6 items-center">
      <Text className="mb-2 text-sm font-semibold uppercase tracking-wide text-gray-500">
        {isNegative ? "Time Elapsed" : "Time Remaining"}
      </Text>
      <Text style={{ color: getTimeColor() }} className="text-5xl font-bold">
        {displayTime}
      </Text>
    </View>
  );
};

interface CountdownProps {
  seconds: number;
  onExpire?: () => void;
  style?: TextStyle;
  className?: string;
}

export function Countdown({
  seconds,
  onExpire,
  style,
  className,
}: CountdownProps) {
  const [remaining, setRemaining] = useState(seconds);
  const onExpireRef = useRef(onExpire);
  const expiredRef = useRef(false);

  useEffect(() => {
    onExpireRef.current = onExpire;
  }, [onExpire]);

  useEffect(() => {
    setRemaining(seconds);
    expiredRef.current = false;
  }, [seconds]);

  // Tick interval (pure state updates only)
  useEffect(() => {
    if (remaining <= 0) return;

    const interval = setInterval(() => {
      setRemaining((prev) => Math.max(prev - 1, 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [remaining]);

  // Side effect when timer expires
  useEffect(() => {
    if (remaining === 0 && !expiredRef.current) {
      expiredRef.current = true;
      onExpireRef.current?.();
    }
  }, [remaining]);

  const m = Math.floor(remaining / 60);
  const s = remaining % 60;
  const formatted = `${m}:${s.toString().padStart(2, "0")}`;

  return (
    <Text style={style} className={className}>
      {formatted}
    </Text>
  );
}
