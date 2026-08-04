import {useShake} from "@/hooks/useShakeAnimation";
import ContactInfoCard from "@/components/maps/ContactInfoCard";
import {useAppStore} from "@/store/useAppStore";
import {LocationDetails} from "@/types/book";
import {
  addressMentionsAllowedPickupCity,
  GOOGLE_MAPS_API_KEY,
  isAllowedPickupCity,
  isDropOffAllowed,
  isWithinAllowedPickupBounds,
} from "@/utils/constants";
import {formatLocation} from "@/utils/helpers/location";
import {getArray, pushToArray} from "@/utils/helpers/recentPlaceStorage";
import {Ionicons} from "@expo/vector-icons";
import * as Contacts from "expo-contacts";
import * as Location from "expo-location";
import {router} from "expo-router";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Keyboard,
  Linking,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  ToastAndroid,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import GooglePlacesTextInput, {
  Place,
} from "react-native-google-places-textinput";
import MapView, {PROVIDER_GOOGLE, Region} from "react-native-maps";
import Animated from "react-native-reanimated";
import {useSafeAreaInsets} from "react-native-safe-area-context";

type SearchType = "pickup" | "dropoff";

type SearchModalProps = {
  visible: boolean;
  onClose: () => void;
  type: SearchType;
};

type Step = "search" | "map";

type Coords = {lat: number; lng: number};

// Theme color — same hex used for the back chevron elsewhere in this file.
// Swap for a themed constant if one exists in utils/constants.
const THEME_COLOR = "#FFA840";

export const PICKUP_AREA_ERROR =
  "Sorry, this pickup location is outside our current service area.";

const DROPOFF_AREA_ERROR =
  "Drop-off location must be reachable by road (no ferry required).";

const MAP_DRAG_VALIDATE_DELAY_MS = 400;

// Sync gates: pickup bbox + drop-off Mainland Luzon allowlist.
function validateCoords(
  type: SearchType,
  lat: number,
  lng: number,
  _other: LocationDetails | null,
): string | null {
  if (type === "pickup" && !isWithinAllowedPickupBounds(lat, lng)) {
    return PICKUP_AREA_ERROR;
  }
  if (type === "dropoff" && !isDropOffAllowed(lat, lng)) {
    return DROPOFF_AREA_ERROR;
  }
  return null;
}

function showValidationError(message: string) {
  if (Platform.OS === "android") {
    ToastAndroid.showWithGravity(message, ToastAndroid.LONG, ToastAndroid.TOP);
  } else {
    Alert.alert("Not Available", message);
  }
}

/** Extract city/municipality from Google Places (new) addressComponents. */
function extractCityFromPlaceComponents(
  components:
    {longText?: string; long_name?: string; types?: string[]}[] | undefined,
): string | null {
  if (!components?.length) return null;

  const locality = components.find((c) => c.types?.includes("locality"));
  if (locality) return locality.longText || locality.long_name || null;

  const admin2 = components.find((c) =>
    c.types?.includes("administrative_area_level_2"),
  );
  if (admin2) return admin2.longText || admin2.long_name || null;

  return null;
}

/** Extract city from Geocoding API (legacy) address_components. */
function extractCityFromGeocodeComponents(
  components: {long_name?: string; types?: string[]}[] | undefined,
): string | null {
  if (!components?.length) return null;

  const locality = components.find((c) => c.types?.includes("locality"));
  if (locality?.long_name) return locality.long_name;

  const admin2 = components.find((c) =>
    c.types?.includes("administrative_area_level_2"),
  );
  if (admin2?.long_name) return admin2.long_name;

  return null;
}

// Only ever called on: (1) initial current-location fix, since GPS gives no
// name, and (2) "Confirm pin" press when the user has actually moved the
// map. Never on drag/region-change — that's billed per call.
async function reverseGeocode(
  lat: number,
  lng: number,
): Promise<{name: string; address: string; city: string | null} | null> {
  try {
    const response = await fetch(
      `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${GOOGLE_MAPS_API_KEY}`,
    );
    const data = await response.json();
    if (data.results && data.results.length > 0) {
      const result = data.results[0];
      return {
        name: result.address_components?.[0]?.long_name || "Dropped pin",
        address: result.formatted_address || "Unknown address",
        city: extractCityFromGeocodeComponents(result.address_components),
      };
    }
    return null;
  } catch (error) {
    console.error("Reverse geocode error:", error);
    return null;
  }
}

// Basic PH mobile validation, same pattern as your OTP screen.
function cleanPhoneInput(value: string) {
  let cleaned = value.replace(/\D/g, "");

  // Remove country code (63)
  if (cleaned.startsWith("63")) {
    cleaned = cleaned.slice(2);
  }

  // Remove leading 0 if present
  if (cleaned.startsWith("0")) {
    cleaned = cleaned.slice(1);
  }

  // Ensure it starts with 9
  if (!cleaned.startsWith("9")) {
    cleaned = cleaned.slice(1);
  }

  // Limit to 10 digits (9XXXXXXXXX)
  return cleaned.slice(0, 10);
}
const RECENT_PLACE_KEY = "recent_places";

const SearchModal: React.FC<SearchModalProps> = ({visible, onClose, type}) => {
  const [recentPlaces, setRecentPlaces] = useState<LocationDetails[]>([]);
  const inset = useSafeAreaInsets();
  const insets = useSafeAreaInsets();

  const setPickUp = useAppStore((state) => state.setPickUp);
  const setPickUpAdditionalDetails = useAppStore(
    (state) => state.setPickUpAdditionalDetails,
  );

  const setPickUpContactName = useAppStore(
    (state) => state.setPickUpContactName,
  );
  const setPickUpContactPhone = useAppStore(
    (state) => state.setPickUpContactPhone,
  );

  const setDropOff = useAppStore((state) => state.setDropOff);
  const setDropOffAdditionalDetails = useAppStore(
    (state) => state.setDropOffAdditionalDetails,
  );

  const setDropOffContactName = useAppStore(
    (state) => state.setDropOffContactName,
  );
  const setDropOffContactPhone = useAppStore(
    (state) => state.setDropOffContactPhone,
  );

  const dropOff = useAppStore((state) => state.dropOff);
  const pickUp = useAppStore((state) => state.pickUp);
  const homeAddress = useAppStore((state) => state.address);
  const {shake, animatedStyle} = useShake();
  const [additionalDetails, setAdditionalDetails] = useState("");
  const [loading, setLoading] = useState(false);

  // Sender (pickup) / Receiver (dropoff) contact fields — live on the search step now.
  const [contactName, setContactName] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [nameError, setNameError] = useState(false);
  const [phoneError, setPhoneError] = useState(false);

  const contactLabel = type === "pickup" ? "Sender" : "Receiver";
  const isContactValid = useMemo(
    () => contactName.trim().length > 0 && contactPhone.length === 10,
    [contactName, contactPhone],
  );

  const haveValue = type === "pickup" ? pickUp : dropOff;
  const otherValue = type === "pickup" ? dropOff : pickUp;

  // add state
  const [searchText, setSearchText] = useState("");

  // Confirmed-on-map location, held locally until the bottom Confirm button
  // on the search step commits it to the store.
  const [confirmedLocation, setConfirmedLocation] =
    useState<LocationDetails | null>(null);

  // --- map / pin step state ---
  const [step, setStep] = useState<Step>("search");
  const [markerCoord, setMarkerCoord] = useState<Coords | null>(null);
  const [mapName, setMapName] = useState("");
  const [mapAddress, setMapAddress] = useState("");
  const [pinMoved, setPinMoved] = useState(false);
  const [resolvingAddress, setResolvingAddress] = useState(false);
  const mapRef = useRef<MapView>(null);
  const isInitialRegion = useRef(true);
  const dragValidateTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null,
  );

  useEffect(() => {
    if (visible) {
      setAdditionalDetails(haveValue?.additionalDetails || "");
      setConfirmedLocation(haveValue ?? null);
      setSearchText(haveValue ? formatLocation(haveValue) : "");
      setStep("search");
      setMarkerCoord(null);
      setContactName(haveValue?.contactName || "");
      setContactPhone(haveValue?.contactPhone || "");
      setNameError(false);
      setPhoneError(false);
    } else if (dragValidateTimerRef.current) {
      clearTimeout(dragValidateTimerRef.current);
      dragValidateTimerRef.current = null;
    }
  }, [visible, haveValue?.additionalDetails, haveValue]);

  useEffect(() => {
    return () => {
      if (dragValidateTimerRef.current) {
        clearTimeout(dragValidateTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    async function getRecentPlaces() {
      setRecentPlaces(await getArray(RECENT_PLACE_KEY));
    }

    getRecentPlaces();
  }, [visible]);

  const handleUseMyInfo = () => {
    const {name, phoneNumber} = useAppStore.getState();
    if (name) {
      setContactName(name);
      setNameError(false);
    }
    if (phoneNumber) {
      setContactPhone(cleanPhoneInput(phoneNumber));
      setPhoneError(false);
    }
  };

  const handlePickContact = async () => {
    try {
      if (Platform.OS === "android") {
        const {status} = await Contacts.requestPermissionsAsync();
        if (status !== "granted") return;
      }

      const contact = await Contacts.presentContactPickerAsync();
      if (!contact) return; // user cancelled

      if (contact.name) setContactName(contact.name);

      const rawNumber = contact.phoneNumbers?.[0]?.number;
      if (rawNumber) setContactPhone(cleanPhoneInput(rawNumber));
    } catch (err) {
      console.warn("Contact pick failed:", err);
    }
  };

  // Entry point for every source (search select, recent, home, current
  // location). Bounds gate only — city allowlist is enforced by each caller.
  const goToMapStep = (coords: Coords, name: string, address: string) => {
    const boundsError = validateCoords(
      type,
      coords.lat,
      coords.lng,
      otherValue,
    );
    if (boundsError) {
      showValidationError(boundsError);
      shake();
      return;
    }

    isInitialRegion.current = true;
    setPinMoved(false);
    setMarkerCoord(coords);
    setMapName(name);
    setMapAddress(address);
    setStep("map");

    requestAnimationFrame(() => {
      mapRef.current?.animateToRegion(
        {
          latitude: coords.lat,
          longitude: coords.lng,
          latitudeDelta: 0.003,
          longitudeDelta: 0.003,
        },
        300,
      );
    });
  };

  const handleOnPlaceSelect = async (place: Place) => {
    const loc = place.details?.location;
    if (!loc) return;

    if (type === "pickup") {
      const city = extractCityFromPlaceComponents(
        place.details?.addressComponents,
      );
      const address = place.details?.formattedAddress || "";
      const allowed =
        isAllowedPickupCity(city) || addressMentionsAllowedPickupCity(address);

      if (!allowed) {
        showValidationError(PICKUP_AREA_ERROR);
        shake();
        return;
      }
    }

    if (type === "dropoff" && !isDropOffAllowed(loc.latitude, loc.longitude)) {
      showValidationError(DROPOFF_AREA_ERROR);
      shake();
      return;
    }

    goToMapStep(
      {lat: loc.latitude, lng: loc.longitude},
      place.details?.displayName?.text || "Unknown location",
      place.details?.formattedAddress || "Unknown address",
    );
  };

  const handleRecentPlacePress = async (place: LocationDetails) => {
    if (!place) return;

    if (
      type === "pickup" &&
      !addressMentionsAllowedPickupCity(place.address) &&
      !addressMentionsAllowedPickupCity(place.name)
    ) {
      showValidationError(PICKUP_AREA_ERROR);
      shake();
      return;
    }

    if (
      type === "dropoff" &&
      !isDropOffAllowed(place.coords.lat, place.coords.lng)
    ) {
      showValidationError(DROPOFF_AREA_ERROR);
      shake();
      return;
    }

    goToMapStep(place.coords, place.name, place.address);
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
            {text: "Cancel", style: "cancel"},
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
          ],
        );
        return;
      }

      const {status} = await Location.requestForegroundPermissionsAsync();

      if (status !== "granted") {
        showValidationError("Permission to access location was denied");
        return;
      }

      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.Balanced,
      });

      const {latitude, longitude} = location.coords;
      // Necessary call — GPS coords alone have no name/address.
      const geocoded = await reverseGeocode(latitude, longitude);

      if (type === "pickup") {
        const allowed =
          isAllowedPickupCity(geocoded?.city) ||
          addressMentionsAllowedPickupCity(geocoded?.address);

        if (!allowed) {
          showValidationError(PICKUP_AREA_ERROR);
          return;
        }
      }

      if (type === "dropoff" && !isDropOffAllowed(latitude, longitude)) {
        showValidationError(DROPOFF_AREA_ERROR);
        return;
      }

      goToMapStep(
        {lat: latitude, lng: longitude},
        geocoded?.name || "Current Location",
        geocoded?.address || "Current Location",
      );
    } catch (error) {
      console.error("Error getting current location:", error);
      showValidationError("Failed to get current location");
    } finally {
      setLoading(false);
    }
  };

  const handleHomePress = () => {
    if (!homeAddress) return;

    if (
      type === "pickup" &&
      !addressMentionsAllowedPickupCity(homeAddress.fullAddress) &&
      !addressMentionsAllowedPickupCity(homeAddress.name)
    ) {
      showValidationError(PICKUP_AREA_ERROR);
      shake();
      return;
    }

    if (
      type === "dropoff" &&
      !isDropOffAllowed(homeAddress.coords.lat, homeAddress.coords.lng)
    ) {
      showValidationError(DROPOFF_AREA_ERROR);
      shake();
      return;
    }

    goToMapStep(
      {lat: homeAddress.coords.lat, lng: homeAddress.coords.lng},
      homeAddress.name,
      homeAddress.fullAddress,
    );
  };

  // Fixed center pin: the pin never moves, the map moves under it.
  // No network call here — just tracks the candidate coord + whether it
  // has actually moved from the initial position.
  // Pickup bounds toast is debounced so rapid region events don't spam.
  const handleRegionChangeComplete = (region: Region) => {
    const {latitude, longitude} = region;

    // Skip the event MapView fires for the initial region on mount.
    if (isInitialRegion.current) {
      isInitialRegion.current = false;
      return;
    }

    // Always track the pin so UX stays smooth while dragging.
    setMarkerCoord({lat: latitude, lng: longitude});
    setPinMoved(true);

    if (dragValidateTimerRef.current) {
      clearTimeout(dragValidateTimerRef.current);
    }

    dragValidateTimerRef.current = setTimeout(() => {
      dragValidateTimerRef.current = null;
      const error = validateCoords(type, latitude, longitude, otherValue);
      if (error) {
        showValidationError(error);
        shake();
      }
    }, MAP_DRAG_VALIDATE_DELAY_MS);
  };

  const handleMapConfirmPin = async () => {
    if (!markerCoord) return;

    // Hard gate: pickup must stay inside service area before confirm.
    const boundsError = validateCoords(
      type,
      markerCoord.lat,
      markerCoord.lng,
      otherValue,
    );
    if (boundsError) {
      showValidationError(boundsError);
      shake();
      return;
    }

    let finalName = mapName;
    let finalAddress = mapAddress;
    let finalCity: string | null = null;

    // Only geocode if the user actually dragged the map — otherwise the
    // original name/address from the search result/recent/home is still valid.
    // For pickup, always re-check allowlist after a drag (city may have changed).
    if (pinMoved) {
      setResolvingAddress(true);
      const geocoded = await reverseGeocode(markerCoord.lat, markerCoord.lng);
      setResolvingAddress(false);

      finalName = geocoded?.name || "Dropped pin";
      finalAddress =
        geocoded?.address ||
        `${markerCoord.lat.toFixed(6)}, ${markerCoord.lng.toFixed(6)}`;
      finalCity = geocoded?.city ?? null;

      if (type === "pickup") {
        const allowed =
          isAllowedPickupCity(finalCity) ||
          addressMentionsAllowedPickupCity(finalAddress);

        if (!allowed) {
          showValidationError(PICKUP_AREA_ERROR);
          shake();
          return;
        }
      }

      if (
        type === "dropoff" &&
        !isDropOffAllowed(markerCoord.lat, markerCoord.lng)
      ) {
        showValidationError(DROPOFF_AREA_ERROR);
        shake();
        return;
      }
    }

    // placeId is intentionally dropped: after moving the map the point no
    // longer corresponds to the originally selected Place.
    // in handleMapConfirmPin, after building the final location:
    const newLoc = {
      name: finalName,
      address: finalAddress,
      coords: markerCoord,
    };
    setConfirmedLocation(newLoc);
    setSearchText(formatLocation(newLoc));
    setStep("search");
  };

  const handleFinalConfirm = async () => {
    if (!confirmedLocation) return;

    const validName = contactName.trim().length > 0;
    const validPhone = contactPhone.length === 10;

    if (!validName || !validPhone) {
      setNameError(!validName);
      setPhoneError(!validPhone);
      shake();
      showValidationError(
        `${contactLabel} name and mobile number are required.`,
      );
      return;
    }

    if (type === "pickup") {
      setPickUp(confirmedLocation);
      setPickUpAdditionalDetails(additionalDetails);
      setPickUpContactName(contactName);
      setPickUpContactPhone(contactPhone);
    } else {
      setDropOff(confirmedLocation);
      setDropOffAdditionalDetails(additionalDetails);
      setDropOffContactName(contactName);
      setDropOffContactPhone(contactPhone);
    }

    await pushToArray(RECENT_PLACE_KEY, confirmedLocation);
    onClose();
  };

  const renderRecentPlace = ({item}: {item: LocationDetails}) => (
    <Pressable
      onPress={() => handleRecentPlacePress(item)}
      className="flex-row items-center px-4 py-3 rounded-xl border-b border-gray-100 active:bg-gray-100"
    >
      <View className="justify-center items-center mr-3 w-10 h-10 bg-gray-100 rounded-full">
        <Ionicons name="location-outline" size={20} color="#6B7280" />
      </View>
      <View className="flex-1">
        <Text className="font-medium text-gray-900">
          {item?.name || "Unknown Place"}
        </Text>
        <Text className="text-sm text-gray-500 mt-0.5 " numberOfLines={1}>
          {item?.address || "Unknown Address"}
        </Text>
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
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View
          style={{
            flex: 1,
            paddingTop: insets.top + 5,
            backgroundColor: "white",
          }}
        >
          {step === "map" && markerCoord ? (
            <View style={{flex: 1}}>
              {/* Header */}
              <View
                className="flex-row justify-center items-center px-4"
                style={{paddingBottom: Platform.OS === "ios" ? 25 : 16}}
              >
                <Pressable
                  onPress={() => setStep("search")}
                  className="absolute -top-1 left-4"
                  hitSlop={20}
                >
                  <Ionicons
                    name="chevron-back-outline"
                    size={Platform.OS === "ios" ? 34 : 28}
                    color={THEME_COLOR}
                  />
                </Pressable>
                <Text className="text-lg font-semibold capitalize">
                  Place {type} pin
                </Text>
              </View>

              {/* Location details + mapAddress — fixed on top */}
              <View className="px-4 pb-3 bg-white">
                <Text className="mb-2 font-semibold text-gray-700">
                  Location details{" "}
                  <Text className="text-sm text-gray-400">(optional)</Text>
                </Text>
                <TextInput
                  value={additionalDetails}
                  onChangeText={setAdditionalDetails}
                  placeholder="e.g. In front of Jollibee or near gate 3"
                  placeholderTextColor="#9CA3AF"
                  className="p-3 text-base text-gray-800 bg-white rounded-xl border border-gray-200"
                />
                <Text className="mt-2 text-sm text-gray-500" numberOfLines={2}>
                  {pinMoved
                    ? "Pin moved — address will update when you confirm"
                    : mapAddress}
                </Text>
              </View>

              {/* Map with fixed center pin */}
              <View style={{flex: 1}}>
                <MapView
                  ref={mapRef}
                  provider={PROVIDER_GOOGLE}
                  style={{flex: 1}}
                  initialRegion={{
                    latitude: markerCoord.lat,
                    longitude: markerCoord.lng,
                    latitudeDelta: 0.001,
                    longitudeDelta: 0.001,
                  }}
                  onRegionChangeComplete={handleRegionChangeComplete}
                />

                {/* Fixed center pin overlay — map moves under it */}
                <View
                  pointerEvents="none"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    marginLeft: -20,
                    marginTop: -40,
                  }}
                >
                  <Ionicons name="pin" size={40} color={THEME_COLOR} />
                </View>
              </View>

              {/* Confirm pin card — hint text + button together */}
              <View
                className="px-6 pt-3 bg-white"
                style={{paddingBottom: inset.bottom || 12}}
              >
                <Text className="mb-2 text-xs text-center text-gray-400">
                  Move the map to adjust the pin position
                </Text>
                <Pressable
                  className="items-center justify-center p-3.5 rounded-lg bg-lightPrimary active:bg-darkPrimary"
                  onPress={handleMapConfirmPin}
                  disabled={resolvingAddress}
                >
                  {resolvingAddress ? (
                    <ActivityIndicator size="small" color="#FFFFFF" />
                  ) : (
                    <Text className="text-lg font-bold text-white">
                      Confirm pin
                    </Text>
                  )}
                </Pressable>
              </View>
            </View>
          ) : (
            <>
              {/* Header */}
              <View
                className="flex-row justify-center items-center px-4"
                style={{paddingBottom: Platform.OS === "ios" ? 25 : 16}}
              >
                <Pressable
                  onPress={onClose}
                  className="absolute -top-1 left-4"
                  hitSlop={20}
                >
                  <Ionicons
                    name="chevron-back-outline"
                    size={Platform.OS === "ios" ? 34 : 28}
                    color={THEME_COLOR}
                  />
                </Pressable>
                <Text className="text-lg font-semibold capitalize">
                  {type} location
                </Text>
              </View>

              {/* Search Input — remounts to show the confirmed address as its text */}
              <View className="mx-4 bg-white border-b border-gray-200">
                <View className="flex-row items-center px-3 py-2">
                  <Ionicons
                    name="search-outline"
                    size={24}
                    color="#4B5563"
                    className="absolute left-3 top-5 z-50 bg-white"
                  />
                  <Animated.View className="flex-1 ml-6" style={animatedStyle}>
                    <GooglePlacesTextInput
                      apiKey={GOOGLE_MAPS_API_KEY ?? ""}
                      onPlaceSelect={handleOnPlaceSelect}
                      value={searchText}
                      onTextChange={setSearchText}
                      style={customStyles}
                      languageCode="en"
                      includedRegionCodes={["ph"]}
                      minCharsToFetch={2}
                      fetchDetails={true}
                      detailsFields={[
                        "displayName",
                        "formattedAddress",
                        "location",
                        "addressComponents",
                        "id",
                      ]}
                      placeHolderText={`Where to ${type === "pickup" ? "pick up" : "drop off"}?`}
                      returnKeyType="search"
                      textContentType="location"
                      textAlign="left"
                      clearElement={
                        <Ionicons
                          name="close"
                          size={24}
                          className="pt-1 pl-2"
                        />
                      }
                      showLoadingIndicator={false}
                    />
                  </Animated.View>
                </View>
              </View>

              <ScrollView
                className="flex-1"
                keyboardShouldPersistTaps="handled"
              >
                <ContactInfoCard
                  contactLabel={contactLabel}
                  contactName={contactName}
                  setContactName={(value) => {
                    setContactName(value);
                    if (nameError) setNameError(false);
                  }}
                  contactPhone={contactPhone}
                  setContactPhone={(value) => {
                    setContactPhone(value);
                    if (phoneError) setPhoneError(false);
                  }}
                  additionalDetails={additionalDetails}
                  onUseMyInfo={handleUseMyInfo}
                  onPickContact={handlePickContact}
                  showNameError={nameError}
                  showPhoneError={phoneError}
                  cleanPhoneInput={cleanPhoneInput}
                />

                {/* Current Location Button */}
                <View className="px-4 mt-5 mb-2">
                  <Pressable
                    onPress={handleCurrentLocation}
                    disabled={loading}
                    className="flex-row items-center px-4 py-3 bg-white rounded-xl border border-gray-200 active:bg-gray-50"
                  >
                    <View className="justify-center items-center mr-3 w-11 h-11 bg-blue-500 rounded-full">
                      <Ionicons name="navigate" size={20} color="#FFFFFF" />
                    </View>
                    {loading ? (
                      <>
                        <Text className="flex-1 text-base font-semibold text-gray-900">
                          Getting current location...
                        </Text>
                        <ActivityIndicator size="small" color={THEME_COLOR} />
                      </>
                    ) : (
                      <>
                        <Text className="flex-1 text-base font-semibold text-gray-900">
                          Use current location
                        </Text>
                        <Ionicons
                          name="chevron-forward"
                          size={20}
                          color="#9CA3AF"
                        />
                      </>
                    )}
                  </Pressable>
                </View>

                {/* Home Address Button */}
                {homeAddress && (
                  <View className="px-4 mb-2">
                    <Pressable
                      onPress={handleHomePress}
                      className="flex-row items-center px-4 py-3 bg-white rounded-xl border border-gray-200 active:bg-gray-50"
                    >
                      <View className="justify-center items-center mr-3 w-11 h-11 bg-amber-500 rounded-full">
                        <Ionicons name="home" size={20} color="#FFFFFF" />
                      </View>
                      <View className="flex-1">
                        <Text className="text-base font-semibold text-gray-900">
                          Home
                        </Text>
                        <Text
                          className="text-sm text-gray-500"
                          numberOfLines={1}
                        >
                          {homeAddress.fullAddress}
                        </Text>
                      </View>
                      <Ionicons
                        name="chevron-forward"
                        size={20}
                        color="#9CA3AF"
                      />
                    </Pressable>
                  </View>
                )}

                {/* Recent Places */}
                {recentPlaces.length > 0 && (
                  <View className="flex-1 px-4 mt-2">
                    <View className="px-4 py-3">
                      <View className="flex-row items-center">
                        <Ionicons
                          name="time-outline"
                          size={18}
                          color="#6B7280"
                          style={{marginRight: 8}}
                        />
                        <Text className="text-xs font-semibold tracking-wider text-gray-600 uppercase">
                          Recent Places
                        </Text>
                      </View>
                    </View>
                    <FlatList
                      data={recentPlaces}
                      renderItem={renderRecentPlace}
                      keyExtractor={(item, index) => `${item!.name}-${index}`}
                      scrollEnabled={false}
                    />
                  </View>
                )}
              </ScrollView>

              {/* Final confirm — commits location + contact + closes modal */}
              <View
                className="px-6 py-3 bg-white border-t border-gray-100"
                style={{paddingBottom: inset.bottom || 12}}
              >
                <Pressable
                  className="items-center justify-center p-3.5 rounded-lg bg-lightPrimary active:bg-darkPrimary disabled:opacity-40"
                  onPress={handleFinalConfirm}
                  disabled={!confirmedLocation || !isContactValid}
                >
                  <Text className="text-lg font-bold text-white">Confirm</Text>
                </Pressable>
              </View>
            </>
          )}
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

export default SearchModal;

const customStyles = {
  container: {
    marginHorizontal: 0,
  },
  inputContainer: {
    borderWidth: 0,
    borderColor: "transparent",
    backgroundColor: "transparent",
  },
  input: {
    minHeight: 45,
    paddingVertical: 12,
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
