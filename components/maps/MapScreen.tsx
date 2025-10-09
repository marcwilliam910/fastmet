import * as Location from "expo-location";
import {useEffect, useRef, useState} from "react";
import {StyleSheet, View} from "react-native";
import MapView, {Marker} from "react-native-maps";

export default function MapScreen() {
  const mapRef = useRef<MapView>(null);

  const [region, setRegion] = useState({
    latitude: 14.676,
    longitude: 121.0437,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  });

  useEffect(() => {
    (async () => {
      const {status} = await Location.requestForegroundPermissionsAsync();
      if (status === "granted") {
        const loc = await Location.getCurrentPositionAsync({});
        const newRegion = {
          ...region,
          latitude: loc.coords.latitude,
          longitude: loc.coords.longitude,
        };
        setRegion(newRegion);
        mapRef.current?.animateToRegion(newRegion, 1000);
      }
    })();
  }, []);

  const handleMapPress = (e: any) => {
    const {latitude, longitude} = e.nativeEvent.coordinate;
    const newRegion = {...region, latitude, longitude};
    setRegion(newRegion);
    mapRef.current?.animateToRegion(newRegion, 500); // 👈 smoothly move camera
  };

  return (
    <View className="flex-1">
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={region}
        showsUserLocation
        onPress={handleMapPress}
      >
        <Marker coordinate={region} title="Selected Location" />
      </MapView>
    </View>
  );
}
