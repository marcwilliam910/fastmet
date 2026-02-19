import { UserAddress } from "@/types/user";
import { GOOGLE_MAPS_API_KEY } from "@/utils/constants";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import GooglePlacesTextInput, {
  GooglePlacesTextInputRef,
  Place,
} from "react-native-google-places-textinput";

type AddressInputProps = {
  value: UserAddress;
  onChange: (address: UserAddress) => void;
  error?: string;
};

type AddressFields = {
  street: string;
  barangay: string;
  city: string;
  province: string;
  postalCode: string;
};

/**
 * Parse Google Places address_components into structured fields.
 * Uses the Google Places API (new) `addressComponents` format.
 */
function parseAddressComponents(
  components: any[] | undefined,
): Partial<AddressFields> {
  if (!components || !Array.isArray(components)) return {};

  const result: Partial<AddressFields> = {};
  let streetNumber = "";
  let route = "";

  for (const component of components) {
    const types: string[] = component.types || [];

    if (types.includes("street_number")) {
      streetNumber = component.longText || component.long_name || "";
    } else if (types.includes("route")) {
      route = component.longText || component.long_name || "";
    } else if (
      types.includes("sublocality") ||
      types.includes("sublocality_level_1") ||
      types.includes("neighborhood")
    ) {
      result.barangay = component.longText || component.long_name || "";
    } else if (types.includes("locality")) {
      result.city = component.longText || component.long_name || "";
    } else if (types.includes("administrative_area_level_1")) {
      result.province = component.longText || component.long_name || "";
    } else if (types.includes("postal_code")) {
      result.postalCode = component.longText || component.long_name || "";
    }
  }

  // Combine street number and route
  if (streetNumber || route) {
    result.street = [streetNumber, route].filter(Boolean).join(" ");
  }

  return result;
}

export default function AddressInput({
  value,
  onChange,
  error,
}: AddressInputProps) {
  const autocompleteRef = useRef<GooglePlacesTextInputRef>(null);
  const [fields, setFields] = useState<AddressFields>({
    street: value?.street || "",
    barangay: value?.barangay || "",
    city: value?.city || "",
    province: value?.province || "",
    postalCode: value?.postalCode || "",
  });
  const [placeName, setPlaceName] = useState(value?.name || "");
  const [coords, setCoords] = useState(value?.coords || null);
  const [hasSelected, setHasSelected] = useState(!!value);

  // Track whether internal state has been initialized from an external value
  const initializedRef = useRef(!!value);

  // Sync internal state when the value prop changes externally
  // (e.g. when editProfile loads address from the store after mount)
  useEffect(() => {
    if (value && !initializedRef.current) {
      setFields({
        street: value.street || "",
        barangay: value.barangay || "",
        city: value.city || "",
        province: value.province || "",
        postalCode: value.postalCode || "",
      });
      setPlaceName(value.name || "");
      setCoords(value.coords || null);
      setHasSelected(true);
      setIsSearching(false);
      initializedRef.current = true;
    }
  }, [value]);

  const buildAddress = useCallback(
    (
      updatedFields: AddressFields,
      name: string,
      latLng: { lat: number; lng: number } | null,
    ) => {
      const parts = [
        updatedFields.street,
        updatedFields.barangay,
        updatedFields.city,
        updatedFields.province,
        updatedFields.postalCode,
      ].filter(Boolean);

      if (parts.length === 0 || !latLng) {
        onChange(null);
        return;
      }

      const fullAddress = parts.join(", ");

      onChange({
        name: name || parts[0] || "Home",
        fullAddress,
        coords: latLng,
        street: updatedFields.street || undefined,
        barangay: updatedFields.barangay || undefined,
        city: updatedFields.city || undefined,
        province: updatedFields.province || undefined,
        postalCode: updatedFields.postalCode || undefined,
      });
    },
    [onChange],
  );

  const handlePlaceSelect = useCallback(
    (place: Place) => {
      const details = place.details;
      if (!details) return;

      const lat = details.location?.latitude;
      const lng = details.location?.longitude;
      if (lat == null || lng == null) return;

      const newCoords = { lat, lng };
      const name = details.displayName?.text || "";
      const parsed = parseAddressComponents(details.addressComponents);

      const newFields: AddressFields = {
        street: parsed.street || "",
        barangay: parsed.barangay || "",
        city: parsed.city || "",
        province: parsed.province || "",
        postalCode: parsed.postalCode || "",
      };

      setFields(newFields);
      setPlaceName(name);
      setCoords(newCoords);
      setHasSelected(true);
      setIsSearching(false);
      initializedRef.current = true;
      buildAddress(newFields, name, newCoords);
    },
    [buildAddress],
  );

  const handleFieldChange = useCallback(
    (field: keyof AddressFields, text: string) => {
      const updated = { ...fields, [field]: text };
      setFields(updated);
      buildAddress(updated, placeName, coords);
    },
    [fields, placeName, coords, buildAddress],
  );

  const handleClear = useCallback(() => {
    setFields({
      street: "",
      barangay: "",
      city: "",
      province: "",
      postalCode: "",
    });
    setPlaceName("");
    setCoords(null);
    setHasSelected(false);
    initializedRef.current = false;
    autocompleteRef.current?.clear();
    onChange(null);
  }, [onChange]);

  // Whether the search box is visible (always visible if no address, toggleable if existing)
  const [isSearching, setIsSearching] = useState(!value);

  const handleChangeAddress = useCallback(() => {
    setIsSearching(true);
  }, []);

  if (!GOOGLE_MAPS_API_KEY) {
    return (
      <View className="gap-2">
        <Text className="text-sm text-red-500">
          Google Maps API key is not configured.
        </Text>
      </View>
    );
  }

  return (
    <View className="gap-3">
      <Text className="text-sm font-medium text-gray-700">Home Address</Text>

      {/* Existing address display */}
      {hasSelected && !isSearching && (
        <View className="flex-row items-center p-4 bg-gray-100 rounded-xl">
          <View className="items-center justify-center mr-3 rounded-full w-10 h-10 bg-amber-500">
            <Ionicons name="home" size={18} color="#FFFFFF" />
          </View>
          <View className="flex-1">
            <Text
              className="text-sm font-semibold text-gray-900"
              numberOfLines={1}
            >
              {placeName || "Home"}
            </Text>
            <Text className="text-xs text-gray-500 mt-0.5" numberOfLines={2}>
              {[
                fields.street,
                fields.barangay,
                fields.city,
                fields.province,
                fields.postalCode,
              ]
                .filter(Boolean)
                .join(", ")}
            </Text>
          </View>
          <Pressable
            onPress={handleChangeAddress}
            hitSlop={10}
            className="ml-2 px-3 py-1.5 rounded-lg bg-white border border-gray-200 active:bg-gray-50"
          >
            <Text className="text-xs font-semibold text-amber-600">Change</Text>
          </Pressable>
        </View>
      )}

      {/* Google Places Autocomplete - shown when no address or user wants to change */}
      {(isSearching || !hasSelected) && (
        <View className="bg-gray-100 rounded-lg">
          <View className="flex-row items-center px-3 py-2">
            <Ionicons
              name="search-outline"
              size={20}
              color="#9CA3AF"
              className="absolute z-50 bg-gray-100 top-4 left-3"
            />
            <View className="flex-1 ml-3">
              <GooglePlacesTextInput
                ref={autocompleteRef}
                apiKey={GOOGLE_MAPS_API_KEY}
                onPlaceSelect={handlePlaceSelect}
                defaultValue={placeName}
                style={autocompleteStyles}
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
                placeHolderText="Search for your address..."
                returnKeyType="search"
                textContentType="fullStreetAddress"
                textAlign="left"
                clearElement={
                  <Pressable onPress={handleClear} hitSlop={10}>
                    <Ionicons name="close" size={20} className="pt-2.5" />
                  </Pressable>
                }
                showLoadingIndicator={false}
              />
            </View>
          </View>
        </View>
      )}

      {/* Structured fields - shown when address is selected */}
      {hasSelected && (
        <View
          className={`gap-3 p-4 bg-gray-50 rounded-xl ${error ? "border border-red-400" : ""}`}
        >
          <Text className="text-xs font-semibold tracking-wider text-gray-500 uppercase">
            Address Details
          </Text>

          {/* Street */}
          <View className="gap-1">
            <Text className="text-xs font-medium text-gray-600">
              House No. / Street
            </Text>
            <TextInput
              value={fields.street}
              onChangeText={(text) => handleFieldChange("street", text)}
              placeholder="e.g. 123 Rizal Street"
              placeholderTextColor="#9CA3AF"
              className="p-3 text-sm bg-white rounded-lg border border-gray-200"
            />
          </View>

          {/* Barangay */}
          <View className="gap-1">
            <Text className="text-xs font-medium text-gray-600">Barangay</Text>
            <TextInput
              value={fields.barangay}
              onChangeText={(text) => handleFieldChange("barangay", text)}
              placeholder="e.g. Brgy. San Antonio"
              placeholderTextColor="#9CA3AF"
              className="p-3 text-sm bg-white rounded-lg border border-gray-200"
            />
          </View>

          {/* City & Province row */}
          <View className="flex-row gap-3">
            <View className="flex-1 gap-1">
              <Text className="text-xs font-medium text-gray-600">
                City / Municipality
              </Text>
              <TextInput
                value={fields.city}
                onChangeText={(text) => handleFieldChange("city", text)}
                placeholder="e.g. Makati"
                placeholderTextColor="#9CA3AF"
                className="p-3 text-sm bg-white rounded-lg border border-gray-200"
              />
            </View>

            <View className="flex-1 gap-1">
              <Text className="text-xs font-medium text-gray-600">
                Province
              </Text>
              <TextInput
                value={fields.province}
                onChangeText={(text) => handleFieldChange("province", text)}
                placeholder="e.g. Metro Manila"
                placeholderTextColor="#9CA3AF"
                className="p-3 text-sm bg-white rounded-lg border border-gray-200"
              />
            </View>
          </View>

          {/* Postal Code */}
          <View className="gap-1 w-1/2">
            <Text className="text-xs font-medium text-gray-600">
              Postal Code
            </Text>
            <TextInput
              value={fields.postalCode}
              onChangeText={(text) => handleFieldChange("postalCode", text)}
              placeholder="e.g. 1200"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              maxLength={6}
              className="p-3 text-sm bg-white rounded-lg border border-gray-200"
            />
          </View>
        </View>
      )}

      {error && (
        <Text className="text-xs text-center font-semibold text-red-500">
          {error}
        </Text>
      )}
    </View>
  );
}

const autocompleteStyles = {
  container: {
    marginHorizontal: 0,
  },
  input: {
    borderRadius: 8,
    borderWidth: 0,
    backgroundColor: "#F3F4F6",
    paddingLeft: 36,
    paddingRight: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  suggestionsContainer: {
    backgroundColor: "#ffffff",
    maxHeight: 200,
    marginTop: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E5E7EB",
  },
  suggestionItem: {
    padding: 12,
  },
  suggestionText: {
    main: {
      fontSize: 14,
      color: "#1F2937",
    },
    secondary: {
      fontSize: 12,
      color: "#6B7280",
    },
  },
  loadingIndicator: {
    color: "#FFA840",
    paddingTop: 10,
  },
  placeholder: {
    color: "#9CA3AF",
  },
};
