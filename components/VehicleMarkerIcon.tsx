import {STATIC_IMAGES} from "@/utils/constants";
import React from "react";
import {Image, StyleSheet} from "react-native";

export type GasCategory = "motorcycle" | "light" | "medium" | "heavy";

type VehicleMarkerIconProps = {
  gasCategory: GasCategory;
  size?: number;
};

const ICON_SOURCE: Record<GasCategory, number> = {
  motorcycle: STATIC_IMAGES.motor,
  light: STATIC_IMAGES.car,
  medium: STATIC_IMAGES.car,
  heavy: STATIC_IMAGES.truck,
};

export const VehicleMarkerIcon: React.FC<VehicleMarkerIconProps> = ({
  gasCategory,
  size = 40,
}) => {
  const source = ICON_SOURCE[gasCategory] ?? STATIC_IMAGES.car;

  return (
    <Image
      source={source}
      style={[styles.icon, {width: size, height: size}]}
      resizeMode="contain"
    />
  );
};

const styles = StyleSheet.create({
  icon: {
    // add shadow/elevation here if the old SVG markers had any on-map styling
  },
});
