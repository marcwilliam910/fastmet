import {Image} from "expo-image";
import React from "react";
import {Text, View} from "react-native";

export default function LogoWithText() {
  return (
    <View className="items-center mb-2">
      <Image
        source={require("@/assets/fastmet/logo.png")}
        style={{width: 70, height: 90}}
        contentFit="contain"
      />
      <Text className="text-2xl font-bold tracking-widest text-secondary">
        FastMet
      </Text>
    </View>
  );
}
