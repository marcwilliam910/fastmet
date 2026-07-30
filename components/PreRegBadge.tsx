import {Ionicons} from "@expo/vector-icons";
import React from "react";
import {Text, View} from "react-native";

/**
 * Premium "Pre-Registered" badge — NativeWind version, no expo-linear-gradient.
 * Solid amber fill + inner highlight strip (thin lighter bar along the top)
 * to fake gradient depth, plus border/shadow for a premium pill look.
 * Shadow props (shadowColor/shadowOffset/shadowOpacity/shadowRadius) stay
 * inline since NativeWind's shadow-* utilities don't cover colored shadows.
 */
export function PreRegBadge() {
  return (
    <View
      className="flex-row items-center px-2 py-[3px] rounded-full bg-[#FFA840] border-[0.5px] border-[#6B3F0040] overflow-hidden"
      style={{
        shadowColor: "#E8781A",
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.35,
        shadowRadius: 4,
        elevation: 3,
      }}
    >
      <View className="absolute top-0 left-0 right-0 h-[45%] bg-white/35 rounded-t-full" />
      <Ionicons
        name="ribbon"
        size={12}
        color="#6B3F00"
        style={{marginRight: 3}}
      />
      <Text className="text-[10px] font-extrabold text-[#6B3F00] tracking-wide">
        PRE-REG
      </Text>
    </View>
  );
}
