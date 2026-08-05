import {LocationDetails} from "@/types/book";
import {Ionicons} from "@expo/vector-icons";
import React from "react";
import {FlatList, Pressable, Text, View} from "react-native";

type RecentPlacesListProps = {
  places: LocationDetails[];
  onSelect: (place: LocationDetails) => void;
};

const RecentPlacesList: React.FC<RecentPlacesListProps> = ({
  places,
  onSelect,
}) => {
  if (places.length === 0) return null;

  return (
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
        data={places}
        keyExtractor={(item, index) => `${item!.name}-${index}`}
        scrollEnabled={false}
        renderItem={({item}) => (
          <Pressable
            onPress={() => onSelect(item)}
            className="flex-row items-center px-4 py-3 border-b border-gray-100 rounded-xl active:bg-gray-100"
          >
            <View className="items-center justify-center w-10 h-10 mr-3 bg-gray-100 rounded-full">
              <Ionicons name="location-outline" size={20} color="#6B7280" />
            </View>
            <View className="flex-1">
              <Text className="font-medium text-gray-900">
                {item?.name || "Unknown Place"}
              </Text>
              <Text className="text-sm text-gray-500 mt-0.5" numberOfLines={1}>
                {item?.address || "Unknown Address"}
              </Text>
            </View>
          </Pressable>
        )}
      />
    </View>
  );
};

export default RecentPlacesList;
