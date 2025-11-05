import BookSheet from "@/components/maps/BookSheet";
import LocationInputs from "@/components/maps/LocationInputs";
import MapScreen from "@/components/maps/MapScreen";
import SearchModal from "@/components/modals/mapSearchModal";
import { LocationData } from "@/types/book";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Params = {
  method: "passenger" | "pasabay";
};

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

  const handleSelect = (place: any) => {
    const details = place.details;

    const locationData: LocationData = {
      name: details.displayName?.text || "Unknown location",
      address: details?.formattedAddress || "Unknown address",
      coords: {
        lat: details.location.latitude,
        lng: details.location.longitude,
      },
    };

    console.log("Place selected:", JSON.stringify(locationData, null, 2));

    if (searchType === "pickup") setPickup(locationData);
    else setDropoff(locationData);
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
