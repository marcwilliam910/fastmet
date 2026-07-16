import {useSocket} from "@/sockets/context/SocketProvider";
import {Driver, LocationDetails, RouteData} from "@/types/book";
import {GOOGLE_MAPS_API_KEY} from "@/utils/constants";
import {useFocusEffect} from "expo-router";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {StatusBar, StyleSheet, View} from "react-native";
import MapView, {LatLng, Marker, PROVIDER_GOOGLE} from "react-native-maps";
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

const MAP_EDGE_PADDING = {top: 80, right: 80, bottom: 80, left: 80};

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
  const routeCoordinatesRef = useRef<LatLng[]>([]);
  const socket = useSocket();
  const [driverLocation, setDriverLocation] = useState<{
    lat: number;
    lng: number;
    // heading: number;
  } | null>(null);
  const [tracksViewChanges, setTracksViewChanges] = useState(true);
  const [isLoadingDriverLocation, setIsLoadingDriverLocation] =
    useState<boolean>(false);

  const MARKER_SIZE = 40;

  const fitToRoute = useCallback((coords: LatLng[]) => {
    if (!mapRef.current || coords.length === 0) return;

    mapRef.current.fitToCoordinates(coords, {
      edgePadding: MAP_EDGE_PADDING,
      animated: true,
    });
  }, []);

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

  useEffect(() => {
    setTracksViewChanges(true);
    const timeout = setTimeout(() => setTracksViewChanges(false), 500);
    return () => clearTimeout(timeout);
  }, [
    pickUp?.coords?.lat,
    pickUp?.coords?.lng,
    dropOff?.coords?.lat,
    dropOff?.coords?.lng,
    driverLocation?.lat,
    driverLocation?.lng,
  ]);

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
              anchor={{x: 0.5, y: 1}}
              tracksViewChanges={tracksViewChanges}
              zIndex={1000}
            >
              <View style={{width: MARKER_SIZE, height: MARKER_SIZE, opacity: 1}}>
                <MapMarkerPin color="#0074FF" size={MARKER_SIZE} />
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
              tracksViewChanges={tracksViewChanges}
              zIndex={1000}
            >
              <View style={{width: 40, height: 40, opacity: 1}}>
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
              anchor={{x: 0.5, y: 1}}
              tracksViewChanges={tracksViewChanges}
              zIndex={1001} // ← Higher than pickup
            >
              <View style={{width: MARKER_SIZE, height: MARKER_SIZE, opacity: 1}}>
                <MapMarkerPin color="#ED1C24" size={MARKER_SIZE} />
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
                  routeCoordinatesRef.current = result.coordinates;
                  fitToRoute(result.coordinates);
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
