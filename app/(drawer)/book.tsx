import BookSheet from "@/components/maps/BookSheet";
import MapScreen from "@/components/maps/MapScreen";
import SearchModal from "@/components/modals/mapSearchModal";
import { useDrivingDistance } from "@/queries/bookingQueries";
import { useAppStore } from "@/store/useAppStore";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { useNavigation } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { Pressable, View } from "react-native";
import { Region } from "react-native-maps";
import { SafeAreaView } from "react-native-safe-area-context";

const Book = () => {
  const pickUp = useAppStore((state) => state.pickUp);
  const dropOff = useAppStore((state) => state.dropOff);
  const routeData = useAppStore((state) => state.routeData);
  const [region, setRegion] = useState<Region | null>(null);
  const navigation = useNavigation();
  const [isDragging, setIsDragging] = useState(false);

  const [searchModalVisible, setSearchModalVisible] = useState(false);
  const [searchType, setSearchType] = useState<"pickup" | "dropoff" | null>(
    null,
  );
  const setRouteData = useAppStore((state) => state.setRouteData); // add
  const selectedVehicle = useAppStore((state) => state.selectedVehicle); // add
  const bookingType = useAppStore((state) => state.bookingType); // add
  const addedServices = useAppStore((state) => state.addedServices); // add
  const { data: route, isFetching } = useDrivingDistance(
    pickUp,
    dropOff,
    selectedVehicle?.key,
  );

  const pricing = useMemo(() => {
    if (!route || !selectedVehicle?.variant) return null;
    const { distanceKm, durationMin } = route;
    const variant = selectedVehicle.variant;
    const tier = variant.pricingTiers.find(
      (t) =>
        distanceKm >= t.minKm &&
        (t.maxKm === undefined || distanceKm <= t.maxKm),
    );
    const distanceFee =
      (tier ? distanceKm * tier.pricePerKm : 0) * bookingType.priceModifier;
    const serviceFee = addedServices.reduce((sum, s) => sum + s.price, 0);
    const basePrice = variant.baseFare;
    return {
      distance: distanceKm,
      duration: durationMin,
      basePrice: Math.round(basePrice * 100) / 100,
      distanceFee: Math.round(distanceFee * 100) / 100,
      serviceFee: Math.round(serviceFee * 100) / 100,
      totalPrice:
        Math.round((basePrice + distanceFee + serviceFee) * 100) / 100,
    };
  }, [route, selectedVehicle, bookingType, addedServices]);

  useEffect(() => {
    if (pricing) setRouteData(pricing);
  }, [pricing, setRouteData]);

  useEffect(() => {
    useAppStore.getState().setLoading(isFetching);
  }, [isFetching]);

  console.log("render", Date.now());

  useEffect(() => {
    useAppStore.getState().fetchBookingTypes();
    useAppStore.getState().fetchVehicles();
  }, []);

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white" }}
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
            className="absolute p-2 bg-white rounded-full shadow-lg top-8 left-6 active:scale-105 active:opacity-80"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 2, height: 2 },
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
        onOpenSearch={(type) => {
          setSearchType(type);
          setSearchModalVisible(true);
        }}
      />

      {searchType && (
        <SearchModal
          visible={searchModalVisible}
          type={searchType}
          onClose={() => setSearchModalVisible(false)}
        />
      )}
    </SafeAreaView>
  );
};

export default Book;
