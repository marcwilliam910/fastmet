import StarDisplay from "@/components/StarDisplay";
import { useSocket } from "@/sockets/context/SocketProvider";
import { useAppStore } from "@/store/useAppStore";
import { STATIC_IMAGES } from "@/utils/constants";
import { Ionicons } from "@expo/vector-icons";
import { usePreventRemove } from "@react-navigation/native";
import { Image, ImageBackground } from "expo-image";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { cssInterop } from "nativewind";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Alert,
  Animated,
  BackHandler,
  Easing,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";

const AnimatedView = cssInterop(Animated.View, { className: "style" });

type RequestedDriver = {
  name: string;
  id: string;
  rating: number;
  vehicleImage: string;
  totalBookings: number;
  distance: number;
  profilePicture: string;
};

const formatRadius = (km: number) => {
  if (km < 1) {
    return `${Math.round(km * 1000)}m`;
  }
  return `${km.toFixed(1)}km`;
};

export default function SearchingDriver() {
  //get params
  const { bookingId } = useLocalSearchParams<{ bookingId: string }>();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const sweepAnim = useRef(new Animated.Value(0)).current;
  const pulseAnim = useRef(new Animated.Value(0)).current;
  const inset = useSafeAreaInsets();
  const [drivers, setDrivers] = useState<RequestedDriver[]>([]);
  const socket = useSocket();
  const [shouldPrevent, setShouldPrevent] = useState(true);

  console.log("SearchingDriver");

  // 1. Prevent screen removal (for both platforms)
  usePreventRemove(shouldPrevent, () => null);
  // 2. Android hardware back override
  useEffect(() => {
    if (Platform.OS !== "android") return;

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      () => shouldPrevent, // Only block if shouldPrevent is true
    );

    return () => backHandler.remove();
  }, [shouldPrevent]);

  useEffect(() => {
    // Faster, smoother rotation for 2026 UI standards
    Animated.loop(
      Animated.timing(sweepAnim, {
        toValue: 1,
        duration: 2500,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    ).start();

    // Subtle breathing pulse
    Animated.loop(
      Animated.timing(pulseAnim, {
        toValue: 1,
        duration: 2000,
        easing: Easing.inOut(Easing.quad),
        useNativeDriver: true,
      }),
    ).start();

    return () => {
      sweepAnim.setValue(0);
      pulseAnim.setValue(0);
    };
  }, [pulseAnim, sweepAnim]);

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

  //SOCKETS LISTENER
  useEffect(() => {
    const handleCancelOffer = ({ driverId }: { driverId: string }) => {
      handleRemoveDriver(driverId);
    };
    const handleAcceptanceRequest = (data: RequestedDriver) => {
      setDrivers((prev) => [...prev, data]);
    };
    const handleBookingCancelled = ({ bookingId }: { bookingId: string }) => {
      useAppStore.getState().clearStates();
      setShouldPrevent(false);

      Toast.show({
        type: "success",
        text1: "Booking Cancelled",
        text2: "Successfully cancelled booking",
        position: "top",
        visibilityTime: 5_000,
        swipeable: true,
        topOffset: 50,
      });

      // Navigate after state update
      setTimeout(() => {
        router.replace("/(drawer)/(tabs)/request?tab=cancelled");
      }, 50);
    };
    const handleDriverAccepted = ({ bookingId }: { bookingId: string }) => {
      setIsModalOpen(false);
      Toast.show({
        type: "bookingAccepted",
        text1: "Driver Found! 🎉",
        text2: "Your driver is on the way",
        position: "top",
        visibilityTime: 10_000,
        swipeable: true,
        topOffset: 50,
      });
      router.push({
        pathname: "/(root_screens)/booking/viewOnMap",
        params: {
          bookingId,
        }, //TESTING PA
      });
    };
    const errorHandler = ({ message }: { message: string }) => {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: message,
        position: "top",
        visibilityTime: 5_000,
        swipeable: true,
        topOffset: 50,
      });

      useAppStore.getState().clearStates();

      router.push("/(drawer)/book");
    };

    socket.on("offerCancelled", handleCancelOffer);
    socket.on("acceptanceRequested", handleAcceptanceRequest);
    socket.on("bookingCancelled", handleBookingCancelled);
    socket.on("driverAccepted", handleDriverAccepted);
    socket.on("error", errorHandler);

    return () => {
      socket.off("acceptanceRequested", handleAcceptanceRequest);
      socket.off("offerCancelled", handleCancelOffer);
      socket.off("bookingCancelled", handleBookingCancelled);
      socket.off("driverAccepted", handleDriverAccepted);
      socket.off("error", errorHandler);
    };
  }, [socket]);

  const handleRemoveDriver = (id: string) => {
    setDrivers((prev) => prev.filter((driver) => driver.id !== id));
  };

  const handleCancelRequest = () => {
    Alert.alert("Cancel Request", "Are you sure you want to cancel?", [
      {
        text: "Cancel",
        style: "cancel",
      },
      {
        text: "Yes",
        onPress: () => socket.emit("cancelBookingRequest", { bookingId }),
      },
    ]);
  };

  return (
    <ImageBackground
      source={STATIC_IMAGES.map_bg}
      style={{ flex: 1 }}
      contentFit="cover"
    >
      <View className="flex-1 bg-black/70 items-center justify-between pt-10 px-6">
        {/* Top Section: Status */}
        <SearchRadiusIndicator />

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
        {drivers.length > 0 && (
          <DriverListCard
            drivers={drivers}
            handleRemoveDriver={handleRemoveDriver}
            bookingId={bookingId}
            isModalOpen={isModalOpen}
            setIsModalOpen={setIsModalOpen}
          />
        )}

        {/* Bottom Section: Actions */}
        <Pressable
          onPress={handleCancelRequest}
          className="w-full items-center bg-white/30 py-4 rounded-2xl active:opacity-90 shadow-lg "
          style={{ marginBottom: inset.bottom + 10 }}
        >
          <Text className="text-white text-lg font-bold">Cancel Request</Text>
        </Pressable>
      </View>
    </ImageBackground>
  );
}

const DriverListCard = ({
  drivers,
  handleRemoveDriver,
  bookingId,
  isModalOpen,
  setIsModalOpen,
}: {
  drivers: RequestedDriver[];
  handleRemoveDriver: (id: string) => void;
  bookingId: string;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  console.log("DriverListCard");
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
              bookingId={bookingId}
              key={driver.id}
              driver={driver}
              onRemove={() => handleRemoveDriver(driver.id)}
              isModalOpen={isModalOpen}
              setIsModalOpen={setIsModalOpen}
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
  bookingId,
  isModalOpen,
  setIsModalOpen,
}: {
  driver: RequestedDriver;
  onRemove: () => void;
  bookingId: string;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  console.log("DriverRow");
  const inset = useSafeAreaInsets();
  const translateX = useRef(new Animated.Value(-400)).current;
  const opacity = useRef(new Animated.Value(0)).current;
  const progressAnim = useRef(new Animated.Value(100)).current;
  const isPausedRef = useRef(false);
  const remainingTimeRef = useRef(6_000); // Track remaining time
  const animationRef = useRef<Animated.CompositeAnimation | null>(null);
  const socket = useSocket();

  const acceptDriver = async () => {
    socket.emit("acceptDriver", { driverId: driver.id, bookingId });
  };

  const startTimer = useCallback(
    (duration: number) => {
      const currentProgress = (duration / 6000) * 100;
      progressAnim.setValue(currentProgress);

      animationRef.current = Animated.timing(progressAnim, {
        toValue: 0,
        duration: duration,
        useNativeDriver: false,
        easing: Easing.linear,
      });

      animationRef.current.start(({ finished }) => {
        if (finished && !isPausedRef.current) {
          // Trigger swipe-right removal animation
          Animated.parallel([
            Animated.timing(translateX, {
              toValue: 400,
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
        }
      });
    },
    [progressAnim, isPausedRef, onRemove, translateX, opacity],
  );
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
    ]).start(() => {
      // Start timer after entrance animation
      startTimer(remainingTimeRef.current);
    });

    return () => {
      if (animationRef.current) {
        animationRef.current.stop();
      }
    };
  }, [opacity, startTimer, translateX]);

  const pauseTimer = () => {
    if (animationRef.current && !isPausedRef.current) {
      isPausedRef.current = true;
      animationRef.current.stop();

      // Calculate remaining time based on current progress
      const currentProgressValue = (progressAnim as any)._value;
      remainingTimeRef.current = (currentProgressValue / 100) * 6000;
    }
  };

  const resumeTimer = () => {
    if (isPausedRef.current) {
      isPausedRef.current = false;
      startTimer(remainingTimeRef.current);
    }
  };

  const handlePress = () => {
    setIsModalOpen(true);
    pauseTimer();
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    resumeTimer();
  };

  // Interpolate progress to percentage string
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 100],
    outputRange: ["0%", "100%"],
  });

  // Interpolate for color changes
  const progressBackgroundColor = progressAnim.interpolate({
    inputRange: [0, 33, 66, 100],
    outputRange: ["#EF4444", "#F59E0B", "#F59E0B", "#10B981"],
  });

  return (
    <>
      <Animated.View
        style={{
          opacity,
          transform: [{ translateX }],
        }}
      >
        <Pressable onPress={handlePress}>
          <View className="relative flex-row items-center justify-between rounded-md bg-gray-100 px-4 py-3">
            {/* Progress Bar (background) */}
            <View className="absolute bottom-0 left-0 right-0 h-[3px] bg-black/5">
              <Animated.View
                style={{
                  width: progressWidth,
                  backgroundColor: progressBackgroundColor,
                }}
                className="h-full rounded-full"
              />
            </View>

            {/* Left: Driver Info */}
            <View className="flex-row items-center gap-3">
              <Image
                source={
                  driver.profilePicture
                    ? { uri: driver.profilePicture }
                    : STATIC_IMAGES.userPlaceholder
                }
                contentFit="cover"
                style={{ width: 40, height: 40, borderRadius: 999 }}
              />

              <View>
                <Text className="text-sm font-semibold text-gray-900">
                  {driver.name}
                </Text>

                <View className="mt-0.5 flex-row items-center gap-1">
                  <Ionicons name="star" size={14} color="#FBBF24" />
                  <Text className="text-xs text-gray-500">
                    {driver.rating} ({driver.totalBookings} bookings)
                  </Text>
                </View>
              </View>
            </View>

            {/* Right: Distance */}
            {driver.distance && (
              <View className="items-center justify-center rounded-xl bg-orange-500 px-3 py-2">
                <Text className="text-[10px] uppercase tracking-wide text-white">
                  Distance
                </Text>
                <Text className="text-sm font-bold text-white">
                  {driver.distance < 1
                    ? `${(driver.distance * 1000).toFixed(0)}m`
                    : `${driver.distance.toFixed(2)}km`}
                </Text>
              </View>
            )}
          </View>
        </Pressable>
      </Animated.View>

      {/* Driver Details Modal */}
      <Modal
        visible={isModalOpen}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View
            className="max-h-[85%] rounded-t-3xl bg-white"
            style={{
              paddingBottom: inset.bottom,
            }}
          >
            {/* Header */}
            <View className="flex-row items-center justify-between border-b border-gray-200 px-6 py-4">
              <Text className="text-xl font-bold text-gray-900">
                Driver Details
              </Text>
              <Pressable onPress={handleCloseModal}>
                <Ionicons name="close" size={28} color="#6B7280" />
              </Pressable>
            </View>

            <ScrollView
              className="px-6 py-6"
              showsVerticalScrollIndicator={false}
            >
              {/* Profile Section */}
              <View className="items-center pb-6">
                <Image
                  source={
                    driver.profilePicture
                      ? { uri: driver.profilePicture }
                      : STATIC_IMAGES.userPlaceholder
                  }
                  contentFit="cover"
                  style={{ width: 120, height: 120, borderRadius: 60 }}
                />
                <Text className="mt-4 text-2xl font-bold text-gray-900">
                  {driver.name}
                </Text>
                <View className="mt-2 flex-row items-center gap-2">
                  <StarDisplay rating={driver.rating} />
                </View>
                <Text className="font-semibold text-sm text-gray-500">
                  {driver.rating} stars
                </Text>
                <Text className="text-lg mt-2 font-semibold text-gray-700">
                  Total Completed Bookings : {driver.totalBookings}
                </Text>
              </View>

              {/* Info Cards */}
              <View className="gap-4">
                {/* Distance */}
                {driver.distance && (
                  <View className="rounded-xl bg-orange-50 p-4">
                    <Text className="mb-1 text-xs font-semibold uppercase tracking-wide text-orange-600">
                      Distance from pick up
                    </Text>
                    <Text className="text-2xl font-bold text-orange-600">
                      {driver.distance < 1
                        ? `${(driver.distance * 1000).toFixed(0)}m`
                        : `${driver.distance.toFixed(2)}km`}{" "}
                      away
                    </Text>
                  </View>
                )}

                {/* Vehicle Images Section */}
                <View className="rounded-xl bg-gray-50 p-4">
                  <Text className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-700">
                    Vehicle Image
                  </Text>

                  <View
                    className="w-full overflow-hidden rounded-lg bg-white"
                    style={{ aspectRatio: 4 / 3 }}
                  >
                    {driver.vehicleImage ? (
                      <View className="relative h-full w-full">
                        <Image
                          source={{ uri: driver.vehicleImage }}
                          style={{ width: "100%", height: "100%" }}
                          contentFit="cover"
                        />
                      </View>
                    ) : (
                      <View className="h-full w-full items-center justify-center bg-gray-200">
                        <Ionicons
                          name="image-outline"
                          size={40}
                          color="#9CA3AF"
                        />

                        <Text className="mt-1 text-gray-400">
                          Not available
                        </Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>

              {/* Action Buttons */}
              <View className="mt-6 gap-3">
                <Pressable
                  className="items-center rounded-xl bg-lightPrimary py-4"
                  onPress={acceptDriver}
                >
                  <Text className="text-base font-bold text-white">
                    Accept Driver
                  </Text>
                </Pressable>
                <Pressable
                  onPress={handleCloseModal}
                  className="items-center rounded-xl bg-gray-200 py-4"
                >
                  <Text className="text-base font-bold text-gray-700">
                    Close
                  </Text>
                </Pressable>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const SearchRadiusIndicator = () => {
  const [searchRadius, setSearchRadius] = useState(0.1);
  const [searchAttempt, setSearchAttempt] = useState(1);
  const socket = useSocket();

  useEffect(() => {
    const handleRadiusExpansion = ({
      radiusKm,
      attempt,
    }: {
      radiusKm: number;
      attempt: number;
    }) => {
      setSearchRadius(radiusKm);
      setSearchAttempt(attempt);
    };

    socket.on("radiusExpansion", handleRadiusExpansion);

    return () => {
      socket.off("radiusExpansion", handleRadiusExpansion);
    };
  }, [socket]);

  return (
    <View className="items-center mt-10">
      <Text className="text-white text-2xl font-bold tracking-tight">
        Searching...
      </Text>
      <Text className="text-gray-400 text-sm mt-2">
        Connecting you with the best driver nearby
      </Text>

      {/* Search Radius Indicator */}
      <View className="mt-4 px-4 py-2 bg-orange-500/20 border border-orange-500/30 rounded-full">
        <View className="flex-row items-center gap-2">
          <Ionicons name="radio-outline" size={16} color="#FB923D" />
          <Text className="text-orange-400 text-sm font-semibold">
            Searching within {formatRadius(searchRadius)} radius
          </Text>
        </View>
      </View>

      {/* Attempt counter */}
      <Text className="text-gray-400 text-xs mt-2">
        Attempt {searchAttempt}
      </Text>
    </View>
  );
};
