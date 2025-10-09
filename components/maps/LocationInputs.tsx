import {Ionicons} from "@expo/vector-icons";
import React, {useState} from "react";
import {Pressable, Text, TextInput, View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
export default function LocationInputs() {
  const inset = useSafeAreaInsets();
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <View
      className="absolute left-0 right-0 z-10 "
      style={{marginTop: inset.top}}
    >
      <View className={`gap-2 px-4 ${isExpanded ? "flex" : "hidden"}`}>
        {/* Input 1 */}
        <View
          className="flex-row items-center px-2 py-1 bg-white rounded-md"
          style={{
            shadowColor: "#000",
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 15,
          }}
        >
          <Ionicons name="location-sharp" size={24} color="green" />
          <TextInput
            placeholder="Enter pick up point location"
            className="flex-1 text-base"
          />
        </View>
        {/* Input 2 */}
        <View
          className="flex-row items-center px-2 py-1 bg-white rounded-md"
          style={{
            shadowColor: "#000",
            shadowOffset: {width: 0, height: 2},
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 15,
          }}
        >
          <Ionicons name="location-sharp" size={24} color="red" />
          <TextInput
            placeholder="Enter drop off point location"
            className="flex-1 text-base"
          />
        </View>
        <View className="flex-row justify-between">
          <Pressable
            className="items-center self-center justify-center bg-white rounded-full size-9"
            style={{
              shadowColor: "#000",
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 15,
            }}
            onPress={() => setIsExpanded(!isExpanded)}
          >
            <Ionicons
              name={isExpanded ? "chevron-up" : "chevron-down"}
              size={22}
              color="#FFA840"
            />
          </Pressable>
          <View className="flex-row gap-2">
            <Pressable
              className="flex-row items-center gap-1 px-2 py-1.5 bg-white rounded-md"
              style={{
                shadowColor: "#000",
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 15,
              }}
            >
              <Ionicons name="add" size={15} color="black" />
              <Text className="text-sm font-semibold">Add Stop</Text>
            </Pressable>
            <Pressable
              className="flex-row items-center gap-1 px-2 py-1.5 bg-white rounded-md"
              style={{
                shadowColor: "#000",
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.2,
                shadowRadius: 4,
                elevation: 15,
              }}
            >
              <Ionicons name="time-outline" size={15} color="black" />
              <Text className="text-sm font-semibold">Select Time</Text>
            </Pressable>
          </View>
        </View>
      </View>

      <Pressable
        className={`items-center self-center justify-center bg-white rounded-full size-10 ${isExpanded ? "hidden" : "flex"}`}
        style={{
          shadowColor: "#000",
          shadowOffset: {width: 0, height: 2},
          shadowOpacity: 0.2,
          shadowRadius: 4,
          elevation: 15,
        }}
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Ionicons
          name={isExpanded ? "chevron-up" : "chevron-down"}
          size={24}
          color="#FFA840"
        />
      </Pressable>
    </View>
  );
}
