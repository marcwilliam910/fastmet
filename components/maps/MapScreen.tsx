import {RouteData} from "@/store/useBookStore";
import {LocationDetails} from "@/types/book";
import {GOOGLE_MAPS_API_KEY, STATIC_IMAGES} from "@/utils/constants";
import {Ionicons} from "@expo/vector-icons";
import {DrawerActions} from "@react-navigation/native";
import * as Location from "expo-location";
import {useNavigation} from "expo-router";
import React, {useEffect, useRef} from "react";
import {Alert, Pressable, StyleSheet, Text, View} from "react-native";
import MapView, {Marker} from "react-native-maps";
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
};

export default function MapScreen({
  pickUp,
  dropOff,
  routeData,
  region,
  setRegion,
}: Props) {
  const mapRef = useRef<MapView>(null);

  const navigation = useNavigation();

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) return;

    (async () => {
      const {status} = await Location.requestForegroundPermissionsAsync();
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
                    edgePadding: {top: 80, right: 80, bottom: 80, left: 80},
                    animated: true,
                  });
                }}
              />
            </>
          )}
        </MapView>
      )}

      {/* Floating burger */}
      <Pressable
        onPress={() => navigation.dispatch(DrawerActions.openDrawer())}
        className="absolute p-2 bg-white rounded-full shadow-lg top-6 left-4 active:scale-105 active:opacity-80"
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

      {routeData.distance > 0 && routeData.duration > 0 && (
        <DistanceBubble routeData={routeData} />
      )}
    </View>
  );
}

export function DistanceBubble({routeData}: {routeData: RouteData}) {
  return (
    <View className="absolute z-50 self-center px-4 py-2 top-10 bg-black/60 rounded-2xl">
      <Text className="text-sm font-semibold text-white">
        {routeData.distance.toFixed(1)} km • {routeData.duration.toFixed(0)} min
      </Text>
    </View>
  );
}
