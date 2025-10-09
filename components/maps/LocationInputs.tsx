import Ionicons from "@expo/vector-icons/Ionicons";
import React, {useRef, useState} from "react";
import {Animated, Easing, Pressable, Text, TextInput, View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";

export default function LocationInputs() {
  const inset = useSafeAreaInsets();
  const [isExpanded, setIsExpanded] = useState(true);
  const slideAnim = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => {
    Animated.timing(slideAnim, {
      toValue: isExpanded ? -150 : 0, // adjust -150 based on height of inputs
      duration: 300,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    }).start();
    setIsExpanded(!isExpanded);
  };

  return (
    <View
      className="absolute left-0 right-0 z-10"
      style={{marginTop: inset.top}}
    >
      <Animated.View
        style={{
          transform: [{translateY: slideAnim}],
          opacity: slideAnim.interpolate({
            inputRange: [-150, 0],
            outputRange: [0, 1],
          }),
        }}
        className="gap-2 px-4"
      >
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

        {/* Action Row */}
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
            onPress={toggleExpand}
          >
            <Ionicons name={"chevron-up"} size={22} color="#FFA840" />
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
      </Animated.View>

      {/* Toggle Button when collapsed */}
      {!isExpanded && (
        <View className="absolute top-0 left-0 right-0 z-20">
          <Pressable
            className="items-center self-center justify-center bg-white rounded-full size-10"
            style={{
              shadowColor: "#000",
              shadowOffset: {width: 0, height: 2},
              shadowOpacity: 0.2,
              shadowRadius: 4,
              elevation: 15,
            }}
            onPress={toggleExpand}
          >
            <Ionicons name="chevron-down" size={24} color="#FFA840" />
          </Pressable>
        </View>
      )}
    </View>
  );
}
