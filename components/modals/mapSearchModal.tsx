import { Ionicons } from "@expo/vector-icons";
import React, { useState } from "react";
import {
  FlatList,
  Modal,
  Platform,
  Pressable,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import GooglePlacesTextInput from "react-native-google-places-textinput";

import { SafeAreaView } from "react-native-safe-area-context";

type SearchType = "pickup" | "dropoff";

type SearchModalProps = {
  visible: boolean;
  onClose: () => void;
  onSelect: (type: SearchType, location: any) => void;
  type: SearchType;
};

const GOOGLE_MAPS_API_KEY =
  Platform.OS === "ios"
    ? process.env.EXPO_PUBLIC_IOS_MAP_KEY
    : process.env.EXPO_PUBLIC_ANDROID_MAP_KEY;

const SearchModal: React.FC<SearchModalProps> = ({
  visible,
  onClose,
  onSelect,
  type,
}) => {
  const [recentPlaces] = useState([
    {
      id: "1",
      name: "Home",
      address: "Quezon City, Metro Manila",
      icon: "home-outline",
    },
    {
      id: "2",
      name: "Work",
      address: "Makati, Metro Manila",
      icon: "briefcase-outline",
    },
    {
      id: "3",
      name: "SM Mall of Asia",
      address: "Pasay, Metro Manila",
      icon: "location-outline",
    },
  ]);

  const handlePlaceSelect = (place: any) => {
    console.log("Place selected:", place);
    // Handle the selected place here
    onClose();
  };

  const handleCurrentLocation = () => {
    console.log("Getting current location...");
    // Get user's current location
  };

  const renderRecentPlace = ({ item }: any) => (
    <Pressable
      onPress={() => handlePlaceSelect(item)}
      className="flex-row items-center px-4 py-3 border-b border-gray-100"
      style={({ pressed }) => [
        { backgroundColor: pressed ? "#F3F4F6" : "transparent" },
      ]}
    >
      <View className="w-10 h-10 bg-gray-100 rounded-full items-center justify-center mr-3">
        <Ionicons name={item.icon} size={20} color="#6B7280" />
      </View>
      <View className="flex-1">
        <Text className="font-medium text-gray-900">{item.name}</Text>
        <Text className="text-sm text-gray-500 mt-0.5">{item.address}</Text>
      </View>
    </Pressable>
  );

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <Modal visible={visible} animationType="slide" transparent>
        <View className="flex-1 bg-white justify-center items-center">
          <Text>Google Maps API key not configured</Text>
          <TouchableOpacity onPress={onClose} className="mt-4">
            <Text className="text-blue-500">Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
    );
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <SafeAreaView className="flex-1 bg-white">
        {/* Header */}
        <View className="flex-row items-center justify-center px-4 py-4 border-b border-gray-200">
          <Pressable onPress={onClose} className="absolute left-3">
            <Ionicons name="chevron-back-outline" size={28} color="#FFA840" />
          </Pressable>
          <Text className="ml-3 text-lg font-semibold capitalize">
            {type} location
          </Text>
        </View>

        {/* Search Input */}
        <View className="px-4 py-3 border-b border-gray-200">
          <View className="flex-row items-center rounded-lg px-3 py-2">
            <Ionicons
              name="search-outline"
              size={20}
              color="#9CA3AF"
              style={{ marginRight: 8 }}
            />
            <View style={{ flex: 1 }}>
              <GooglePlacesTextInput
                apiKey={GOOGLE_MAPS_API_KEY}
                onPlaceSelect={handlePlaceSelect}
                style={customStyles}
                languageCode="en"
                includedRegionCodes={["ph"]}
                minCharsToFetch={2}
                fetchDetails={true}
              />
            </View>
          </View>
        </View>

        {/* Current Location Button */}
        <Pressable
          onPress={handleCurrentLocation}
          className="flex-row items-center px-4 py-4 border-b border-gray-100 bg-white"
          style={({ pressed }) => [
            { backgroundColor: pressed ? "#F9FAFB" : "transparent" },
          ]}
        >
          <View className="w-12 h-12 bg-blue-50 rounded-full items-center justify-center mr-4 border border-blue-100">
            <Ionicons name="navigate" size={22} color="#3B82F6" />
          </View>
          <Text className="text-gray-900 font-semibold text-base">
            Use current location
          </Text>
        </Pressable>

        {/* Recent Places */}
        <View className="flex-1">
          <View className="px-4 py-3 border-b border-gray-100 bg-gray-50">
            <View className="flex-row items-center">
              <Ionicons
                name="time-outline"
                size={20}
                color="#6B7280"
                style={{ marginRight: 10 }}
              />
              <Text className="font-bold text-gray-900 text-sm uppercase tracking-wide">
                Recent Places
              </Text>
            </View>
          </View>
          <FlatList
            data={recentPlaces}
            renderItem={renderRecentPlace}
            keyExtractor={(item) => item.id}
          />
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default SearchModal;

const customStyles = {
  container: {
    marginHorizontal: 0,
    flex: undefined,
  },
  input: {
    height: 45,
    borderColor: "#ccc",
    borderRadius: 8,
    color: "red",
  },
  suggestionsContainer: {
    backgroundColor: "#ffffff",
    maxHeight: 250,
  },
  suggestionItem: {
    padding: 15,
  },
  suggestionText: {
    main: {
      fontSize: 16,
      color: "#333",
    },
    secondary: {
      fontSize: 14,
      color: "#666",
    },
  },
  loadingIndicator: {
    color: "#999",
  },
  placeholder: {
    color: "#999",
  },
};
