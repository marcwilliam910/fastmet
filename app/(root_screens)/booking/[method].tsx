import BookSheet from "@/components/maps/BookSheet";
import LocationInputs from "@/components/maps/LocationInputs";
import MapScreen from "@/components/maps/MapScreen";
import SearchModal from "@/components/modals/mapSearchModal";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import {
  GooglePlaceData,
  GooglePlaceDetail,
} from "react-native-google-places-autocomplete";
import { SafeAreaView } from "react-native-safe-area-context";

type Params = {
  method: "passenger" | "pasabay";
};

type LocationData = {
  name: string;
  coords: { lat: number; lng: number };
} | null;

const Book = () => {
  const { method } = useLocalSearchParams<Params>();

  useEffect(() => {
    if (!method) router.back();
  }, [method]);

  const [isExpanded, setIsExpanded] = useState(true);
  const [modalVisible, setModalVisible] = useState(false);
  const [searchType, setSearchType] = useState<"pickup" | "dropoff" | null>(
    null
  );

  const [pickup, setPickup] = useState<LocationData>(null);
  const [dropoff, setDropoff] = useState<LocationData>(null);

  // ✅ Fix: match expected parameter type from SearchModal
  const handleSelect = (
    type: "pickup" | "dropoff",
    location: { data: GooglePlaceData; details: GooglePlaceDetail }
  ) => {
    const locationData = {
      name: location.data.description,
      coords: {
        lat: location.details.geometry.location.lat,
        lng: location.details.geometry.location.lng,
      },
    };

    if (type === "pickup") setPickup(locationData);
    else setDropoff(locationData);

    setModalVisible(false);
  };

  return (
    <SafeAreaView
      style={{ flex: 1, backgroundColor: "white" }}
      edges={["right", "bottom", "left"]}
    >
      <View className="relative flex-1">
        {/* header inputs */}
        <LocationInputs
          isExpanded={isExpanded}
          setIsExpanded={setIsExpanded}
          onOpenSearch={(type) => {
            setSearchType(type);
            setModalVisible(true);
          }}
          pickup={pickup}
          dropoff={dropoff}
        />

        <MapScreen />
      </View>

      <BookSheet
        isExpanded={isExpanded}
        setIsExpanded={setIsExpanded}
        method={method}
      />

      {searchType && (
        <SearchModal
          visible={modalVisible}
          type={searchType}
          onClose={() => setModalVisible(false)}
          onSelect={handleSelect}
        />
      )}
    </SafeAreaView>
  );
};

export default Book;
