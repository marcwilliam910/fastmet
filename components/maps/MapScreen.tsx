import { LocationDetails, RouteData } from "@/types/book";
import { GOOGLE_MAPS_API_KEY, STATIC_IMAGES } from "@/utils/constants";
import * as Location from "expo-location";
import { useFocusEffect } from "expo-router";
import React, { useCallback, useEffect, useRef } from "react";
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
};

export default function MapScreen({
  pickUp,
  dropOff,
  routeData,
  region,
  setRegion,
}: Props) {
  const mapRef = useRef<MapView>(null);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setHidden(true);
      return () => StatusBar.setHidden(false);
    }, [])
  );

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) return;

    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Location permission is needed to show your position."
        );
        return;
      }

      const location = await Location.getCurrentPositionAsync({});
      const userRegion = {
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      };
      setRegion(userRegion);
      mapRef.current?.animateToRegion(userRegion, 1000);
    })();
  }, [setRegion]);

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
          showsUserLocation
          followsUserLocation
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
  const inset = useSafeAreaInsets();
  return (
    <View
      className="absolute z-50 self-center px-4 py-2 bg-black/60 rounded-2xl"
      style={{ top: inset.top + 10 }}
    >
      <Text className="text-sm font-semibold text-white">
        {routeData.distance.toFixed(1)} km • {routeData.duration.toFixed(0)} min
      </Text>
    </View>
  );
}
