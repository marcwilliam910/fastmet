import {Ionicons} from "@expo/vector-icons";
import React, {RefObject} from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from "react-native";
import MapView, {PROVIDER_GOOGLE, Region} from "react-native-maps";

type Coords = {lat: number; lng: number};
type SearchType = "pickup" | "dropoff";

type MapPinStepViewProps = {
  type: SearchType;
  themeColor: string;
  additionalDetails: string;
  setAdditionalDetails: (value: string) => void;
  pinMoved: boolean;
  mapAddress: string;
  markerCoord: Coords;
  mapRef: RefObject<MapView | null>;
  onRegionChangeComplete: (region: Region) => void;
  resolvingAddress: boolean;
  onConfirmPin: () => void;
  onBack: () => void;
  bottomInset: number;
};

const MapPinStepView: React.FC<MapPinStepViewProps> = ({
  type,
  themeColor,
  additionalDetails,
  setAdditionalDetails,
  pinMoved,
  mapAddress,
  markerCoord,
  mapRef,
  onRegionChangeComplete,
  resolvingAddress,
  onConfirmPin,
  onBack,
  bottomInset,
}) => {
  return (
    <View style={{flex: 1}}>
      <View
        className="flex-row items-center justify-center px-4"
        style={{paddingBottom: Platform.OS === "ios" ? 25 : 16}}
      >
        <Pressable
          onPress={onBack}
          className="absolute -top-1 left-4"
          hitSlop={20}
        >
          <Ionicons
            name="chevron-back-outline"
            size={Platform.OS === "ios" ? 34 : 28}
            color={themeColor}
          />
        </Pressable>
        <Text className="text-lg font-semibold capitalize">
          Place {type} pin
        </Text>
      </View>

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
          className="p-3 text-base text-gray-800 bg-white border border-gray-200 rounded-xl"
        />
        <Text className="mt-2 text-sm text-gray-500" numberOfLines={2}>
          {pinMoved
            ? "Pin moved — address will update when you confirm"
            : mapAddress}
        </Text>
      </View>

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
          onRegionChangeComplete={onRegionChangeComplete}
        />
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
          <Ionicons name="pin" size={40} color={themeColor} />
        </View>
      </View>

      <View
        className="px-6 pt-3 bg-white"
        style={{paddingBottom: bottomInset || 12}}
      >
        <Text className="mb-2 text-xs text-center text-gray-400">
          Move the map to adjust the pin position
        </Text>
        <Pressable
          className="items-center justify-center p-3.5 rounded-lg bg-lightPrimary active:bg-darkPrimary"
          onPress={onConfirmPin}
          disabled={resolvingAddress}
        >
          {resolvingAddress ? (
            <ActivityIndicator size="small" color="#FFFFFF" />
          ) : (
            <Text className="text-lg font-bold text-white">Confirm pin</Text>
          )}
        </Pressable>
      </View>
    </View>
  );
};

export default MapPinStepView;
