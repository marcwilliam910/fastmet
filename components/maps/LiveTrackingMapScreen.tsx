import { useSocket } from "@/sockets/context/SocketProvider";
import { Driver, LocationDetails, RouteData } from "@/types/book";
import { GOOGLE_MAPS_API_KEY, STATIC_IMAGES } from "@/utils/constants";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { StatusBar, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

type Props = {
  pickUp: LocationDetails;
  dropOff: LocationDetails;
  routeData: RouteData;
  region: Region | null;
  setRegion: React.Dispatch<React.SetStateAction<Region | null>>;
  bookingId: string;
  driver: Driver;
};

export default function LiveTrackingMapScreen({
  pickUp,
  dropOff,
  routeData,
  region,
  setRegion,
  bookingId,
  driver,
}: Props) {
  const mapRef = useRef<MapView>(null);
  const socket = useSocket();
  const [driverLocation, setDriverLocation] = useState<{
    lat: number;
    lng: number;
    heading: number;
  } | null>(null);
  const [isLoadingDriverLocation, setIsLoadingDriverLocation] =
    useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setHidden(true);
      return () => StatusBar.setHidden(false);
    }, [])
  );

  // In LiveTrackingMapScreen component HERE
  useFocusEffect(
    useCallback(() => {
      if (!socket || !bookingId) return;

      let isSubscribed = true;
      setIsLoadingDriverLocation(true);

      const handleDriverLocationResponse = (data: {
        driverLoc: { lat: number; lng: number; heading: number } | null;
      }) => {
        if (isSubscribed) {
          if (data.driverLoc) {
            setDriverLocation(data.driverLoc);
            console.log("📍 Driver location received:", data.driverLoc);
          }
          setIsLoadingDriverLocation(false);
        }
      };

      // Listen for driver location response
      socket.on("driverLocationResponse", handleDriverLocationResponse);

      // Request driver location
      socket.emit("getDriverLocation", { driverId: driver.id, bookingId });
      console.log("📡 Requesting driver location for booking:", bookingId);

      // Cleanup when leaving the screen
      return () => {
        isSubscribed = false;
        socket.off("driverLocationResponse", handleDriverLocationResponse);
        console.log("🔌 Unsubscribed from driver location");
      };
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [bookingId, driver.id])
  );

  useEffect(() => {
    if (pickUp?.coords) {
      const newRegion = {
        latitude: pickUp.coords.lat,
        longitude: pickUp.coords.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);
      mapRef.current?.animateToRegion(newRegion, 1000);
    }
  }, [pickUp, setRegion]);

  return (
    <View className="flex-1">
      {region && (
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          showsCompass
          mapType="standard"
          initialRegion={region}
        >
          {pickUp && (
            <Marker
              coordinate={{
                latitude: pickUp.coords.lat,
                longitude: pickUp.coords.lng,
              }}
              title="Pick Up"
              image={STATIC_IMAGES.pickup}
            />
          )}

          {/* DRIVER LOCATION */}
          {driverLocation && !isLoadingDriverLocation && (
            <Marker
              image={STATIC_IMAGES.driver}
              coordinate={{
                latitude: driverLocation.lat,
                longitude: driverLocation.lng,
              }}
              title={driver.name ? `Driver - ${driver.name}` : "Your Driver"}
              rotation={driverLocation.heading}
              anchor={{ x: 0.5, y: 0.5 }}
            />
          )}

          {/* route line */}
          {dropOff && (
            <Marker
              coordinate={{
                latitude: dropOff.coords.lat,
                longitude: dropOff.coords.lng,
              }}
              title="Drop Off"
              image={STATIC_IMAGES.dropoff}
            />
          )}

          {pickUp && dropOff && (
            <>
              <MapViewDirections
                origin={{
                  latitude: pickUp.coords.lat,
                  longitude: pickUp.coords.lng,
                }}
                destination={{
                  latitude: dropOff.coords.lat,
                  longitude: dropOff.coords.lng,
                }}
                apikey={GOOGLE_MAPS_API_KEY ?? ""}
                strokeWidth={5}
                strokeColor="#007AFF"
                optimizeWaypoints
                onReady={(result) => {
                  mapRef.current?.fitToCoordinates(result.coordinates, {
                    edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
                    animated: true,
                  });
                }}
              />
            </>
          )}
        </MapView>
      )}

      {routeData.distance > 0 && routeData.duration > 0 && (
        <DistanceBubble routeData={routeData} />
      )}
    </View>
  );
}

export function DistanceBubble({ routeData }: { routeData: RouteData }) {
  return (
    <View className="absolute z-50 self-center px-4 py-2 top-10 bg-black/60 rounded-2xl">
      <Text className="text-sm font-semibold text-white">
        {routeData.distance.toFixed(1)} km • {routeData.duration.toFixed(0)} min
      </Text>
    </View>
  );
}
