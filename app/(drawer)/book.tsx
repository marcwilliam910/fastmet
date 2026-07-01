import BookSheet from "@/components/maps/BookSheet";
import MapScreen from "@/components/maps/MapScreen";
import SearchModal from "@/components/modals/mapSearchModal";
import {useDrivingDistance} from "@/queries/bookingQueries";
import {useSurgeFactors} from "@/queries/pricingQueries";
import {useAppStore} from "@/store/useAppStore";
import {Ionicons} from "@expo/vector-icons";
import {DrawerActions} from "@react-navigation/native";
import {useNavigation} from "expo-router";
import React, {useEffect, useMemo, useState} from "react";
import {Pressable, View} from "react-native";
import {Region} from "react-native-maps";
import {SafeAreaView} from "react-native-safe-area-context";

const DEFAULT_REGION = {
  latitude: 14.5995, // 👈 change to your city center
  longitude: 120.9842,
  latitudeDelta: 0.05,
  longitudeDelta: 0.05,
};

const Book = () => {
  const pickUp = useAppStore((state) => state.pickUp);
  const dropOff = useAppStore((state) => state.dropOff);
  const routeData = useAppStore((state) => state.routeData);
  const setRouteData = useAppStore((state) => state.setRouteData);
  const selectedVehicle = useAppStore((state) => state.selectedVehicle);
  const bookingType = useAppStore((state) => state.bookingType);
  const addedServices = useAppStore((state) => state.addedServices);

  const [region, setRegion] = useState<Region>(DEFAULT_REGION);
  const [isDragging, setIsDragging] = useState(false);
  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchType, setSearchType] = useState<"pickup" | "dropoff" | null>(
    null,
  );

  const navigation = useNavigation();

  const {data: route, isFetching} = useDrivingDistance(
    pickUp,
    dropOff,
    selectedVehicle?.key,
  );

  // ── Surge + gas factors ───────────────────────────────────────────────────
  // Only fetches when pickUp is set — cached 60s, covers all variants at once
  const {data: surgeFactors, isLoading: isSurgeLoading} =
    useSurgeFactors(pickUp);
  // ── Pricing ───────────────────────────────────────────────────────────────
  const pricing = useMemo(() => {
    if (!route || !selectedVehicle?.variant) return null;

    const {distanceKm, durationMin} = route;
    const variant = selectedVehicle.variant;
    const variantKey = `${selectedVehicle.key}_${variant.maxLoadKg}`;

    const factors = surgeFactors?.[variantKey];
    const surgeMultiplier = factors?.surgeMultiplier ?? 1.0;
    const gasAdjFactor = factors?.gasAdjFactor ?? 1.0;

    const basePrice = Math.round(variant.baseFare * gasAdjFactor);
    const sortedTiers = [...variant.pricingTiers].sort(
      (a, b) => a.minKm - b.minKm,
    );

    const distanceFee = (() => {
      let fee = 0;
      let remaining = distanceKm;
      for (const tier of sortedTiers) {
        if (remaining <= 0) break;
        const tierMax = tier.maxKm ?? Infinity;
        const kmInTier = Math.min(remaining, tierMax - tier.minKm);
        fee += kmInTier * tier.pricePerKm;
        remaining -= kmInTier;
      }
      return Math.round(fee * bookingType.priceModifier);
    })();

    const serviceFee = addedServices.reduce((sum, s) => sum + s.price, 0);
    const subtotal = basePrice + distanceFee + serviceFee;
    const totalPrice = Math.round(subtotal * surgeMultiplier);

    // ── Pricing breakdown log ─────────────────────────────────────────────
    console.log("──────────────────────────────────────");
    console.log(`🚗 Vehicle:       ${variantKey}`);
    console.log(`📍 Distance:      ${distanceKm.toFixed(2)} km`);
    console.log(
      `⛽ Gas adj:       ×${gasAdjFactor} (base: ₱${variant.baseFare} → ₱${basePrice})`,
    );
    console.log(
      `📦 Booking type:  ×${bookingType.priceModifier} (${bookingType.type} - ${bookingType.value})`,
    );
    console.log(`💰 Distance fee:  ₱${distanceFee}`);
    console.log(`🔧 Service fee:   ₱${serviceFee}`);
    console.log(`📊 Subtotal:      ₱${subtotal}`);
    console.log(`⚡ Surge:         ×${surgeMultiplier}`);
    console.log(`✅ Total:         ₱${totalPrice}`);
    console.log("──────────────────────────────────────");

    return {
      distance: Math.round(distanceKm),
      duration: Math.round(durationMin),
      basePrice,
      distanceFee,
      serviceFee,
      totalPrice,
      surgeMultiplier,
      gasAdjFactor,
    };
  }, [route, selectedVehicle, bookingType, addedServices, surgeFactors]);

  useEffect(() => {
    if (pricing) setRouteData(pricing);
  }, [pricing, setRouteData]);

  useEffect(() => {
    useAppStore.getState().setLoading(isFetching);
  }, [isFetching]);

  useEffect(() => {
    useAppStore.getState().fetchBookingTypes();
    useAppStore.getState().fetchVehicles();
  }, []);

  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: "white"}}
      edges={["right", "bottom", "left"]}
    >
      <View className="relative flex-1">
        <MapScreen
          pickUp={pickUp}
          dropOff={dropOff}
          routeData={routeData}
          region={region}
          setRegion={setRegion}
          setIsDragging={setIsDragging}
          bookingType={bookingType.type}
        />

        {/* Floating burger */}
        {!isDragging && (
          <Pressable
            onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
            className="absolute left-6 top-8 p-2 bg-white rounded-full shadow-lg active:scale-105 active:opacity-80"
            style={{
              shadowColor: "#000",
              shadowOffset: {width: 2, height: 2},
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            }}
          >
            <Ionicons name="menu" size={28} color="#FFA840" />
          </Pressable>
        )}
      </View>

      <BookSheet
        isDragging={isDragging}
        isSurgeLoading={isSurgeLoading}
        onOpenSearch={(type) => {
          setSearchType(type);
          setSearchModalVisible(true);
        }}
      />

      <SearchModal
        visible={searchModalVisible}
        type={searchType ?? "pickup"}
        onClose={() => {
          setSearchModalVisible(false);
          setSearchType(null);
        }}
      />
    </SafeAreaView>
  );
};

export default Book;
