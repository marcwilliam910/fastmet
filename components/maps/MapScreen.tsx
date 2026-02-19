import { LocationDetails, RouteData } from "@/types/book";
import { GOOGLE_MAPS_API_KEY, STATIC_IMAGES } from "@/utils/constants";
import { Image } from "expo-image";
import * as Location from "expo-location";
import { useFocusEffect } from "expo-router";
import React, { memo, useCallback, useEffect, useRef, useState } from "react";
import { Alert, StatusBar, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { useSafeAreaInsets } from "react-native-safe-area-context";
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
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
};

function MapScreen({
  pickUp,
  dropOff,
  routeData,
  region,
  setRegion,
  setIsDragging,
}: Props) {
  const mapRef = useRef<MapView>(null);
  const [isAnimating, setIsAnimating] = useState(false);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setHidden(true);
      return () => StatusBar.setHidden(false);
    }, []),
  );

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) return;

    let isMounted = true;

    (async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          Alert.alert(
            "Permission Required",
            "Location permission is needed to show your position.",
          );
          return;
        }

        const location = await Location.getCurrentPositionAsync({});
        if (!isMounted) return;

        const userRegion = {
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.01,
          longitudeDelta: 0.01,
        };

        setRegion(userRegion);
        mapRef.current?.animateToRegion(userRegion, 1000);
      } catch (err) {
        console.error("Failed to get user location:", err);
        Alert.alert(
          "Location Error",
          "Unable to retrieve your current location. Please ensure location services are enabled.",
        );
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [setRegion]);

  // Update the useEffect
  useEffect(() => {
    if (pickUp?.coords && mapRef.current && !isAnimating) {
      const newRegion = {
        latitude: pickUp.coords.lat,
        longitude: pickUp.coords.lng,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(newRegion);

      // Only animate if dropOff doesn't exist (to avoid conflict with MapViewDirections)
      if (!dropOff) {
        setIsAnimating(true);
        mapRef.current.animateToRegion(newRegion, 1000);
        setTimeout(() => setIsAnimating(false), 1000);
      }
    }
  }, [pickUp, dropOff, isAnimating, setRegion]);

  return (
    <View className="flex-1">
      {region && (
        <MapView
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          showsUserLocation
          followsUserLocation={!pickUp && !dropOff}
          showsCompass
          mapType="standard"
          initialRegion={region}
          onTouchStart={() => setIsDragging(true)}
          onTouchEnd={() => setIsDragging(false)}
          onTouchCancel={() => setIsDragging(false)}
        >
          {pickUp && (
            <Marker
              coordinate={{
                latitude: pickUp.coords.lat,
                longitude: pickUp.coords.lng,
              }}
              title="Pick Up"
              anchor={{ x: 0.5, y: 0.5 }}
              centerOffset={{ x: 0, y: 0 }}
              tracksViewChanges={false}
              zIndex={1000}
            >
              <Image
                source={STATIC_IMAGES.pickup}
                style={{ width: 50, height: 50 }}
                contentFit="contain"
              />
            </Marker>
          )}

          {dropOff && (
            <Marker
              coordinate={{
                latitude: dropOff.coords.lat,
                longitude: dropOff.coords.lng,
              }}
              title="Drop Off"
              anchor={{ x: 0.5, y: 0.5 }}
              centerOffset={{ x: 0, y: 0 }}
              tracksViewChanges={false}
              zIndex={1000}
            >
              <Image
                source={STATIC_IMAGES.dropoff}
                style={{ width: 50, height: 50 }}
                contentFit="contain"
              />
            </Marker>
          )}
          {pickUp && dropOff && (
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
              mode="DRIVING"
              onReady={(result) => {
                if (!isAnimating && mapRef.current) {
                  setIsAnimating(true);
                  mapRef.current.fitToCoordinates(result.coordinates, {
                    edgePadding: { top: 80, right: 80, bottom: 400, left: 80 },
                    animated: true,
                  });
                  setTimeout(() => setIsAnimating(false), 1500);
                }
              }}
            />
          )}
        </MapView>
      )}

      {routeData.distance > 0 && routeData.duration > 0 && (
        <DistanceBubble routeData={routeData} />
      )}
    </View>
  );
}

export default memo(MapScreen);

export function DistanceBubble({ routeData }: { routeData: RouteData }) {
  const inset = useSafeAreaInsets();

  // Format duration: convert to hours if >= 60 minutes
  const formatDuration = (minutes: number) => {
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = Math.round(minutes % 60);
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${Math.round(minutes)} min`;
  };

  return (
    <View
      className="absolute z-50 self-center px-4 py-2 bg-black/60 rounded-2xl"
      style={{ top: inset.top + 10 }}
    >
      <Text className="text-sm font-semibold text-white">
        {routeData.distance.toFixed(1)} km •{" "}
        {formatDuration(routeData.duration)}
      </Text>
    </View>
  );
}
