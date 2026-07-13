import {Type} from "@/store/slices/bookSlice";
import {useAppStore} from "@/store/useAppStore";
import {LocationDetails, RouteData} from "@/types/book";
import {GOOGLE_MAPS_API_KEY} from "@/utils/constants";
import {formatDuration} from "@/utils/helpers/date";
import * as Location from "expo-location";
import {useFocusEffect} from "expo-router";
import React, {memo, useCallback, useEffect, useRef, useState} from "react";
import {Alert, StatusBar, StyleSheet, Text, View} from "react-native";
import MapView, {Marker} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {MapMarkerPin} from "../MapMarkerPin";

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
  region: Region;
  setRegion: React.Dispatch<React.SetStateAction<Region>>;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  bookingType: Type;
};

function MapScreen({
  pickUp,
  dropOff,
  routeData,
  region,
  setRegion,
  setIsDragging,
  bookingType,
}: Props) {
  const mapRef = useRef<MapView>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const setLoading = useAppStore((state) => state.setLoading);

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
        const {status} = await Location.requestForegroundPermissionsAsync();
        setLoading(true);
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
        setTimeout(() => {
          mapRef.current?.animateToRegion(userRegion, 1000);
        }, 300);
      } catch (err) {
        console.error("Failed to get user location:", err);
        Alert.alert(
          "Location Error",
          "Unable to retrieve your current location. Please ensure location services are enabled.",
        );
      } finally {
        setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [setLoading, setRegion]);

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
        {/* POLYLINE FIRST - renders at bottom */}
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
                  edgePadding: {top: 80, right: 80, bottom: 400, left: 80},
                  animated: true,
                });
                setTimeout(() => setIsAnimating(false), 1500);
              }
            }}
          />
        )}

        {/* MARKERS LAST - renders on top */}
        {pickUp && (
          <Marker
            key={`pickup-${pickUp.coords.lat}-${pickUp.coords.lng}`}
            coordinate={{
              latitude: pickUp.coords.lat,
              longitude: pickUp.coords.lng,
            }}
            title="Pick Up"
            anchor={{x: 0.5, y: 0.5}}
            tracksViewChanges={false}
            zIndex={1000}
          >
            <View style={{opacity: 1}}>
              <MapMarkerPin color="#0074FF" size={50} />
            </View>
          </Marker>
        )}

        {dropOff && (
          <Marker
            key={`dropoff-${dropOff.coords.lat}-${dropOff.coords.lng}`}
            coordinate={{
              latitude: dropOff.coords.lat,
              longitude: dropOff.coords.lng,
            }}
            title="Drop Off"
            anchor={{x: 0.5, y: 0.5}}
            tracksViewChanges={false}
            zIndex={1001} // ← Higher than pickup
          >
            <View style={{opacity: 1}}>
              <MapMarkerPin color="#ED1C24" size={50} />
            </View>
          </Marker>
        )}
      </MapView>

      {routeData.distance > 0 &&
        routeData.duration > 0 &&
        bookingType !== "pooling" && <DistanceBubble routeData={routeData} />}
    </View>
  );
}

export default memo(MapScreen);

export function DistanceBubble({routeData}: {routeData: RouteData}) {
  const inset = useSafeAreaInsets();

  return (
    <View
      className="absolute z-50 self-center px-4 py-2 rounded-2xl bg-black/60"
      style={{top: inset.top + 10}}
    >
      <Text className="text-sm font-semibold text-white">
        {routeData.distance.toFixed(1)} km •{" "}
        {formatDuration(routeData.duration)}
      </Text>
    </View>
  );
}
