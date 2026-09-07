import { useState, useEffect } from "react";

export interface CancelTimerState {
  canCancel: boolean;
  remainingMs: number;
  remainingMinutes: number;
  remainingSeconds: number;
}

export function useCancelBookingTimer(
  referenceTime: Date | null,
  graceMinutes: number
): CancelTimerState {
  const [now, setNow] = useState(Date.now());

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(Date.now());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (!referenceTime) {
    return {
      canCancel: false,
      remainingMs: graceMinutes * 60 * 1000,
      remainingMinutes: graceMinutes,
      remainingSeconds: 0,
    };
  }

  const referenceMs = new Date(referenceTime).getTime();
  const graceMs = graceMinutes * 60 * 1000;
  const elapsed = now - referenceMs;
  const remaining = Math.max(0, graceMs - elapsed);

  return {
    canCancel: elapsed >= graceMs,
    remainingMs: remaining,
    remainingMinutes: Math.floor(remaining / 60000),
    remainingSeconds: Math.floor((remaining % 60000) / 1000),
  };
}
