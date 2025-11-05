import BookSheet from "@/components/maps/BookSheet";
import LocationInputs from "@/components/maps/LocationInputs";
import MapScreen from "@/components/maps/MapScreen";
import SearchModal from "@/components/modals/mapSearchModal";
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
        />
      )}
    </SafeAreaView>
  );
};

export default Book;
