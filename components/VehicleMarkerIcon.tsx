import React from "react";
import Svg, {Circle, Path, Rect} from "react-native-svg";

export type GasCategory = "motorcycle" | "light" | "medium" | "heavy";

type VehicleMarkerIconProps = {
  gasCategory: GasCategory;
  size?: number;
};

const WHEEL_COLOR = "#333333";
const BODY_COLOR = "#ED8718"; // darkPrimary
const ACCENT_COLOR = "#FFA840"; // lightPrimary

const MotorcycleIcon: React.FC<{size: number}> = ({size}) => (
  <Svg width={size} height={size} viewBox="0 0 100 60">
    <Path
      d="M22 45 L45 25 L60 25 L78 45"
      stroke={BODY_COLOR}
      strokeWidth={6}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Path
      d="M45 25 L50 15 L65 15"
      stroke={BODY_COLOR}
      strokeWidth={5}
      fill="none"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <Rect x="55" y="20" width="14" height="8" rx="3" fill={BODY_COLOR} />
    <Circle cx="22" cy="45" r="12" fill={WHEEL_COLOR} />
    <Circle cx="78" cy="45" r="12" fill={WHEEL_COLOR} />
    <Circle cx="22" cy="45" r="5" fill={ACCENT_COLOR} />
    <Circle cx="78" cy="45" r="5" fill={ACCENT_COLOR} />
  </Svg>
);

const LightVehicleIcon: React.FC<{size: number}> = ({size}) => (
  <Svg width={size} height={size} viewBox="0 0 100 60">
    <Rect x="10" y="30" width="80" height="18" rx="6" fill={BODY_COLOR} />
    <Path
      d="M25 30 L35 14 Q38 10 44 10 L62 10 Q68 10 71 14 L80 30 Z"
      fill={BODY_COLOR}
    />
    <Path d="M38 28 L44 15 L60 15 L68 28 Z" fill={ACCENT_COLOR} />
    <Circle cx="28" cy="48" r="10" fill={WHEEL_COLOR} />
    <Circle cx="72" cy="48" r="10" fill={WHEEL_COLOR} />
    <Circle cx="28" cy="48" r="4" fill={ACCENT_COLOR} />
    <Circle cx="72" cy="48" r="4" fill={ACCENT_COLOR} />
  </Svg>
);

const MediumVehicleIcon: React.FC<{size: number}> = ({size}) => (
  <Svg width={size} height={size} viewBox="0 0 100 60">
    <Rect x="8" y="20" width="84" height="28" rx="6" fill={BODY_COLOR} />
    <Rect x="14" y="10" width="30" height="18" rx="4" fill={BODY_COLOR} />
    <Rect x="18" y="14" width="22" height="10" rx="2" fill={ACCENT_COLOR} />
    <Circle cx="26" cy="48" r="10" fill={WHEEL_COLOR} />
    <Circle cx="74" cy="48" r="10" fill={WHEEL_COLOR} />
    <Circle cx="26" cy="48" r="4" fill={ACCENT_COLOR} />
    <Circle cx="74" cy="48" r="4" fill={ACCENT_COLOR} />
  </Svg>
);

const HeavyVehicleIcon: React.FC<{size: number}> = ({size}) => (
  <Svg width={size} height={size} viewBox="0 0 120 60">
    <Rect x="6" y="14" width="24" height="26" rx="4" fill={BODY_COLOR} />
    <Rect x="10" y="18" width="16" height="10" rx="2" fill={ACCENT_COLOR} />
    <Rect x="32" y="8" width="82" height="32" rx="4" fill={BODY_COLOR} />
    <Rect
      x="38"
      y="14"
      width="70"
      height="12"
      fill={ACCENT_COLOR}
      opacity={0.5}
    />
    <Circle cx="22" cy="48" r="9" fill={WHEEL_COLOR} />
    <Circle cx="60" cy="48" r="9" fill={WHEEL_COLOR} />
    <Circle cx="100" cy="48" r="9" fill={WHEEL_COLOR} />
    <Circle cx="22" cy="48" r="3.5" fill={ACCENT_COLOR} />
    <Circle cx="60" cy="48" r="3.5" fill={ACCENT_COLOR} />
    <Circle cx="100" cy="48" r="3.5" fill={ACCENT_COLOR} />
  </Svg>
);

export const VehicleMarkerIcon: React.FC<VehicleMarkerIconProps> = ({
  gasCategory,
  size = 40,
}) => {
  switch (gasCategory) {
    case "motorcycle":
      return <MotorcycleIcon size={size} />;
    case "light":
      return <LightVehicleIcon size={size} />;
    case "medium":
      return <MediumVehicleIcon size={size} />;
    case "heavy":
      return <HeavyVehicleIcon size={size} />;
    default:
      return <LightVehicleIcon size={size} />;
  }
};
