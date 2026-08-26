import {useSocket} from "@/sockets/context/SocketProvider";
import {useAppStore} from "@/store/useAppStore";
import {BookingETAUpdatedPayload, Driver, LocationDetails} from "@/types/book";
import {GOOGLE_MAPS_API_KEY, STATIC_IMAGES} from "@/utils/constants";
import {useFocusEffect} from "expo-router";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {Image, StatusBar, StyleSheet, View} from "react-native";
import MapView, {LatLng, Marker, PROVIDER_GOOGLE} from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import {GasCategory, VehicleMarkerIcon} from "../VehicleMarkerIcon";
import {DistanceBubble} from "./MapScreen";

type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

type Props = {
  pickUp: LocationDetails;
  dropOff: LocationDetails;
  gasCategory: GasCategory;
  region: Region | null;
  setRegion: React.Dispatch<React.SetStateAction<Region | null>>;
  bookingId: string;
  driver: Driver;
  status: string;
};

const MAP_EDGE_PADDING = {top: 80, right: 80, bottom: 80, left: 80};

export default function LiveTrackingMapScreen({
  pickUp,
  dropOff,
  gasCategory,
  region,
  setRegion,
  bookingId,
  driver,
  status,
}: Props) {
  const mapRef = useRef<MapView>(null);
  const routeCoordinatesRef = useRef<LatLng[]>([]);
  const socket = useSocket();
  const getLiveEtaCache = useAppStore((state) => state.getLiveEtaCache);
  const setLiveEtaCache = useAppStore((state) => state.setLiveEtaCache);
  const [driverLocation, setDriverLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [liveETA, setLiveETA] = useState<{
    distance: number;
    duration: number;
  } | null>(null);
  const [tracksViewChanges, setTracksViewChanges] = useState(true);
  const [isLoadingDriverLocation, setIsLoadingDriverLocation] =
    useState<boolean>(false);

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

  // Live ETA — cache locally; request only when server may need to recalc
  useFocusEffect(
    useCallback(() => {
      if (!socket || !bookingId) return;

      const cached = getLiveEtaCache(bookingId);
      if (cached) {
        setLiveETA({
          distance: cached.distance,
          duration: cached.duration,
        });
      }

      const handleBookingETAUpdated = (data: BookingETAUpdatedPayload) => {
        if (data.bookingId !== bookingId) return;
        if (data.distanceKm <= 0 || data.durationMin <= 0) return;
        if (!data.etaRevision) return;

        setLiveEtaCache(bookingId, {
          etaRevision: data.etaRevision,
          distance: data.distanceKm,
          duration: data.durationMin,
        });
        setLiveETA({
          distance: data.distanceKm,
          duration: data.durationMin,
        });
      };

      socket.on("bookingETAUpdated", handleBookingETAUpdated);
      socket.emit("requestBookingETA", {bookingId});

      return () => {
        socket.off("bookingETAUpdated", handleBookingETAUpdated);
      };
    }, [bookingId, getLiveEtaCache, setLiveEtaCache, socket]),
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
              <View>
                <Image
                  source={STATIC_IMAGES.pickup}
                  style={{width: 50, height: 50}}
                />
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
              <View>
                <Image
                  source={STATIC_IMAGES.dropoff}
                  style={{width: 50, height: 50}}
                />
              </View>
            </Marker>
          )}

          {driverLocation && !isLoadingDriverLocation && (
            <MapViewDirections
              origin={{
                latitude: driverLocation.lat,
                longitude: driverLocation.lng,
              }}
              destination={
                status === "picked_up"
                  ? {
                      latitude: dropOff!.coords.lat,
                      longitude: dropOff!.coords.lng,
                    }
                  : {
                      latitude: pickUp!.coords.lat,
                      longitude: pickUp!.coords.lng,
                    }
              }
              apikey={GOOGLE_MAPS_API_KEY ?? ""}
              strokeWidth={5}
              strokeColor="#007AFF"
              optimizeWaypoints
              onReady={(result) => {
                routeCoordinatesRef.current = result.coordinates;
                fitToRoute(result.coordinates);
              }}
            />
          )}
        </MapView>
      )}

      {liveETA && liveETA.distance > 0 && liveETA.duration > 0 && (
        <DistanceBubble routeData={liveETA} />
      )}
    </View>
  );
}
