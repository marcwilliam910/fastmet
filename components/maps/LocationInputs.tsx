import Ionicons from "@expo/vector-icons/Ionicons";
import React, { useRef } from "react";
import { Animated, Easing, Pressable, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function LocationInputs({
  isExpanded,
  setIsExpanded,
}: {
  isExpanded: boolean;
  setIsExpanded: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const inset = useSafeAreaInsets();
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
      style={{ marginTop: inset.top }}
    >
      <Animated.View
        style={{
          transform: [{ translateY: slideAnim }],
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
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 15,
          }}
        >
          <Ionicons name="location-sharp" size={24} color="green" />
          <TextInput
            placeholder="Pickup location"
            className="flex-1 text-base"
          />
        </View>

        {/* Input 2 */}
        <View
          className="flex-row items-center px-2 py-1 bg-white rounded-md"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 15,
          }}
        >
          <Ionicons name="location-sharp" size={24} color="red" />
          <TextInput
            placeholder="Drop point location"
            className="flex-1 text-base"
          />
        </View>

        {/* Action Row */}
        <Pressable
          className="items-center self-end justify-center bg-white rounded-full size-9 active:bg-gray-100"
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.2,
            shadowRadius: 4,
            elevation: 15,
          }}
          onPress={toggleExpand}
        >
          <Ionicons name={"chevron-up"} size={22} color="#FFA840" />
        </Pressable>
      </Animated.View>

      {/* Toggle Button when collapsed */}
      {!isExpanded && (
        <View className="absolute top-0 left-0 right-0 z-20">
          <Pressable
            className="items-center self-center justify-center bg-white rounded-full size-10 active:bg-gray-100"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: 2 },
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
