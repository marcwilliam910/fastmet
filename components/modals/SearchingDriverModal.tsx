import { STATIC_IMAGES } from "@/utils/constants";
import { Image, ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { cssInterop } from "nativewind";
import React, { useEffect, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const AnimatedView = cssInterop(Animated.View, { className: "style" });

export default function SearchingDriverModal({
  visible,
}: {
  visible: boolean;
}) {
  const sweepAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const inset = useSafeAreaInsets();

  useEffect(() => {
    if (!visible) return;

    // Faster, smoother rotation for 2026 UI standards
    Animated.loop(
      Animated.timing(sweepAnim, {
        toValue: 1,
        duration: 2500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    ).start();

    // Subtle breathing pulse
    Animated.loop(
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      })
    ).start();

    return () => {
      sweepAnim.setValue(0);
      pulseAnim.setValue(0);
    };
  }, [pulseAnim, sweepAnim, visible]);

  const sweepRotate = sweepAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  const pulseScale = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.8, 1.9],
  });

  const pulseOpacity = pulseAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0.4, 0],
  });

  return (
    <Modal transparent visible={visible} animationType="fade">
      <ImageBackground
        source={STATIC_IMAGES.map_bg}
        style={{ flex: 1 }}
        contentFit="cover"
      >
        <View className="flex-1 bg-black/70 items-center justify-between pt-10 px-6">
          {/* Top Section: Status */}
          <View className="items-center mt-10">
            <Text className="text-white text-2xl font-bold tracking-tight">
              Searching...
            </Text>
            <Text className="text-gray-400 text-sm mt-2">
              Connecting you with the best driver nearby
            </Text>
          </View>

          {/* Center Section: The Radar */}
          <View className="items-center justify-center">
            {/* Ambient Pulse Glow */}
            <AnimatedView
              className="absolute size-64 rounded-full bg-orange-500/50"
              style={{
                transform: [{ scale: pulseScale }],
                opacity: pulseOpacity,
              }}
            />

            {/* Main Radar Disc */}
            <View className="size-72 items-center justify-center rounded-full border border-white/10 bg-black/40 overflow-hidden">
              {/* Background Rings */}
              {[1, 2, 3].map((i) => (
                <View
                  key={i}
                  className="absolute rounded-full border-lightPrimary/20"
                  style={{ width: i * 80, height: i * 80, borderWidth: 4 - i }}
                />
              ))}

              {/* The Rotating Sweep */}
              <AnimatedView
                style={{
                  ...StyleSheet.absoluteFillObject,
                  transform: [{ rotate: sweepRotate }],
                }}
              >
                {/* This View creates the "Pie Slice" sweep */}
                <LinearGradient
                  colors={["rgba(251, 146, 60, 0.5)", "transparent"]}
                  start={{ x: 1, y: 0 }}
                  end={{ x: 0, y: 1 }}
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    width: "50%",
                    height: "50%",
                    borderTopRightRadius: 128, // Matches radius (64*2 / 2)
                  }}
                />
                {/* Leading Scanning Line */}
                <View className="absolute top-0 left-1/2 w-[2px] h-1/2 bg-orange-400 shadow-lg shadow-orange-500" />
              </AnimatedView>

              {/* Center Logo Hub */}
              <View className="size-28 rounded-full bg-slate-900 border-2 border-orange-500 items-center justify-center shadow-2xl shadow-orange-500/50">
                <Image
                  source={STATIC_IMAGES.fastmetLogo}
                  style={{ width: 50, height: 50 }}
                  contentFit="fill"
                />
              </View>
            </View>
          </View>

          {/* Bottom Section: Driver Card */}
          <DriverListCard />

          {/* Bottom Section: Actions */}
          <Pressable
            className="w-full items-center bg-orange-500 py-4 rounded-2xl active:opacity-90 shadow-lg shadow-orange-900/20"
            style={{ marginBottom: inset.bottom }}
          >
            <Text className="text-white text-lg font-bold">Skip for now</Text>
          </Pressable>
        </View>
      </ImageBackground>
    </Modal>
  );
}

const DriverListCard = () => {
  const [drivers, setDrivers] = useState<any[]>([]);
  const nextIdRef = useRef(7);

  // Simulate drivers arriving at random intervals
  useEffect(() => {
    const driverPool = [
      { name: "Juan Lazcano", rating: 4.8, reviews: 70, distance: 8 },
      { name: "Maria Santos", rating: 4.9, reviews: 120, distance: 5 },
      { name: "Carlos Mendez", rating: 4.7, reviews: 85, distance: 12 },
      { name: "Ana Rodriguez", rating: 4.6, reviews: 95, distance: 15 },
      { name: "Luis Garcia", rating: 4.8, reviews: 110, distance: 7 },
      { name: "Sofia Martinez", rating: 4.9, reviews: 150, distance: 3 },
      { name: "Pedro Alvarez", rating: 4.7, reviews: 65, distance: 10 },
      { name: "Isabella Cruz", rating: 4.9, reviews: 135, distance: 6 },
      { name: "Miguel Torres", rating: 4.6, reviews: 88, distance: 14 },
      { name: "Carmen Reyes", rating: 4.8, reviews: 102, distance: 9 },
    ];

    let poolIndex = 0;

    const addRandomDriver = () => {
      if (poolIndex < driverPool.length) {
        const newDriver = {
          id: nextIdRef.current++,
          ...driverPool[poolIndex],
        };

        setDrivers((prev) => [...prev, newDriver]);
        poolIndex++;

        // Schedule next driver arrival (random between 2-6 seconds)
        const delay = Math.random() * 4000 + 2000;
        setTimeout(addRandomDriver, delay);
      }
    };

    // Start with first driver immediately
    addRandomDriver();

    return () => {};
  }, []);

  const handleRemoveDriver = (id: number) => {
    setDrivers((prev) => prev.filter((driver) => driver.id !== id));
  };

  return (
    <View style={{ width: "100%", marginBottom: 24, paddingHorizontal: 8 }}>
      <View style={{ marginBottom: 12, paddingHorizontal: 4 }}>
        <Text
          style={{
            color: "rgba(255, 255, 255, 0.9)",
            fontSize: 12,
            fontWeight: "600",
            textTransform: "uppercase",
            letterSpacing: 1,
          }}
        >
          Available Drivers ({drivers.length})
        </Text>
      </View>

      <View style={{ height: 280 }}>
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ gap: 4 }}
        >
          {drivers.map((driver) => (
            <DriverRow
              key={driver.id}
              driver={driver}
              onRemove={() => handleRemoveDriver(driver.id)}
            />
          ))}
        </ScrollView>
      </View>
    </View>
  );
};

const DriverRow = ({
  driver,
  onRemove,
}: {
  driver: any;
  onRemove: () => void;
}) => {
  const [progress, setProgress] = useState(100);
  const translateX = useRef(new Animated.Value(-400)).current; // Start from left
  const opacity = useRef(new Animated.Value(0)).current; // Start invisible

  useEffect(() => {
    // Entrance animation - slide in from left
    Animated.parallel([
      Animated.timing(translateX, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
    ]).start();

    // Timer countdown (random between 30-60 seconds per driver)
    const duration = 60000; // 30-60 seconds
    const interval = 50; // Update every 50ms
    const step = (interval / duration) * 100;

    const timer = setInterval(() => {
      setProgress((prev) => {
        const newProgress = prev - step;
        if (newProgress <= 0) {
          clearInterval(timer);
          // Trigger swipe-right removal animation
          Animated.parallel([
            Animated.timing(translateX, {
              toValue: 400, // Swipe to right
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(opacity, {
              toValue: 0,
              duration: 400,
              useNativeDriver: true,
            }),
          ]).start(() => {
            onRemove();
          });
          return 0;
        }
        return newProgress;
      });
    }, interval);

    return () => clearInterval(timer);
  }, [translateX, opacity, onRemove]);

  const getProgressColor = () => {
    if (progress > 66) return "#10B981"; // Green
    if (progress > 33) return "#F59E0B"; // Orange
    return "#EF4444"; // Red
  };

  return (
    <Animated.View
      style={{
        opacity: opacity,
        transform: [{ translateX: translateX }],
      }}
    >
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          paddingHorizontal: 16,
          backgroundColor: "#F3F4F6",
          borderRadius: 6,
          justifyContent: "space-between",
          paddingVertical: 12,
          position: "relative",
        }}
      >
        {/* Progress Bar */}
        <View
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 3,
            backgroundColor: "rgba(0, 0, 0, 0.05)",
          }}
        >
          <View
            style={{
              height: "100%",
              width: `${progress}%`,
              backgroundColor: getProgressColor(),
              borderRadius: 3,
            }}
          />
        </View>

        {/* Left: Driver Info */}
        <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
          <View
            style={{
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: "#E5E7EB",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text style={{ fontSize: 20 }}>👤</Text>
          </View>

          <View>
            <Text style={{ color: "#111827", fontWeight: "600", fontSize: 14 }}>
              {driver.name}
            </Text>

            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                gap: 4,
                marginTop: 2,
              }}
            >
              <Text style={{ fontSize: 14 }}>⭐</Text>
              <Text style={{ color: "#6B7280", fontSize: 12 }}>
                {driver.rating} ({driver.reviews})
              </Text>
            </View>
          </View>
        </View>

        {/* Right: Distance */}
        <View
          style={{
            alignItems: "center",
            justifyContent: "center",
            borderRadius: 12,
            backgroundColor: "#F97316",
            paddingHorizontal: 12,
            paddingVertical: 8,
          }}
        >
          <Text
            style={{
              color: "white",
              fontSize: 10,
              textTransform: "uppercase",
              letterSpacing: 0.5,
            }}
          >
            Distance
          </Text>
          <Text style={{ color: "white", fontWeight: "bold", fontSize: 14 }}>
            {driver.distance} km
          </Text>
        </View>
      </View>
    </Animated.View>
  );
};
