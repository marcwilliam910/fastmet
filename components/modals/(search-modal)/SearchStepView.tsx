import ContactInfoCard from "@/components/maps/ContactInfoCard";
import {LocationDetails} from "@/types/book";
import {UserAddress} from "@/types/user";
import {GOOGLE_MAPS_API_KEY} from "@/utils/constants";
import {Ionicons} from "@expo/vector-icons";
import React from "react";
import {
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import GooglePlacesTextInput, {
  Place,
} from "react-native-google-places-textinput";
import Animated from "react-native-reanimated";
import RecentPlacesList from "./RecentPlacesList";

type SearchType = "pickup" | "dropoff";

type SearchStepViewProps = {
  type: SearchType;
  themeColor: string;
  onClose: () => void;
  animatedStyle: any;
  searchText: string;
  setSearchText: (value: string) => void;
  onPlaceSelect: (place: Place) => void;
  contactLabel: "Sender" | "Receiver";
  contactName: string;
  setContactName: (value: string) => void;
  contactPhone: string;
  setContactPhone: (value: string) => void;
  additionalDetails: string;
  onUseMyInfo: () => void;
  onPickContact: () => void;
  nameError: boolean;
  phoneError: boolean;
  cleanPhoneInput: (value: string) => string;
  loading: boolean;
  onCurrentLocation: () => void;
  homeAddress: UserAddress | null;
  onHomePress: () => void;
  recentPlaces: LocationDetails[];
  onRecentPlacePress: (place: LocationDetails) => void;
  confirmedLocation: LocationDetails | null;
  isContactValid: boolean;
  onFinalConfirm: () => void;
  onShowCoverage?: () => void;
  bottomInset: number;
};

const SearchStepView: React.FC<SearchStepViewProps> = ({
  type,
  themeColor,
  onClose,
  animatedStyle,
  searchText,
  setSearchText,
  onPlaceSelect,
  contactLabel,
  contactName,
  setContactName,
  contactPhone,
  setContactPhone,
  additionalDetails,
  onUseMyInfo,
  onPickContact,
  nameError,
  phoneError,
  cleanPhoneInput,
  loading,
  onCurrentLocation,
  homeAddress,
  onHomePress,
  recentPlaces,
  onRecentPlacePress,
  confirmedLocation,
  isContactValid,
  onFinalConfirm,
  onShowCoverage,
  bottomInset,
}) => {
  return (
    <>
      <View
        className="flex-row items-center justify-center px-4"
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
            color={themeColor}
          />
        </Pressable>
        <Text className="text-lg font-semibold capitalize">
          {type} location
        </Text>
        {type === "pickup" && onShowCoverage && (
          <Pressable
            onPress={onShowCoverage}
            className="absolute -top-1 right-4"
          >
            <Ionicons
              name="information-circle-outline"
              size={Platform.OS === "ios" ? 32 : 26}
              color="#6B7280"
            />
          </Pressable>
        )}
      </View>

      <View className="mx-4 bg-white border-b border-gray-200">
        <View className="flex-row items-center px-3 py-2">
          <Ionicons
            name="search-outline"
            size={24}
            color="#4B5563"
            className="absolute z-50 bg-white left-3 top-5"
          />
          <Animated.View className="flex-1 ml-6" style={animatedStyle}>
            <GooglePlacesTextInput
              apiKey={GOOGLE_MAPS_API_KEY ?? ""}
              onPlaceSelect={onPlaceSelect}
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
                <Ionicons name="close" size={24} className="pt-1 pl-2" />
              }
              showLoadingIndicator={false}
            />
          </Animated.View>
        </View>
      </View>

      <ScrollView className="flex-1" keyboardShouldPersistTaps="handled">
        <ContactInfoCard
          contactLabel={contactLabel}
          contactName={contactName}
          setContactName={setContactName}
          contactPhone={contactPhone}
          setContactPhone={setContactPhone}
          additionalDetails={additionalDetails}
          onUseMyInfo={onUseMyInfo}
          onPickContact={onPickContact}
          showNameError={nameError}
          showPhoneError={phoneError}
          cleanPhoneInput={cleanPhoneInput}
        />

        <View className="px-4 mt-5 mb-2">
          <Pressable
            onPress={onCurrentLocation}
            disabled={loading}
            className="flex-row items-center px-4 py-3 bg-white border border-gray-200 rounded-xl active:bg-gray-50"
          >
            <View className="items-center justify-center mr-3 bg-blue-500 rounded-full w-11 h-11">
              <Ionicons name="navigate" size={20} color="#FFFFFF" />
            </View>
            {loading ? (
              <>
                <Text className="flex-1 text-base font-semibold text-gray-900">
                  Getting current location...
                </Text>
                <ActivityIndicator size="small" color={themeColor} />
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

        {homeAddress && (
          <View className="px-4 mb-2">
            <Pressable
              onPress={onHomePress}
              className="flex-row items-center px-4 py-3 bg-white border border-gray-200 rounded-xl active:bg-gray-50"
            >
              <View className="items-center justify-center mr-3 rounded-full w-11 h-11 bg-amber-500">
                <Ionicons name="home" size={20} color="#FFFFFF" />
              </View>
              <View className="flex-1">
                <Text className="text-base font-semibold text-gray-900">
                  Home
                </Text>
                <Text className="text-sm text-gray-500" numberOfLines={1}>
                  {homeAddress.fullAddress}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </Pressable>
          </View>
        )}

        <RecentPlacesList places={recentPlaces} onSelect={onRecentPlacePress} />
      </ScrollView>

      <View
        className="px-6 py-3 bg-white border-t border-gray-100"
        style={{paddingBottom: bottomInset || 12}}
      >
        <Pressable
          className="items-center justify-center p-3.5 rounded-lg bg-lightPrimary active:bg-darkPrimary disabled:opacity-40"
          onPress={onFinalConfirm}
          disabled={!confirmedLocation || !isContactValid}
        >
          <Text className="text-lg font-bold text-white">Confirm</Text>
        </Pressable>
      </View>
    </>
  );
};

export default SearchStepView;

const customStyles = {
  container: {marginHorizontal: 0},
  inputContainer: {
    borderWidth: 0,
    borderColor: "transparent",
    backgroundColor: "transparent",
  },
  input: {minHeight: 45, paddingVertical: 12},
  suggestionsContainer: {
    backgroundColor: "#f3f4f6",
    maxHeight: 250,
    marginTop: 20,
  },
  suggestionItem: {padding: 15},
  suggestionText: {
    main: {fontSize: 16, color: "#333"},
    secondary: {fontSize: 14, color: "#666"},
  },
  loadingIndicator: {color: "red", paddingTop: 10},
  placeholder: {color: "#999"},
};
