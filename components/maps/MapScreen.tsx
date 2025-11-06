import { useBookStore } from "@/store/useBookStore";
import { Ionicons } from "@expo/vector-icons";
import { DrawerActions } from "@react-navigation/native";
import { router, useNavigation } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Platform, Pressable, StyleSheet, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";

const GOOGLE_MAPS_API_KEY =
  Platform.OS === "ios"
    ? process.env.EXPO_PUBLIC_IOS_MAP_KEY
    : process.env.EXPO_PUBLIC_ANDROID_MAP_KEY;

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);
  const pickUp = useBookStore((state) => state.pickUp);
  const dropOff = useBookStore((state) => state.dropOff);
  const navigation = useNavigation();

  const [region, setRegion] = useState({
    latitude: 14.676,
    longitude: 121.0437,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) router.back();
  }, []);

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
  }, [pickUp]);

  return (
    <View className="flex-1">
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        showsUserLocation
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
          />
        )}

        {dropOff && (
          <Marker
            coordinate={{
              latitude: dropOff.coords.lat,
              longitude: dropOff.coords.lng,
            }}
            title="Drop Off"
          />
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
            onReady={(result) => {
              mapRef.current?.fitToCoordinates(result.coordinates, {
                edgePadding: { top: 80, right: 80, bottom: 80, left: 80 },
                animated: true,
              });
            }}
          />
        )}
      </MapView>

      {/* Floating burger */}
      <Pressable
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        className="absolute top-10 left-4 bg-white p-2 rounded-full shadow-lg"
        style={{
          shadowColor: "#000", // color of the shadow
          shadowOffset: { width: 2, height: 2 }, // x/y offset
          shadowOpacity: 0.25, // opacity 0–1
          shadowRadius: 3.84, // blur radius
          elevation: 5, // Android only
        }}
      >
        <Ionicons name="menu" size={28} color="#FFA840" />
      </Pressable>
    </View>
  );
}
