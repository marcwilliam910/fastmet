import MapScreen from "@/components/maps/MapScreen";
import ViewOnMapSheet from "@/components/maps/ViewOnMapSheet";
import React, {useState} from "react";
import {View} from "react-native";
import {Region} from "react-native-maps";
import {SafeAreaView} from "react-native-safe-area-context";

const DUMMY_DATA = {
  pickUp: {
    name: "Pickup Location",
    address: "123 Main St, City, Country",
    // manila coords
    coords: {lat: 14.5995, lng: 120.9842},
  },
  dropOff: {
    name: "Dropoff Location",
    address: "456 Elm St, City, Country",
    // Pasig coords
    coords: {lat: 14.6, lng: 121.065},
  },
  routeData: {
    distance: 5.0,
    duration: 15,
    price: 20,
  },
};

export default function ViewOnMap() {
  const [region, setRegion] = useState<Region | null>(null);
  return (
    <SafeAreaView
      style={{flex: 1, backgroundColor: "white"}}
      edges={["right", "bottom", "left"]}
    >
      <View className="relative flex-1">
        <MapScreen
          pickUp={DUMMY_DATA.pickUp}
          dropOff={DUMMY_DATA.dropOff}
          routeData={DUMMY_DATA.routeData}
          region={region}
          setRegion={setRegion}
        />
      </View>

      <ViewOnMapSheet driverName="John Doe" rating={4.5} />
    </SafeAreaView>
  );
}
