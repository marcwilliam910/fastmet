import {useSocket} from "@/sockets/context/SocketProvider";
import {Driver, LocationDetails, RouteData} from "@/types/book";
import {GOOGLE_MAPS_API_KEY} from "@/utils/constants";
import {useFocusEffect} from "expo-router";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {StatusBar, StyleSheet, View} from "react-native";
import MapView, {Marker, PROVIDER_GOOGLE} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import {MapMarkerPin} from "../MapMarkerPin";
import {GasCategory, VehicleMarkerIcon} from "../VehicleMarkerIcon";

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
  gasCategory: GasCategory;
  region: Region | null;
  setRegion: React.Dispatch<React.SetStateAction<Region | null>>;
  bookingId: string;
  driver: Driver;
};

export default function LiveTrackingMapScreen({
  pickUp,
  dropOff,
  routeData,
  gasCategory,
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
    // heading: number;
  } | null>(null);
  const [isLoadingDriverLocation, setIsLoadingDriverLocation] =
    useState<boolean>(false);

  useFocusEffect(
    useCallback(() => {
      StatusBar.setHidden(true);
      return () => StatusBar.setHidden(false);
    }, []),
  );

  // request driver location
  useFocusEffect(
    useCallback(() => {
      if (!socket || !bookingId) return;

      let isSubscribed = true;
      setIsLoadingDriverLocation(true);

      const handleDriverLocationResponse = (data: {
        driverLoc: {lat: number; lng: number} | null;
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

      // Cleanup when leaving the screen
      return () => {
        isSubscribed = false;
        socket.off("driverLocationResponse", handleDriverLocationResponse);
        console.log("🔌 Unsubscribed from driver location");
      };
    }, [bookingId, socket]),
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
          provider={PROVIDER_GOOGLE}
          ref={mapRef}
          style={StyleSheet.absoluteFillObject}
          showsCompass
          mapType="standard"
          initialRegion={region}
        >
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
          {/* DRIVER LOCATION */}
          {driverLocation && !isLoadingDriverLocation && (
            <Marker
              key={`driver-${driverLocation.lat}-${driverLocation.lng}`}
              coordinate={{
                latitude: driverLocation.lat,
                longitude: driverLocation.lng,
              }}
              title={driver.name ? `Driver - ${driver.name}` : "Your Driver"}
              anchor={{x: 0.5, y: 0.5}}
              tracksViewChanges={false}
              zIndex={1000}
            >
              <View style={{opacity: 1}}>
                <VehicleMarkerIcon gasCategory={gasCategory} size={40} />
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

      {/* {routeData.distance > 0 && routeData.duration > 0 && (
        <DistanceBubble routeData={routeData} />
      )} */}
    </View>
  );
}
