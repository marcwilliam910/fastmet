import { useShake } from "@/hooks/useShakeAnimation";
import { useAppStore } from "@/store/useAppStore";
import { LocationDetails } from "@/types/book";
import { GOOGLE_MAPS_API_KEY, METRO_MANILA_POLYGON } from "@/utils/constants";
import { formatLocation } from "@/utils/helper";
import { Ionicons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { router } from "expo-router";
import { isPointInPolygon } from "geolib";
import React, { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Linking,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  ToastAndroid,
  View,
} from "react-native";
import GooglePlacesTextInput, {
  Place,
} from "react-native-google-places-textinput";
import Animated from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type SearchType = "pickup" | "dropoff";

type SearchModalProps = {
  visible: boolean;
  onClose: () => void;
  type: SearchType;
};

function isWithinMetroManila(lat: number, lng: number) {
  return isPointInPolygon(
    { latitude: lat, longitude: lng },
    METRO_MANILA_POLYGON.map(([lat, lng]) => ({
      latitude: lat,
      longitude: lng,
    }))
  );
}

const SearchModal: React.FC<SearchModalProps> = ({
  visible,
  onClose,
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
  const inset = useSafeAreaInsets();
  const [selectedPlace, setSelectedPlace] = useState<Partial<Place> | null>(
    null
  );
  const setPickUp = useAppStore((state) => state.setPickUp);
  const setPickUpAdditionalDetails = useAppStore(
    (state) => state.setPickUpAdditionalDetails
  );
  const setDropOff = useAppStore((state) => state.setDropOff);
  const setDropOffAdditionalDetails = useAppStore(
    (state) => state.setDropOffAdditionalDetails
  );

  const insets = useSafeAreaInsets();

  const dropOff = useAppStore((state) => state.dropOff);
  const pickUp = useAppStore((state) => state.pickUp);
  const { shake, animatedStyle } = useShake();
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [loading, setLoading] = useState(false);

  const searchValue = formatLocation(type === "pickup" ? pickUp : dropOff);
  const haveValue = type === "pickup" ? pickUp : dropOff;

  // Initialize additionalDetails when modal opens with existing value
  useEffect(() => {
    if (visible) {
      setAdditionalDetails(haveValue?.additionalDetails || "");
      setSelectedPlace(null); // Reset selected place when reopening
    }
  }, [visible, haveValue?.additionalDetails]);

  // Determine if confirm button should be enabled
  const initialAdditionalDetails = haveValue?.additionalDetails || "";
  const additionalDetailsChanged =
    additionalDetails !== initialAdditionalDetails;

  // Primary condition: location selected OR (location exists AND details changed)
  const canConfirm =
    selectedPlace !== null || (haveValue !== null && additionalDetailsChanged);

  const handleConfirm = () => {
    // If a new place was selected
    if (selectedPlace?.details) {
      const details = selectedPlace.details;

      const locationData: LocationDetails = {
        name: details.displayName.text || "Unknown location",
        address: details.formattedAddress || "Unknown address",
        coords: {
          lat: details.location.latitude,
          lng: details.location.longitude,
        },
      };

      if (type === "pickup") {
        setPickUp(locationData);
        setPickUpAdditionalDetails(additionalDetails);
      } else {
        setDropOff(locationData);
        setDropOffAdditionalDetails(additionalDetails);
      }
    }
    // If only additionalDetails changed (location already exists)
    else if (haveValue && additionalDetailsChanged) {
      if (type === "pickup") {
        setPickUpAdditionalDetails(additionalDetails);
      } else {
        setDropOffAdditionalDetails(additionalDetails);
      }
    }

    onClose();
  };

  const handleCurrentLocation = async () => {
    try {
      setLoading(true);
      const isLocationEnabled = await Location.hasServicesEnabledAsync();

      if (!isLocationEnabled) {
        Alert.alert(
          "Location Services Disabled",
          "Please enable location services in your device settings to use this feature.",
          [
            { text: "Cancel", style: "cancel" },
            {
              text: "Open Settings",
              onPress: () => {
                if (Platform.OS === "ios") {
                  Linking.openURL("app-settings:");
                } else {
                  Linking.openSettings();
                }
              },
            },
          ]
        );
        return;
      }

      const { status } = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        const message = "Permission to access location was denied";

        if (Platform.OS === "android") {
          ToastAndroid.showWithGravity(
            message,
            ToastAndroid.LONG,
            ToastAndroid.TOP
          );
        } else {
          Alert.alert("Permission Denied", message);
        }
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const { latitude, longitude } = location.coords;
      // Reverse geocode to get address
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${GOOGLE_MAPS_API_KEY}`
      );

      const data = await response.json();

      if (data.results && data.results.length > 0) {
        const result = data.results[0];

        console.log(additionalDetails);

        const locationData: LocationDetails = {
          name: result.address_components[0]?.long_name || "Current Location",
          address: result.formatted_address,
          coords: {
            lat: latitude,
            lng: longitude,
          },
        };

        if (type === "pickup") {
          setPickUp(locationData);
          setPickUpAdditionalDetails(additionalDetails);
        } else {
          setDropOff(locationData);
          setDropOffAdditionalDetails(additionalDetails);
        }

        onClose();
      }
    } catch (error) {
      console.error("Error getting current location:", error);

      const message = "Failed to get current location";

      if (Platform.OS === "android") {
        ToastAndroid.showWithGravity(
          message,
          ToastAndroid.LONG,
          ToastAndroid.TOP
        );
      } else {
        Alert.alert("Error", message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOnPlaceSelect = (place: Place) => {
    setSelectedPlace(null);

    const loc = place.details?.location;
    if (!loc) return;

    console.log("Selected location:", {
      lat: loc.latitude,
      lng: loc.longitude,
    });

    // const allowed = isWithinMetroManila(loc.latitude, loc.longitude);

    // if (!allowed) {
    //   const message = "Services are only available within Metro Manila.";

    //   if (Platform.OS === "android") {
    //     ToastAndroid.showWithGravity(
    //       message,
    //       ToastAndroid.LONG,
    //       ToastAndroid.TOP
    //     );
    //   } else {
    //     Alert.alert("Not Available", message);
    //   }

    //   shake();
    //   return;
    // }

    setSelectedPlace(place);
  };

  const renderRecentPlace = ({ item }: any) => (
    <Pressable
      className="flex-row items-center px-4 py-3 border-b border-gray-100"
      style={({ pressed }) => [
        { backgroundColor: pressed ? "#F3F4F6" : "transparent" },
      ]}
    >
      <View className="items-center justify-center w-10 h-10 mr-3 bg-gray-100 rounded-full">
        <Ionicons name={item.icon} size={20} color="#6B7280" />
      </View>
      <View className="flex-1">
        <Text className="font-medium text-gray-900">{item.name}</Text>
        <Text className="text-sm text-gray-500 mt-0.5">{item.address}</Text>
      </View>
    </Pressable>
  );

  useEffect(() => {
    if (!GOOGLE_MAPS_API_KEY) router.back();
  }, []);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          paddingTop: insets.top + 5, // respect status bar / notch
          paddingBottom: insets.bottom,
          backgroundColor: "white",
        }}
      >
        {/* Header */}
        <View
          className="flex-row items-center justify-center px-4"
          style={{ paddingBottom: Platform.OS === "ios" ? 25 : 16 }}
        >
          <Pressable
            onPress={() => {
              setSelectedPlace(null);

              onClose();
            }}
            className="absolute left-4 -top-1"
            hitSlop={20}
          >
            <Ionicons
              name="chevron-back-outline"
              size={Platform.OS === "ios" ? 34 : 28}
              color="#FFA840"
            />
          </Pressable>
          <Text className="text-lg font-semibold capitalize">
            {type} location
          </Text>
        </View>
        {/* Search Input */}
        <View className="pb-4 mx-4 bg-white border-b border-gray-200">
          <View className="flex-row items-center px-3 py-2 rounded-xl">
            <Ionicons
              name="search-outline"
              size={24}
              color="#4B5563"
              className="absolute z-50 bg-white top-5 left-3"
            />
            <Animated.View
              className="flex-1 ml-6" // all static styling here
              style={animatedStyle} // only animated transforms here
            >
              <GooglePlacesTextInput
                apiKey={GOOGLE_MAPS_API_KEY ?? ""}
                onPlaceSelect={handleOnPlaceSelect}
                value={haveValue ? searchValue : undefined}
                style={customStyles}
                languageCode="en"
                includedRegionCodes={["ph"]}
                minCharsToFetch={2}
                fetchDetails={true}
                placeHolderText={`Where to ${type === "pickup" ? "pick up" : "drop off"}?`}
                returnKeyType="search"
                textContentType="location"
                textAlign="left"
                clearElement={
                  <Ionicons name="close" size={24} className="pt-3" />
                }
                showLoadingIndicator={false}
              />
            </Animated.View>
          </View>
        </View>

        {/* Additional Details Input */}

        <View className="mx-4 mt-7">
          <Text className="mb-2 font-semibold text-gray-700">
            Location details{" "}
            <Text className="text-sm text-gray-400">(optional)</Text>
          </Text>

          <TextInput
            defaultValue={haveValue?.additionalDetails}
            onChangeText={setAdditionalDetails}
            multiline
            numberOfLines={4}
            placeholder="e.g. In front of Jollibee or near gate 3"
            placeholderTextColor="#9CA3AF"
            style={{ height: 120, textAlignVertical: "top" }}
            className="p-4 text-base text-gray-800 bg-white border border-gray-200 rounded-xl"
          />
        </View>

        {/* Current Location Button */}
        <View className="px-4 mt-5 mb-2">
          <Pressable
            onPress={handleCurrentLocation}
            disabled={loading}
            className="flex-row items-center px-4 py-4 bg-white border border-gray-200 rounded-2xl active:bg-gray-50"
          >
            <View className="items-center justify-center mr-3 bg-blue-500 rounded-full w-11 h-11">
              <Ionicons name="navigate" size={20} color="#FFFFFF" />
            </View>
            {loading ? (
              <>
                <Text className="flex-1  text-base font-semibold text-gray-900">
                  Getting current location...
                </Text>
                <ActivityIndicator size="small" color="#FFA840" />
              </>
            ) : (
              <>
                <Text className="flex-1 text-base font-semibold text-gray-900">
                  Use current location
                </Text>
                <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
              </>
            )}
          </Pressable>
        </View>

        {/* Recent Places */}
        <View className="flex-1 px-4">
          <View className="px-4 py-3 mb-2">
            <View className="flex-row items-center">
              <Ionicons
                name="time-outline"
                size={18}
                color="#6B7280"
                style={{ marginRight: 8 }}
              />
              <Text className="text-xs font-semibold tracking-wider text-gray-600 uppercase">
                Recent Places
              </Text>
            </View>
          </View>
          <FlatList
            data={recentPlaces}
            renderItem={renderRecentPlace}
            keyExtractor={(item) => item.id}
            showsVerticalScrollIndicator={false}
          />
        </View>

        <Pressable
          className={`items-center justify-center p-3.5 mx-6 bg-lightPrimary absolute left-0 right-0 active:bg-darkPrimary rounded-lg ${canConfirm ? "active:bg-darkPrimary" : "opacity-80"}`}
          onPress={handleConfirm}
          disabled={!canConfirm}
          style={{
            bottom: inset.bottom + 15,
          }}
        >
          <Text className="text-lg font-bold text-white">Confirm</Text>
        </Pressable>
      </View>
    </Modal>
  );
};

export default SearchModal;

const customStyles = {
  container: {
    marginHorizontal: 0,
  },
  input: {
    minHeight: 45, // Use minHeight instead of height
    borderColor: "red",
    borderRadius: 8,
    borderWidth: 0,
    paddingVertical: 12,
    minWidth: 320,
  },
  suggestionsContainer: {
    backgroundColor: "#f3f4f6",
    maxHeight: 250,
    marginTop: 20,
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
    color: "red",
    paddingTop: 10,
  },
  placeholder: {
    color: "#999",
  },
};
